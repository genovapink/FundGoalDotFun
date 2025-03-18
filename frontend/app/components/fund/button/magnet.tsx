import { useEffect, useRef, type JSX } from "react";
import gsap from "gsap";
import { cn } from "~/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("", {
  variants: {
    color: {
      foreground: "border-foreground text-foreground",
    },
    size: {
      default: "px-4 py-2 text-lg",
      lg: "px-6 py-4 text-xl",
      sm: "px-4 py-2",
    },
  },
  defaultVariants: {
    color: "foreground",
    size: "default",
  },
});

const bgFlairVarians = cva("", {
  variants: {
    background: {
      foreground: "bg-foreground",
    },
  },
  defaultVariants: {
    background: "foreground",
  },
});

export const ButtonMagnetVariantsVal = ["orange", "yellow", "pink", "blue", "green"];
export type ButtonMagnetVariants = VariantProps<typeof buttonVariants>;

type ButtonMagnetProps = {} & ButtonMagnetVariants & JSX.IntrinsicElements["button"];

export function ButtonMagnet({ children, color, size, ...props }: ButtonMagnetProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const flairRef = useRef<HTMLSpanElement | null>(null);

  function getXY(e: MouseEvent) {
    if (!buttonRef.current) return;

    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();

    const xTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, width, 0, 100),
      gsap.utils.clamp(0, 100)
    );
    const yTransformer = gsap.utils.pipe(
      gsap.utils.mapRange(0, height, 0, 100),
      gsap.utils.clamp(0, 100)
    );

    return {
      x: xTransformer(e.clientX - left),
      y: yTransformer(e.clientY - top),
    };
  }

  function handleMouseEnter(e: MouseEvent) {
    const flair = flairRef.current;
    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    const XY = getXY(e);
    const x = XY?.x ?? 0;
    const y = XY?.y ?? 0;

    xSet(x);
    ySet(y);
    gsap.to(flair, { scale: 1, duration: 0.4, ease: "power2.out" });
  }

  const handleMouseLeave = (e: MouseEvent) => {
    const XY = getXY(e);
    const x = XY?.x ?? 0;
    const y = XY?.y ?? 0;

    const flair = flairRef.current;

    gsap.killTweensOf(flair);
    gsap.to(flair, {
      xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
      scale: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const XY = getXY(e);
    const x = XY?.x ?? 0;
    const y = XY?.y ?? 0;

    gsap.to(flairRef.current, { xPercent: x, yPercent: y, duration: 0.4, ease: "power2" });
  };

  useEffect(() => {
    if (!buttonRef.current || !flairRef.current) return;

    const flair = flairRef.current;
    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");

    buttonRef.current.addEventListener("mouseenter", handleMouseEnter);
    buttonRef.current.addEventListener("mouseleave", handleMouseLeave);
    buttonRef.current.addEventListener("mousemove", handleMouseMove);

    return () => {
      buttonRef.current?.removeEventListener("mouseenter", handleMouseEnter);
      buttonRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      buttonRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={cn(
        buttonVariants({ color, size }),
        "relative inline-flex items-center justify-center overflow-hidden transition-colors cursor-pointer whitespace-nowrap",
        "border bg-transparent rounded-full font-semibold h-max",
        "hover:text-background"
      )}
      {...props}
    >
      <span
        ref={flairRef}
        className="absolute inset-0 scale-0 transform origin-top-left will-change-transform"
      >
        <span
          className={cn(
            "absolute left-0 top-0 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none",
            bgFlairVarians({ background: color })
          )}
        ></span>
      </span>
      <div className="relative text-center transition-colors duration-50 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:duration-150">
        {children}
      </div>
    </button>
  );
}
