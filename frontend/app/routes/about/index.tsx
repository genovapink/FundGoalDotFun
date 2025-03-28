import { DynamicHeader } from "@fund/dynamic-header";
import { AnimatePresence, motion } from "motion/react";
import { useState, type JSX } from "react";
import { HowItWorks } from "./how-it-works";
import { HowTo } from "./how-to";
import { Introduction } from "./introduction";
import { AnimatedUnderline } from "@fund/animated-underline";
import { ScrambleText } from "@fund/scramble-text";

export default function About() {
  const LIST = ["Introduction", "How to", "How it works"];

  const [selected, setSelected] = useState("introduction");

  function handleSelected(selected: string) {
    setSelected(selected);
  }

  return (
    <>
      <DynamicHeader title="About" />
      <div className="mt-8 container">
        <div className="grid grid-cols-12 gap-y-10">
          <p className="col-span-12 text-9xl my-24">
            <ScrambleText title="About" />
          </p>
          <div className="col-span-5 col-start-2">
            <div className="flex flex-col gap-4">
              {LIST.map((item, idx) => (
                <AnimatedUnderline
                  key={idx}
                  selected={selected === item.toLowerCase().split(" ").join("-")}
                  onClick={() => handleSelected(item.toLowerCase().split(" ").join("-"))}
                >
                  {item}
                </AnimatedUnderline>
              ))}
            </div>
          </div>
          <div className="col-span-5">
            <AnimatePresence mode="popLayout">
              {selected === "introduction" && (
                <motion.div
                  layout
                  key={"introduction"}
                  className="text-2xl tracking-wide bg-background"
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Introduction />
                </motion.div>
              )}
              {selected === "how-to" && (
                <motion.div
                  layout
                  key={"how-to"}
                  className="text-2xl tracking-wide bg-background"
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <HowTo />
                </motion.div>
              )}
              {selected === "how-it-works" && (
                <motion.div
                  layout
                  key={"how-it-works"}
                  className="text-2xl tracking-wide bg-background"
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <HowItWorks />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
