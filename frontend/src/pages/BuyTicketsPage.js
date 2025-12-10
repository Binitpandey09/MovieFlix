import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import api from '../api';
import SeatQuantityModal from '../components/SeatQuantityModal';
import './BuyTicketsPage.css';

const BuyTicketsPage = () => {
    const { movieId } = useParams();
    const [searchParams] = useSearchParams();
    const cityId = searchParams.get('cityId'); // Assuming we pass cityId filter

    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0); // Index of selected date
    const [dates, setDates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null); // { theaterId, showtime }

    // Generate next 5 days
    useEffect(() => {
        const today = new Date();
        const nextDays = Array.from({ length: 5 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return {
                day: d.toLocaleString('en-US', { weekday: 'short' }),
                date: d.getDate(),
                month: d.toLocaleString('en-US', { month: 'short' }),
                fullDate: d.toISOString().split('T')[0] // YYYY-MM-DD
            };
        });
        setDates(nextDays);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Movie
                const movieRes = await api.get(`/api/movies/${movieId}`);
                setMovie(movieRes.data);

                // 2. Fetch Theaters (filtered by city if available)
                const endpoint = cityId ? `/api/theaters?city=${cityId}` : '/api/theaters';
                const theatersRes = await api.get(endpoint);
                setTheaters(theatersRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [movieId, cityId]);

    const handleShowtimeClick = (theater, time) => {
        setPendingBooking({
            theater,
            time,
            date: dates[selectedDate].fullDate
        });
        setShowModal(true);
    };

    const handleQuantityConfirm = (quantity) => {
        setShowModal(false);
        if (pendingBooking) {
            // Navigate to Seat Layout page (reusing BookingPage for now, but with new logic)
            // We pass state to the route so BookingPage knows what to render
            navigate(`/booking/${movieId}`, {
                state: {
                    ...pendingBooking,
                    quantity,
                    isPremiumFlow: true
                }
            });
        }
    };

    // Dummy showtimes generator
    const getDummyShowtimes = () => {
        return ["09:30 AM", "12:15 PM", "03:45 PM", "07:10 PM", "10:45 PM"];
    };

    if (!movie) return <div className="p-5 text-center">Loading...</div>;

    return (
        <div className="buy-tickets-container">
            {/* Movie Header */}
            <div className="movie-header-strip">
                <Container>
                    <h1 className="movie-title-header">{movie.title}</h1>
                    <div className="movie-meta-header">
                        <span className="meta-certificate">UA</span>
                        <span>{movie.genre}</span>
                        <span>•</span>
                        <span>{dates[selectedDate]?.month} {dates[selectedDate]?.date}, {dates[selectedDate]?.day}</span>
                    </div>
                </Container>
            </div>

            {/* Date Slider */}
            <div className="date-slider-container">
                <Container>
                    {dates.map((d, index) => (
                        <div
                            key={index}
                            className={`date-item ${selectedDate === index ? 'selected' : ''}`}
                            onClick={() => setSelectedDate(index)}
                        >
                            <div className="date-day">{d.day}</div>
                            <div className="date-number">{d.date}</div>
                            <div className="date-day">{d.month}</div>
                        </div>
                    ))}
                </Container>
            </div>

            {/* Filters Bar (Visual Only) */}
            <Container>
                <div className="filters-bar">
                    <div className="left-filters">
                        Looking for specific price or showtime? (Filters Mockup)
                    </div>
                </div>
            </Container>

            {/* Theaters List */}
            <Container className="theaters-list">
                {theaters.length > 0 ? theaters.map(theater => (
                    <div key={theater._id} className="theater-row">
                        <div className="theater-info">
                            <div className="theater-name">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                                {theater.name}
                            </div>
                            <div className="theater-location">
                                M-Ticket Available • Food & Beverage
                            </div>
                        </div>
                        <div className="showtimes-container">
                            {/* Using dummy showtimes for now as requested for "any date" */}
                            {getDummyShowtimes().map((time, idx) => (
                                <div
                                    key={idx}
                                    className="showtime-btn available"
                                    onClick={() => handleShowtimeClick(theater, time)}
                                >
                                    {time}
                                    <span className="amenity-tooltip">4K DOLBY 7.1</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )) : (
                    <div className="p-4 text-center">No theaters found in this city.</div>
                )}
            </Container>

            <SeatQuantityModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onConfirm={handleQuantityConfirm}
            />
        </div>
    );
};

export default BuyTicketsPage;
