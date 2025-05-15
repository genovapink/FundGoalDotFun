import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Link, NavLink, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, useFetcher, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createElement, useState, useEffect, createContext, useContext, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClientOnly } from "remix-utils/client-only";
import gsap from "gsap";
import { cva } from "class-variance-authority";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { MoveRight, MoveUp, ChevronDown, User, LogOut, Plus, X, Upload, AlertCircle, Check, ChevronLeft, Copy, Pencil } from "lucide-react";
import { Drawer as Drawer$1 } from "vaul";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Slot } from "@radix-ui/react-slot";
import { Toaster, toast } from "sonner";
import Masonry from "react-masonry-css";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useToken, useBalance } from "wagmi";
import { decodeEventLog, parseEther, parseUnits, maxUint256, formatUnits } from "viem";
import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import QRCode from "react-qr-code";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?";
function ScrambleText({ title, className }) {
  const [text, setText] = useState(title);
  useEffect(() => {
    let pos = 0;
    const intervalRef = setInterval(() => {
      const scrambled = title.split("").map((char, index2) => {
        if (pos / CYCLES_PER_LETTER > index2) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setText(scrambled);
      pos++;
      if (pos >= title.length * CYCLES_PER_LETTER) {
        clearInterval(intervalRef);
        setText(title);
      }
    }, SHUFFLE_TIME);
    return () => clearInterval(intervalRef);
  }, [title]);
  return /* @__PURE__ */ jsx("span", { className: cn("", className), children: text });
}
const FundWalletContext = createContext(null);
function useFundWallet() {
  const context = useContext(FundWalletContext);
  if (!context) {
    throw new Error("useFundWallet must be used within a FundWalletProvider");
  }
  return context;
}
const buttonVariants$1 = cva("", {
  variants: {
    color: {
      foreground: "border-foreground text-foreground",
      green: "border-[#47B172] text-[#47B172] hover:text-white",
      pink: "border-[#E97B86] text-[#E97B86] hover:text-white"
    },
    size: {
      default: "px-4 py-2 text-lg",
      lg: "px-6 py-4 text-xl",
      sm: "px-4 py-2 text-sm"
    }
  },
  defaultVariants: {
    color: "foreground",
    size: "default"
  }
});
const bgFlairVarians = cva("", {
  variants: {
    background: {
      foreground: "bg-foreground",
      pink: "bg-[#E97B86]",
      green: "bg-[#47B172]"
    }
  },
  defaultVariants: {
    background: "foreground"
  }
});
function ButtonMagnet({ children, color, size, ...props }) {
  const buttonRef = useRef(null);
  const flairRef = useRef(null);
  function getXY(e) {
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
      y: yTransformer(e.clientY - top)
    };
  }
  function handleMouseEnter(e) {
    const flair = flairRef.current;
    const xSet = gsap.quickSetter(flair, "xPercent");
    const ySet = gsap.quickSetter(flair, "yPercent");
    const XY = getXY(e);
    const x = (XY == null ? void 0 : XY.x) ?? 0;
    const y = (XY == null ? void 0 : XY.y) ?? 0;
    xSet(x);
    ySet(y);
    gsap.to(flair, { scale: 1, duration: 0.4, ease: "power2.out" });
  }
  const handleMouseLeave = (e) => {
    const XY = getXY(e);
    const x = (XY == null ? void 0 : XY.x) ?? 0;
    const y = (XY == null ? void 0 : XY.y) ?? 0;
    const flair = flairRef.current;
    gsap.killTweensOf(flair);
    gsap.to(flair, {
      xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
      yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
      scale: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };
  const handleMouseMove = (e) => {
    const XY = getXY(e);
    const x = (XY == null ? void 0 : XY.x) ?? 0;
    const y = (XY == null ? void 0 : XY.y) ?? 0;
    gsap.to(flairRef.current, { xPercent: x, yPercent: y, duration: 0.4, ease: "power2" });
  };
  useEffect(() => {
    if (!buttonRef.current || !flairRef.current) return;
    const flair = flairRef.current;
    gsap.quickSetter(flair, "xPercent");
    gsap.quickSetter(flair, "yPercent");
    buttonRef.current.addEventListener("mouseenter", handleMouseEnter);
    buttonRef.current.addEventListener("mouseleave", handleMouseLeave);
    buttonRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      var _a, _b, _c;
      (_a = buttonRef.current) == null ? void 0 : _a.removeEventListener("mouseenter", handleMouseEnter);
      (_b = buttonRef.current) == null ? void 0 : _b.removeEventListener("mouseleave", handleMouseLeave);
      (_c = buttonRef.current) == null ? void 0 : _c.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: buttonRef,
      className: cn(
        "relative inline-flex items-center justify-center overflow-hidden transition-colors cursor-pointer whitespace-nowrap",
        "border bg-transparent rounded-full font-semibold h-max",
        "hover:text-background",
        buttonVariants$1({ color, size })
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            ref: flairRef,
            className: "absolute inset-0 scale-0 transform origin-top-left will-change-transform",
            children: /* @__PURE__ */ jsx(
              "span",
              {
                className: cn(
                  "absolute left-0 top-0 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none",
                  bgFlairVarians({ background: color })
                )
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "relative text-center transition-colors duration-50 ease-[cubic-bezier(0.645,0.045,0.355,1)] hover:duration-150", children })
      ]
    }
  );
}
const arrowVariants = {
  down: {
    initial: { y: 0 },
    hover: { y: 4 },
    focus: {
      y: [0, 4, 0],
      transition: { repeat: Infinity }
    },
    active: { y: 12 }
  },
  up: {
    initial: { y: 0 },
    hover: { y: -4 },
    focus: {
      y: [0, -4, 0],
      transition: { repeat: Infinity }
    },
    active: { y: -12 }
  },
  left: {
    initial: { x: 0 },
    hover: { x: -4 },
    focus: {
      x: [0, -4, 0],
      transition: { repeat: Infinity }
    },
    active: { x: -12 }
  },
  right: {
    initial: { x: 0 },
    hover: { x: 4 },
    focus: {
      x: [0, 4, 0],
      transition: { repeat: Infinity }
    },
    active: { x: 12 }
  }
};
function getBaseProps({ className }) {
  return {
    className: cn(
      "text-primary inline-flex cursor-pointer items-center text-left font-medium transition focus:outline-none",
      className
    )
  };
}
const MotionLink = motion.create(Link);
function ArrowButtonContent({ children, direction = "right", iconB64, ...rest }) {
  const circumference = 28 * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    children && (direction === "right" || direction === "up") ? /* @__PURE__ */ jsx("span", { className: "mr-8 text-xl font-medium", children }) : null,
    /* @__PURE__ */ jsxs("div", { className: "relative inline-flex h-14 w-14 flex-none items-center justify-center p-1", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute text-gray-200 dark:text-gray-600", children: /* @__PURE__ */ jsxs("svg", { width: "60", height: "60", children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            stroke: "currentColor",
            strokeWidth: "2",
            fill: "transparent",
            r: "28",
            cx: "30",
            cy: "30"
          }
        ),
        /* @__PURE__ */ jsx(
          motion.circle,
          {
            stroke: "currentColor",
            strokeWidth: "2",
            fill: "transparent",
            r: "28",
            cx: "30",
            cy: "30",
            style: { strokeDasharray, rotate: -90 },
            variants: {
              initial: { strokeDashoffset: circumference },
              hover: { strokeDashoffset: 0, color: "#0a0e15" },
              focus: { strokeDashoffset: 0, color: "#0a0e15" },
              active: { strokeDashoffset: 0, color: "#0a0e15" }
            },
            transition: {
              damping: 0,
              ...shouldReduceMotion ? { duration: 0 } : null
            }
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx(
        motion.span,
        {
          transition: shouldReduceMotion ? { duration: 0 } : {},
          variants: shouldReduceMotion ? {} : arrowVariants[direction],
          children: iconB64 ? /* @__PURE__ */ jsx("img", { src: iconB64, className: "size-6" }) : /* @__PURE__ */ jsx(
            MoveUp,
            {
              name: "arrow-up",
              className: cn(
                "size-5",
                direction === "right" && "-rotate-90",
                direction === "left" && "rotate-90",
                direction === "down" && "rotate-180",
                direction === "up" && "rotate-0"
              )
            }
          )
        }
      )
    ] }),
    children && (direction === "left" || direction === "down") ? /* @__PURE__ */ jsx("span", { className: "ml-8 text-xl font-medium", children }) : null
  ] });
}
function ForwardLink({
  to,
  className,
  children
}) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsxs(
    MotionLink,
    {
      to,
      className: cn("text-primary flex space-x-4 focus:outline-none", className),
      animate: "initial",
      whileHover: "hover",
      whileFocus: "active",
      transition: shouldReduceMotion ? { duration: 0 } : {},
      children: [
        /* @__PURE__ */ jsx("span", { children }),
        /* @__PURE__ */ jsx(
          motion.span,
          {
            variants: shouldReduceMotion ? {} : arrowVariants.left,
            transition: shouldReduceMotion ? { duration: 0 } : {},
            children: /* @__PURE__ */ jsx(MoveRight, { name: "arrow-up" })
          }
        )
      ]
    }
  );
}
function ButtonArrow({ to, href, target, onClick, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ...getBaseProps(props),
      animate: "initial",
      whileHover: "hover",
      whileFocus: "active",
      transition: shouldReduceMotion ? { duration: 0 } : {},
      onClick,
      children: /* @__PURE__ */ jsx(ArrowButtonContent, { ...props })
    }
  );
}
function Drawer({ ...props }) {
  return /* @__PURE__ */ jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerPortal({ ...props }) {
  return /* @__PURE__ */ jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function DrawerTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function DropdownMenu({ ...props }) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Trigger, { "data-slot": "dropdown-menu-trigger", ...props });
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuShortcut({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: cn("text-muted-foreground ml-auto text-xs tracking-widest", className),
      ...props
    }
  );
}
function ConnectWallet() {
  const [isOpen, setIsOpen] = useState(false);
  const { connectors, isConnected, address, disconnect } = useFundWallet();
  useEffect(() => {
    if (isConnected && address) {
      setIsOpen(false);
    }
  }, [isConnected, address]);
  return /* @__PURE__ */ jsx(Fragment, { children: isConnected ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ClientOnly, { children: () => /* @__PURE__ */ jsx(ButtonMagnet, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4", children: [
      address.slice(0, 6),
      "...",
      address == null ? void 0 : address.slice(-4),
      /* @__PURE__ */ jsx(ChevronDown, { className: "size-4 transition-transform" })
    ] }) }) }) }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "center", className: "w-48", children: [
      /* @__PURE__ */ jsx(NavLink, { to: "/profile", children: /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "py-4", children: [
        "My Profile",
        /* @__PURE__ */ jsx(DropdownMenuShortcut, { children: /* @__PURE__ */ jsx(User, { className: "size-6" }) })
      ] }) }),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "py-4", onClick: disconnect, children: [
        "Log out",
        /* @__PURE__ */ jsx(DropdownMenuShortcut, { children: /* @__PURE__ */ jsx(LogOut, {}) })
      ] })
    ] })
  ] }) : /* @__PURE__ */ jsxs(Drawer, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(ClientOnly, { children: () => /* @__PURE__ */ jsx(ButtonMagnet, { onClick: () => setIsOpen(true), children: "Connect Wallet" }) }),
    /* @__PURE__ */ jsx(DrawerContent, { className: "pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-sm", children: [
      /* @__PURE__ */ jsx(DrawerHeader, { children: /* @__PURE__ */ jsx(DrawerTitle, { className: "text-center font-bold", children: "Connect a Wallet" }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-10", children: connectors.map((connector) => /* @__PURE__ */ jsx(
        ButtonArrow,
        {
          onClick: async () => {
            await connector.connect();
            setIsOpen(false);
          },
          iconB64: connector.icon,
          direction: "left",
          className: "w-max",
          children: connector.name
        },
        connector.id
      )) })
    ] }) })
  ] }) });
}
const DISPLAY_TIME = 2e3;
function DynamicHeader({ listTokens, titleChild, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % listTokens.length);
    }, DISPLAY_TIME);
    return () => clearInterval(interval);
  }, [displayed]);
  useEffect(() => {
    const item = listTokens[currentIndex];
    setDisplayed(
      `$${item.ticker}: ${String(parseFloat((Math.random() * (10 - 1) + 1).toFixed(2)))}`
    );
  }, [currentIndex]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("container mt-12 flex flex-row items-center justify-center gap-5", className),
      children: [
        /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("img", { src: "/logo-long-white-1.png", className: "h-11", alt: "GoFunding Logo" }) }),
        titleChild && titleChild,
        /* @__PURE__ */ jsx(ClientOnly, { children: () => /* @__PURE__ */ jsx(ScrambleText, { title: `${displayed}K`, className: "grow text-center" }) }),
        /* @__PURE__ */ jsx(ConnectWallet, {})
      ]
    }
  );
}
const endpoint = clusterApiUrl("devnet");
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new TorusWalletAdapter()];
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout$1({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    className: "dark",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  const queryClient = new QueryClient();
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    fetch(`${"https://fundgoal.fun"}/api/tokens/ticker/list`).then((res) => res.json()).then((val) => {
      setTokens(val);
    });
  }, []);
  return /* @__PURE__ */ jsx(ConnectionProvider, {
    endpoint,
    children: /* @__PURE__ */ jsx(WalletProvider, {
      wallets,
      autoConnect: true,
      children: /* @__PURE__ */ jsxs(QueryClientProvider, {
        client: queryClient,
        children: [tokens.length !== 0 && /* @__PURE__ */ jsx(DynamicHeader, {
          listTokens: tokens,
          title: "root"
        }), /* @__PURE__ */ jsx(Outlet, {})]
      })
    })
  });
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout: Layout$1,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn("cursor-pointer", buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const MENUS = [
  {
    text: "Home",
    to: "/"
  },
  {
    text: "Create",
    to: "/create"
  },
  {
    text: "About",
    to: "/about"
  }
];
function BottomNavigation() {
  const [active, setActive] = useState(false);
  return /* @__PURE__ */ jsx("div", { className: "fixed bottom-10 flex items-center justify-center w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative flex items-center justify-center gap-4 px-2 backdrop-blur-lg rounded-full bg-background/30 border border-white/50", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute left-0 z-10 w-full rounded-[40px]",
        animate: {
          x: active ? "calc(100% + 5px)" : 0
        },
        transition: { type: "ease-in", duration: 0.5 },
        children: /* @__PURE__ */ jsx(
          motion.button,
          {
            className: "flex size-12 items-center justify-center rounded-full bg-slate-800 sm:size-20 cursor-pointer border border-white/50",
            onClick: () => setActive(!active),
            animate: { rotate: active ? 45 : 0 },
            transition: {
              type: "ease-in",
              duration: 0.5
            },
            children: /* @__PURE__ */ jsx(Plus, { size: 40, strokeWidth: 3, className: "text-white" })
          }
        )
      }
    ),
    MENUS.map((val, index2) => /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "size-10 sm:size-16 flex flex-col gap-2 items-center justify-center cursor-pointer",
        animate: {
          filter: active ? "blur(0px)" : "blur(2px)",
          scale: active ? 1 : 0.9,
          opacity: active ? 1 : 0
        },
        transition: {
          type: "ease-in",
          duration: 0.4
        },
        children: /* @__PURE__ */ jsx(NavLink, { to: val.to, children: /* @__PURE__ */ jsx(Button, { variant: "link", children: val.text }) })
      },
      index2
    ))
  ] }) });
}
function Layout() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(BottomNavigation, {}), /* @__PURE__ */ jsx(Toaster, {})]
  });
}
const _layout = withComponentProps(Layout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _layout
}, Symbol.toStringTag, { value: "Module" }));
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};
function meta$4() {
  const title = "FundGoalDotFun | Tokenize Ideas, Fund the Future";
  const description = "FundGoalDotFun is a decentralized crowdfunding launchpad for research, education, creators, and startups. Tokenize your project and fund it with onchain support.";
  const image = "/logo.png";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:url",
    content: "https://fundgoal.fun"
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }, {
    name: "twitter:site",
    content: "@fundgoaldotfun"
  }, {
    name: "theme-color",
    content: "#3F5F15"
  }];
}
async function loader$2({
  request
}) {
  const {
    searchParams
  } = new URL(request.url);
  const searchTerm = searchParams.get("q");
  const page = Number(searchParams.get("page")) + 1 || 1;
  const apiUrl = searchTerm ? `${import.meta.env.VITE_BE_URL}/api/tokens?q=${encodeURIComponent(searchTerm)}&page=${page}` : `${process.env.VITE_BE_URL}/api/tokens`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return {
    data
  };
}
const index$4 = withComponentProps(function Home() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData();
  const [data, setData] = useState({
    tokens: loaderData.data.items,
    shouldLoadMore: loaderData.data.shouldLoadMore
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const handleFetch = async () => {
    setIsLoading(true);
    fetcher.load(`/api/list?q=${encodeURIComponent(searchTerm)}&page=${searchTerm ? 1 : page}`);
  };
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSearch = async () => {
    setPage(1);
    await handleFetch();
  };
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      await handleSearch();
    }
  };
  const handleClearSearch = () => {
    setPage(1);
    setSearchTerm("");
    setIsLoading(true);
    fetcher.load("/api/list");
  };
  const handleOnNextPage = async () => {
    await handleFetch();
  };
  useEffect(() => {
    if (fetcher.state == "idle" && fetcher.data) {
      setIsLoading(false);
      if (searchTerm) {
        setData({
          tokens: fetcher.data.items,
          shouldLoadMore: fetcher.data.shouldLoadMore
        });
      } else {
        setPage(page + 1);
        setData((old) => {
          return {
            tokens: [...old.tokens, ...fetcher.data.items],
            shouldLoadMore: fetcher.data.shouldLoadMore
          };
        });
      }
    }
  }, [fetcher]);
  useEffect(() => {
    const timeo = setTimeout(() => {
      setIsLoading(false);
      clearTimeout(timeo);
    }, 200);
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", {
      className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center gap-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative",
          children: [/* @__PURE__ */ jsx("div", {
            className: "w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"
          }), /* @__PURE__ */ jsx("div", {
            className: "absolute inset-0 w-16 h-16 bg-white/20 rounded-full animate-ping"
          })]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl font-semibold",
          children: "Fetching Tokens..."
        }), /* @__PURE__ */ jsx("p", {
          className: "text-sm text-gray-400 animate-pulse",
          children: "Hang tight, loading your decentralized goodness!"
        })]
      })
    });
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "container flex flex-col mt-8 gap-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex flex-row items-center gap-10",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "relative w-full",
          children: [/* @__PURE__ */ jsx(Input, {
            placeholder: "Search tokens or enter <social_media> URL ...",
            className: "dark:bg-transparent p-5 pr-10",
            value: searchTerm,
            onChange: handleInputChange,
            onKeyUp: handleKeyPress
          }), searchTerm && /* @__PURE__ */ jsx("button", {
            onClick: handleClearSearch,
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none",
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsx(X, {
              className: "w-5 h-5 cursor-pointer"
            })
          })]
        }), /* @__PURE__ */ jsx(Button, {
          variant: "secondary",
          className: "p-5",
          onClick: handleSearch,
          children: "Search"
        })]
      }), /* @__PURE__ */ jsx(Masonry, {
        breakpointCols: breakpointColumnsObj,
        className: "my-masonry-grid",
        columnClassName: "my-masonry-grid_column flex flex-col gap-y-5",
        children: data.tokens.map((token, i) => {
          const iframeSrc = String(token.postUrl);
          return /* @__PURE__ */ jsxs(NavLink, {
            className: "flex flex-col w-full rounded-lg border border-white/50 py-3 px-5 gap-y-3",
            to: String(token.contractAddress),
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-4",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "font-bold text-xl",
                children: [token.name, " (", token.ticker || token.symbol || "N/A", ")"]
              }), /* @__PURE__ */ jsx("p", {
                children: token.description || "No description available"
              })]
            }), /* @__PURE__ */ jsx("iframe", {
              className: cn("rounded-lg h-full w-full overflow-hidden", iframeSrc.includes("youtube") && "aspect-video", iframeSrc.includes("linkedin") && "aspect-square"),
              src: iframeSrc,
              frameBorder: "0",
              allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
              referrerPolicy: "strict-origin-when-cross-origin",
              scrolling: "no"
            }), /* @__PURE__ */ jsx("p", {
              className: "flex text-inherit justify-end",
              children: /* @__PURE__ */ jsx(ForwardLink, {
                className: "justify-end",
                to: String(token.contractAddress),
                children: "More"
              })
            })]
          }, i);
        })
      }), data.shouldLoadMore && /* @__PURE__ */ jsx("div", {
        className: "flex w-full justify-center mt-12 mb-36",
        children: /* @__PURE__ */ jsx(ButtonMagnet, {
          size: "lg",
          onClick: handleOnNextPage,
          children: "Load More"
        })
      })]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$4,
  loader: loader$2,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  request
}) {
  const {
    searchParams
  } = new URL(request.url);
  const searchTerm = searchParams.get("q");
  const page = Number(searchParams.get("page")) + 1 || 1;
  const apiUrl = searchTerm ? `${import.meta.env.VITE_BE_URL}/api/solana-tokens?q=${encodeURIComponent(searchTerm)}&page=${page}` : `${process.env.VITE_BE_URL}/api/solana-tokens?page=${page}`;
  const list = await fetch(apiUrl).then((res) => res.json());
  return list;
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function HowItWorks() {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "mb-32 px-4 sm:px-6 space-y-8",
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            className: "text-base sm:text-lg leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            children: [
              /* @__PURE__ */ jsx("strong", { children: "FundGoalDotFun" }),
              " is your decentralized gateway to launching and supporting onchain funding campaigns. Whether you're backing community-driven tokens or creating your own, the platform makes crypto-native fundraising simple, transparent, and fast."
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.ol,
          {
            className: "list-decimal list-inside space-y-2 text-base sm:text-lg",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2 },
            children: [
              /* @__PURE__ */ jsx("li", { children: "Explore live tokens in the Funding Market—each tied to real goals or missions." }),
              /* @__PURE__ */ jsx("li", { children: "Connect your wallet and buy tokens directly with full onchain transparency." }),
              /* @__PURE__ */ jsx("li", { children: "Sell at any time or hold to support the project’s growth and milestones." })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            className: "text-base sm:text-lg leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.3 },
            children: "Want to launch your own funding token? It’s as easy as:"
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.ol,
          {
            className: "list-decimal list-inside space-y-2 text-base sm:text-lg",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.4 },
            children: [
              /* @__PURE__ */ jsx("li", { children: "Fill out a quick form with your token’s name, ticker, and description." }),
              /* @__PURE__ */ jsx("li", { children: "Add your logo and optional links (Twitter, website, GitHub, etc.)." }),
              /* @__PURE__ */ jsx("li", { children: "Connect your wallet and deploy your token—no coding needed." }),
              /* @__PURE__ */ jsx("li", { children: "Your token is live on EduChain and ready for trading in seconds." })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            className: "text-base sm:text-lg leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.5 },
            children: [
              "All tokens follow a ",
              /* @__PURE__ */ jsx("strong", { children: "fair-launch" }),
              " model—no pre-mints, no hidden allocations. Every trade is onchain, every milestone is visible, and every creator earns transparently as their project grows."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            className: "text-base sm:text-lg leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.6 },
            children: "Join the future of fundraising. Launch. Donate. Trade. Build—on GoFundingDotFun."
          }
        )
      ]
    }
  );
}
function HowTo() {
  const sections = [
    {
      title: "Get Started Instantly",
      content: "Dive into the Funding Market to discover active campaigns or launch your own tokenized project. With just a wallet and a few clicks, you're ready to fund what matters."
    },
    {
      title: "Launch Your Funding Token",
      content: "Customize your token with a name, ticker, and description. Upload a logo, plug in your socials, and launch your ERC-20 on Solana—fully onchain, no code required."
    },
    {
      title: "Trade and Support Projects",
      content: "Explore live tokens, connect your wallet, and start trading. Support research, creators, or early-stage builders while earning or contributing—transparently and securely."
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "space-y-12 mb-32 px-4 sm:px-6", children: sections.map((section, index2) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col gap-4 sm:gap-6 ${index2 % 2 === 1 ? "sm:text-end" : "sm:text-start"}`,
      children: [
        /* @__PURE__ */ jsx(
          motion.p,
          {
            className: "text-xl sm:text-2xl font-bold underline underline-offset-4",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: index2 * 0.2 },
            children: section.title
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            className: "text-base sm:text-lg leading-relaxed",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.4, delay: index2 * 0.2 + 0.1 },
            children: section.content
          }
        )
      ]
    },
    index2
  )) });
}
function Introduction() {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "mb-32 px-4 sm:px-6",
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            className: "text-lg sm:text-xl leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            children: [
              /* @__PURE__ */ jsx("strong", { children: "FundGoalDotFun" }),
              " is a decentralized launchpad designed to fund the future of learning, discovery, and innovation. Built on ",
              /* @__PURE__ */ jsx("strong", { children: "EduChain" }),
              ", it enables anyone to launch fundraising tokens for scholarships, scientific research, creative projects, and early-stage startups—with no gatekeepers, no friction, and full transparency."
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.p,
          {
            className: "mt-4 text-lg sm:text-xl leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2 },
            children: [
              "From student-led experiments to decentralized science (DeSci) and open-source ventures, FundGoalDotFun makes it radically simple to bootstrap public-good projects with onchain tokenization, gamified milestones, and programmable incentives.",
              " ",
              /* @__PURE__ */ jsx("strong", { children: "Donations flow peer-to-peer, tracked transparently on the blockchain" }),
              "."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            className: "mt-6 text-lg sm:text-xl leading-relaxed",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.3 },
            children: "Whether you're a researcher, a student, a builder, or a believer in decentralized change, FundGoalDotFun gives you the tools to turn your vision into reality—one token at a time."
          }
        )
      ]
    }
  );
}
function AnimatedUnderline({ selected, children, onClick }) {
  return /* @__PURE__ */ jsxs(
    motion.p,
    {
      className: "relative cursor-pointer w-max",
      animate: selected ? "hover" : "hidden",
      whileHover: "hover",
      onClick,
      children: [
        children,
        /* @__PURE__ */ jsx(
          motion.span,
          {
            className: "absolute bottom-0 left-0 h-[2px] bg-white origin-right",
            variants: {
              hidden: { width: 0 },
              hover: { width: "100%" }
            },
            transition: { duration: 0.2, ease: "easeInOut" }
          }
        )
      ]
    }
  );
}
function meta$3() {
  const title = "About FundGoalDotFun | Decentralized Crowdfunding for Research & Innovation";
  const description = "Learn how FundGoalDotFun empowers students, creators, and researchers to launch decentralized crowdfunding campaigns through tokenization on EduChain.";
  const image = "/logo.png";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:url",
    content: "https://fundgoal.fun/about"
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }, {
    name: "twitter:site",
    content: "@fundgoaldotfun"
  }, {
    name: "theme-color",
    content: "#3F5F15"
  }];
}
const index$3 = withComponentProps(function About() {
  const LIST = ["Introduction", "How to", "How it works"];
  const [selected, setSelected] = useState("introduction");
  function handleSelected(selected2) {
    setSelected(selected2);
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("div", {
      className: "mt-8 container max-w-screen-xl mx-auto px-4 sm:px-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-12 gap-y-10 lg:gap-x-10",
        children: [/* @__PURE__ */ jsx("p", {
          className: "col-span-12 text-4xl sm:text-6xl lg:text-9xl my-12 lg:my-24 text-center",
          children: /* @__PURE__ */ jsx(ScrambleText, {
            title: "About"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "col-span-12 lg:col-span-5 lg:col-start-2",
          children: /* @__PURE__ */ jsx("div", {
            className: "flex justify-center lg:flex-col gap-4 items-center lg:items-start",
            children: LIST.map((item, idx) => /* @__PURE__ */ jsx(AnimatedUnderline, {
              selected: selected === item.toLowerCase().split(" ").join("-"),
              onClick: () => handleSelected(item.toLowerCase().split(" ").join("-")),
              children: item
            }, idx))
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "col-span-12 lg:col-span-5",
          children: /* @__PURE__ */ jsxs(AnimatePresence, {
            mode: "popLayout",
            children: [selected === "introduction" && /* @__PURE__ */ jsx(motion.div, {
              layout: true,
              className: "text-lg sm:text-xl lg:text-2xl tracking-wide bg-background",
              animate: {
                scale: 1,
                opacity: 1
              },
              exit: {
                scale: 0.8,
                opacity: 0
              },
              children: /* @__PURE__ */ jsx(Introduction, {})
            }, "introduction"), selected === "how-to" && /* @__PURE__ */ jsx(motion.div, {
              layout: true,
              className: "text-lg sm:text-xl lg:text-2xl tracking-wide bg-background",
              animate: {
                scale: 1,
                opacity: 1
              },
              exit: {
                scale: 0.8,
                opacity: 0
              },
              children: /* @__PURE__ */ jsx(HowTo, {})
            }, "how-to"), selected === "how-it-works" && /* @__PURE__ */ jsx(motion.div, {
              layout: true,
              className: "text-lg sm:text-xl lg:text-2xl tracking-wide bg-background",
              animate: {
                scale: 1,
                opacity: 1
              },
              exit: {
                scale: 0.8,
                opacity: 0
              },
              children: /* @__PURE__ */ jsx(HowItWorks, {})
            }, "how-it-works")]
          })
        })]
      })
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$3,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function ImageUploader({ onChange }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleFile = (file) => {
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    onChange == null ? void 0 : onChange(file);
  };
  const handleImageChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
  };
  const handleDrop = (e) => {
    var _a;
    e.preventDefault();
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
  };
  const handleDragOver = (e) => e.preventDefault();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "border border-input rounded-lg bg-background p-4 flex items-center justify-center cursor-pointer h-[180px] sm:h-[200px]",
      onClick: () => {
        var _a;
        return (_a = fileInputRef.current) == null ? void 0 : _a.click();
      },
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            onChange: handleImageChange,
            className: "hidden",
            accept: "image/*"
          }
        ),
        previewUrl ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: previewUrl,
              alt: "Token logo preview",
              className: "w-24 h-24 sm:w-32 sm:h-32 object-contain"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2", children: "Click to change" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "border border-dashed border-input rounded-lg p-4 sm:p-6", children: /* @__PURE__ */ jsx(Upload, { className: "w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4", children: "Drag & drop or click to upload (max 1 MB)" })
        ] })
      ]
    }
  );
}
const ConfirmLaunchModal = ({
  onClose,
  onConfirm,
  isLoading,
  formData,
  image
}) => {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsx("div", { className: "bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg sm:text-xl font-bold", children: "Confirm Token Launch" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-center mb-4 flex items-center justify-center text-amber-500 text-sm sm:text-base", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "mr-2 h-4 w-4 sm:h-5 sm:w-5" }),
        "Are you sure you want to launch this token?"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-input rounded-lg p-4 space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: image ? /* @__PURE__ */ jsx(
          "img",
          {
            src: URL.createObjectURL(image),
            alt: "Token logo",
            className: "w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border border-input"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xl sm:text-2xl font-bold", children: formData.name ? formData.name.charAt(0).toUpperCase() : "T" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm sm:text-base", children: [
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Token Name:" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: formData.name }),
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Ticker:" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: formData.ticker }),
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Total Supply:" }),
          /* @__PURE__ */ jsx("div", { className: "font-medium text-right", children: "1,000,000,000" }),
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Token Amount:" }),
          /* @__PURE__ */ jsxs("div", { className: "font-medium text-right", children: [
            formData.initialTokens.toLocaleString(),
            " ",
            formData.ticker
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-input rounded-lg p-4 space-y-2 text-sm sm:text-base", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Launch cost: 0.1 EDU (liquidity) + 0.25 EDU (gas)" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Token supply: 1,000,000,000 tokens (fixed)" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "You receive 2% of total supply (20,000,000 tokens)" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs sm:text-sm mt-1", children: "• 25% unlocked when market cap reaches $1,000,000" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs sm:text-sm", children: "• 25% unlocked when market cap reaches $3,000,000" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs sm:text-sm", children: "• 25% unlocked when market cap reaches $6,000,000" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs sm:text-sm", children: "• 25% unlocked when market cap reaches $10,000,000" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mt-6", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "w-full py-3 border border-input rounded-lg hover:bg-secondary transition-colors cursor-pointer",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onConfirm,
            disabled: isLoading,
            className: `cursor-pointer w-full py-3 bg-[#e2ffc7] hover:bg-[#d5f5b9] text-black font-medium rounded-lg transition-colors flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`,
            children: isLoading ? /* @__PURE__ */ jsxs("span", { className: "flex items-center", children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  className: "animate-spin -ml-1 mr-2 h-4 w-4 text-black",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ jsx(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ),
              "Processing..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Check, { className: "mr-2 h-4 w-4" }),
              "Approve & Launch"
            ] })
          }
        )
      ] })
    ] })
  ] }) }) });
};
function meta$2() {
  const title = "Create a Token | GoFundingDotFun";
  const description = "Launch your own funding token in minutes on Solana. Customize token name, ticker, image, and description. Empower decentralized fundraising for your project, startup, or research.";
  const image = "/logo.png";
  const url = "https://fundgoal.fun/create";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:url",
    content: url
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }, {
    name: "twitter:site",
    content: "@gofundingdotfun"
  }, {
    name: "theme-color",
    content: "#3F5F15"
  }];
}
const index$2 = withComponentProps(function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
    donationAddress: "",
    initialTokens: 1e9,
    embedCode: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [image, setImage] = useState(null);
  const {
    isConnected
  } = useFundWallet();
  const {
    writeContract: createToken,
    data: hashCreateToken,
    isPending: loadingCreateToken
  } = useWriteContract();
  const {
    data: createTokenReceipt,
    isLoading: loadingCreateTokenReceipt
  } = useWaitForTransactionReceipt({
    hash: hashCreateToken
  });
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreedToTerms) setShowModal(true);
    else toast("Please agree to the terms and conditions.");
  };
  const confirmLaunch = async () => {
    setIsLoading(true);
    try {
      createToken({
        abi: ABI,
        address: CONTRACT_ADDRESS,
        functionName: "createToken",
        args: [formData.name, formData.ticker],
        value: parseEther("0.1")
      });
    } catch (err) {
      console.error(err);
      toast("Failed to initiate token creation.");
    }
  };
  const saveToken = async ({
    bondingAddress,
    tokenAddress
  }) => {
    try {
      const payload = {
        name: formData.name,
        ticker: formData.ticker,
        description: formData.description,
        initialTokens: formData.initialTokens,
        contractAddress: tokenAddress,
        donationAddress: formData.donationAddress,
        embedCode: formData.embedCode,
        bondingCurveAddress: bondingAddress,
        status: "active"
      };
      const compiledFD = new FormData();
      if (image) compiledFD.append("image", image);
      compiledFD.append("payload", JSON.stringify(payload));
      const response = await fetch(`${"https://fundgoal.fun"}/api/tokens`, {
        method: "POST",
        body: compiledFD
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create token");
      }
      setShowModal(false);
    } catch (error) {
      toast(`Error creating token: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (createTokenReceipt) {
      for (const log of createTokenReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: ABI,
            data: log.data,
            topics: log.topics
          });
          if (decoded.eventName === "BondingCurveCreated") {
            const bondingAddress = decoded.args["bondingCurveAddress"];
            const tokenAddress = decoded.args["tokenAddress"];
            saveToken({
              bondingAddress,
              tokenAddress
            });
            toast("Token created successfully! 🥳");
            setTimeout(() => {
              navigate(`/${tokenAddress}`, {
                replace: true,
                preventScrollReset: true
              });
            }, 3e3);
          }
        } catch {
        }
      }
    }
  }, [createTokenReceipt]);
  if (!isConnected) {
    return /* @__PURE__ */ jsxs("div", {
      className: "w-full min-h-screen flex flex-col justify-center items-center text-center px-4",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-4xl sm:text-6xl font-bold mb-4",
        children: "Connect Your Wallet"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-lg sm:text-xl text-gray-500 mb-8",
        children: "Please connect your wallet to create your token on FundGoalDotFun."
      }), /* @__PURE__ */ jsx("p", {
        className: "text-md text-gray-400",
        children: "Make sure your wallet is connected."
      })]
    });
  }
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsxs("div", {
      className: "w-full min-h-screen mx-auto py-6 px-4 sm:px-6 lg:px-8 xl:max-w-6xl mb-28",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-3xl sm:text-5xl lg:text-8xl my-12 lg:my-24 text-center",
        children: /* @__PURE__ */ jsx(ScrambleText, {
          title: "Launch your token"
        })
      }), /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col lg:grid lg:grid-cols-2 gap-6",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "space-y-6",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "Name"
            }), /* @__PURE__ */ jsx("input", {
              name: "name",
              placeholder: 'Example: "Genova"',
              value: formData.name,
              onChange: handleChange,
              className: "w-full p-3 border border-input rounded-lg bg-background",
              required: true
            }), /* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "Ticker"
            }), /* @__PURE__ */ jsx("input", {
              name: "ticker",
              placeholder: 'Example: "$GEN"',
              value: formData.ticker,
              onChange: handleChange,
              className: "w-full p-3 border border-input rounded-lg bg-background",
              required: true
            }), /* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "Description"
            }), /* @__PURE__ */ jsx("textarea", {
              name: "description",
              placeholder: "Explain your project",
              value: formData.description,
              onChange: handleChange,
              className: "w-full p-3 border border-input rounded-lg bg-background min-h-[120px]",
              required: true
            }), /* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "EVM Donation Address (optional)"
            }), /* @__PURE__ */ jsx("input", {
              name: "donationAddress",
              placeholder: "0x....",
              value: formData.donationAddress,
              onChange: handleChange,
              className: "w-full p-3 border border-input rounded-lg bg-background"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-6",
            children: [/* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "Upload a Picture"
            }), /* @__PURE__ */ jsx(ImageUploader, {
              onChange: (file) => setImage(file)
            }), /* @__PURE__ */ jsx("label", {
              className: "block text-lg sm:text-xl mb-2",
              children: "Embed Code"
            }), /* @__PURE__ */ jsx("textarea", {
              name: "embedCode",
              placeholder: "Embed code, YouTube or LinkedIn",
              value: formData.embedCode,
              onChange: handleChange,
              className: "w-full p-3 border border-input rounded-lg bg-background min-h-[120px]",
              rows: 6,
              required: true
            })]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "border border-input rounded-lg bg-background p-4",
          children: /* @__PURE__ */ jsxs("label", {
            className: "flex items-start cursor-pointer text-sm space-x-2",
            children: [/* @__PURE__ */ jsx("input", {
              type: "checkbox",
              checked: agreedToTerms,
              onChange: () => setAgreedToTerms((prev) => !prev),
              className: "mt-1"
            }), /* @__PURE__ */ jsx("span", {
              children: "I agree to the Terms and Conditions"
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex justify-end",
          children: /* @__PURE__ */ jsx("button", {
            type: "submit",
            disabled: isLoading,
            className: "px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold",
            children: isLoading ? "Processing..." : "Launch Token"
          })
        })]
      })]
    }), /* @__PURE__ */ jsx(ConfirmLaunchModal, {
      show: showModal,
      onClose: () => setShowModal(false),
      onConfirm: confirmLaunch
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$2,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function ChartFund(props) {
  const {
    data,
    colors: {
      backgroundColor = "transparent",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)"
    } = {}
  } = props;
  const chartContainerRef = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    const chart = createChart(chartContainerRef.current, {
      layout: {
        attributionLogo: false,
        textColor: "white",
        background: {
          type: ColorType.Solid,
          color: "transparent"
        }
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "transparent" }
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight
    });
    chart.timeScale().applyOptions({
      borderVisible: false
    });
    chart.timeScale().fitContent();
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      borderColor: "#000000"
    });
    candleSeries.setData(data);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);
  return /* @__PURE__ */ jsx("div", { ref: chartContainerRef, className: "h-96 w-full" });
}
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default"
});
function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ToggleGroupPrimitive.Root,
    {
      "data-slot": "toggle-group",
      "data-variant": variant,
      "data-size": size,
      className: cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ToggleGroupContext.Provider, { value: { variant, size }, children })
    }
  );
}
function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}) {
  const context = React.useContext(ToggleGroupContext);
  return /* @__PURE__ */ jsx(
    ToggleGroupPrimitive.Item,
    {
      "data-slot": "toggle-group-item",
      "data-variant": context.variant || variant,
      "data-size": context.size || size,
      className: cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l cursor-pointer",
        className
      ),
      ...props,
      children
    }
  );
}
function Tabs({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
        className
      ),
      ...props
    }
  );
}
function TabsContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const TradingForm = ({
  type,
  baseToken,
  quoteToken,
  balance,
  amount,
  setAmount,
  setIsOpen,
  setTxType,
  isOpen,
  bondingCurveAddress,
  contractAddress,
  refetchNativeBalance
}) => {
  const { isConnected, connectors } = useFundWallet();
  const LIST_SHORTCUT = [25, 50, 75, 100];
  const displayToken = type === "buy" ? baseToken : quoteToken;
  const balanceToken = type === "buy" ? baseToken : quoteToken;
  const receiveToken = type === "buy" ? quoteToken : baseToken;
  const { address: userAddress } = useFundWallet();
  const shouldExecuteAfterApprove = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value) && Number(value) >= 0) {
      setAmount(value);
    }
  };
  const setPercentage = (percentage) => {
    const adjustedPercentage = percentage === 100 ? 98 : percentage;
    const calculatedAmount = balance * adjustedPercentage / 100;
    setAmount(calculatedAmount.toFixed(2));
  };
  const { data: contractReturn } = useReadContract({
    abi: BONDING_CURVE_ABI,
    address: bondingCurveAddress,
    functionName: type === "buy" ? "calculateBuyReturn" : "calculateSellReturn",
    args: [parseUnits(amount || "0", 18)],
    query: {
      enabled: !!amount && Number(amount) > 0
    }
  });
  const receiveAmount = !amount || Number(amount) <= 0 ? "0.00" : contractReturn ? (Number(contractReturn) / 1e18).toFixed(2) : "Calculating...";
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: contractAddress,
    functionName: "allowance",
    args: [userAddress, bondingCurveAddress],
    query: {
      enabled: !!userAddress && !!bondingCurveAddress
    }
  });
  const {
    writeContract: approve,
    data: txApprove,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove
  } = useWriteContract();
  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: txApprove
  });
  const {
    writeContract: tx,
    data: txHash,
    isPending: isTxPending,
    error: txError,
    reset: resetTx
  } = useWriteContract();
  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: txHash
  });
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    abi: ERC20_ABI,
    address: contractAddress,
    functionName: "balanceOf",
    args: [userAddress],
    query: {
      enabled: !!userAddress
    }
  });
  const doTransactions = async () => {
    try {
      const tokenAmount = parseUnits(amount, 18);
      setIsSubmitting(true);
      const needsApproval = type === "sell" && currentAllowance !== void 0 && currentAllowance !== null && BigInt(currentAllowance.toString()) < tokenAmount;
      if (needsApproval) {
        toast.info("Approving tokens...");
        shouldExecuteAfterApprove.current = true;
        approve({
          abi: ERC20_ABI,
          address: contractAddress,
          functionName: "approve",
          args: [bondingCurveAddress, maxUint256]
        });
        return;
      }
      toast.info(`Processing ${type} transaction...`);
      shouldExecuteAfterApprove.current = false;
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: type,
        ...type === "sell" && { args: [tokenAmount] },
        ...type === "buy" && { value: parseEther(amount) }
      });
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Failed to initiate transaction");
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (approveError) {
      toast.error("Approval was rejected");
      resetApprove();
    }
  }, [approveError, resetApprove]);
  useEffect(() => {
    if (txError) {
      toast.error("Transaction was rejected");
      resetTx();
      setIsSubmitting(false);
    }
  }, [txError, resetTx]);
  useEffect(() => {
    if ((approveReceipt == null ? void 0 : approveReceipt.status) === "success" && shouldExecuteAfterApprove.current) {
      toast.success("Approval successful!");
      const tokenAmount = parseUnits(amount, 18);
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: type,
        ...type === "sell" && { args: [tokenAmount] },
        ...type === "buy" && { value: parseEther(amount) }
      });
      shouldExecuteAfterApprove.current = false;
    }
  }, [approveReceipt]);
  useEffect(() => {
    if (txReceipt) {
      setIsSubmitting(false);
      for (const log of txReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: BONDING_CURVE_ABI,
            data: log.data,
            topics: log.topics
          });
          if (decoded.eventName === "Bought") {
            setTimeout(() => toast.success("Buy successful! 🥳"), 3e3);
            refetchBalance == null ? void 0 : refetchBalance();
            refetchNativeBalance == null ? void 0 : refetchNativeBalance();
          } else if (decoded.eventName === "Sold") {
            setTimeout(() => toast.success("Sell successful! 🥳"), 3e3);
            refetchBalance == null ? void 0 : refetchBalance();
            refetchNativeBalance == null ? void 0 : refetchNativeBalance();
          }
        } catch (error) {
          console.error("Decoding error:", error);
        }
      }
    }
  }, [txReceipt]);
  useEffect(() => {
    if ((approveReceipt == null ? void 0 : approveReceipt.status) === "success") {
      refetchAllowance == null ? void 0 : refetchAllowance();
    }
  }, [approveReceipt]);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-base font-medium", children: "Quantity" }) }),
    /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center border rounded-md p-2", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: displayToken.icon === "" ? "/logo-color.png" : displayToken.icon,
          alt: displayToken.name || "",
          className: "w-6 h-6 mr-2 rounded-xl"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "mr-2", children: displayToken.name }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          inputMode: "decimal",
          value: amount,
          onChange: handleAmountChange,
          placeholder: "0.00",
          className: "w-full outline-none"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600", children: [
      "Available:",
      " ",
      isConnected ? type === "buy" ? `${balance.toFixed(4)} ${balanceToken.name}` : `${tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(4) : "0.00"} ${balanceToken.name}` : "0"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-row gap-2", children: LIST_SHORTCUT.map((val, idx) => /* @__PURE__ */ jsx(Button, { onClick: () => setPercentage(val), variant: "outline", className: "flex-1", children: val == 100 ? "MAX" : val + "%" }, idx)) }),
    /* @__PURE__ */ jsx("div", { className: "border-t pt-2", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsx("span", { children: "What you receive:" }),
      /* @__PURE__ */ jsxs("span", { children: [
        receiveAmount,
        " ",
        receiveToken.name
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(ClientOnly, { children: () => isConnected ? /* @__PURE__ */ jsx(
      ButtonMagnet,
      {
        onClick: () => doTransactions(),
        color: type === "buy" ? "green" : "pink",
        disabled: isApprovePending || isSubmitting,
        children: isApprovePending ? "Approving..." : isSubmitting ? "Processing..." : type === "buy" ? "Buy" : "Sell"
      }
    ) : /* @__PURE__ */ jsxs(Drawer, { open: isOpen, onOpenChange: setIsOpen, children: [
      /* @__PURE__ */ jsx(ClientOnly, { children: () => /* @__PURE__ */ jsx(
        ButtonMagnet,
        {
          onClick: () => setIsOpen(true),
          color: type === "buy" ? "green" : "pink",
          children: "Connect Wallet"
        }
      ) }),
      /* @__PURE__ */ jsx(DrawerContent, { className: "pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-sm", children: [
        /* @__PURE__ */ jsx(DrawerHeader, { children: /* @__PURE__ */ jsx(DrawerTitle, { className: "text-center font-bold", children: "Connect a Wallet" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-10", children: connectors.map((connector) => /* @__PURE__ */ jsx(
          ButtonArrow,
          {
            onClick: () => connector.connect(),
            iconB64: connector.icon,
            direction: "left",
            className: "w-max",
            children: connector.name
          },
          connector.id
        )) })
      ] }) })
    ] }) })
  ] });
};
function BuySellTabs({ contractAddress, imageUrl, bondingCurveAddress }) {
  const [quoteTokenName, setQuoteTokenName] = useState(null);
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxTypeInternal] = useState("buy");
  const user = useFundWallet();
  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const { data: tokenBalanceData } = useToken({
    address: contractAddress
  });
  const { data: currentPrice } = useBalance({
    address: bondingCurveAddress
  });
  const pairData = {
    baseToken: { icon: imageUrl, name: "SOL" },
    quoteToken: { icon: imageUrl, name: quoteTokenName },
    balance: txType === "buy" ? balance : tokenBalance,
    price: currentPrice ? parseFloat(formatUnits(currentPrice)) : 0
  };
  const { data: dataBalance, refetch: refetchBalance } = useBalance({
    address: user == null ? void 0 : user.address
  });
  const { data: dataToken, refetch: refetchToken } = useToken({
    address: contractAddress
  });
  const setTxType = (type) => {
    setTxTypeInternal(type);
    setAmount("");
  };
  useEffect(() => {
    if (tokenBalanceData) {
      setTokenBalance(parseFloat(tokenBalanceData.amount));
    }
  }, [tokenBalanceData]);
  useEffect(() => {
    if (dataBalance) {
      setBalance(parseFloat(dataBalance.formatted));
    }
  }, [dataBalance]);
  useEffect(() => {
    refetchToken();
  }, [contractAddress]);
  useEffect(() => {
    if (dataToken == null ? void 0 : dataToken.symbol) {
      setQuoteTokenName(dataToken.symbol);
    }
  }, [dataToken]);
  if (!quoteTokenName) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 py-10", children: "Loading token info..." });
  }
  return /* @__PURE__ */ jsxs(
    Tabs,
    {
      defaultValue: "buy",
      className: "w-full",
      value: txType,
      onValueChange: (val) => {
        setTxType(val);
        setAmount("");
      },
      children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "w-full grid grid-cols-2", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "buy", className: "cursor-pointer", children: "Buy" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "sell", className: "cursor-pointer", children: "Sell" })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "buy", className: "mt-4", children: /* @__PURE__ */ jsx(
          TradingForm,
          {
            type: "buy",
            ...pairData,
            amount,
            setAmount,
            setIsOpen,
            setTxType,
            isOpen,
            bondingCurveAddress,
            contractAddress,
            refetchNativeBalance: refetchBalance
          }
        ) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "sell", className: "mt-4", children: /* @__PURE__ */ jsx(
          TradingForm,
          {
            type: "sell",
            ...pairData,
            amount,
            setAmount,
            setIsOpen,
            setTxType,
            isOpen,
            bondingCurveAddress,
            contractAddress,
            refetchNativeBalance: refetchBalance
          }
        ) })
      ]
    }
  );
}
function Pagination({
  currentPage,
  totalPages,
  onBack,
  onNext,
  className
}) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex justify-center items-center gap-2 mt-4", className), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onBack,
        disabled: currentPage === 1,
        className: "px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed",
        children: "Previous"
      }
    ),
    /* @__PURE__ */ jsxs("span", { className: "text-xs sm:text-sm", children: [
      "Page ",
      currentPage,
      " of ",
      totalPages
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onNext,
        disabled: currentPage === totalPages,
        className: "px-3 py-1 text-xs sm:text-sm rounded-md border border-white/50 disabled:opacity-50 disabled:cursor-not-allowed",
        children: "Next"
      }
    )
  ] });
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "table-container", className: "relative w-full overflow-x-auto", children: /* @__PURE__ */ jsx(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  ) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("thead", { "data-slot": "table-header", className: cn("[&_tr]:border-b", className), ...props });
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "px-2 py-5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCaption({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("text-muted-foreground mt-4 text-sm", className),
      ...props
    }
  );
}
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(Comp, { "data-slot": "badge", className: cn(badgeVariants({ variant }), className), ...props });
}
function ShowQR({ address }) {
  const [isOpen, setIsOpen] = useState(false);
  return /* @__PURE__ */ jsxs(Drawer, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(ClientOnly, { children: () => /* @__PURE__ */ jsx(
      "p",
      {
        onClick: () => setIsOpen(true),
        className: "underline italic text-blue-500 text-xs cursor-pointer",
        children: "show qr"
      }
    ) }),
    /* @__PURE__ */ jsx(DrawerContent, { className: "pb-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-full max-w-sm", children: [
      /* @__PURE__ */ jsx(DrawerHeader, { children: /* @__PURE__ */ jsx(DrawerTitle, { className: "text-center font-bold", children: "Donate to creator" }) }),
      /* @__PURE__ */ jsx("div", { className: "p-5 bg-foreground rounded-lg", children: /* @__PURE__ */ jsx(
        QRCode,
        {
          className: "aspect-square rounded-lg",
          size: 256,
          style: { height: "auto", maxWidth: "100%", width: "100%" },
          value: address,
          viewBox: `0 0 256 256`
        }
      ) })
    ] }) })
  ] });
}
function addressTrimer(address) {
  return `${address.slice(0, 6)}...${address == null ? void 0 : address.slice(-4)}`;
}
const generateAddress = () => `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
function meta$1() {
  const title = "Token Details | FundGoalDotFun";
  const description = "View token information, transaction activity, and market data for community-funded projects on FundGoalDotFun.";
  const image = "/logo.png";
  const url = "https://fundgoal.fun";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "website"
  }, {
    property: "og:url",
    content: url
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }, {
    name: "twitter:site",
    content: "@fundgoaldotfun"
  }, {
    name: "theme-color",
    content: "#3F5F15"
  }];
}
async function loader({
  params
}) {
  const {
    ca
  } = params;
  const token = await fetch(`${import.meta.env.VITE_BE_URL}/api/tokens/${ca}`).then((r) => r.json());
  return token;
}
const index$1 = withComponentProps(function Symbol2({
  loaderData
}) {
  const TIME_SERIES = ["1m", "5m", "30m", "1h", "4h", "1w"];
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const invoices = Array.from({
    length: 20
  }, () => ({
    user: generateAddress().substring(0, 10) + "...",
    type: Math.random() > 0.5 ? "Buy" : "Sell",
    price: parseFloat((Math.random() * 1e-4 + 1e-6).toFixed(8)),
    volume: parseFloat((Math.random() * 1e-5 + 1e-6).toFixed(8)),
    edu: parseFloat((Math.random() * 1e-5 + 1e-6).toFixed(8)),
    date: new Date(Date.now() - Math.floor(Math.random() * 1e3 * 60 * 60 * 24 * 30)).toISOString().split("T")[0].replace(/-/g, " - "),
    tx: `0x${Math.random().toString(16).substring(2, 10)}...`
  }));
  const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = invoices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  return /* @__PURE__ */ jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-5 mt-12 px-4 sm:px-6 lg:px-10 min-h-screen",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "col-span-full lg:col-span-8",
      children: [/* @__PURE__ */ jsxs(NavLink, {
        to: "/",
        className: "flex flex-row items-center text-sm gap-x-2 underline mb-4",
        children: [/* @__PURE__ */ jsx(ChevronLeft, {
          className: "size-4"
        }), " Back"]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs",
          children: [/* @__PURE__ */ jsx("p", {
            children: "Market Cap: $22,833"
          }), /* @__PURE__ */ jsx("p", {
            children: "Price: 0.0000000337 EDU"
          }), /* @__PURE__ */ jsx("p", {
            children: "Liquidity: 123456789 EDU"
          }), /* @__PURE__ */ jsxs("p", {
            children: ["Remaining: 695,799,225.84 ", loaderData.ticker]
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex flex-wrap gap-2 justify-center sm:justify-end",
          children: /* @__PURE__ */ jsx(ToggleGroup, {
            type: "single",
            children: TIME_SERIES.map((val, idx) => /* @__PURE__ */ jsx(ToggleGroupItem, {
              value: val,
              children: val
            }, idx))
          })
        })]
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "col-span-full lg:col-span-8 row-auto lg:row-start-2 w-full",
      children: /* @__PURE__ */ jsx("div", {
        className: "p-5 border border-white/50 rounded-lg",
        children: /* @__PURE__ */ jsx(ChartFund, {
          data: [{
            open: 10,
            high: 10.63,
            low: 9.49,
            close: 9.55,
            time: 1642427876
          }, {
            open: 9.55,
            high: 10.3,
            low: 9.42,
            close: 9.94,
            time: 1642514276
          }, {
            open: 9.94,
            high: 10.17,
            low: 9.92,
            close: 9.78,
            time: 1642600676
          }, {
            open: 9.78,
            high: 10.59,
            low: 9.18,
            close: 9.51,
            time: 1642687076
          }, {
            open: 9.51,
            high: 10.46,
            low: 9.1,
            close: 10.17,
            time: 1642773476
          }, {
            open: 10.17,
            high: 10.96,
            low: 10.16,
            close: 10.47,
            time: 1642859876
          }, {
            open: 10.47,
            high: 11.39,
            low: 10.4,
            close: 10.81,
            time: 1642946276
          }, {
            open: 10.81,
            high: 11.6,
            low: 10.3,
            close: 10.75,
            time: 1643032676
          }, {
            open: 10.75,
            high: 11.6,
            low: 10.49,
            close: 10.93,
            time: 1643119076
          }, {
            open: 10.93,
            high: 11.53,
            low: 10.76,
            close: 10.96,
            time: 1643205476
          }]
        })
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "col-span-full lg:col-span-8 row-start-4 lg:row-start-3 w-full",
      children: [/* @__PURE__ */ jsxs(Table, {
        className: "overflow-y-auto relative",
        children: [/* @__PURE__ */ jsx(TableCaption, {
          children: "A list of your recent transactions."
        }), /* @__PURE__ */ jsx(TableHeader, {
          className: "sticky top-0 bg-background",
          children: /* @__PURE__ */ jsxs(TableRow, {
            children: [/* @__PURE__ */ jsx(TableHead, {
              children: "User"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Type"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Price (EDU)"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: loaderData.ticker
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "EDU"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Date"
            }), /* @__PURE__ */ jsx(TableHead, {
              children: "Tx Hash"
            })]
          })
        }), /* @__PURE__ */ jsx(TableBody, {
          children: paginatedInvoices.map((invoice, id) => /* @__PURE__ */ jsxs(TableRow, {
            className: "odd:bg-transparent even:bg-white/10",
            children: [/* @__PURE__ */ jsx(TableCell, {
              className: "font-medium",
              children: invoice.user
            }), /* @__PURE__ */ jsx(TableCell, {
              children: invoice.type
            }), /* @__PURE__ */ jsx(TableCell, {
              children: invoice.price
            }), /* @__PURE__ */ jsx(TableCell, {
              children: invoice.volume
            }), /* @__PURE__ */ jsx(TableCell, {
              children: invoice.edu
            }), /* @__PURE__ */ jsx(TableCell, {
              children: invoice.date
            }), /* @__PURE__ */ jsx(TableCell, {
              children: /* @__PURE__ */ jsx("a", {
                href: `https://opencampus-codex.blockscout.com/tx/${invoice.tx}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "truncate block text-blue-500 hover:underline",
                title: invoice.tx,
                children: invoice.tx
              })
            })]
          }, id))
        })]
      }), /* @__PURE__ */ jsx(Pagination, {
        className: "mb-36",
        onBack: () => setCurrentPage((prev) => Math.max(1, prev - 1)),
        onNext: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)),
        currentPage,
        totalPages
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "col-span-full lg:col-span-4 row-auto lg:row-start-1 lg:row-end-4 w-full",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-10",
        children: [/* @__PURE__ */ jsx(BuySellTabs, {
          contractAddress: loaderData.contractAddress,
          imageUrl: loaderData.imageUrl,
          bondingCurveAddress: loaderData.bondingCurveAddress
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-4",
          children: [/* @__PURE__ */ jsx(ForwardLink, {
            className: "justify-end",
            to: "/",
            children: "Visit resource"
          }), /* @__PURE__ */ jsx("iframe", {
            className: cn("rounded-lg h-full w-full overflow-hidden", "aspect-video"),
            src: String(loaderData.postUrl),
            frameBorder: "0",
            allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            referrerPolicy: "strict-origin-when-cross-origin",
            scrolling: "no"
          }), /* @__PURE__ */ jsx("div", {
            className: "h-[1px] bg-white/50 w-full self-end my-8"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-row gap-2 items-center",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Name:"
            }), /* @__PURE__ */ jsx(Badge, {
              variant: "secondary",
              children: loaderData.name
            }), /* @__PURE__ */ jsx(Copy, {
              className: "size-5 cursor-pointer"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-row gap-2 items-center",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Contract Address:"
            }), /* @__PURE__ */ jsx("a", {
              href: `https://edu-chain-testnet.blockscout.com/address/${loaderData.contractAddress}`,
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx(Badge, {
                className: "cursor-pointer",
                children: addressTrimer(loaderData.contractAddress)
              })
            }), /* @__PURE__ */ jsx(Copy, {
              className: "size-5 cursor-pointer",
              onClick: () => navigator.clipboard.writeText(loaderData.contractAddress)
            })]
          }), loaderData.donationAddress && /* @__PURE__ */ jsxs("div", {
            className: "flex flex-row gap-2 items-center",
            children: [/* @__PURE__ */ jsx("p", {
              children: "Donate to Creator"
            }), /* @__PURE__ */ jsx(Badge, {
              variant: "secondary",
              children: addressTrimer(loaderData.donationAddress)
            }), /* @__PURE__ */ jsx(Copy, {
              className: "size-5 cursor-pointer",
              onClick: () => navigator.clipboard.writeText(loaderData.donationAddress)
            }), /* @__PURE__ */ jsx(ShowQR, {
              address: loaderData.donationAddress
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "h-[1px] bg-white/50 w-full self-start my-8"
          }), /* @__PURE__ */ jsx("p", {
            children: "Description:"
          }), /* @__PURE__ */ jsx("p", {
            children: loaderData.description
          })]
        })]
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index$1,
  loader,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function TabsOutline({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsOutlineList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        " inline-flex w-full items-center justify-start  gap-0 border-b-2 border-border p-0 text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
function TabsOutlineTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "mx-2 -mb-[2px] inline-flex items-center justify-start whitespace-nowrap border-b-2 px-2 py-2 text-base font-medium transition-all first-of-type:ml-0 disabled:pointer-events-none disabled:text-muted-foreground data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground cursor-pointer",
        className
      ),
      ...props
    }
  );
}
function TabsOutlineContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      ),
      ...props
    }
  );
}
function meta() {
  const title = "User Profile | FundGoalDotFun";
  const description = "View a creator's onchain profile on FundGoalDotFun. Track their fundraising tokens, followers, and community impact.";
  const image = "/logo.png";
  const url = "https://fundgoal.fun/profile";
  return [{
    title
  }, {
    name: "description",
    content: description
  }, {
    property: "og:title",
    content: title
  }, {
    property: "og:description",
    content: description
  }, {
    property: "og:type",
    content: "profile"
  }, {
    property: "og:url",
    content: url
  }, {
    property: "og:image",
    content: image
  }, {
    name: "twitter:card",
    content: "summary_large_image"
  }, {
    name: "twitter:title",
    content: title
  }, {
    name: "twitter:description",
    content: description
  }, {
    name: "twitter:image",
    content: image
  }, {
    name: "twitter:site",
    content: "@fundgoaldotfun"
  }, {
    name: "theme-color",
    content: "#3F5F15"
  }];
}
const index = withComponentProps(function ProfilePage() {
  const {
    publicKey
  } = useWallet();
  return /* @__PURE__ */ jsxs("div", {
    className: "container mt-8 flex flex-col gap-4",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-row gap-4 justify-center",
      children: [/* @__PURE__ */ jsx("img", {
        src: "https://placehold.co/50",
        className: "aspect-square object-cover rounded-full h-max"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col gap-1",
        children: [/* @__PURE__ */ jsx("p", {
          children: "username"
        }), /* @__PURE__ */ jsx("p", {
          children: "0 followers"
        }), /* @__PURE__ */ jsx("p", {
          children: "bio"
        }), /* @__PURE__ */ jsx(ButtonMagnet, {
          size: "sm",
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-row gap-2 items-center",
            children: [/* @__PURE__ */ jsx(Pencil, {
              className: "size-4"
            }), "Edit profile"]
          })
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col gap-2 justify-center items-center",
      children: [/* @__PURE__ */ jsx(Badge, {
        variant: "outline",
        className: "py-2 px-3 mx-auto",
        children: publicKey ? publicKey.toBase58() : "Connect Wallet"
      }), publicKey && /* @__PURE__ */ jsx(ForwardLink, {
        to: `https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`,
        className: "text-end",
        children: "view on Solana explorer"
      })]
    }), /* @__PURE__ */ jsxs(TabsOutline, {
      defaultValue: "coins-created",
      children: [/* @__PURE__ */ jsxs(TabsOutlineList, {
        className: "w-full mb-5",
        children: [/* @__PURE__ */ jsx(TabsOutlineTrigger, {
          value: "coins-created",
          className: "capitalize",
          children: "Coins Created"
        }), /* @__PURE__ */ jsx(TabsOutlineTrigger, {
          value: "followers",
          className: "capitalize",
          children: "Followers"
        }), /* @__PURE__ */ jsx(TabsOutlineTrigger, {
          value: "following",
          className: "capitalize",
          children: "Following"
        })]
      }), /* @__PURE__ */ jsx(TabsOutlineContent, {
        value: "coins-created",
        className: "flex flex-col gap-10",
        children: /* @__PURE__ */ jsx("p", {
          className: "italic",
          children: "soon"
        })
      }), /* @__PURE__ */ jsx(TabsOutlineContent, {
        value: "followers",
        className: "flex flex-col gap-10",
        children: /* @__PURE__ */ jsx("p", {
          className: "italic",
          children: "soon"
        })
      }), /* @__PURE__ */ jsx(TabsOutlineContent, {
        value: "following",
        className: "flex flex-col gap-10",
        children: /* @__PURE__ */ jsx("p", {
          className: "italic",
          children: "soon"
        })
      })]
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DTnhsj4p.js", "imports": ["/assets/chunk-D4RADZKF-BZ4imTJX.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DE0StPiO.js", "imports": ["/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/root-CAsDutsN.js", "/assets/createLucideIcon-DqF-kfK_.js", "/assets/preload-helper-BeGl6iAn.js", "/assets/drawer-DjQHysjT.js", "/assets/index-CIXzG5v3.js", "/assets/index-DZdmqhza.js", "/assets/scramble-text-eqsPe4ip.js", "/assets/provider-M81ew7FS.js", "/assets/magnet-BVi2yfa0.js", "/assets/index-BHuQsQrX.js", "/assets/index-COmMMEcZ.js", "/assets/useWallet-DhPxDxZ0.js"], "css": ["/assets/root-D09DPmgm.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/_layout": { "id": "routes/_layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/_layout-B29VJjYs.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/button-BegphyA9.js", "/assets/index-DZdmqhza.js", "/assets/index-WK4sMw3K.js", "/assets/index-BHuQsQrX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/index": { "id": "routes/index", "parentId": "routes/_layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-D4v5mqXO.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/magnet-BVi2yfa0.js", "/assets/index-CIXzG5v3.js", "/assets/provider-M81ew7FS.js", "/assets/button-BegphyA9.js", "/assets/x-BAIX-ARt.js", "/assets/index-BHuQsQrX.js", "/assets/index-DZdmqhza.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/landing/list": { "id": "routes/landing/list", "parentId": "routes/_layout", "path": "/api/list", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/list-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/about/index": { "id": "routes/about/index", "parentId": "routes/_layout", "path": "/about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-D6beaFok.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/scramble-text-eqsPe4ip.js", "/assets/provider-M81ew7FS.js", "/assets/index-CIXzG5v3.js", "/assets/index-DZdmqhza.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/create/index": { "id": "routes/create/index", "parentId": "routes/_layout", "path": "/create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-Ds_naR_a.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/scramble-text-eqsPe4ip.js", "/assets/index-WK4sMw3K.js", "/assets/x-BAIX-ARt.js", "/assets/provider-M81ew7FS.js", "/assets/useWriteContract-DlIVuD58.js", "/assets/preload-helper-BeGl6iAn.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/details-ca/index": { "id": "routes/details-ca/index", "parentId": "routes/_layout", "path": ":ca", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-DGKVDu7w.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/index-CIXzG5v3.js", "/assets/index-COmMMEcZ.js", "/assets/index-BHuQsQrX.js", "/assets/badge-BTB8hMLb.js", "/assets/provider-M81ew7FS.js", "/assets/drawer-DjQHysjT.js", "/assets/magnet-BVi2yfa0.js", "/assets/button-BegphyA9.js", "/assets/index-WK4sMw3K.js", "/assets/useWriteContract-DlIVuD58.js", "/assets/index-DZdmqhza.js", "/assets/preload-helper-BeGl6iAn.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/profile/index": { "id": "routes/profile/index", "parentId": "routes/_layout", "path": "/profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-p7r6s-Rn.js", "imports": ["/assets/createLucideIcon-DqF-kfK_.js", "/assets/chunk-D4RADZKF-BZ4imTJX.js", "/assets/magnet-BVi2yfa0.js", "/assets/index-CIXzG5v3.js", "/assets/provider-M81ew7FS.js", "/assets/badge-BTB8hMLb.js", "/assets/useWallet-DhPxDxZ0.js", "/assets/index-BHuQsQrX.js", "/assets/index-DZdmqhza.js", "/assets/index-COmMMEcZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8f000cd6.js", "version": "8f000cd6", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/_layout": {
    id: "routes/_layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/index": {
    id: "routes/index",
    parentId: "routes/_layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/landing/list": {
    id: "routes/landing/list",
    parentId: "routes/_layout",
    path: "/api/list",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/about/index": {
    id: "routes/about/index",
    parentId: "routes/_layout",
    path: "/about",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/create/index": {
    id: "routes/create/index",
    parentId: "routes/_layout",
    path: "/create",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/details-ca/index": {
    id: "routes/details-ca/index",
    parentId: "routes/_layout",
    path: ":ca",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/profile/index": {
    id: "routes/profile/index",
    parentId: "routes/_layout",
    path: "/profile",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
