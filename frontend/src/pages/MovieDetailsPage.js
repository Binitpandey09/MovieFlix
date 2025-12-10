import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Button, Container, Modal } from 'react-bootstrap';
import api from '../api';
import CitySelectionModal from '../components/CitySelectionModal';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await api.get(`/api/movies/${id}`);
                setMovie(data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        fetchMovie();
    }, [id]);

    const handleBookTickets = () => {
        setShowCityModal(true);
    };

    const handleCitySelect = (city) => {
        setShowCityModal(false);
        const cityQuery = `?cityId=${city._id}&city=${city.name}`;
        navigate(`/buytickets/${movie._id}${cityQuery}`);
    };

    if (!movie) {
        return <Container><div>Loading...</div></Container>;
    }

    return (
        <div className="movie-details-wrapper" style={{ backgroundImage: `url(${movie.backdropUrl || movie.image})` }}>
            <div className="movie-details-overlay">
                <Container>
                    <Row className="movie-details-content">
                        <Col md={3} className="poster-container">
                            <Image src={movie.posterUrl || movie.image} alt={movie.title} fluid className="movie-poster" />
                        </Col>
                        <Col md={9} className="details-container">
                            <h1 className="movie-title">{movie.title}</h1>
                            <div className="rating-box">⭐ {movie.rating}/10</div>
                            <div className="tags-box"><span className="tag">2D</span><span className="tag">Hindi</span></div>
                            <p className="movie-meta">{movie.genre} • UA • {new Date(movie.releaseDate).toLocaleDateString()} • {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''}</p>
                            <p className="movie-description">{movie.description}</p>

                            <div className="action-buttons">
                                <Button variant="danger" size="lg" className="book-tickets-btn" onClick={handleBookTickets}>Book Tickets</Button>
                                {movie.trailerKey && (
                                    <Button variant="outline-light" size="lg" className="trailer-btn" onClick={() => setShowTrailer(true)}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                        </svg>
                                        Watch Trailer
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Trailer Modal */}
            <Modal
                show={showTrailer}
                onHide={() => setShowTrailer(false)}
                size="lg"
                centered
                className="trailer-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{movie.title} - Trailer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="video-responsive">
                        <iframe
                            width="853"
                            height="480"
                            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded youtube"
                        />
                    </div>
                </Modal.Body>
            </Modal>

            <CitySelectionModal
                show={showCityModal}
                onHide={() => setShowCityModal(false)}
                onSelect={handleCitySelect}
            />
        </div>
    );
};

export default MovieDetailsPage;