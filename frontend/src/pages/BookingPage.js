import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import SeatSelector from '../components/SeatSelector';
import './BookingPage.css';

const BookingPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchMovie = async () => {
            const { data } = await api.get(`/api/movies/${movieId}`);
            setMovie(data);
            if (data.showtimes && data.showtimes.length > 0) {
                setSelectedShowtime(data.showtimes[0]);
            }
        };
        fetchMovie();
    }, [movieId]);
    
    const subtotal = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
    const convenienceFee = selectedSeats.length > 0 ? 50 : 0;
    const totalPrice = subtotal + convenienceFee;

    const handlePayment = async () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        const bookingDetails = {
            movieId: movie._id,
            showtime: { date: selectedShowtime.date, time: selectedShowtime.time },
            seats: selectedSeats.map(s => s.number),
        };
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        try {
            await api.post('/api/bookings', bookingDetails, config);
            alert('Booking successful!');
            navigate('/my-bookings');
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    if (!movie) return <div>Loading...</div>;

    return (
        <Container fluid="lg" className="booking-page-container">
            <h2 className="movie-title-booking">{movie.title}</h2>
            <div className="showtime-selector">
                {movie.showtimes.map(st => (
                    <Button key={st._id} variant={selectedShowtime?._id === st._id ? 'danger' : 'outline-secondary'} onClick={() => { setSelectedShowtime(st); setSelectedSeats([]); }} className="me-2 mb-2">
                        {st.date} - {st.time}
                    </Button>
                ))}
            </div>
            <Row>
                <Col md={8}>
                    {selectedShowtime && <SeatSelector onSeatsSelected={setSelectedSeats} />}
                </Col>
                <Col md={4}>
                    <Card className="booking-summary">
                        <Card.Body>
                            <Card.Title>Booking Summary</Card.Title>
                            <hr />
                            <div className="summary-item"><span>Seats ({selectedSeats.length})</span><span>₹{subtotal}</span></div>
                            <div className="summary-item"><span>Convenience Fee</span><span>₹{convenienceFee}</span></div>
                            <hr />
                            <div className="summary-item total"><span>Total Price</span><span>₹{totalPrice}</span></div>
                            <Button variant="danger" className="w-100 mt-3" disabled={selectedSeats.length === 0} onClick={handlePayment}>Pay ₹{totalPrice}</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingPage;