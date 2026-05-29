require('dotenv').config({ path: '../.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');
const spotify = require('./spotify');

const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const queueRouter = require('./routes/queue');

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
});

// Inject io into queue router
queueRouter.setIO(io);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/queue', queueRouter);

app.get('/api/now-playing', async (req, res) => {
  try {
    const track = await spotify.getCurrentTrack();
    if (!track) return res.json(null);
    res.json(track);
  } catch {
    res.json(null);
  }
});

app.get('/api/host-url', (req, res) => {
  // Get local network IP
  const interfaces = os.networkInterfaces();
  let localIp = 'localhost';
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        localIp = alias.address;
        break;
      }
    }
    if (localIp !== 'localhost') break;
  }
  res.json({ url: `http://${localIp}:5173/guest` });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
