import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import MovieCard from '../components/MovieCard';
import BannerCarousel from '../components/BannerCarousel';
import './HomePage.css';

const HomePage = ({ category }) => {
    // State is now simplified to a single list of movies for the grid
    const [movies, setMovies] = useState([]);
    const [banners, setBanners] = useState([]);
    const [activeTabKey, setActiveTabKey] = useState('now_showing');

    // Fetch banners (Top Rated Now Showing Movies)
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Fetch top 5 rated movies that are currently showing
                const { data } = await api.get('/api/movies?status=now_showing&sort=rating&limit=5');

                // Transform API data to BannerCarousel format
                const formattedBanners = data
                    .map(movie => ({
                        id: movie._id,
                        title: movie.title,
                        subtitle: movie.genre || 'Top Rated',
                        description: movie.description || 'Experience this masterpiece in theaters now.',
                        ctaText: 'Book Tickets',
                        ctaHref: `/movie/${movie._id}`,
                        imageUrl: movie.backdropUrl || movie.posterUrl || movie.image, // Prefer backdrop for banners
                        alt: `${movie.title} movie banner`,
                    }));

                setBanners(formattedBanners);
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                setBanners([]);
            }
        };

        fetchBanners();
    }, []);

    // useEffect is now simplified to a single API call
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // Build query based on active tab
                let statusQuery = '';
                if (activeTabKey === 'now_showing') {
                    statusQuery = '&status=now_showing';
                } else if (activeTabKey === 'coming_soon') {
                    statusQuery = '&status=coming_soon';
                } else if (activeTabKey === 'experiences') {
                    statusQuery = '&status=experiences';
                }
                // 'all_movies' sends no status, fetching all movies

                const apiUrl = `/api/movies?genre=${category}${statusQuery}&limit=12`;
                console.log('Fetching movies with URL:', apiUrl);
                console.log('Active tab:', activeTabKey);
                console.log('Full URL:', process.env.REACT_APP_API_URL + apiUrl);

                const { data } = await api.get(apiUrl);
                console.log('Received movies:', data?.length || 0);
                setMovies(data && Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
                setMovies([]);
            }
        };

        fetchMovies();
    }, [category, activeTabKey]);

    // This function sets the correct title for the grid based on the active tab
    const getGridTitle = () => {
        switch (activeTabKey) {
            case 'now_showing': return 'Now Showing';
            case 'coming_soon': return 'Coming Soon';
            case 'experiences': return 'Experiences';
            case 'all_movies':
            default: return 'Movies';
        }
    };

    return (
        <>
            <BannerCarousel
                banners={banners}
                autoplay={true}
                autoplayInterval={4000}
                loop={true}
            />

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