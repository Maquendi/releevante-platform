"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function SocketIoClient({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "socket/connect" });
  }, []);
  return <>{children}</>;
}
