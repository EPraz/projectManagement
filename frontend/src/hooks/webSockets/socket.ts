import { io } from "socket.io-client";

const socket = io(process.env.VITE_API_URL || "http://localhost:3000");
export default socket;
