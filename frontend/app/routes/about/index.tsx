import { DynamicHeader } from "@fund/dynamic-header";
import { AnimatePresence, motion } from "motion/react";
import { useState, type JSX } from "react";
import { HowItWorks } from "./how-it-works";
import { HowTo } from "./how-to";
import { Introduction } from "./introduction";
import { AnimatedUnderline } from "@fund/animated-underline";
import { ScrambleText } from "@fund/scramble-text";

export function meta() {
  return [
    { title: "About - Gofunding" },
    { name: "description", content: "About - Gofunding" },
    { name: "image", content: "/logo.png" },
    { name: "og:image", content: "/logo.png" },
    { name: "twitter:image", content: "/logo.png" },
  ];
}

export default function About() {
  const LIST = ["Introduction", "How to", "How it works"];
  const [selected, setSelected] = useState("introduction");

  function handleSelected(selected: string) {
    setSelected(selected);
  }

  return (
    <>
      <DynamicHeader title="About" />
      <div className="mt-8 container max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-y-10 lg:gap-x-10">
          <p className="col-span-12 text-4xl sm:text-6xl lg:text-9xl my-12 lg:my-24 text-center">
            <ScrambleText title="About" />
          </p>
          <div className="col-span-12 lg:col-span-5 lg:col-start-2">
            <div className="flex justify-center lg:flex-col gap-4 items-center lg:items-start">
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
          <div className="col-span-12 lg:col-span-5">
            <AnimatePresence mode="popLayout">
              {selected === "introduction" && (
                <motion.div
                  layout
                  key={"introduction"}
                  className="text-lg sm:text-xl lg:text-2xl tracking-wide bg-background"
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
                  className="text-lg sm:text-xl lg:text-2xl tracking-wide bg-background"
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
                  className="text-lg sm:text-xl lg:text-2xl tracking-wide bg-background"
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
