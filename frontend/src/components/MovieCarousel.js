import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import api from '../api';
import './MovieCarousel.css';

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="custom-arrow custom-next" 
      onClick={onClick}
      style={{ display: 'flex' }}
    />
  );
}

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div 
      className="custom-arrow custom-prev" 
      onClick={onClick}
      style={{ display: 'flex' }}
    />
  );
}

const CustomDots = ({ dots, currentSlide, goToSlide }) => {
  return (
    <div className="custom-dots-container">
      {dots.map((dot, index) => (
        <button
          key={index}
          className={`custom-dot ${index === currentSlide ? 'active' : ''}`}
          onClick={() => goToSlide(index)}
        />
      ))}
    </div>
  );
};

const MovieCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const { data } = await api.get('/banners'); // Fixed: removed /api prefix
                setBanners(data && Array.isArray(data) ? data : []); // Added safety check
            } catch (error) {
                console.error("Failed to fetch banners:", error);
                setBanners([]); // Set empty array on error
            }
        };
        fetchBanners();
    }, []);

    const sliderRef = React.useRef(null);

    const goToSlide = (slideIndex) => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(slideIndex);
        }
    };

    // Improved filter with better safety checks
    const filteredBanners = banners.filter(banner => 
        banner && banner.movie && banner.movie._id && banner.bannerImage
    );

    const settings = {
        dots: false,
        infinite: filteredBanners.length > 1,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: filteredBanners.length > 1, // Only autoplay if multiple slides
        autoplaySpeed: 5000,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentSlide(newIndex);
        },
        fade: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <div className="carousel-wrapper">
            {filteredBanners.length > 0 ? (
                <>
                    <Slider ref={sliderRef} {...settings}>
                        {filteredBanners.map((banner) => (
                            <div key={banner._id} className="carousel-slide">
                                <Link to={`/movie/${banner.movie._id}`}>
                                    <div className="image-container">
                                        <img 
                                            src={banner.bannerImage} 
                                            alt={banner.movie.title || 'Movie Banner'} 
                                            className="carousel-full-width-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none'; // Hide broken images
                                            }}
                                        />
                                        <div className="image-overlay"></div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Slider>
                    {filteredBanners.length > 1 && (
                        <CustomDots
                            dots={filteredBanners}
                            currentSlide={currentSlide}
                            goToSlide={goToSlide}
                        />
                    )}
                </>
            ) : (
                <div className="carousel-placeholder">
                    <div className="placeholder-content">
                        <div className="placeholder-shimmer"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCarousel;