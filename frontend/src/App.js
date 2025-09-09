import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import api from './api';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import AllMoviesPage from './pages/AllMoviesPage';

function App() {
  const [city, setCity] = useState('Ludhiana');
  const [category, setCategory] = useState('All');
  const [allCities, setAllCities] = useState([]);
  const [categories, setCategories] = useState([]);

  // This is the section with the corrected code
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/api/categories');
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data.categories)) {
          setCategories(categoriesResponse.data.categories.map(c => c.name));
        }

        // Fetch cities
        const citiesResponse = await api.get('/api/cities');
        if (citiesResponse.data && Array.isArray(citiesResponse.data.cities)) {
          const cityNames = citiesResponse.data.cities.map(c => c.name);
          setAllCities(cityNames);
          // This logic now correctly uses the initial default city, not the state variable
          if (cityNames.length > 0 && !cityNames.includes('Ludhiana')) {
            setCity(cityNames[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };

    fetchInitialData();
    // ✅ CORRECTED: The dependency array is empty because this should only run once.
    // The logic inside no longer depends on the 'city' state variable.
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header city={city} setCity={setCity} allCities={allCities} />
        <FilterBar setCategory={setCategory} categories={categories} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage city={city} category={category} />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/booking/:movieId" element={<BookingPage />} />
            <Route path="/contact" element={<Container className="my-4"><ContactPage /></Container>} />
            <Route path="/login" element={<Container className="my-4"><LoginPage /></Container>} />
            <Route path="/register" element={<Container className="my-4"><RegisterPage /></Container>} />
            <Route path="/my-bookings" element={<Container className="my-4"><BookingsPage /></Container>} />
            <Route path="/movies" element={<AllMoviesPage />} />
            <Route path="/admin" element={<AdminPanelPage categories={categories} fetchCategories={() => {}} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

