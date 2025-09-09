import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import api from './api'; // ✅ CHANGE #1: Import your centralized api instance
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

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // ✅ CHANGE #2: Use the 'api' instance to call the correct backend URL
        const { data } = await api.get('/api/categories');
        // ✅ CHANGE #3: Add a check to prevent crash if data is not an array
        if (Array.isArray(data)) {
          setCategories(data.map(c => c.name));
        }
      } catch (error) {
          console.error("Could not fetch categories", error);
      }
    };

    const fetchAllCities = async () => {
        try {
            // ✅ CHANGE #2: Use the 'api' instance
            const { data } = await api.get('/api/cities');
            // ✅ CHANGE #3: Add a check to prevent crash
            if (Array.isArray(data)) {
              const cityNames = data.map(c => c.name);
              setAllCities(cityNames);
              if (cityNames.length > 0 && !cityNames.includes(city)) {
                setCity(cityNames[0]);
              }
            }
        } catch (error) {
            console.error("Could not fetch cities", error);
        }
    };

    fetchAllCities();
    fetchAllCategories();
  }, []); // Note: Removed 'city' dependency to prevent re-fetching on every city change

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
            <Route path="/admin" element={<AdminPanelPage categories={categories} fetchCategories={fetchAllCategories} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
