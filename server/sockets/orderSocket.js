const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join order-specific room for real-time updates
    socket.on('joinOrderRoom', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`📦 Socket ${socket.id} joined order-${orderId}`);
    });

    socket.on('leaveOrderRoom', (orderId) => {
      socket.leave(`order-${orderId}`);
    });

    // Admin joins admin room for dashboard updates
    socket.on('joinAdmin', () => {
      socket.join('admin');
      console.log(`👑 Admin joined dashboard: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
