import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import api from '../api';
import MovieCard from '../components/MovieCard';

const AllMoviesPage = () => {
    const [allMovies, setAllMovies] = useState([]);

    useEffect(() => {
        // This fetches ALL movies without any limit
        const fetchAllMovies = async () => {
            try {
                const { data } = await api.get('/api/movies');
                setAllMovies(data);
            } catch (error) {
                console.error("Failed to fetch all movies:", error);
            }
        };
        fetchAllMovies();
    }, []);

    return (
        <Container className="my-4">
            <h1>All Movies</h1>
            <Row>
                {allMovies.map(movie => (
                    <Col key={movie._id} sm={12} md={6} lg={4} xl={3}>
                        <MovieCard movie={movie} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AllMoviesPage;