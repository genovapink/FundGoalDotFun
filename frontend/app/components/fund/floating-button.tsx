import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function FloatingActionButton() {
  const [active, setActive] = useState(false);

  const images = ["/cake.svg", "/cake.svg", "/cake.svg", "/cake.svg"];

  return (
    // <main className="relative flex min-h-screen w-full items-start justify-center bg-white px-4 py-10 md:items-center">
    <div className="relative flex w-max items-start justify-start sm:justify-center bg-red-200">
      <div className="relative flex items-center justify-center gap-4">
        <motion.div
          className="absolute left-0 z-10 w-full rounded-[40px] bg-background"
          animate={{
            x: active ? "calc(100% + 20px)" : 0,
          }}
          transition={{ type: "ease-in", duration: 0.5 }}
        >
          <motion.button
            className="flex size-12 items-center justify-center rounded-full bg-zinc-400 sm:size-20"
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 45 : 0 }}
            transition={{
              type: "ease-in",
              duration: 0.5,
            }}
          >
            <Plus size={40} strokeWidth={3} className="text-white" />
          </motion.button>
        </motion.div>
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Image ${index + 1}`}
            className="size-10 rounded-full sm:size-16"
            animate={{
              filter: active ? "blur(0px) invert(100%)" : "blur(2px) invert(100%)",
              scale: active ? 1 : 0.9,
              rotate: active ? 0 : 45,
            }}
            transition={{
              type: "ease-in",
              duration: 0.4,
            }}
          />
        ))}
      </div>
    </div>
    // </main>
  );
}
