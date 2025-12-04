import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import api from '../api';
import MovieCard from '../components/MovieCard';

import { useLocation } from 'react-router-dom';

const AllMoviesPage = () => {
    const [allMovies, setAllMovies] = useState([]);
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const url = searchQuery
                    ? `/api/movies?search=${searchQuery}`
                    : '/api/movies';

                const { data } = await api.get(url);
                setAllMovies(data);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
        };
        fetchAllMovies();
    }, [searchQuery]);

    return (
        <Container className="my-4">
            <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'All Movies'}</h1>
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