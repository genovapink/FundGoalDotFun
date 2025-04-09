import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";

import { getBalance, getToken } from "@wagmi/core";
import { WAGMI_CONFIG } from "@services/wagmi/config";
import { TradingForm } from "~/components/ui/TradingForm";
import { useFundWallet } from "@fund/wallet/provider";
import { formatEther, parseUnits } from "viem";

interface BuySellTabsProps {
  contractAddress: string;
  imageUrl: string;
  bondingCurveAddress: `0x${string}`;
}

export function BuySellTabs({ contractAddress, imageUrl, bondingCurveAddress }: BuySellTabsProps) {
  const [quoteTokenName, setQuoteTokenName] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState<"buy" | "sell">("buy");
  const user = useFundWallet();
  const [balance, setBalance] = useState<number>(0);

  const pairData = {
    baseToken: { icon: imageUrl, name: "EDU" },
    quoteToken: { icon: imageUrl, name: quoteTokenName },
    balance,
    price: 3000,
  };

  useEffect(() => {
    getBalance(WAGMI_CONFIG, {
      address: user?.address as `0x${string}`,
    }).then((data) => {
      if (data?.value) {
        const eth = parseFloat(formatEther(data.value));
        setBalance(eth);
      }
    });
  }, [user]);

  useEffect(() => {
    getToken(WAGMI_CONFIG, {
      address: contractAddress as `0x${string}`,
    }).then((data) => {
      if (data?.symbol) setQuoteTokenName(data.symbol);
    });
  }, [contractAddress]);

  if (!quoteTokenName) {
    return <div className="text-center text-gray-500 py-10">Loading token info...</div>;
  }

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="buy" className="cursor-pointer">
          Buy
        </TabsTrigger>
        <TabsTrigger value="sell" className="cursor-pointer">
          Sell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="buy" className="mt-4">
        <TradingForm
          type="buy"
          {...pairData}
          amount={amount}
          setAmount={setAmount}
          setIsOpen={setIsOpen}
          setTxType={setTxType}
          isOpen={isOpen}
          bondingCurveAddress={bondingCurveAddress as `0x${string}`}
        />
      </TabsContent>
      <TabsContent value="sell" className="mt-4">
        <TradingForm
          type="sell"
          {...pairData}
          amount={amount}
          setAmount={setAmount}
          setIsOpen={setIsOpen}
          setTxType={setTxType}
          isOpen={isOpen}
          bondingCurveAddress={bondingCurveAddress as `0x${string}`}
        />
      </TabsContent>
    </Tabs>
  );
}
