import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './SeatQuantityModal.css';

const SeatQuantityModal = ({ show, onHide, onConfirm }) => {
    const [quantity, setQuantity] = useState(2); // Default to 2

    // Vehicle graphics based on quantity (Simulated with Emojis for now)
    const getVehicle = (qty) => {
        if (qty === 1) return "🚲"; // Cycle
        if (qty === 2) return "🛵"; // Scooter
        if (qty === 3) return "🛺"; // Auto
        if (qty === 4) return "🚗"; // Car
        return "🚌"; // Bus for more
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="seat-quantity-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>How many seats?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="vehicle-graphic">
                    {getVehicle(quantity)}
                </div>

                <div className="quantity-selector">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <button
                            key={num}
                            className={`quantity-btn ${quantity === num ? 'selected' : ''}`}
                            onClick={() => setQuantity(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <div className="category-pricing">
                    <div className="category-item">
                        <span>RECLINER</span>
                        <span className="category-price">₹420</span>
                        <span className="category-status">AVAILABLE</span>
                    </div>
                    <div className="category-item">
                        <span>PRIME</span>
                        <span className="category-price">₹290</span>
                        <span className="category-status">AVAILABLE</span>
                    </div>
                    <div className="category-item">
                        <span>CLASSIC</span>
                        <span className="category-price">₹200</span>
                        <span className="category-status">AVAILABLE</span>
                    </div>
                </div>

                <Button className="select-seats-btn" onClick={() => onConfirm(quantity)}>
                    Select Seats
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default SeatQuantityModal;
