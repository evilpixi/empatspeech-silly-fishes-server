import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import cors from 'cors';
import Fish from './IFish';
import { FishEvents } from './consts';

let gameScore: number = 0;
const fishes: Map<string, Fish> = new Map();
const movementArea = { xmin: 64, xmax: 1856, ymin: 64, ymax: 692 };

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
  // when a client connects, log it
  console.log('Client Connected:', socket.id);
  socket.on(FishEvents.USER_CONNECTED, (user) =>
    console.log('Client Data:', { id: socket.id, ...user })
  );

  // tells the client to initialize the game with the current fishes
  socket.emit(FishEvents.FISH_INITIALIZE, Array.from(fishes.values()));

  // when a client clicks a button to spawn a fish
  socket.on(FishEvents.SPAWN_FISH, (fishData: Fish) =>
  {
    console.log("A new fish has been asked to be spawned:", fishData);
    const newFish: Fish = { ...fishData, id: socket.id + Date.now(), targetX: 0, targetY: 0 };

    const movement = getNewRandomTargetPosition();
    newFish.targetX = movement.targetX;
    newFish.targetY = movement.targetY;
    fishes.set(newFish.id, newFish);


    io.emit(FishEvents.FISH_SPAWNED, newFish);
    setTimeout(() =>
    {
      if (!fishes.has(newFish.id)) return;

      updateNextFishMovement(newFish);
    }, 5300);
  });

  // when a fish is set to delete
  socket.on(FishEvents.FISH_MARKED_FOR_DELETE, (fishId: string) =>
  {
    const fishData = { ...fishes.get(fishId) };
    console.log("A fish has been marked for deletion:", { fishId, ...fishData });
    fishes.delete(fishId);

    io.emit(FishEvents.FISH_DELETED, fishId);
    updateScore(gameScore + 100);
  });

  // when asking to full reset the game
  socket.on(FishEvents.FULL_RESET, () =>
  {
    fishes.clear();
    io.emit(FishEvents.GAME_RESETED);
    updateScore(0);
    console.log("--- The game has been reset ---");
  });
});

function updateScore(newScore: number)
{
  gameScore = newScore;
  io.emit(FishEvents.SCORE_UPDATED, gameScore);
}

function getNewRandomTargetPosition()
{
  return {
    targetX: Math.floor(Math.random() * (movementArea.xmax - movementArea.xmin + 1) + movementArea.xmin),
    targetY: Math.floor(Math.random() * (movementArea.ymax - movementArea.ymin + 1) + movementArea.ymin)
  };
}

function updateNextFishMovement(fish: Fish)
{
  const movement = getNewRandomTargetPosition();

  io.emit(FishEvents.FISH_UPDATED, { id: fish.id, ...movement });
  setTimeout(() =>
  {
    if (!fishes.has(fish.id)) return;

    updateNextFishMovement(fish);
  }, 5000);
}

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