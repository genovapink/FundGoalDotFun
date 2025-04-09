import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import { TradingForm } from "~/components/ui/TradingForm";
import { useFundWallet } from "@fund/wallet/provider";
import { formatEther, type Address } from "viem";
import { useBalance, useReadContract, useToken } from "wagmi";
import { BONDING_CURVE_ABI } from "~/constants/BONDING_CURVE_ABI";
import { ERC20_ABI } from "~/constants/ERC20_ABI";

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
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const { data: tokenBalanceData } = useReadContract({
    abi: ERC20_ABI,
    address: contractAddress as `0x${string}`,
    functionName: "balanceOf",
    args: [user.address as `0x${string}`],
  });

  const { data: currentPrice } = useReadContract({
    abi: BONDING_CURVE_ABI,
    address: bondingCurveAddress as `0x${string}`,
    functionName: "getCurrentPrice",
  });

  const pairData = {
    baseToken: { icon: imageUrl, name: "EDU" },
    quoteToken: { icon: imageUrl, name: quoteTokenName },
    balance: txType === "buy" ? balance : tokenBalance,
    price:
      currentPrice && typeof currentPrice === "bigint" ? parseFloat(formatEther(currentPrice)) : 0,
  };

  const { data: dataBalance, refetch: refetchBalance } = useBalance({
    address: user?.address as Address,
  });

  const { data: dataToken, refetch: refetchToken } = useToken({
    address: contractAddress as Address,
  });

  useEffect(() => {
    if (tokenBalanceData && typeof tokenBalanceData === "bigint") {
      const balanceInEther = parseFloat(formatEther(tokenBalanceData));
      setTokenBalance(balanceInEther);
    }
  }, [tokenBalanceData]);

  useEffect(() => {
    if (dataBalance?.formatted) {
      setBalance(parseFloat(dataBalance.formatted));
    }
  }, [dataBalance]);

  useEffect(() => {
    refetchToken();
  }, [contractAddress]);

  useEffect(() => {
    if (dataToken?.symbol) {
      setQuoteTokenName(dataToken.symbol);
      console.log("symbol", dataToken.symbol);
    }
  }, [dataToken]);

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
          contractAddress={contractAddress as `0x${string}`}
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
          contractAddress={contractAddress as `0x${string}`}
        />
      </TabsContent>
    </Tabs>
  );
}
