import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import CitySelectionModal from '../components/CitySelectionModal';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const [showCityModal, setShowCityModal] = React.useState(false);

    const handleBookClick = (e) => {
        e.preventDefault();
        setShowCityModal(true);
    };

    const handleCitySelect = (city) => {
        setShowCityModal(false);
        const cityQuery = `?cityId=${city._id}&city=${city.name}`;
        navigate(`/buytickets/${movie._id}${cityQuery}`);
    };

    return (
        <Card className="p-3 rounded">
            <Link to={`/movie/${movie._id}`}>
                <Card.Img src={movie.posterUrl || movie.image} variant="top" style={{ aspectRatio: '2/3', objectFit: 'cover' }} />
            </Link>
            <Card.Body>
                <Link to={`/movie/${movie._id}`}>
                    <Card.Title as="div">
                        <strong>{movie.title}</strong>
                    </Card.Title>
                </Link>
                <button
                    className="btn btn-danger btn-sm w-100 mt-2"
                    onClick={handleBookClick}
                >
                    Book Tickets
                </button>
            </Card.Body>
            <CitySelectionModal
                show={showCityModal}
                onHide={() => setShowCityModal(false)}
                onSelect={handleCitySelect}
            />
        </Card>
    );
};

export default MovieCard;