import { useEffect, useRef } from "react";
//import { signOut } from "next-auth/react"; // If using next-auth

const signOut = () => {
  console.log("signed out oh yess .....");
};

const useSessionTimeout = (timeout = 30000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    console.log("resetting timer ****************")
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log("Session expired due to inactivity.");
      signOut(); // Log out the user
    }, timeout);
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
    ];

    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimer(); // Start the timer on mount

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeout]);

  return null; // This hook doesn't render anything
};

export default useSessionTimeout;
