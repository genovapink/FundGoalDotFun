import { Button } from "@shadcn/button";
import { useEffect, useState, type JSX } from "react";
import { cn } from "~/utils/cn";
import { ClientOnly } from "remix-utils/client-only";
import Marquee from "react-fast-marquee";
import { ScrambleText } from "./scramble-text";
import React from "react";
import { ButtonMagnet } from "./button";
import { ConnectWallet } from "./wallet/connect-wallet";
import { Link } from "react-router";

type DynamicHeaderProps = {
  title?: string;
  titleChild?: React.ReactNode;
} & JSX.IntrinsicElements["div"];

const LIST_TOKENS = [
  {
    name: "LOREM",
    cap: "5.0K",
  },
  {
    name: "DOLOR",
    cap: "15.5K",
  },
  {
    name: "SIT",
    cap: "25.8K",
  },
  {
    name: "AMET",
    cap: "50.1K",
  },
];

const DISPLAY_TIME = 2000;

export function DynamicHeader({ title, titleChild, className }: DynamicHeaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayed, setDisplayed] = useState(LIST_TOKENS[0].name);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % LIST_TOKENS.length);
    }, DISPLAY_TIME);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const item = LIST_TOKENS[currentIndex];
    setDisplayed(`$${item.name}: ${item.cap}`);
  }, [currentIndex]);

  return (
    <div
      className={cn("container mt-12 flex flex-row items-center justify-center gap-5", className)}
    >
      {title !== "Home" && <Link to="/">Home</Link>}
      {title && <p className="w-max">{title}</p>}
      {titleChild && titleChild}
      <ClientOnly>
        {() => <ScrambleText title={displayed} className="grow text-center" />}
      </ClientOnly>
      <ConnectWallet />
    </div>
  );
}

export function DynamicHeaderLooped({ title, className }: DynamicHeaderProps) {
  const [displayedTokens, setDisplayedTokens] = useState(LIST_TOKENS.map((token) => token.name));

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedTokens(
        (prev) => prev.map((_, index) => LIST_TOKENS[index].name + Math.random()) // Ensures re-render
      );
    }, DISPLAY_TIME);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn("container mt-12 flex flex-row items-center justify-center gap-5", className)}
    >
      <p className="w-max">{title}</p>
      <div className="flex gap-8 grow justify-center">
        <ClientOnly>
          {() => (
            <React.Fragment>
              {displayedTokens.map((token, index) => (
                <ScrambleText key={token} title={token.replace(/\d+\.\d+/, "")} />
              ))}
            </React.Fragment>
          )}
        </ClientOnly>
      </div>
      <Button className="w-max">Connect Wallet Soon</Button>
    </div>
  );
}
