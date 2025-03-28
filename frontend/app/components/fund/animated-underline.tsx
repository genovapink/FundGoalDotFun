import { motion } from "motion/react";
import type { JSX } from "react";

type AnimatedUnderlineProps = {
  selected?: boolean;
} & JSX.IntrinsicElements["p"];

export function AnimatedUnderline({ selected, children, onClick }: AnimatedUnderlineProps) {
  return (
    <motion.p
      className="relative cursor-pointer w-max"
      animate={selected ? "hover" : "hidden"}
      whileHover="hover"
      onClick={onClick}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-white origin-right"
        variants={{
          hidden: { width: 0 },
          hover: { width: "100%" },
        }}
        // animate={selected ? "hover" : "hidden"}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
    </motion.p>
  );
}
