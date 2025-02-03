"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

export default function SocketIoClient({ children }) {
  // const [nfcId, setNfcId] = useState("");

  // useEffect(() => {
  //   const socket = io("http://localhost:7777");

  //   socket.on("connect", () => {
  //     socket.emit("message", "ui-app is connected");
  //   });

  //   socket.on("message", (msg) => {
  //     console.log("message received ", msg);
  //   });

  //   socket.on("health_report", (msg) => {
  //     console.log("health_report report received ", msg);
  //   });

  //   socket.on("nfc_data", (nfc) => {
  //     console.log("nfc from python ", nfc);
  //     setNfcId(nfc);
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("nfc_data");
  //     socket.off("message");
  //     socket.disconnect();
  //   };

  //   //setSocket(socket)
  // }, []);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "socket/connect" });

    return () => {
      //dispatch({ type: "socket/disconnect" });
    };
  }, []);

  return <>{children}</>;
}
