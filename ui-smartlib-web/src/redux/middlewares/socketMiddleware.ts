// src/middleware/socketMiddleware.js
import { io, Socket } from "socket.io-client";
import { CurrentBook, setCurrentCopy } from "../features/checkoutSlice";
import { clearInterval } from "timers";
import { setCurrentReturnBook, updateCurrentReturnBookStatus } from "../features/returnbookSlice";

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
            // store.dispatch(
            //   updateItemStatus({
            //     itemStatus: data,
            //   })
            // );
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

      case "socket/returnbook":
        if (socket) {
       
          const returnBook = action.payload;
          
          (async()=>{
            store.dispatch(
              updateCurrentReturnBookStatus({
                status: 'return_started'
              })
            );
  
            await new Promise((resolve) => setTimeout(resolve, 5000));
  
            store.dispatch(
              updateCurrentReturnBookStatus({
                status: 'return_successful',
              })
            );
          })()
        
        }
        break;

        case "socket/checkout":
          if (socket) {
         
            const copies = action.payload;

            (async () => {
              for (const copy of copies) {
                const { isbn } = copy;
  
                store.dispatch(
                  setCurrentCopy({
                    isbn,
                    status: "checkout_started",
                  })
                );
  
                await new Promise((resolve) => setTimeout(resolve, 5000));
  
                store.dispatch(
                  setCurrentCopy({
                    isbn,
                    status: "checkout_successful",
                  })
                );
              }
            })();
          }
          break;
        
      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
