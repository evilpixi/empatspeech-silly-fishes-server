import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import Fish from './IFish';
import { FishEvents } from './consts';

const gameScore: number = 0;
const fishes: Fish[] = [];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.use(cors());



// --------------------------------------------------
// ------------------- Socket.io --------------------
// --------------------------------------------------
io.on('connect', (socket: Socket) =>
{
  console.log('Client Connected:', socket.id);
  socket.on(FishEvents.USER_CONNECTED, (user) =>
    console.log('Client Data:', user)
  );

  socket.emit(FishEvents.FISH_INITIALIZE, fishes);

  socket.on(FishEvents.SPAWN_FISH, (fishData: Fish) =>
  {
    console.log("A new fish has been asked to be spawned:", fishData);
    const newFish: Fish = { ...fishData, id: socket.id + Date.now() };
    fishes.push(newFish);

    io.emit(FishEvents.FISH_SPAWNED, newFish);
  });
});


// --------------------------------------------------
// --------------- Routes and Server ----------------
// --------------------------------------------------
app.get('/', (req, res) =>
{
  res.send('Socket.IO Server is running');
});

server.listen(3000, () =>
{
  console.log('Servidor Socket.IO en http://localhost:3000');
});