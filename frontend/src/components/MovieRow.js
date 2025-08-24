import React from 'react';
import Slider from 'react-slick';
import MovieCard from './MovieCard';
import './MovieRow.css';

const MovieRow = ({ title, movies }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        ]
    };

    return (
        <div className="movie-row-container">
            <h2 className="movie-row-title">{title}</h2>
            {movies.length > 0 ? (
                <Slider {...settings}>
                    {movies.map(movie => (
                        <div key={movie._id} className="movie-row-slide">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </Slider>
            ) : (
                <p>No movies to display in this section.</p>
            )}
        </div>
    );
};

export default MovieRow;