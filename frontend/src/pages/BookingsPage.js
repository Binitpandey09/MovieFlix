import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            const fetchBookings = async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    const { data } = await api.get('/api/bookings/my', config);
                    setBookings(data);
                } catch (error) {
                    console.error('Failed to fetch bookings', error);
                }
            };
            fetchBookings();
        }
    }, [navigate, userInfo]);

    return (
        <>
            <h1>My Bookings</h1>
            {bookings.length === 0 ? (
                <p>You have no bookings.</p>
            ) : (
                bookings.map(booking => (
                    <Card key={booking._id} className="mb-3">
                        <Card.Header>Booking ID: {booking._id} | Booked on: {new Date(booking.bookingTime).toLocaleDateString()}</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={2}>
                                    <Image src={booking.movieId.image} alt={booking.movieId.title} fluid rounded />
                                </Col>
                                <Col>
                                    <Card.Title>{booking.movieId.title}</Card.Title>
                                    <Card.Text><strong>Showtime:</strong> {booking.showtime.date} at {booking.showtime.time}</Card.Text>
                                    <Card.Text><strong>Seats:</strong> {booking.seats.join(', ')}</Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            )}
        </>
    );
};

export default BookingsPage;