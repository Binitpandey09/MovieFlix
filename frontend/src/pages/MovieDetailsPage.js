import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const { data } = await axios.get(`/api/movies/${id}`);
                setMovie(data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        fetchMovie();
    }, [id]);

    const handleBookTickets = () => {
        navigate(`/booking/${movie._id}`);
    };

    if (!movie) {
        return <Container><div>Loading...</div></Container>;
    }

    return (
        <div className="movie-details-wrapper" style={{ backgroundImage: `url(${movie.image})` }}>
            <div className="movie-details-overlay">
                <Container>
                    <Row className="movie-details-content">
                        <Col md={4} className="poster-container">
                            <Image src={movie.image} alt={movie.title} fluid className="movie-poster" />
                        </Col>
                        <Col md={8} className="details-container">
                            <h1 className="movie-title">{movie.title}</h1>
                            <div className="rating-box">⭐ {movie.rating}/10</div>
                            <div className="tags-box"><span className="tag">2D</span><span className="tag">Hindi</span></div>
                            <p className="movie-meta">{movie.genre} • UA • {new Date(movie.releaseDate).toLocaleDateString()}</p>
                            <p className="movie-description">{movie.description}</p>
                            <Button variant="danger" size="lg" className="book-tickets-btn" onClick={handleBookTickets}>Book Tickets</Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default MovieDetailsPage;