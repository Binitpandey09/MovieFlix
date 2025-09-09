import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import MovieCarousel from '../components/MovieCarousel';
import './HomePage.css';

const HomePage = ({ city, category }) => {
    // State is now simplified to a single list of movies for the grid
    const [movies, setMovies] = useState([]);
    const [activeTabKey, setActiveTabKey] = useState('now_showing');

    // useEffect is now simplified to a single API call
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // 'all_movies' key sends no status, fetching all movies.
                // Otherwise, it sends the key ('now_showing' or 'coming_soon') as the status.
                const statusQuery = activeTabKey === 'all_movies' ? '' : `&status=${activeTabKey}`;
                
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/movies?city=${city}&genre=${category}${statusQuery}&limit=12`);
                setMovies(data && Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                setMovies([]);
            }
        };
        
        fetchMovies();
    }, [city, category, activeTabKey]);

    // This function sets the correct title for the grid based on the active tab
    const getGridTitle = () => {
        switch(activeTabKey) {
            case 'now_showing': return 'Now Showing';
            case 'coming_soon': return 'Coming Soon';
            case 'all_movies':
            default: return 'Movies';
        }
    };

    return (
        <>
            <MovieCarousel />

            <div className="tabs-wrapper">
                <Container>
                    <Tabs
                        id="movie-tabs"
                        activeKey={activeTabKey}
                        onSelect={(k) => setActiveTabKey(k)}
                        className="movie-tabs-nav"
                    >
                        <Tab eventKey="now_showing" title="Now Showing"></Tab>
                        <Tab eventKey="all_movies" title="Movies"></Tab>
                        <Tab eventKey="coming_soon" title="Coming Soon"></Tab>
                        <Tab eventKey="experiences" title="Experiences"></Tab>
                    </Tabs>
                </Container>
            </div>

            <Container className="section-spacing">
                {/* The separate <MovieRow> component has been removed */}
                
                <div className="section-header">
                    <h2>{getGridTitle()}</h2>
                    <Link to="/movies" className="see-all-link">See All ›</Link>
                </div>
                
                <Row>
                    {movies && movies.length > 0 ? (
                        movies.map((movie) => (
                            <Col key={movie._id} sm={12} md={6} lg={4} xl={3}>
                                <MovieCard movie={movie} />
                            </Col>
                        ))
                    ) : (
                        <p>No movies currently available matching your criteria.</p>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default HomePage;