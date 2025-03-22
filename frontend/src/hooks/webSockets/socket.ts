import { io } from "socket.io-client";

const socket = io(process.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});
export default socket;
