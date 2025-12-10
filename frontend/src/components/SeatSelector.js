import React, { useState, useEffect } from 'react';
import './SeatSelector.css';

let seatCounter = 1;

const SEAT_MAP_TEMPLATE = [
    { category: "Recliner", price: 420, rows: [{ id: 'A', count: 14 }] },
    {
        category: "Prime", price: 290, rows: [
            { id: 'B', count: 20 },
            { id: 'C', count: 20 },
            { id: 'D', count: 20 },
        ]
    },
    {
        category: "Classic", price: 200, rows: [
            { id: 'E', count: 17 },
            { id: 'F', count: 17 },
            { id: 'G', count: 17 },
        ]
    }
];

const Seat = ({ id, displayNumber, status, onSelect }) => {
    const handleClick = () => {
        if (status !== 'booked' && status !== 'locked') onSelect(id);
    };
    return <div className={`seat ${status}`} onClick={handleClick}>{displayNumber}</div>;
};

const SeatSelector = ({ onSeatsSelected, maxSeats, lockedSeats = [], socket, roomDetails }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatMap, setSeatMap] = useState([]);

    useEffect(() => {
        // Initialize seat map
        const map = SEAT_MAP_TEMPLATE.map(tier => ({
            ...tier,
            rows: tier.rows.map(row => ({
                ...row,
                seats: Array.from({ length: row.count }, (_, i) => ({
                    id: `${row.id}${i + 1}`,
                    displayNumber: i + 1,
                    status: 'available', // initial state
                    price: tier.price
                }))
            }))
        }));
        setSeatMap(map);
    }, []);

    const handleSeatSelect = (seatId, price) => {
        const isSelected = selectedSeats.some(seat => seat.id === seatId);
        let newSelectedSeats;

        if (isSelected) {
            // Deselect: Unlock it
            newSelectedSeats = selectedSeats.filter(seat => seat.id !== seatId);
            socket?.emit('release_seat_lock', { ...roomDetails, seatId });
        } else {
            // Select: Try to Lock it
            if (lockedSeats.includes(seatId)) return; // Prevent selecting locked

            if (maxSeats && selectedSeats.length >= maxSeats) {
                // Shift logic: Release the first one, lock the new one
                const [first, ...rest] = selectedSeats;
                socket?.emit('release_seat_lock', { ...roomDetails, seatId: first.id });

                newSelectedSeats = [...rest, { id: seatId, price }];
                socket?.emit('request_seat_lock', { ...roomDetails, seatId });
            } else {
                newSelectedSeats = [...selectedSeats, { id: seatId, price }];
                socket?.emit('request_seat_lock', { ...roomDetails, seatId });
            }
        }

        setSelectedSeats(newSelectedSeats);
        onSeatsSelected(newSelectedSeats.map(seat => ({ number: seat.id, price: seat.price })));
    };

    return (
        <div className="seat-selector-container">
            <div className="screen">SCREEN THIS WAY</div>
            <div className="seat-map">
                {seatMap.map(tier => (
                    <div key={tier.category} className="seat-tier">
                        <div className="tier-header"><span>{tier.category} - ₹{tier.price}</span></div>
                        {tier.rows.map(row => (
                            <div key={row.id} className="seat-row">
                                <div className="row-label">{row.id}</div>
                                <div className="seats">
                                    {row.seats.map((seat) => {
                                        let status = seat.status;
                                        if (lockedSeats.includes(seat.id)) status = 'locked';
                                        if (selectedSeats.some(s => s.id === seat.id)) status = 'selected';

                                        return (
                                            <Seat
                                                key={seat.id}
                                                id={seat.id}
                                                displayNumber={seat.displayNumber}
                                                status={status}
                                                onSelect={() => handleSeatSelect(seat.id, seat.price)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="seat-legend">
                <div className="legend-item"><div className="seat available"></div><span>Available</span></div>
                <div className="legend-item"><div className="seat selected"></div><span>Selected</span></div>
                <div className="legend-item"><div className="seat locked"></div><span>Unavailable</span></div>
            </div>
        </div>
    );
};

export default SeatSelector;