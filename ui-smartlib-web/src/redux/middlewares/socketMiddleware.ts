// src/middleware/socketMiddleware.js
import { io, Socket } from "socket.io-client";
import { updateItemStatus } from "../features/checkoutSlice";
import { clearInterval } from "timers";

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
          const copies = action.payload;

          const statuses = [
            "checkout_started",
            "door_opening",
            "opened_waiting",
            "checkout_successful",
          ];

          let index = 0;
          let stidx = 0;

          const interval = setInterval(() => {
            try {
              let item: any = null;
              try {
                item = copies[index];
              } catch (error) {
                clearInterval(interval);
              }

              const status = statuses[stidx];
              const itemStatus = {
                cpy: item.cpy,
                isbn: item.isbn,
                status,
              } as any;
              store.dispatch(
                updateItemStatus({
                  itemStatus,
                })
              );
              stidx++;
            } catch (error) {
              index++;
              stidx = 0;
            }
          }, 10000);
          socket.emit(action.event, copies);
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
