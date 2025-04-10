import { Button } from "@shadcn/button";
import { useEffect, useState, type JSX } from "react";
import { cn } from "~/utils/cn";
import { ClientOnly } from "remix-utils/client-only";
import { ScrambleText } from "./scramble-text";
import React from "react";
import { ConnectWallet } from "./wallet/connect-wallet";

type DynamicHeaderProps = {
  titleChild?: React.ReactNode;
  listTokens: Record<string, unknown>[];
} & JSX.IntrinsicElements["div"];

const DISPLAY_TIME = 2000;

export function DynamicHeader({ listTokens, titleChild, className }: DynamicHeaderProps) {
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

  return (
    <div
      className={cn("container mt-12 flex flex-row items-center justify-center gap-5", className)}
    >
      <img src="/logo-long-white-1.png" className="h-11" />
      {titleChild && titleChild}
      <ClientOnly>
        {() => <ScrambleText title={`${displayed}K`} className="grow text-center" />}
      </ClientOnly>
      <ConnectWallet />
    </div>
  );
}

// export function DynamicHeaderLooped({ title, className }: DynamicHeaderProps) {
//   const [displayedTokens, setDisplayedTokens] = useState(LIST_TOKENS.map((token) => token.name));

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDisplayedTokens(
//         (prev) => prev.map((_, index) => LIST_TOKENS[index].name + Math.random()) // Ensures re-render
//       );
//     }, DISPLAY_TIME);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       className={cn("container mt-12 flex flex-row items-center justify-center gap-5", className)}
//     >
//       <p className="w-max">{title}</p>
//       <div className="flex gap-8 grow justify-center">
//         <ClientOnly>
//           {() => (
//             <React.Fragment>
//               {displayedTokens.map((token, index) => (
//                 <ScrambleText key={token} title={token.replace(/\d+\.\d+/, "")} />
//               ))}
//             </React.Fragment>
//           )}
//         </ClientOnly>
//       </div>
//       <Button className="w-max">Connect Wallet Soon</Button>
//     </div>
//   );
// }
