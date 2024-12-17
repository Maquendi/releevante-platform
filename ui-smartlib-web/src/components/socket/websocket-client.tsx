"use client";

import { useEffect } from "react";

export function WebSocketConnection() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = function (event) {
      console.log("connected to server message" + event);
      socket.send("message: i am connected");
    };

    socket.onmessage = function (event) {
      console.log("received message" + event);
    };

    socket.onclose = function (event) {
      // Handle connection close
    };
    return () => {
      socket.close();
    };
  }, []);

  return <></>;
}
