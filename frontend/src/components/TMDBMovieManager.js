import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../api';
import './TMDBMovieManager.css';

const TMDBMovieManager = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showtimeData, setShowtimeData] = useState({
        date: '',
        time: '',
        screen: 'Screen 1',
        totalSeats: 50,
        price: 200,
    });
    // selectedCities state removed

    // Get auth config
    const getAuthConfig = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo?.token}`
            }
        };
    };

    useEffect(() => {
        fetchTMDBMovies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTMDBMovies = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/tmdb/all', getAuthConfig());
            setMovies(data);
        } catch (err) {
            setError('Failed to fetch TMDB movies: ' + (err.response?.data?.message || err.message));
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImportTMDB = async () => {
        setImporting(true);
        setError('');
        setSuccess('');
        try {
            const { data } = await api.post('/api/tmdb/fetch', {}, getAuthConfig());
            setSuccess(`Imported ${data.imported} new movies, updated ${data.updated} movies`);
            fetchTMDBMovies();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to import movies from TMDB');
            console.error('Import error:', err);
        } finally {
            setImporting(false);
        }
    };

    const handleEnableMovie = async (movieId) => {
        try {
            await api.put(`/api/tmdb/${movieId}/enable`, { cities: [] }, getAuthConfig()); // Send empty cities
            setSuccess('Movie enabled for booking');
            fetchTMDBMovies();
        } catch (err) {
            setError('Failed to enable movie');
        }
    };

    const handleDisableMovie = async (movieId) => {
        try {
            await api.put(`/api/tmdb/${movieId}/disable`, {}, getAuthConfig());
            setSuccess('Movie disabled');
            fetchTMDBMovies();
        } catch (err) {
            setError('Failed to disable movie');
        }
    };

    const openShowtimeModal = (movie) => {
        setSelectedMovie(movie);
        // setSelectedCities(movie.cities || []); // Removed
        setShowModal(true);
    };

    const handleAddShowtime = async () => {
        if (!showtimeData.date || !showtimeData.time) {
            setError('Please fill all showtime fields');
            return;
        }

        try {
            await api.post(`/api/tmdb/${selectedMovie._id}/showtime`, showtimeData, getAuthConfig());

            // Enable movie if not already enabled
            if (!selectedMovie.isEnabled) {
                await api.put(`/api/tmdb/${selectedMovie._id}/enable`, { cities: [] }, getAuthConfig());
            }

            setSuccess('Showtime added successfully');
            setShowModal(false);
            setShowtimeData({ date: '', time: '', screen: 'Screen 1', totalSeats: 50, price: 200 });
            fetchTMDBMovies();
        } catch (err) {
            setError('Failed to add showtime: ' + (err.response?.data?.message || err.message));
            console.error('Add showtime error:', err);
        }
    };

    const handleRemoveShowtime = async (movieId, showtimeId) => {
        try {
            await api.delete(`/api/tmdb/${movieId}/showtime/${showtimeId}`, getAuthConfig());
            setSuccess('Showtime removed');
            fetchTMDBMovies();
        } catch (err) {
            setError('Failed to remove showtime');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isUpcoming = (releaseDate) => {
        return new Date(releaseDate) > new Date();
    };

    return (
        <div className="tmdb-manager">
            <div className="tmdb-header">
                <h2>🎬 TMDB Movie Manager</h2>
                <Button
                    variant="primary"
                    onClick={handleImportTMDB}
                    disabled={importing}
                >
                    {importing ? (
                        <>
                            <Spinner animation="border" size="sm" /> Importing...
                        </>
                    ) : (
                        '📥 Import from TMDB'
                    )}
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

            {loading ? (
                <div className="text-center p-5">
                    <Spinner animation="border" />
                    <p>Loading movies...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive className="tmdb-table">
                    <thead>
                        <tr>
                            <th>Poster</th>
                            <th>Title</th>
                            <th>Release Date</th>
                            <th>Status</th>
                            <th>Rating</th>
                            <th>Showtimes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map(movie => (
                            <tr key={movie._id}>
                                <td>
                                    <img
                                        src={movie.posterUrl || movie.image}
                                        alt={movie.title}
                                        className="movie-poster-thumb"
                                    />
                                </td>
                                <td>
                                    <strong>{movie.title}</strong>
                                    <br />
                                    <small className="text-muted">{movie.genre}</small>
                                </td>
                                <td>
                                    {formatDate(movie.releaseDate)}
                                    <br />
                                    {isUpcoming(movie.releaseDate) ? (
                                        <Badge bg="info">Upcoming</Badge>
                                    ) : (
                                        <Badge bg="success">Released</Badge>
                                    )}
                                </td>
                                <td>
                                    {movie.isEnabled ? (
                                        <Badge bg="success">✓ Enabled</Badge>
                                    ) : (
                                        <Badge bg="secondary">Disabled</Badge>
                                    )}
                                </td>
                                <td>
                                    ⭐ {movie.voteAverage?.toFixed(1) || 'N/A'}
                                </td>
                                <td>
                                    <Badge bg="primary">{movie.showtimes?.length || 0} shows</Badge>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {movie.isEnabled ? (
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                onClick={() => handleDisableMovie(movie._id)}
                                            >
                                                Disable
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="success"
                                                onClick={() => handleEnableMovie(movie._id)}
                                            >
                                                Enable
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => openShowtimeModal(movie)}
                                        >
                                            Manage Shows
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Showtime Management Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Manage Showtimes - {selectedMovie?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Add New Showtime</h5>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={showtimeData.date}
                                onChange={(e) => setShowtimeData({ ...showtimeData, date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={showtimeData.time}
                                onChange={(e) => setShowtimeData({ ...showtimeData, time: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Screen</Form.Label>
                            <Form.Select
                                value={showtimeData.screen}
                                onChange={(e) => setShowtimeData({ ...showtimeData, screen: e.target.value })}
                            >
                                <option>Screen 1</option>
                                <option>Screen 2</option>
                                <option>Screen 3</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Total Seats</Form.Label>
                            <Form.Control
                                type="number"
                                value={showtimeData.totalSeats}
                                onChange={(e) => setShowtimeData({ ...showtimeData, totalSeats: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Price (₹)</Form.Label>
                            <Form.Control
                                type="number"
                                value={showtimeData.price}
                                onChange={(e) => setShowtimeData({ ...showtimeData, price: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddShowtime}>
                            Add Showtime
                        </Button>
                    </Form>

                    <hr />

                    <h5>Existing Showtimes</h5>
                    {selectedMovie?.showtimes?.length > 0 ? (
                        <Table striped size="sm">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Screen</th>
                                    <th>Seats</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMovie.showtimes.map(st => (
                                    <tr key={st._id}>
                                        <td>{st.date}</td>
                                        <td>{st.time}</td>
                                        <td>{st.screen}</td>
                                        <td>{st.availableSeats}/{st.totalSeats}</td>
                                        <td>₹{st.price}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleRemoveShowtime(selectedMovie._id, st._id)}
                                            >
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted">No showtimes added yet</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TMDBMovieManager;
