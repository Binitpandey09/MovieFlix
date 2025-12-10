import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './CityPage.css';

const cityImages = {
    'Mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1920&q=80',
    'Delhi-NCR': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80',
    'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80',
    'Hyderabad': 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1920&q=80',
    'Chennai': 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?auto=format&fit=crop&w=1920&q=80',
    'Pune': 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?auto=format&fit=crop&w=1920&q=80',
    'default': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80'
};

const CityPage = () => {
    const { cityName } = useParams();
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [key, setKey] = useState('now-showing');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cityId, setCityId] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    useEffect(() => {
        const fetchCityAndMovies = async () => {
            setLoading(true);
            try {
                // 1. Get City ID
                const citiesRes = await axios.get(`${API_URL}/api/cities`);
                const city = citiesRes.data.find(c => c.name.toLowerCase() === cityName.toLowerCase());

                if (!city) {
                    setError(`City "${cityName}" not found in our database.`);
                    setLoading(false);
                    return;
                }

                setCityId(city._id);

                // 2. Fetch Movies for this City
                const [nowShowingRes, comingSoonRes] = await Promise.all([
                    axios.get(`${API_URL}/api/movies?city=${city._id}&status=now_showing`),
                    axios.get(`${API_URL}/api/movies?city=${city._id}&status=coming_soon`)
                ]);

                setNowShowing(nowShowingRes.data);
                setComingSoon(comingSoonRes.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load movies.');
            } finally {
                setLoading(false);
            }
        };

        fetchCityAndMovies();
    }, [cityName, API_URL]);

    const bannerImage = cityImages[cityName] || cityImages['default'];

    return (
        <>
            {/* City Banner */}
            <div className="city-banner-container">
                <div className="city-banner-inner">
                    <div className="city-banner-image-container">
                        <img
                            src={bannerImage}
                            alt={`${cityName} City Banner`}
                            className="city-banner-image"
                        />
                        <div className="city-banner-overlay"></div>
                    </div>
                    <div className="city-banner-content">
                        <h1 className="city-banner-title">{cityName}</h1>
                        <p className="city-banner-subtitle">Explore the best movies in your city</p>
                    </div>
                </div>
            </div>

            {/* Movie Tabs */}
            <div className="city-tabs-wrapper">
                <Container>
                    <Tabs
                        id="city-movie-tabs"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="custom-tabs"
                    >
                        <Tab eventKey="now-showing" title="Now Showing" />
                        <Tab eventKey="coming-soon" title="Coming Soon" />
                    </Tabs>
                </Container>
            </div>

            {/* Tab Content Area */}
            <Container className="my-4">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center">{error}</Alert>
                ) : (
                    <Row>
                        {key === 'now-showing' && (
                            nowShowing.length > 0 ? (
                                nowShowing.map(movie => (
                                    <Col key={movie._id} xs={6} sm={4} md={3} lg={2.4} className="mb-4">
                                        <MovieCard movie={movie} />
                                    </Col>
                                ))
                            ) : (
                                <Col><p className="text-center text-muted my-5">No movies currently showing in {cityName}.</p></Col>
                            )
                        )}
                        {key === 'coming-soon' && (
                            comingSoon.length > 0 ? (
                                comingSoon.map(movie => (
                                    <Col key={movie._id} xs={6} sm={4} md={3} lg={2.4} className="mb-4">
                                        <MovieCard movie={movie} />
                                    </Col>
                                ))
                            ) : (
                                <Col><p className="text-center text-muted my-5">No upcoming movies scheduled for {cityName}.</p></Col>
                            )
                        )}
                    </Row>
                )}
            </Container>
        </>
    );
};

export default CityPage;
