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
import AllMoviesPage from './pages/AllMoviesPage';
import CityPage from './pages/CityPage';
import BuyTicketsPage from './pages/BuyTicketsPage';
import BookingPage from './pages/BookingPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </Container>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [category] = useState('All');
  const [categories, setCategories] = useState([]);

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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1 }}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage category={category} />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/contact" element={<Container className="my-4"><ContactPage /></Container>} />
              <Route path="/login" element={<Container className="my-4"><LoginPage /></Container>} />
              <Route path="/register" element={<Container className="my-4"><RegisterPage /></Container>} />
              <Route path="/movies" element={<AllMoviesPage />} />
              <Route path="/city/:cityName" element={<CityPage />} />
              <Route path="/buytickets/:movieId" element={<BuyTicketsPage />} />
              <Route path="/booking/:movieId" element={<BookingPage />} />
              <Route path="/admin" element={<AdminPanelPage categories={categories} fetchCategories={fetchAllCategories} />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;