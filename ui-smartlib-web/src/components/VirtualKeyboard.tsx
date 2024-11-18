'use client'
import useOnClickOutside from "@/hooks/useOnClickOutside";
import React, { useState, useRef, useEffect } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type KeyboardRef = {
  setInput: (input: string) => void;
};

interface KeyboardProps {
  handleInputChangeFn: (input: string) => void;
  open: boolean;
  state:string
}

const VirtualKeyboard = ({ handleInputChangeFn, open,state }: KeyboardProps) => {
  const [layoutName, setLayoutName] = useState<string>("default");
  const keyboardRef = useRef<KeyboardRef | null>(null);
  const keyboardContainer = useRef(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOnClickOutside(keyboardContainer, () => setIsOpen(false));

  const onChange = (input: string) => {
    handleInputChangeFn(input);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === "default" ? "shift" : "default"
    );
  };

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  useEffect(()=>{
    keyboardRef.current?.setInput(state);
  },[state])

  return (
  
        <div
          ref={keyboardContainer}
          className={`fixed bottom-0 left-0 right-0 z-50 duration-300 ease-in-out ${isOpen ? ' translate-y-0':'translate-y-full'}`}
        >
          <Keyboard
            keyboardRef={(r) => (keyboardRef.current = r)}
            layoutName={layoutName}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
        </div>
      
  
  );
};

export default VirtualKeyboard;
