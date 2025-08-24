import React, { useState } from 'react';
import './SeatSelector.css';

let seatCounter = 1;
const SEAT_MAP = [
    { category: "VIP", price: 400, rows: [{ id: 'L', seats: Array.from({ length: 14 }, () => ({ id: seatCounter++, status: 'available' })) }] },
    { category: "Premium", price: 230, rows: [
        { id: 'K', seats: Array.from({ length: 20 }, () => ({ id: seatCounter++, status: 'available' })) },
        { id: 'J', seats: Array.from({ length: 20 }, () => ({ id: seatCounter++, status: 'available' })) },
        { id: 'I', seats: Array.from({ length: 20 }, () => ({ id: seatCounter++, status: 'available' })) },
    ]},
    { category: "Executive", price: 210, rows: [
        { id: 'D', seats: Array.from({ length: 17 }, () => ({ id: seatCounter++, status: 'available' })) },
        { id: 'C', seats: Array.from({ length: 17 }, () => ({ id: seatCounter++, status: 'available' })) },
    ]}
];

const Seat = ({ id, displayNumber, status, onSelect }) => {
    const handleClick = () => {
        if (status !== 'booked') onSelect(id);
    };
    return <div className={`seat ${status}`} onClick={handleClick}>{displayNumber}</div>;
};

const SeatSelector = ({ onSeatsSelected }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatSelect = (seatId, price) => {
        const isSelected = selectedSeats.some(seat => seat.id === seatId);
        let newSelectedSeats;
        if (isSelected) {
            newSelectedSeats = selectedSeats.filter(seat => seat.id !== seatId);
        } else {
            newSelectedSeats = [...selectedSeats, { id: seatId, price }];
        }
        setSelectedSeats(newSelectedSeats);
        onSeatsSelected(newSelectedSeats.map(seat => ({ number: seat.id, price: seat.price })));
    };

    return (
        <div className="seat-selector-container">
            <div className="screen">SCREEN</div>
            <div className="seat-map">
                {SEAT_MAP.map(tier => (
                    <div key={tier.category} className="seat-tier">
                        <div className="tier-header"><span>{tier.category} - ₹{tier.price}</span></div>
                        {tier.rows.map(row => (
                            <div key={row.id} className="seat-row">
                                <div className="row-label">{row.id}</div>
                                <div className="seats">
                                    {row.seats.map((seat, index) => (
                                        <Seat 
                                            key={seat.id}
                                            id={seat.id}
                                            displayNumber={index + 1}
                                            status={selectedSeats.some(s => s.id === seat.id) ? 'selected' : seat.status}
                                            onSelect={() => handleSeatSelect(seat.id, tier.price)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="seat-legend">
                <div className="legend-item"><div className="seat available"></div><span>Available</span></div>
                <div className="legend-item"><div className="seat selected"></div><span>Selected</span></div>
                <div className="legend-item"><div className="seat booked"></div><span>Booked</span></div>
            </div>
        </div>
    );
};

export default SeatSelector;