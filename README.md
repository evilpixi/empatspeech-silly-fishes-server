# EmpatSpeech Silly Fishes Server

The server for a game about life under the sea.

if you are looking for the Client look at [this repo](https://github.com/evilpixi/empatspeech-silly-fishes)

deploy: [https://empatspeech-silly-fishes-server.onrender.com/](https://empatspeech-silly-fishes-server.onrender.com/)

## Requirements

- [Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Usage

1. Install dependencies:
    ```sh
    npm install
    ```

2. Start the server:
    ```sh
    npm run start
    ```

The server will run on [http://localhost:3000](http://localhost:3000).

## Available Commands

| Command       | Description                               |
|---------------|-------------------------------------------|
| `npm install` | Install project dependencies              |
| `npm run dev` | Launch a development server with hot reload |
| `npm run build` | Build the project for production         |
| `npm run start` | Start the production server              |

## Project Structure

- [src](http://_vscodecontentref_/0) - Contains the server source code.
  - [index.ts](http://_vscodecontentref_/1) - The main entry point. This contains the server configuration and starts the server.
  - [consts.ts](http://_vscodecontentref_/2) - Contains the constants used in the server.
  - [IFish.ts](http://_vscodecontentref_/3) - Defines the Fish interface.

## Server Endpoints

- `GET /` - Returns a message indicating that the Socket.IO server is running.

## Socket.IO Events

- `connect` - Triggered when a client connects.
- [FishEvents.USER_CONNECTED](http://_vscodecontentref_/4) - Logs client data when a user connects.
- [FishEvents.FISH_INITIALIZE](http://_vscodecontentref_/5) - Initializes the game with the current fishes.
- [FishEvents.SPAWN_FISH](http://_vscodecontentref_/6) - Spawns a new fish.
- [FishEvents.FISH_MARKED_FOR_DELETE](http://_vscodecontentref_/7) - Marks a fish for deletion.
- [FishEvents.FULL_RESET](http://_vscodecontentref_/8) - Resets the game.

## Deploying to Production

After you run the `npm run build` command, your code will be built into the `dist` folder. To deploy your server, upload the contents of the `dist` folder to your server and start the server using `npm run start`.

Created by Evilpixi.