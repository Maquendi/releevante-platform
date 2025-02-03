"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type KeyboardRef = {
  setInput: (input: string) => void;
};

interface KeyboardProps {
  setInputText:  Dispatch<SetStateAction<string>>;
  open: boolean;
  state: string;
  isNumeric?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const VirtualKeyboard = ({
  setInputText,
  open,
  state,
  isNumeric = false,
  setOpen,
}: KeyboardProps) => {
  const [layoutName, setLayoutName] = useState<string>("default");
  const keyboardRef = useRef<KeyboardRef | null>(null);
  const keyboardContainerRef = useRef<HTMLInputElement | null>(null);
  useOnClickOutside(keyboardContainerRef, () => setOpen(false));

  const onChange = (input: string) => {
    console.log('on change keyboard',input)
    setInputText(input);
  };

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
    if (button === "{down}") setOpen(false);
  };

  const handleShift = () => {
    setLayoutName((prevLayout) =>
      prevLayout === "default" ? "shift" : "default"
    );
  };

  useEffect(() => {
    keyboardRef.current?.setInput(state);
  }, [state]);

  const numericLayout = {
    default: ["1 2 3", "4 5 6", "7 8 9", "{down} 0 {backspace}"],
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      ref={keyboardContainerRef}
      className={`fixed bottom-0 left-0 right-0 z-50 duration-300 ease-in-out px-10 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={onKeyPress}
        layout={isNumeric ? numericLayout : undefined}
        display={{
          "{down}": "▼",
          "{backspace}": "⌫",
        }}
        theme="hg-theme-default hg-layout-numeric numeric-theme"
      />
    </div>
  );
};

export default VirtualKeyboard;
