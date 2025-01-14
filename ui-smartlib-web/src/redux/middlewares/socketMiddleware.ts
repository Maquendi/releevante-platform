// src/middleware/socketMiddleware.js
import { io, Socket } from "socket.io-client";
import { setCurrentCopy } from "../features/checkoutSlice";
import { updateCurrentReturnBookStatus } from "../features/returnbookSlice";
import {
  onNewItemStatus,
  onNewTransactionStatus,
} from "@/actions/returnbook-actions";

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
          socket.on("item_checkout_success", (data) => {
            const { itemId, isbn } = data;

            store.dispatch(
              setCurrentCopy({
                isbn,
                status: "checkout_successful",
              })
            );

            onNewItemStatus({
              itemId,
              status: "CHECKOUT_SUCCESS",
            });
          });

          socket.on("item_checkout_started", (data) => {
            const { itemId, isbn } = data;

            store.dispatch(
              setCurrentCopy({
                isbn,
                status: 'checkout_started',
              })
            );

            onNewItemStatus({
              itemId,
              status: "CHECKOUT_STARTED",
            });
          });

          socket.on("checkout_success", (data) => {
            const { transactionId } = data;
            onNewTransactionStatus({
              loanId: transactionId,
              status: "CURRENT",
            });
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

          (async () => {
            store.dispatch(
              updateCurrentReturnBookStatus({
                status: "return_started",
              })
            );

            await new Promise((resolve) => setTimeout(resolve, 5000));

            store.dispatch(
              updateCurrentReturnBookStatus({
                status: "return_successful",
              })
            );
          })();
        }
        break;

      case "socket/checkout":
        if (socket) {
          const data = action.payload;
          socket.emit("checkout", data);
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
