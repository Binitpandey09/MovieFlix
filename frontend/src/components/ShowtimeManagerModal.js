import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';
import api from '../api';


const ShowtimeManagerModal = ({ show, handleClose, movie, refreshMovies }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [localShowtimes, setLocalShowtimes] = useState([]);

    useEffect(() => {
        if (movie) setLocalShowtimes(movie.showtimes);
    }, [movie]);
    
    if (!movie) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !time) return alert('Please select a date and time.');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await api.post(`/api/movies/${movie._id}/showtimes`, { date, time }, config);
            setLocalShowtimes(data.showtimes);
            setDate('');
            setTime('');
        } catch (error) {
            alert('Failed to add showtime');
        }
    };

    const onModalClose = () => {
        refreshMovies();
        handleClose();
    };

    return (
        <Modal show={show} onHide={onModalClose} size="lg">
            <Modal.Header closeButton><Modal.Title>Manage Showtimes for "{movie.title}"</Modal.Title></Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <h5>Existing Showtimes</h5>
                        <ListGroup>
                            {localShowtimes.map(st => (<ListGroup.Item key={st._id || st.date+st.time}>{st.date} at {st.time}</ListGroup.Item>))}
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <h5>Add New Showtime</h5>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='date'><Form.Label>Date</Form.Label><Form.Control type='date' value={date} onChange={(e) => setDate(e.target.value)} required></Form.Control></Form.Group>
                            <Form.Group controlId='time' className='mt-2'><Form.Label>Time</Form.Label><Form.Control type='time' value={time} onChange={(e) => setTime(e.target.value)} required></Form.Control></Form.Group>
                            <Button type='submit' variant='primary' className='mt-3'>Add Showtime</Button>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ShowtimeManagerModal;