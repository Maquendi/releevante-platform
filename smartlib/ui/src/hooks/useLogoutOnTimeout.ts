import { useEffect, useRef } from "react";
import useAuth from "./useAuth";

const useLogoutOnTimeout = (timeout = 30000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { logoutMutation } = useAuth();

  timeoutRef.current = setTimeout(() => {
    logoutMutation.mutateAsync();
  }, timeout);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [timeout]);

  return null;
};

export default useLogoutOnTimeout;
