import { motion } from "motion/react";
import React, { use, useEffect, useRef, useState, type JSX } from "react";
import { cn } from "~/utils/cn";

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";

type ScrambleTextProps = {
  title: string;
} & JSX.IntrinsicElements["span"];

export function ScrambleText({ title, className }: ScrambleTextProps) {
  const [text, setText] = useState(title);

  useEffect(() => {
    let pos = 0;
    const intervalRef = setInterval(() => {
      const scrambled = title
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= title.length * CYCLES_PER_LETTER) {
        clearInterval(intervalRef);
        setText(title);
      }
    }, SHUFFLE_TIME);

    return () => clearInterval(intervalRef);
  }, [title]);

  return <span className={cn("", className)}>{text}</span>;
}

// export default ScrambleText;
