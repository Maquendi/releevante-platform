"use client";

import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { io } from "socket.io-client";
import {
  onNewItemStatus,
  onNewTransactionStatus,
} from "./actions/book-transactions-actions";
import {
  TransactionItemStatusEnum,
  TransactionStatusEnum,
} from "./core/domain/loan.model";
import {
  BookTransactionItemState,
  setCurrentItem,
} from "./redux/features/bookExchangeSlice";
import { clearCart } from "./redux/features/cartSlice";
import { addUserId } from "./redux/features/contactLessLoginSlice";

let socketClientInitialized = false;

const SOCKET_URL = process.env.SOCKET_SERVER;

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
});

function susbcribeOnServerEvents(dispatch: Dispatch<AnyAction>) {
  if (socketClientInitialized) return;

  console.log("susbcribeOnServerEvents EXECUTING **************");
  socket.removeAllListeners();
  socket.on("user_wristband_scanned", (data) => {
    const { id } = data;
  });

  socket.on("item_checkout_started", (data: BookTransactionItemState) => {
    console.log("item_checkout_started here.....");
    const { id: itemId, isbn, cpy, transactionType } = data;

    dispatch(setCurrentItem(data));

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKOUT_STARTED,
    });
  });

  socket.on("item_checkout_success", (data: BookTransactionItemState) => {
    console.log("item_checkout_success here.....");
    const { id: itemId, isbn, cpy, transactionType } = data;

    dispatch(setCurrentItem(data));

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKOUT_SUCCESS,
    });
  });

  socket.on("checkout_success", (data) => {
    const { transactionId } = data;
    onNewTransactionStatus({
      transactionId: transactionId,
      status: TransactionStatusEnum.CURRENT,
    });
  });

  socket.on("card_detected", (payload) => {
    console.log(payload);
    dispatch(
      addUserId({
        user: {
          id: payload.data,
        },
      })
    );
  });

  socket.on("item_checkin_started", (data: BookTransactionItemState) => {
    console.log("item_checkin_started");
    const { id: itemId, isbn, cpy, transactionType } = data;
    dispatch(setCurrentItem(data));

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKIN_STARTED,
    });
  });

  socket.on("item_checkin_success", (data: BookTransactionItemState) => {
    console.log("item_checkin_success");

    const { id: itemId, isbn, cpy, transactionType } = data;

    dispatch(setCurrentItem(data));

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
    });
  });
  socket.on("health_report", (msg) => {
    console.log("health_report report received ", msg);
  });

  socketClientInitialized = true;
}

export enum SocketEventType {
  checkout = "checkout",
  checkin = "checkin",
}

function eventEmitter(event: SocketEventType, { payload }) {
  socket.emit(event, payload);
}

function arrayBufferToString(buffer, encoding = "utf-8") {
  let decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}

export function initWebSocketServer(dispatch: Dispatch<AnyAction>) {
  if (socket?.disconnected) {
    socketClientInitialized = false;
    susbcribeOnServerEvents(dispatch);
    socket.connect();
  }
}

export function useWebSocketServer(dispatch: Dispatch<AnyAction>) {
  initWebSocketServer(dispatch);
  return {
    eventEmitter,
  };
}
