import React, { useState, useEffect } from 'react';
import { Form, Button, ListGroup, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const CityTheaterManager = () => {
    const [cities, setCities] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [newCityName, setNewCityName] = useState('');
    const [newTheaterName, setNewTheaterName] = useState('');
    const [newTheaterLocation, setNewTheaterLocation] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchTheaters(selectedCity._id);
        } else {
            setTheaters([]);
        }
    }, [selectedCity]);

    const fetchCities = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/cities`);
            setCities(data);
        } catch (err) {
            setError('Failed to load cities');
        }
    };

    const fetchTheaters = async (cityId) => {
        try {
            const { data } = await axios.get(`${API_URL}/api/theaters?city=${cityId}`);
            setTheaters(data);
        } catch (err) {
            setError('Failed to load theaters');
        }
    };

    const handleAddCity = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/cities`, { name: newCityName }, config);
            setNewCityName('');
            fetchCities();
            setSuccess('City added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add city');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteCity = async (id) => {
        if (!window.confirm('Are you sure? This will delete all theaters in this city.')) return;
        try {
            await axios.delete(`${API_URL}/api/cities/${id}`, config);
            if (selectedCity?._id === id) setSelectedCity(null);
            fetchCities();
        } catch (err) {
            setError('Failed to delete city');
        }
    };

    const handleAddTheater = async (e) => {
        e.preventDefault();
        if (!selectedCity) return;
        try {
            await axios.post(`${API_URL}/api/theaters`, {
                name: newTheaterName,
                location: newTheaterLocation,
                city: selectedCity._id
            }, config);
            setNewTheaterName('');
            setNewTheaterLocation('');
            fetchTheaters(selectedCity._id);
            setSuccess('Theater added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add theater');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteTheater = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`${API_URL}/api/theaters/${id}`, config);
            fetchTheaters(selectedCity._id);
        } catch (err) {
            setError('Failed to delete theater');
        }
    };

    return (
        <div className="mt-4">
            <h2>Manage Cities & Theaters</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row>
                <Col md={5}>
                    <Card className="p-3 mb-3">
                        <h4>Cities</h4>
                        <Form onSubmit={handleAddCity} className="mb-3 d-flex gap-2">
                            <Form.Control
                                type="text"
                                placeholder="Enter city name"
                                value={newCityName}
                                onChange={(e) => setNewCityName(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="primary">Add</Button>
                        </Form>
                        <ListGroup>
                            {cities.map(city => (
                                <ListGroup.Item
                                    key={city._id}
                                    active={selectedCity?._id === city._id}
                                    action
                                    onClick={() => setSelectedCity(city)}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    {city.name}
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteCity(city._id); }}
                                    >
                                        &times;
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="p-3">
                        <h4>Theaters {selectedCity ? `in ${selectedCity.name}` : '(Select a City)'}</h4>
                        {selectedCity ? (
                            <>
                                <Form onSubmit={handleAddTheater} className="mb-3">
                                    <Row className="g-2">
                                        <Col md={5}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Theater Name"
                                                value={newTheaterName}
                                                onChange={(e) => setNewTheaterName(e.target.value)}
                                                required
                                            />
                                        </Col>
                                        <Col md={5}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Location"
                                                value={newTheaterLocation}
                                                onChange={(e) => setNewTheaterLocation(e.target.value)}
                                                required
                                            />
                                        </Col>
                                        <Col md={2}>
                                            <Button type="submit" variant="success" className="w-100">Add</Button>
                                        </Col>
                                    </Row>
                                </Form>
                                <ListGroup>
                                    {theaters.length === 0 && <p className="text-muted">No theaters found.</p>}
                                    {theaters.map(theater => (
                                        <ListGroup.Item key={theater._id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{theater.name}</strong>
                                                <br />
                                                <small className="text-muted">{theater.location}</small>
                                            </div>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTheater(theater._id)}>Delete</Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        ) : (
                            <p className="text-muted">Please select a city to manage theaters.</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CityTheaterManager;
