"use client";

import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { io, Socket } from "socket.io-client";
import {
  onNewItemStatus,
  onNewTransactionStatus,
} from "./actions/book-transactions-actions";
import {
  TransactionItemStatusEnum,
  TransactionStatusEnum,
  BookTransactions,
} from "./core/domain/loan.model";
import { setCurrentCopy } from "./redux/features/checkoutSlice";
import { updateCurrentBookStatus } from "./redux/features/returnbookSlice";

let socketClientInitialized = false;

const SOCKET_URL = "http://localhost:7777";

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
});

function susbcribeOnServerEvents(dispatch: Dispatch<AnyAction>) {
  if (socketClientInitialized) return;

  console.log("caling .... susbcribeOnServerEvents");

  socket.on("item_checkout_success", (data) => {
    const { itemId, isbn, cpy, transactionType } = data;

    dispatch(
      setCurrentCopy({
        isbn,
        status: TransactionItemStatusEnum.CHECKOUT_SUCCESS,
      })
    );

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKOUT_SUCCESS,
    });
  });

  socket.on("user_wristband_scanned", (data) => {
    const { id } = data;

    console.log("user wristband scanned with id: " + id);
  });

  socket.on("item_checkout_started", (data) => {
    const { itemId, isbn, cpy, transactionType } = data;

    dispatch(
      setCurrentCopy({
        isbn,
        status: TransactionItemStatusEnum.CHECKOUT_STARTED,
      })
    );

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKOUT_STARTED,
    });
  });

  socket.on("item_checkin_started", (data) => {
    console.log("item_checkin_started");
    const { itemId, isbn, cpy, transactionType } = data;
    dispatch(
      updateCurrentBookStatus({
        status: TransactionItemStatusEnum.CHECKIN_STARTED,
      })
    );

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKIN_STARTED,
    });
  });

  socket.on("item_checkin_success", (data) => {
    console.log("item_checkin_success");
    const { itemId, isbn, cpy, transactionType } = data;
    dispatch(
      updateCurrentBookStatus({
        status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
      })
    );

    onNewItemStatus({
      itemId,
      isbn,
      cpy,
      transactionType,
      status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
    });
  });

  socket.on("checkout_success", (data) => {
    const { transactionId } = data;
    onNewTransactionStatus({
      transactionId: transactionId,
      status: TransactionStatusEnum.CURRENT,
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

export function useWebSocketServer() {
  if (socket?.disconnected) {
    socket.connect();
  }

  return {
    susbcribeOnServerEvents,
    eventEmitter,
  };
}
