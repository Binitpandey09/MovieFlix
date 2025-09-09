import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import Footer from './components/Footer'; // 1. Import the Footer
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import AdminPanelPage from './pages/AdminPanelPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import AllMoviesPage from './pages/AllMoviesPage'; // 1. Import the new page


function App() {
  const [city, setCity] = useState('Ludhiana');
  const [category, setCategory] = useState('All');
  const [allCities, setAllCities] = useState([]);
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
    const fetchAllCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        // ✅ CORRECTED: Check for the 'categories' array inside the data object
        if (data && Array.isArray(data.categories)) { 
          setCategories(data.categories.map(c => c.name));
        } else if (Array.isArray(data)) { // Fallback for direct array response
          setCategories(data.map(c => c.name));
        }
      } catch (error) {
          console.error("Could not fetch categories", error);
      }
    };

    const fetchAllCities = async () => {
        try {
            const { data } = await api.get('/api/cities');
            // ✅ CORRECTED: Check for the 'cities' array inside the data object
            if (data && Array.isArray(data.cities)) {
              const cityNames = data.cities.map(c => c.name);
              setAllCities(cityNames);
              if (cityNames.length > 0 && !cityNames.includes(city)) {
                setCity(cityNames[0]);
              }
            } else if (Array.isArray(data)) { // Fallback for direct array response
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
  }, []);

  return (
    <Router>
      {/* 2. Add flexbox wrapper to make footer sticky */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header city={city} setCity={setCity} allCities={allCities} />
        <FilterBar setCategory={setCategory} categories={categories} />
        
        {/* 3. Make main content area expand */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage city={city} category={category} />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/booking/:movieId" element={<BookingPage />} />
            <Route path="/contact" element={<Container className="my-4"><ContactPage /></Container>} />
            <Route path="/login" element={<Container className="my-4"><LoginPage /></Container>} />
            <Route path="/register" element={<Container className="my-4"><RegisterPage /></Container>} />
            <Route path="/my-bookings" element={<Container className="my-4"><BookingsPage /></Container>} />
            <Route path="/movies" element={<AllMoviesPage />} /> {/* 2. Add the route */}
            <Route path="/admin" element={<AdminPanelPage categories={categories} fetchCategories={fetchAllCategories} />} />
          </Routes>
        </main>

        <Footer /> {/* 4. Add the Footer component at the end */}
      </div>
    </Router>
  );
}

export default App;