const socketHandler = (io) => {
    // In-memory store for locks: { "showtimeRoomId": { "seatId": { socketId, expiresAt } } }
    const locks = {};

    // Helper to get room ID
    const getRoomId = (movie, theater, date, time) => `${movie}_${theater}_${date}_${time}`;

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join a showtime room
        socket.on('join_showtime', ({ movieId, theaterId, date, time }) => {
            const roomId = getRoomId(movieId, theaterId, date, time);
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);

            // Send existing locks to the new user
            if (locks[roomId]) {
                const activeLocks = Object.keys(locks[roomId]);
                socket.emit('initial_locks', activeLocks);
            }
        });

        // Request a lock on a seat
        socket.on('request_seat_lock', ({ movieId, theaterId, date, time, seatId }) => {
            const roomId = getRoomId(movieId, theaterId, date, time);

            if (!locks[roomId]) locks[roomId] = {};

            // Check if already locked
            if (locks[roomId][seatId]) {
                // If locked by self, ignore (or re-confirm)
                if (locks[roomId][seatId].socketId === socket.id) return;

                // If locked by someone else, notify failure (though UI should prevent this)
                socket.emit('lock_failed', { seatId, message: 'Seat already locked' });
                return;
            }

            // Lock the seat
            locks[roomId][seatId] = {
                socketId: socket.id,
                expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
            };

            // Broadcast to others in the room
            socket.to(roomId).emit('seat_locked_update', { seatId });
            console.log(`Seat ${seatId} locked by ${socket.id} in ${roomId}`);
        });

        // Release a lock
        socket.on('release_seat_lock', ({ movieId, theaterId, date, time, seatId }) => {
            const roomId = getRoomId(movieId, theaterId, date, time);

            if (locks[roomId] && locks[roomId][seatId] && locks[roomId][seatId].socketId === socket.id) {
                delete locks[roomId][seatId];
                socket.to(roomId).emit('seat_released_update', { seatId });
                console.log(`Seat ${seatId} released by ${socket.id} in ${roomId}`);
            }
        });

        // Handle disconnect: Remove all locks held by this user
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Iterate all rooms and remove locks owned by this socket
            for (const roomId in locks) {
                const roomLocks = locks[roomId];
                for (const seatId in roomLocks) {
                    if (roomLocks[seatId].socketId === socket.id) {
                        delete roomLocks[seatId];
                        // Notify users in that room
                        io.to(roomId).emit('seat_released_update', { seatId });
                    }
                }
                // Cleanup empty room objects
                if (Object.keys(roomLocks).length === 0) {
                    delete locks[roomId];
                }
            }
        });
    });
};

module.exports = socketHandler;
