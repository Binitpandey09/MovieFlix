import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Tab, Tabs } from 'react-bootstrap';
import api from '../api';
import MovieCard from '../components/MovieCard';
import './CityPage.css';

const cityImages = {
    'Mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=1920&q=80',
    'Delhi-NCR': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=80',
    'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1920&q=80',
    'Hyderabad': 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1920&q=80',
    'Chennai': 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?auto=format&fit=crop&w=1920&q=80',
    'default': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80'
};

const CityPage = () => {
    const { cityName } = useParams();
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [key, setKey] = useState('now-showing');

    // API calls removed as per user request to keep City Page separate from Home Page
    // Future plan: Implement city-specific movie fetching here

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
                        <Tab eventKey="now-showing" title="Now Showing">
                        </Tab>
                        <Tab eventKey="coming-soon" title="Coming Soon">
                        </Tab>
                    </Tabs>
                </Container>
            </div>

            {/* Tab Content Area */}
            <Container className="my-4">
                {key === 'now-showing' && (
                    <Row>
                        <Col><p className="text-center text-muted my-5">Movies specific to {cityName} will appear here.</p></Col>
                    </Row>
                )}
                {key === 'coming-soon' && (
                    <Row>
                        <Col><p className="text-center text-muted my-5">Upcoming movies in {cityName} will appear here.</p></Col>
                    </Row>
                )}
            </Container>
        </>
    );
};

export default CityPage;
