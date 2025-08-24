import React, { useState, useEffect } from 'react';
import { Table, Button, Form, ListGroup, Image, Container, Nav } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditMovieModal from '../components/EditMovieModal';
import ShowtimeManagerModal from '../components/ShowtimeManagerModal';
import './AdminPanelPage.css'; // Import the new CSS

const AdminPanelPage = () => {
    const [activeView, setActiveView] = useState('viewMovies'); // State to control which view is shown

    // API URL from environment variable, fallback to localhost:5001
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

    // States for Movies, Cities, Banners, and Categories
    const [movies, setMovies] = useState([]);
    const [cities, setCities] = useState([]);
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);

    // Add Movie Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [rating, setRating] = useState(0);
    const [image, setImage] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [selectedCities, setSelectedCities] = useState([]);

    // Add City Form state
    const [newCityName, setNewCityName] = useState('');

    // Add Category Form state
    const [newCategoryName, setNewCategoryName] = useState('');

    // Add Banner Form state
    const [selectedMovieForBanner, setSelectedMovieForBanner] = useState('');
    const [bannerImageUrl, setBannerImageUrl] = useState('');

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showShowtimeModal, setShowShowtimeModal] = useState(false);
    const [currentMovie, setCurrentMovie] = useState(null);

    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // --- Data Fetching Functions (for reuse in handlers) ---
    const fetchMovies = async () => {
        const { data } = await axios.get(`${API_URL}/api/movies`);
        setMovies(data);
    };
    const fetchCities = async () => {
        const { data } = await axios.get(`${API_URL}/api/cities`);
        setCities(data.map(city => city.name));
    };
    const fetchBanners = async () => {
        const { data } = await axios.get(`${API_URL}/api/banners`);
        setBanners(data);
    };
    const fetchCategories = async () => {
        const { data } = await axios.get(`${API_URL}/api/categories`);
        setCategories(data);
    };

    // Initial data loading
    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        // Move API calls inside useEffect to avoid dependency issues
        const loadInitialData = async () => {
            try {
                const [moviesRes, citiesRes, bannersRes, categoriesRes] = await Promise.all([
                    axios.get(`${API_URL}/api/movies`),
                    axios.get(`${API_URL}/api/cities`),
                    axios.get(`${API_URL}/api/banners`),
                    axios.get(`${API_URL}/api/categories`)
                ]);
                
                setMovies(moviesRes.data);
                setCities(citiesRes.data.map(city => city.name));
                setBanners(bannersRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        };

        loadInitialData();
    }, [navigate, userInfo, API_URL]);

    // --- Handlers ---
    const handleEditClick = (movie) => { setCurrentMovie(movie); setShowEditModal(true); };
    const handleShowtimeClick = (movie) => { setCurrentMovie(movie); setShowShowtimeModal(true); };
    const handleCloseModals = () => { setShowEditModal(false); setShowShowtimeModal(false); setCurrentMovie(null); };

    const handleCityChange = (e) => {
        const { value, checked } = e.target;
        setSelectedCities(prev => checked ? [...prev, value] : prev.filter(c => c !== value));
    };

    const addCityHandler = async (e) => {
        e.preventDefault();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.post(`${API_URL}/api/cities`, { name: newCityName }, config);
            setNewCityName('');
            fetchCities();
            alert('City added!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add city.');
        }
    };

    const addCategoryHandler = async (e) => {
        e.preventDefault();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.post(`${API_URL}/api/categories`, { name: newCategoryName }, config);
            setNewCategoryName('');
            fetchCategories();
            alert('Category added!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add category.');
        }
    };

    const deleteCategoryHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`${API_URL}/api/categories/${id}`, config);
            fetchCategories();
        }
    };

    const addMovieHandler = async (e) => {
        e.preventDefault();
        if (selectedCities.length === 0 || !releaseDate || !genre) {
            return alert('Please fill out all fields, including genre, cities and release date.');
        }
        const movieData = { title, description, genre, rating, image, releaseDate, cities: selectedCities, showtimes: [] };
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.post(`${API_URL}/api/movies`, movieData, config);
            alert('Movie added successfully!');
            fetchMovies();
            setTitle(''); setDescription(''); setGenre(''); setRating(0); setImage(''); setReleaseDate(''); setSelectedCities([]);
            document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add movie.');
        }
    };

    const deleteMovieHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`${API_URL}/api/movies/${id}`, config);
            fetchMovies();
        }
    };
    
    const addBannerHandler = async (e) => {
        e.preventDefault();
        if (!selectedMovieForBanner || !bannerImageUrl) return alert('Please select a movie and provide a URL.');
        const bannerExists = banners.some(banner => banner.movie._id === selectedMovieForBanner);
        if (bannerExists) return alert('A banner for this movie already exists.');
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.post(`${API_URL}/api/banners`, { movie: selectedMovieForBanner, bannerImage: bannerImageUrl }, config);
            alert('Banner added!');
            fetchBanners();
            setSelectedMovieForBanner('');
            setBannerImageUrl('');
        } catch (error) {
            alert('Failed to add banner.');
        }
    };

    const deleteBannerHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`${API_URL}/api/banners/${id}`, config);
            fetchBanners();
        }
    };

    // This function will render the correct component based on the activeView state
    const renderActiveView = () => {
        switch (activeView) {
            case 'addMovie':
                return (
                    <div>
                        <h2>Add Movie</h2>
                        <Form onSubmit={addMovieHandler}>
                            <Form.Group controlId='title'><Form.Label>Title</Form.Label><Form.Control type='text' value={title} onChange={(e) => setTitle(e.target.value)} /></Form.Group>
                            <Form.Group controlId='description'><Form.Label>Description</Form.Label><Form.Control as='textarea' rows={3} value={description} onChange={(e) => setDescription(e.target.value)} /></Form.Group>
                            <Form.Group controlId='genre'>
                                <Form.Label>Genre</Form.Label>
                                <Form.Select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                                    <option value="">-- Select Genre --</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category.name}>{category.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId='rating'><Form.Label>Rating</Form.Label><Form.Control type='number' value={rating} onChange={(e) => setRating(e.target.value)} /></Form.Group>
                            <Form.Group controlId='image'><Form.Label>Image URL</Form.Label><Form.Control type='text' value={image} onChange={(e) => setImage(e.target.value)} /></Form.Group>
                            <Form.Group controlId='releaseDate'><Form.Label>Release Date</Form.Label><Form.Control type='date' value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required /></Form.Group>
                            <Form.Group controlId='cities' className='mt-2'><Form.Label>Available In Cities</Form.Label>{cities.map(city => (<Form.Check type='checkbox' key={city} label={city} value={city} onChange={handleCityChange} />))}</Form.Group>
                            <Button type='submit' variant='primary' className='mt-3'>Add Movie</Button>
                        </Form>
                    </div>
                );
            case 'addCity':
                return (
                    <div>
                        <h2>Add New City</h2>
                        <Form onSubmit={addCityHandler}><Form.Group controlId='newCityName'><Form.Label>City Name</Form.Label><Form.Control type='text' value={newCityName} onChange={(e) => setNewCityName(e.target.value)} required /></Form.Group><Button type='submit' variant='secondary' className='mt-3 w-100'>Add City</Button></Form>
                    </div>
                );
            case 'addBanner':
                return (
                    <div>
                        <h2>Add Carousel Banner</h2>
                        <Form onSubmit={addBannerHandler}><Form.Group controlId="movieSelect"><Form.Label>Select Movie</Form.Label><Form.Select value={selectedMovieForBanner} onChange={(e) => setSelectedMovieForBanner(e.target.value)}><option value="">-- Select a Movie --</option>{movies.map(movie => (<option key={movie._id} value={movie._id}>{movie.title}</option>))}</Form.Select></Form.Group><Form.Group controlId="bannerImage" className="mt-2"><Form.Label>Banner Image URL</Form.Label><Form.Control type="text" value={bannerImageUrl} onChange={(e) => setBannerImageUrl(e.target.value)} placeholder="https://.../image.jpg" /></Form.Group><Button type="submit" variant="primary" className="mt-3 w-100">Add Banner</Button></Form>
                    </div>
                );
            case 'manageCategories':
                return (
                    <div>
                        <h2>Manage Categories</h2>
                        <ListGroup className="mb-3">
                            {categories.map(category => (
                                <ListGroup.Item key={category._id} className="d-flex justify-content-between align-items-center">
                                    {category.name}
                                    <Button variant="outline-danger" size="sm" onClick={() => deleteCategoryHandler(category._id)}>Delete</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Form onSubmit={addCategoryHandler}>
                            <Form.Group controlId='newCategoryName'>
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control type='text' value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
                            </Form.Group>
                            <Button type='submit' variant='info' className='mt-3 w-100'>Add Category</Button>
                        </Form>
                    </div>
                );
            case 'viewMovies':
            default:
                return (
                    <div>
                        <h2>Movies</h2>
                        <Table striped bordered hover responsive className="table-sm">
                            <thead><tr><th>TITLE</th><th>CITIES</th><th>ACTIONS</th></tr></thead>
                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie._id}>
                                        <td>{movie.title}</td>
                                        <td>{movie.cities && movie.cities.length > 0 ? movie.cities.join(', ') : 'N/A'}</td>
                                        <td>
                                            <Button variant="info" size="sm" className="mx-1 my-1" onClick={() => handleShowtimeClick(movie)}>Showtimes</Button>
                                            <Button variant="light" size="sm" className="mx-1 my-1" onClick={() => handleEditClick(movie)}>Edit</Button>
                                            <Button variant="danger" size="sm" className="mx-1 my-1" onClick={() => deleteMovieHandler(movie._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <h2 className="mt-5">Manage Carousel Banners</h2>
                        <ListGroup>
                            {banners.map(banner => (
                                <ListGroup.Item key={banner._id} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Image src={banner.bannerImage} thumbnail width="100px" className="me-3" />
                                        <span>{banner.movie?.title || 'Movie Deleted'}</span>
                                    </div>
                                    <Button variant="danger" size="sm" onClick={() => deleteBannerHandler(banner._id)}>Delete</Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                );
        }
    };

    return (
        <Container fluid className="my-4">
            <div className="admin-panel-container">
                <div className="admin-sidebar">
                    <Nav variant="pills" activeKey={activeView} onSelect={(k) => setActiveView(k)} className="flex-column">
                        <Nav.Link eventKey="viewMovies">View Movies & Banners</Nav.Link>
                        <Nav.Link eventKey="addMovie">Add Movie</Nav.Link>
                        <Nav.Link eventKey="addCity">Add New City</Nav.Link>
                        <Nav.Link eventKey="addBanner">Add Carousel Banner</Nav.Link>
                        <Nav.Link eventKey="manageCategories">Manage Categories</Nav.Link>
                    </Nav>
                </div>
                <div className="admin-content">
                    {renderActiveView()}
                </div>
            </div>

            <EditMovieModal show={showEditModal} handleClose={handleCloseModals} movie={currentMovie} refreshMovies={fetchMovies} cities={cities} categories={categories.map(c => c.name)} />
            <ShowtimeManagerModal show={showShowtimeModal} handleClose={handleCloseModals} movie={currentMovie} refreshMovies={fetchMovies} />
        </Container>
    );
};

export default AdminPanelPage;