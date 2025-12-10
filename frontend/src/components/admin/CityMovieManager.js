import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Badge, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';

const CityMovieManager = () => {
    const [cities, setCities] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'now_showing', 'coming_soon', 'selected'

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

    useEffect(() => {
        fetchCities();
        fetchMovies();
    }, []);

    const fetchCities = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/cities`);
            setCities(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMovies = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/movies?limit=100`); // Get all movies
            setMovies(data);
        } catch (err) {
            console.error(err);
        }
    };

    const getMovieStatusForCity = (movie, cityId) => {
        const statusObj = movie.cityStatus?.find(s => s.city === cityId);
        return statusObj ? statusObj.status : 'none';
    };

    const handleStatusChange = async (movieId, newStatus) => {
        if (!selectedCity) return;
        setLoading(true);
        try {
            // Find the movie to update locally first for optimistic UI
            const movieToUpdate = movies.find(m => m._id === movieId);
            const currentCityStatus = movieToUpdate.cityStatus || [];

            // Remove existing status for this city
            const otherCitiesStatus = currentCityStatus.filter(s => s.city !== selectedCity);

            // Add new status if not 'none'
            const updatedCityStatus = newStatus === 'none'
                ? otherCitiesStatus
                : [...otherCitiesStatus, { city: selectedCity, status: newStatus }];

            // API Call
            await axios.put(`${API_URL}/api/movies/${movieId}`, {
                cityStatus: updatedCityStatus
            }, config);

            // Update local state
            setMovies(movies.map(m =>
                m._id === movieId ? { ...m, cityStatus: updatedCityStatus } : m
            ));

            setSuccess('Status updated!');
            setTimeout(() => setSuccess(''), 1000);
        } catch (err) {
            setError('Failed to update status');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredMovies = movies.filter(movie => {
        if (!selectedCity) return true;
        const status = getMovieStatusForCity(movie, selectedCity);
        if (filterStatus === 'all') return true;
        if (filterStatus === 'selected') return status !== 'none';
        return status === filterStatus;
    });

    return (
        <div className="mt-4">
            <h2>City Movie Manager</h2>
            <p className="text-muted">Select a city to manage which movies are shown there.</p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="d-flex justify-content-between align-items-end mb-4">
                <Form.Group style={{ maxWidth: '300px', flex: 1 }}>
                    <Form.Label><strong>Select City:</strong></Form.Label>
                    <Form.Select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">-- Choose a City --</option>
                        {cities.map(city => (
                            <option key={city._id} value={city._id}>{city.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {selectedCity && (
                    <div className="ms-3">
                        <Form.Label><strong>Filter View:</strong></Form.Label><br />
                        <ButtonGroup>
                            <Button variant={filterStatus === 'all' ? "primary" : "outline-primary"} onClick={() => setFilterStatus('all')}>All</Button>
                            <Button variant={filterStatus === 'selected' ? "primary" : "outline-primary"} onClick={() => setFilterStatus('selected')}>Selected Only</Button>
                            <Button variant={filterStatus === 'now_showing' ? "primary" : "outline-primary"} onClick={() => setFilterStatus('now_showing')}>Now Showing</Button>
                            <Button variant={filterStatus === 'coming_soon' ? "primary" : "outline-primary"} onClick={() => setFilterStatus('coming_soon')}>Coming Soon</Button>
                        </ButtonGroup>
                    </div>
                )}
            </div>

            {selectedCity && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Movie Title</th>
                            <th>Global Release</th>
                            <th>City Availability ({cities.find(c => c._id === selectedCity)?.name})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovies.length === 0 && (
                            <tr><td colSpan="3" className="text-center text-muted">No movies match the current filter.</td></tr>
                        )}
                        {filteredMovies.map(movie => {
                            const currentStatus = getMovieStatusForCity(movie, selectedCity);
                            return (
                                <tr key={movie._id}>
                                    <td>
                                        <strong>{movie.title}</strong>
                                        {movie.isTMDBImport && <Badge bg="info" className="ms-2">TMDB</Badge>}
                                    </td>
                                    <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex gap-3">
                                            <Form.Check
                                                type="radio"
                                                id={`none-${movie._id}`}
                                                label="Not Showing"
                                                name={`status-${movie._id}`}
                                                checked={currentStatus === 'none'}
                                                onChange={() => handleStatusChange(movie._id, 'none')}
                                                disabled={loading}
                                            />
                                            <Form.Check
                                                type="radio"
                                                id={`now-${movie._id}`}
                                                label="Now Showing"
                                                name={`status-${movie._id}`}
                                                checked={currentStatus === 'now_showing'}
                                                onChange={() => handleStatusChange(movie._id, 'now_showing')}
                                                disabled={loading}
                                                className="text-success"
                                            />
                                            <Form.Check
                                                type="radio"
                                                id={`coming-${movie._id}`}
                                                label="Coming Soon"
                                                name={`status-${movie._id}`}
                                                checked={currentStatus === 'coming_soon'}
                                                onChange={() => handleStatusChange(movie._id, 'coming_soon')}
                                                disabled={loading}
                                                className="text-warning"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default CityMovieManager;
