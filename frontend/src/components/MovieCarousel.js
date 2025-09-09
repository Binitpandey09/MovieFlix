import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
// 1. Import your new api instance INSTEAD of axios
import api from '../api'; // Adjust path if api.js is in a different folder
import './MovieCarousel.css';

// ... (Your NextArrow, PrevArrow, and CustomDots components remain unchanged) ...

const MovieCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // 2. Use `api.get` which already knows the backend URL
                // The request will now correctly go to https://movieflix-sp5q.onrender.com/api/banners
                const { data } = await api.get('/api/banners');
                
                // Now, `data` should be the actual JSON object from your API
                // If the array is inside a key, you might need data.banners or data.data
                if (Array.isArray(data)) {
                    setBanners(data);
                } else if (Array.isArray(data.banners)) { // Fallback for { banners: [...] }
                    setBanners(data.banners);
                }

            } catch (error) {
                console.error("Failed to fetch banners:", error);
                setBanners([]); // Set to empty array on error to prevent crashes
            }
        };
        fetchBanners();
    }, []);

    // 3. (RECOMMENDED) Make your filter crash-proof
    const filteredBanners = Array.isArray(banners) ? banners.filter(banner => banner.movie) : [];

    const sliderRef = React.useRef(null);

    // ... (rest of your component code remains the same) ...

    const settings = {
        dots: false,
        infinite: filteredBanners.length > 1,
        speed: 600,
        slidesToShow: 1,
        // ... etc
    };

    return (
        <div className="carousel-wrapper">
           {/* ... (rest of your JSX remains the same) ... */}
        </div>
    );
};

export default MovieCarousel;
