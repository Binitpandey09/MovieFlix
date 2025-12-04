import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ContactPage from './pages/ContactPage';
// import BookingPage from './pages/BookingPage'; // Removed

import AllMoviesPage from './pages/AllMoviesPage'; // 1. Import the new page
import CityPage from './pages/CityPage'; // Import CityPage


function App() {
  const [category] = useState('All'); // Removed setCategory as FilterBar is removed
  const [categories, setCategories] = useState([]); // State for all categories
  const fetchAllCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.map(c => c.name));
    } catch (error) {
      console.error("Could not fetch categories", error);
    }
  };
  useEffect(() => {
    fetchAllCategories();
  }, []);

  return (
    <Router>
      {/* 2. Add flexbox wrapper to make footer sticky */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        {/* FilterBar removed - Home and Category dropdown hidden */}

        {/* 3. Make main content area expand */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage category={category} />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/contact" element={<Container className="my-4"><ContactPage /></Container>} />
            <Route path="/login" element={<Container className="my-4"><LoginPage /></Container>} />
            <Route path="/register" element={<Container className="my-4"><RegisterPage /></Container>} />
            {/* Booking routes removed as per user request */}
            <Route path="/movies" element={<AllMoviesPage />} /> {/* 2. Add the route */}
            <Route path="/city/:cityName" element={<CityPage />} /> {/* City Page Route */}
            <Route path="/admin" element={<AdminPanelPage categories={categories} fetchCategories={fetchAllCategories} />} />
          </Routes>
        </main>

        <Footer /> {/* 4. Add the Footer component at the end */}
      </div>
    </Router>
  );
}

export default App;