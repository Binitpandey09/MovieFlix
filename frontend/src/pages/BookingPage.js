import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import SeatSelector from '../components/SeatSelector';
import './BookingPage.css';
import { io } from 'socket.io-client';
import { useRazorpay } from "react-razorpay";

const ENDPOINT = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const BookingPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // State passed from BuyTicketsPage
    const { theater, time, date, quantity, isPremiumFlow } = location.state || {};
    const { Razorpay } = useRazorpay();

    const [movie, setMovie] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState([]); // Seats locked by others
    const [socket, setSocket] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Socket Connection
    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);

        const roomDetails = {
            movieId,
            theaterId: theater?._id,
            date: date || 'Today',
            time: time || '09:00 PM'
        };

        newSocket.emit('join_showtime', roomDetails);

        newSocket.on('initial_locks', (locks) => {
            setLockedSeats(locks);
        });

        newSocket.on('seat_locked_update', ({ seatId }) => {
            setLockedSeats((prev) => [...prev, seatId]);
        });

        newSocket.on('seat_released_update', ({ seatId }) => {
            setLockedSeats((prev) => prev.filter(id => id !== seatId));
        });

        return () => newSocket.disconnect();
    }, [movieId, theater, date, time]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await api.get(`/api/movies/${movieId}`);
                setMovie(data);
            } catch (error) {
                console.error("Failed to fetch movie", error);
            }
        };
        fetchMovie();
    }, [movieId]);

    // Redirect if direct access without flow
    useEffect(() => {
        if (!isPremiumFlow && !location.state) {
            // navigate(`/movie/${movieId}`); // Uncomment to enforce flow
        }
    }, [isPremiumFlow, movieId, navigate, location.state]);

    const subtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
    const convenienceFee = selectedSeats.length > 0 ? 50 : 0;
    const totalPrice = subtotal + convenienceFee;

    const handlePayment = async () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (selectedSeats.length !== quantity) {
            alert(`Please select exactly ${quantity} seats.`);
            return;
        }

        try {
            const token = userInfo.token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const seatNumbers = selectedSeats.map(s => s.number);

            // 2. Create Razorpay Order
            const orderRes = await api.post('/api/payment/orders', { amount: totalPrice }, config);
            const { id: order_id, amount } = orderRes.data;

            // 3. Open Razorpay Modal
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
                amount: amount,
                currency: "INR",
                name: "MovieFlix",
                description: `Booking for ${movie.title}`,
                image: "https://your-logo-url.com/logo.png",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, config);

                        if (verifyRes.data.msg === "Payment Verified Successfully") {
                            // 4. Create/Confirm Booking in DB
                            await api.post('/api/bookings', {
                                movieId: movie._id,
                                theaterId: theater?._id,
                                showtime: { date, time },
                                seats: seatNumbers,
                                quantity,
                                totalAmount: totalPrice,
                                paymentId: response.razorpay_payment_id
                            }, config);

                            alert('Booking Successful!');
                            navigate('/bookings/my');
                        }
                    } catch (err) {
                        alert("Payment Verification Failed");
                        console.error(err);
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: "9999999999",
                },
                theme: {
                    color: "#e50914",
                },
            };

            const rzp1 = new Razorpay(options);
            rzp1.on("payment.failed", function (response) {
                alert(response.error.description);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert('Payment execution failed');
        }
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <Container fluid="lg" className="booking-page-container">
            <div className="booking-header">
                <div className="booking-movie-info">
                    <h2 className="movie-title-booking">{movie.title}</h2>
                    <p>{theater?.name || 'Create Cineplex'} | {date} | {time}</p>
                </div>
                <div className="booking-actions">
                    <Button variant="outline-danger" className="px-4"> {quantity} Tickets </Button>
                </div>
            </div>

            <Row className="mt-4">
                <Col md={9}>
                    <SeatSelector
                        onSeatsSelected={setSelectedSeats}
                        maxSeats={quantity}
                        lockedSeats={lockedSeats}
                        socket={socket}
                        roomDetails={{ movieId, theaterId: theater?._id, date, time }}
                    />
                </Col>
                <Col md={3}>
                    <Card className="booking-summary">
                        <Card.Img variant="top" src={movie.image} style={{ height: '150px', objectFit: 'cover' }} />
                        <Card.Body>
                            <Card.Title>Booking Summary</Card.Title>
                            <hr />
                            <div className="summary-item"><span>{theater?.name}</span></div>
                            <div className="summary-item"><small>{date}, {time}</small></div>
                            <hr />
                            <div className="summary-item"><span>Seats ({selectedSeats.length})</span><span>₹{subtotal}</span></div>
                            <div className="summary-item"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
                            <hr />
                            <div className="summary-item total"><span>Total Price</span><span>₹{totalPrice}</span></div>

                            {quantity && selectedSeats.length !== quantity && (
                                <div className="text-danger small mt-2">Select {quantity} seats</div>
                            )}

                            <Button
                                variant="danger"
                                className="w-100 mt-3"
                                disabled={selectedSeats.length === 0 || (quantity && selectedSeats.length !== quantity)}
                                onClick={handlePayment}
                            >
                                Pay ₹{totalPrice}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingPage;