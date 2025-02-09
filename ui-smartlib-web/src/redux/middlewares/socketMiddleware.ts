// src/middleware/socketMiddleware.js
import { io, Socket } from "socket.io-client";
import { setCurrentCopy } from "../features/checkoutSlice";
import { updateCurrentBookStatus } from "../features/returnbookSlice";
import {
  onNewItemStatus,
  onNewTransactionStatus,
} from "@/actions/book-transactions-actions";
import {
  TransactionItemStatusEnum,
  TransactionStatusEnum,
} from "@/core/domain/loan.model";

const SOCKET_URL = "http://localhost:7777";

/**
 *
 * @param socket
 * @param store
 */

function susbcribeOnServerEvents(socket: Socket, store: any) {
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    store.dispatch({ type: "socket/connected", payload: socket.id });
  });

  socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
    store.dispatch({ type: "socket/disconnected", payload: reason });
  });

  /**
   * Business events
   */

  socket.on("item_checkout_success", (data) => {
    const { id, isbn } = data;

    store.dispatch(
      setCurrentCopy({
        isbn,
        status: TransactionItemStatusEnum.CHECKOUT_SUCCESS,
      })
    );

    onNewItemStatus({
      itemId: id,
      status: TransactionItemStatusEnum.CHECKOUT_SUCCESS,
    });
  });

  socket.on("user_wristband_scanned", (data) => {
    const { id } = data;

    console.log("user wristband scanned with id: " + id);
  });

  socket.on("item_checkout_started", (data) => {
    const { id, isbn } = data;

    store.dispatch(
      setCurrentCopy({
        isbn,
        status: TransactionItemStatusEnum.CHECKOUT_STARTED,
      })
    );

    onNewItemStatus({
      itemId: id,
      status: TransactionItemStatusEnum.CHECKOUT_STARTED,
    });
  });

  socket.on("item_checkin_started", (data) => {
    console.log("item_checkin_started");
    const { id } = data;
    store.dispatch(
      updateCurrentBookStatus({
        status: TransactionItemStatusEnum.CHECKIN_STARTED,
      })
    );

    onNewItemStatus({
      itemId: id,
      status: TransactionItemStatusEnum.CHECKIN_STARTED,
    });
  });

  socket.on("item_checkin_success", (data) => {
    console.log("item_checkin_success");
    const { id } = data;
    store.dispatch(
      updateCurrentBookStatus({
        status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
      })
    );

    onNewItemStatus({
      itemId: id,
      status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
    });
  });

  socket.on("checkout_success", (data) => {
    const { transactionId } = data;
    onNewTransactionStatus({
      loanId: transactionId,
      status: TransactionStatusEnum.CURRENT,
    });
  });

  socket.on("health_report", (msg) => {
    console.log("health_report report received ", msg);
  });
}

function onCheckin({ payload }, socket: Socket) {
  //const data: CheckinItem = payload;
  socket?.emit("checkin", payload);
}

function onCheckout({ payload }, socket: Socket) {
  socket?.emit("checkout", payload);
}

/**
 *
 * @param store
 * @returns
 */
const socketMiddleware = (store) => {
  let socket: Socket;
  return (next) => (action) => {
    switch (action.type) {
      case "socket/connect":
        if (!socket) {
          socket = io(SOCKET_URL);
          susbcribeOnServerEvents(socket, store);
        }
        break;

      case "socket/checkin":
        onCheckin(action, socket);
        break;

      case "socket/checkout":
        onCheckout(action, socket);
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
