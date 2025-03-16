import { motion } from "motion/react";
import { useState } from "react";

interface ButtonMagnetProps {
  label: string;
  href?: string;
}

export function ButtonMagnet({ label, href = "#" }: ButtonMagnetProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(0);

  const getXY = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    return { x, y };
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { x, y } = getXY(e);
    setPosition({ x, y });
    setScale(1);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { x, y } = getXY(e);
    setPosition({
      x: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      y: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
    });
    setScale(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { x, y } = getXY(e);
    setPosition({ x, y });
  };

  return (
    <motion.a
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative inline-flex items-center justify-center gap-[0.363636em] overflow-hidden rounded-[6.25rem] border border-[#fffce1] bg-transparent px-6 py-[0.9375rem] text-[1.2rem] font-semibold text-[#fffce1] no-underline transition-colors hover:text-[#0e100f]"
      data-block="button"
    >
      <motion.span
        className="absolute inset-0 origin-top-left will-change-transform"
        initial={{ x: 0, y: 0, scale: 0 }}
        animate={{ x: position.x, y: position.y, scale }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <span className="absolute left-0 top-0 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fffce1] pointer-events-none"></span>
      </motion.span>
      <span className="relative text-center transition-colors duration-50 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:duration-150">
        {label}
      </span>
    </motion.a>
  );
}

// export default AnimatedButton;
