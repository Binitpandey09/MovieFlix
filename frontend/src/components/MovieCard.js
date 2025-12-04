import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Card className="p-3 rounded">
            <Link to={`/movie/${movie._id}`}>
                <Card.Img src={movie.posterUrl || movie.image} variant="top" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />
            </Link>
            <Card.Body>
                <Link to={`/movie/${movie._id}`}>
                    <Card.Title as="div">
                        <strong>{movie.title}</strong>
                    </Card.Title>
                </Link>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;