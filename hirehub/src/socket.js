import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 3,
    transports: ['websocket']
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
  console.log(err.description);
  console.log(err.context);
});

export default socket;
