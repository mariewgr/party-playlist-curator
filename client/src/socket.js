import { io } from 'socket.io-client';

const serverUrl = `http://${window.location.hostname}:3001`;
const socket = io(serverUrl);

export default socket;
