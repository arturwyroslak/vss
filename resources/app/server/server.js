const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Importing cors for CORS configuration

// Enable CORS for all routes
app.use(cors());

const app = express();
const server = http.createServer(app);
// Initialize socket.io for real-time communication
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'out', 'vs', 'code', 'electron-sandbox', 'workbench', 'workbench.html'));
});

// Serve static files from the 'out' directory
app.use(express.static(path.join(__dirname, '..', 'out')));

app.use('/api', createProxyMiddleware({
  target: 'http://backend-service-url',
  changeOrigin: true,
}));

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  // Additional event handlers here
  socket.on('message', (message) => {
    console.log('Message received:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
