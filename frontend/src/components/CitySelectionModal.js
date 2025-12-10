import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import api from '../api';
import './CitySelectionModal.css';

// Predefined images for major cities (could store in DB ideally)
const cityImages = {
    'Mumbai': 'https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png',
    'Delhi-NCR': 'https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png',
    'Bengaluru': 'https://in.bmscdn.com/m6/images/common-modules/regions/bang.png',
    'Hyderabad': 'https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png',
    'Chennai': 'https://in.bmscdn.com/m6/images/common-modules/regions/chen.png',
    'Pune': 'https://in.bmscdn.com/m6/images/common-modules/regions/pune.png',
    'Kolkata': 'https://in.bmscdn.com/m6/images/common-modules/regions/kolk.png',
    'Kochi': 'https://in.bmscdn.com/m6/images/common-modules/regions/koch.png',
    'default': 'https://cdn-icons-png.flaticon.com/512/535/535137.png' // Generic building icon
};

const CitySelectionModal = ({ show, onHide, onSelect }) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCities = async () => {
            if (!show) return;
            try {
                const { data } = await api.get('/api/cities');
                // Filter duplicates if any
                setCities(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch cities", error);
                setLoading(false);
            }
        };
        fetchCities();
    }, [show]);

    const handleCitySelect = (city) => {
        localStorage.setItem('userCity', JSON.stringify(city));
        if (onSelect) onSelect(city);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="city-selection-modal"
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Select Your City</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? <div className="p-4 text-center">Loading cities...</div> : (
                    <div className="popular-cities">
                        <div className="city-grid">
                            {cities.map(city => (
                                <div key={city._id} className="city-item" onClick={() => handleCitySelect(city)}>
                                    <img
                                        src={cityImages[city.name] || cityImages['default']}
                                        alt={city.name}
                                        className="city-icon"
                                    />
                                    <span className="city-name">{city.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default CitySelectionModal;
