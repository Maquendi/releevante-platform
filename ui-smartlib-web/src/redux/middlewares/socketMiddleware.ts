// src/middleware/socketMiddleware.js
import { io, Socket } from "socket.io-client";
import { updateItemStatus } from "../features/checkoutSlice";

const SOCKET_URL = "http://localhost:7777";

const socketMiddleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    switch (action.type) {
      case "socket/connect":
        if (!socket) {
          socket = io(SOCKET_URL);

          socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            store.dispatch({ type: "socket/connected", payload: socket.id });
          });

          socket.on("disconnect", (reason) => {
            console.warn("Socket disconnected:", reason);
            store.dispatch({ type: "socket/disconnected", payload: reason });
          });

          // Example: Listen for server events
          socket.on("server-event", (data) => {
            store.dispatch({ type: "socket/serverEvent", payload: data });
          });

          // Example: Listen for server events
          socket.on("checkout_status", (data) => {
            store.dispatch(
              updateItemStatus({
                itemStatus: data,
              })
            );
          });

          socket.on("health_report", (msg) => {
            console.log("health_report report received ", msg);
          });
        }
        break;

      case "socket/disconnect":
        if (socket) {
          socket.disconnect();
          //socket = undefined;
          console.log("Socket disconnected manually");
        }
        break;

      case "socket/emit":
        if (socket) {
          const copies = action.payload
          setTimeout(()=> {
            const selected = copies[0];
            store.dispatch(
              updateItemStatus({
                itemStatus: {
                  cpy: 
                },
              })
            );
          }, 15000)
          //socket.emit(action.event, action.payload);
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
