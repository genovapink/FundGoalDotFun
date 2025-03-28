import { Link, type LinkProps } from "react-router";
import { motion, useReducedMotion, type Variant } from "motion/react";
// import { Icon } from "./icon";
import { cn } from "~/utils/cn";
import type { JSX } from "react";
import { ArrowUp, MoveRight, MoveUp } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */
type ArrowIconProps = "up" | "down" | "left" | "right";
type ElementState = "active" | "focus" | "hover" | "initial";

type ArrowButtonBaseProps = {
  direction?: ArrowIconProps;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
};

type ConditionalHrefAndTo =
  | { href?: string; to?: never; target?: JSX.IntrinsicElements["a"]["target"] }
  | { href?: never; to: LinkProps["to"]; target?: never };

type PrefetchType = { prefetch?: LinkProps["prefetch"] };

type ArrowLinkProps = ConditionalHrefAndTo &
  ArrowButtonBaseProps &
  PrefetchType & {
    direction?: ArrowIconProps;
    iconB64?: string;
    onClick?: JSX.IntrinsicElements["div"]["onClick"];
  };

/* -------------------------------------------------------------------------- */
/*                               Motion variant                               */
/* -------------------------------------------------------------------------- */
const arrowVariants: Record<ArrowIconProps, Record<ElementState, Variant>> = {
  down: {
    initial: { y: 0 },
    hover: { y: 4 },
    focus: {
      y: [0, 4, 0],
      transition: { repeat: Infinity },
    },
    active: { y: 12 },
  },
  up: {
    initial: { y: 0 },
    hover: { y: -4 },
    focus: {
      y: [0, -4, 0],
      transition: { repeat: Infinity },
    },
    active: { y: -12 },
  },
  left: {
    initial: { x: 0 },
    hover: { x: -4 },
    focus: {
      x: [0, -4, 0],
      transition: { repeat: Infinity },
    },
    active: { x: -12 },
  },
  right: {
    initial: { x: 0 },
    hover: { x: 4 },
    focus: {
      x: [0, 4, 0],
      transition: { repeat: Infinity },
    },
    active: { x: 12 },
  },
};

/* -------------------------------------------------------------------------- */
/*                                   helper                                   */
/* -------------------------------------------------------------------------- */
function getBaseProps({ className }: ArrowButtonBaseProps) {
  return {
    className: cn(
      "text-primary inline-flex cursor-pointer items-center text-left font-medium transition focus:outline-none",
      className
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const MotionLink = motion.create(Link);

function ArrowButtonContent({ children, direction = "right", iconB64, ...rest }: ArrowLinkProps) {
  const circumference = 28 * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {children && (direction === "right" || direction === "up") ? (
        <span className="mr-8 text-xl font-medium">{children}</span>
      ) : null}

      <div className="relative inline-flex h-14 w-14 flex-none items-center justify-center p-1">
        <div className="absolute text-gray-200 dark:text-gray-600">
          <svg width="60" height="60">
            <circle
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              r="28"
              cx="30"
              cy="30"
            />

            <motion.circle
              stroke="currentColor"
              strokeWidth="2"
              fill="transparent"
              r="28"
              cx="30"
              cy="30"
              style={{ strokeDasharray, rotate: -90 }}
              variants={{
                initial: { strokeDashoffset: circumference },
                hover: { strokeDashoffset: 0, color: "#0a0e15" },
                focus: { strokeDashoffset: 0, color: "#0a0e15" },
                active: { strokeDashoffset: 0, color: "#0a0e15" },
              }}
              transition={{
                damping: 0,
                ...(shouldReduceMotion ? { duration: 0 } : null),
              }}
            />
          </svg>
        </div>

        <motion.span
          transition={shouldReduceMotion ? { duration: 0 } : {}}
          variants={shouldReduceMotion ? {} : arrowVariants[direction]}
        >
          {iconB64 ? (
            <img src={iconB64} className="size-6" />
          ) : (
            <MoveUp
              name="arrow-up"
              className={cn(
                "size-5",
                direction === "right" && "-rotate-90",
                direction === "left" && "rotate-90",
                direction === "down" && "rotate-180",
                direction === "up" && "rotate-0"
              )}
              // <ArrowUp
              //   size="xl"
              //   name="arrow-up"
              //   className={cn(
              //     "size-6",
              //     direction === "right" && "-rotate-90",
              //     direction === "left" && "rotate-90",
              //     direction === "down" && "rotate-180",
              //     direction === "up" && "rotate-0"
              //   )}
            />
          )}
          {/* <Icon
            name="arrow-up"
            size="xl"
            className={cn(
              direction === "right" && "rotate-90",
              direction === "left" && "-rotate-90",
              direction === "down" && "rotate-180",
              direction === "up" && "rotate-0"
            )}
          /> */}
        </motion.span>
      </div>

      {children && (direction === "left" || direction === "down") ? (
        <span className="ml-8 text-xl font-medium">{children}</span>
      ) : null}
    </>
  );
}

function ArrowLink({ to, href, target, ...props }: ArrowLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        {...getBaseProps(props)}
        animate="initial"
        whileHover="hover"
        whileFocus="active"
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        <ArrowButtonContent {...props} />
      </motion.a>
    );
  } else if (to) {
    return (
      <MotionLink
        to={to}
        {...getBaseProps(props)}
        animate="initial"
        whileHover="hover"
        whileFocus="active"
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        <ArrowButtonContent {...props} />
      </MotionLink>
    );
  }
  throw new Error("Must provide either to or href to ArrowLink");
}

function BackLink({
  to,
  className,
  children,
}: { to: LinkProps["to"] } & Pick<ArrowLinkProps, "className" | "children">) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <MotionLink
      to={to}
      className={cn("text-primary flex space-x-4 focus:outline-none", className)}
      animate="initial"
      whileHover="hover"
      whileFocus="active"
      transition={shouldReduceMotion ? { duration: 0 } : {}}
    >
      <motion.span
        variants={shouldReduceMotion ? {} : arrowVariants.left}
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        <ArrowUp size="xl" name="arrow-up" className="-rotate-90" />
      </motion.span>
      <span>{children}</span>
    </MotionLink>
  );
}

function ForwardLink({
  to,
  className,
  children,
}: { to: LinkProps["to"] } & Pick<ArrowLinkProps, "className" | "children">) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <MotionLink
      to={to}
      className={cn("text-primary flex space-x-4 focus:outline-none", className)}
      animate="initial"
      whileHover="hover"
      whileFocus="active"
      transition={shouldReduceMotion ? { duration: 0 } : {}}
    >
      <span>{children}</span>
      <motion.span
        variants={shouldReduceMotion ? {} : arrowVariants.left}
        transition={shouldReduceMotion ? { duration: 0 } : {}}
      >
        <MoveRight name="arrow-up" />
      </motion.span>
    </MotionLink>
  );
}

function ButtonArrow({ to, href, target, onClick, ...props }: ArrowLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      {...getBaseProps(props)}
      animate="initial"
      whileHover="hover"
      whileFocus="active"
      transition={shouldReduceMotion ? { duration: 0 } : {}}
      onClick={onClick}
    >
      <ArrowButtonContent {...props} />
    </motion.div>
  );
}

export { ArrowLink, BackLink, ButtonArrow, ForwardLink };
