import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './BannerCarousel.css';

/**
 * BannerCarousel Component
 * 
 * A production-ready, accessible sliding banner carousel for MovieFlix.
 * Enforces 1-3 banners maximum with automatic truncation and warnings.
 * 
 * @param {Object} props
 * @param {Array} props.banners - Array of banner objects (max 3, min 1)
 * @param {number} props.maxVisible - Maximum visible slides (default: 3)
 * @param {boolean} props.autoplay - Enable autoplay (default: false)
 * @param {number} props.autoplayInterval - Autoplay interval in ms (default: 5000)
 * @param {boolean} props.loop - Enable looping (default: false)
 * @param {Function} props.onSlideChange - Callback when slide changes
 * @param {string} props.aspectRatio - CSS aspect ratio (default: "16/6.4")
 * @param {string} props.containerMaxWidth - Max container width (default: "1400px")
 * @param {boolean} props.strict - Throw error on >3 banners instead of truncating (default: false)
 */
const BannerCarousel = ({
  banners = [],
  maxVisible = 3,
  autoplay = false,
  autoplayInterval = 5000,
  loop = false,
  onSlideChange,
  aspectRatio = '16/6.4',
  containerMaxWidth = '1400px',
  strict = false
}) => {
  const [processedBanners, setProcessedBanners] = useState([]);
  const swiperRef = useRef(null);
  
  // Validate and process banners on mount/update
  useEffect(() => {
    // Handle empty banners
    if (banners.length === 0) {
      console.info('BannerCarousel: No banners provided, showing fallback hero');
      setProcessedBanners([]);
      return;
    }
    
    // Handle >3 banners
    if (banners.length > 3) {
      if (strict) {
        throw new Error(`BannerCarousel: Received ${banners.length} banners but maximum is 3. Set strict=false to auto-truncate.`);
      }
      console.warn(`Carousel: input banners truncated to 3 items (received ${banners.length} banners)`);
      setProcessedBanners(banners.slice(0, 3));
      return;
    }
    
    setProcessedBanners(banners);
  }, [banners, strict]);
  
  // Handle slide change
  const handleSlideChange = (swiper) => {
    if (onSlideChange) {
      onSlideChange(swiper.realIndex);
    }
  };
  
  // Swiper configuration - Show peek of adjacent banners on both sides
  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay, Keyboard, A11y],
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    loop: loop && processedBanners.length > 1,
    loopedSlides: processedBanners.length,
    navigation: {
      nextEl: '.swiper-button-next-custom',
      prevEl: '.swiper-button-prev-custom',
    },
    pagination: {
      el: '.swiper-pagination-custom',
      clickable: true,
      bulletClass: 'carousel-bullet',
      bulletActiveClass: 'carousel-bullet-active',
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    a11y: {
      enabled: true,
      prevSlideMessage: 'Previous banner',
      nextSlideMessage: 'Next banner',
      firstSlideMessage: 'This is the first banner',
      lastSlideMessage: 'This is the last banner',
      paginationBulletMessage: 'Go to banner {{index}}',
    },
    autoplay: autoplay ? {
      delay: autoplayInterval,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    } : false,
    onSlideChange: handleSlideChange,
  };
  
  // Fallback hero when no banners
  if (processedBanners.length === 0) {
    return (
      <div 
        className="fallback-hero"
        role="region"
        aria-label="Featured content"
        style={{ maxWidth: containerMaxWidth }}
      >
        <div className="fallback-content">
          <h1 className="fallback-title">Welcome to MovieFlix</h1>
          <p className="fallback-subtitle">Discover and book your favorite movies</p>
          <a 
            href="/movies" 
            className="fallback-cta"
            aria-label="Browse all movies"
          >
            Browse Movies
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="banner-carousel-wrapper"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured movie banners"
      style={{ 
        maxWidth: containerMaxWidth,
        '--aspect-ratio': aspectRatio 
      }}
    >
      <Swiper
        {...swiperConfig}
        ref={swiperRef}
        className="banner-swiper"
        aria-live={autoplay ? "polite" : "off"}
      >
        {processedBanners.map((banner, index) => (
          <SwiperSlide key={banner.id || index}>
            <BannerSlide banner={banner} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Arrows */}
      {processedBanners.length > 1 && (
        <>
          <button
            className="swiper-button-prev-custom carousel-arrow"
            aria-label="Previous banner"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="swiper-button-next-custom carousel-arrow"
            aria-label="Next banner"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}
      
      {/* Custom Pagination Dots */}
      {processedBanners.length > 1 && (
        <div className="swiper-pagination-custom" aria-label="Banner navigation"></div>
      )}
    </div>
  );
};

/**
 * Individual Banner Slide Component
 * Handles responsive images with srcset and lazy loading
 */
const BannerSlide = ({ banner, index }) => {
  const {
    title,
    subtitle,
    description,
    ctaText,
    ctaHref,
    imageUrl,
    alt,
    srcset,
  } = banner;
  
  // Generate srcset if not provided
  const defaultSrcset = srcset || `
    ${imageUrl}?w=480 480w,
    ${imageUrl}?w=768 768w,
    ${imageUrl}?w=1024 1024w,
    ${imageUrl}?w=1600 1600w,
    ${imageUrl}?w=1920 1920w
  `;
  
  const sizes = "(max-width: 640px) 100vw, (max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw";
  
  return (
    <div 
      className="banner-slide"
      tabIndex="0"
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${banner.total || 3}: ${title}`}
    >
      <div className="banner-image-container">
        <img
          src={imageUrl}
          srcSet={defaultSrcset}
          sizes={sizes}
          alt={alt || title}
          className="banner-image"
          loading="lazy"
        />
        <div className="banner-overlay" aria-hidden="true"></div>
      </div>
      
      <div className="banner-content">
        <h2 className="banner-title">{title}</h2>
        {subtitle && <p className="banner-subtitle">{subtitle}</p>}
        {description && <p className="banner-description">{description}</p>}
        {ctaText && ctaHref && (
          <a 
            href={ctaHref}
            className="banner-cta"
            aria-label={`${ctaText} - ${title}`}
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
};

export default BannerCarousel;
