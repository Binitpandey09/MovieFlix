import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import api from '../api';

// The modal now receives a 'cities' prop with the list from your database
const EditMovieModal = ({ show, handleClose, movie, refreshMovies, cities }) => {
    const [formData, setFormData] = useState({ title: '', description: '', genre: '', rating: 0, image: '', releaseDate: '', cities: [] });

    useEffect(() => {
        if (movie) {
            setFormData({
                title: movie.title || '',
                description: movie.description || '',
                genre: movie.genre || '',
                rating: movie.rating || 0,
                image: movie.image || '',
                releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
                cities: movie.cities || []
            });
        }
    }, [movie]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCityChange = (e) => {
        const { value, checked } = e.target;
        const currentCities = formData.cities;
        if (checked) {
            setFormData({ ...formData, cities: [...currentCities, value] });
        } else {
            setFormData({ ...formData, cities: currentCities.filter(city => city !== value) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            await api.put(`/api/movies/${movie._id}`, formData, config);
            refreshMovies();
            handleClose();
        } catch (error) {
            alert('Failed to update movie');
        }
    };

    if (!movie) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton><Modal.Title>Edit Movie</Modal.Title></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='title'><Form.Label>Title</Form.Label><Form.Control type='text' name='title' value={formData.title} onChange={handleChange}></Form.Control></Form.Group>
                    <Form.Group controlId='description'><Form.Label>Description</Form.Label><Form.Control as='textarea' name='description' rows={3} value={formData.description} onChange={handleChange}></Form.Control></Form.Group>
                    <Form.Group controlId='genre'><Form.Label>Genre</Form.Label><Form.Control type='text' name='genre' value={formData.genre} onChange={handleChange}></Form.Control></Form.Group>
                    <Form.Group controlId='rating'><Form.Label>Rating</Form.Label><Form.Control type='number' name='rating' value={formData.rating} onChange={handleChange}></Form.Control></Form.Group>
                    <Form.Group controlId='image'><Form.Label>Image URL</Form.Label><Form.Control type='text' name='image' value={formData.image} onChange={handleChange}></Form.Control></Form.Group>
                    <Form.Group controlId='releaseDate'>
                        <Form.Label>Release Date</Form.Label>
                        <Form.Control
                            type='date'
                            name='releaseDate'
                            value={formData.releaseDate}
                            onChange={handleChange}
                        />
                    </Form.Group>



                    <Button type='submit' variant='primary' className='mt-3'>Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditMovieModal;