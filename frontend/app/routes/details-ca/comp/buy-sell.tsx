import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import { TradingForm } from "~/components/ui/TradingForm";
import { useFundWallet } from "@fund/wallet/provider";
import { formatUnits, type Address } from "viem"; // Format units used by Solana will be different
import { useBalance, useToken } from "wagmi"; // Wagmi might still be useful for wallet balance fetching

interface BuySellTabsProps {
  contractAddress: string;
  imageUrl: string;
  bondingCurveAddress: string;
}

export function BuySellTabs({ contractAddress, imageUrl, bondingCurveAddress }: BuySellTabsProps) {
  const [quoteTokenName, setQuoteTokenName] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>(""); // Amount input for buy/sell
  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxTypeInternal] = useState<"buy" | "sell">("buy");
  const user = useFundWallet(); // Assumes wallet context is correctly initialized
  const [balance, setBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const { data: tokenBalanceData } = useToken({
    address: contractAddress as Address,
  });

  // Fetch current price or any relevant bonding curve data
  const { data: currentPrice } = useBalance({
    address: bondingCurveAddress as Address,
  });

  const pairData = {
    baseToken: { icon: imageUrl, name: "SOL" },
    quoteToken: { icon: imageUrl, name: quoteTokenName },
    balance: txType === "buy" ? balance : tokenBalance,
    price: currentPrice ? parseFloat(formatUnits(currentPrice)) : 0,
  };

  const { data: dataBalance, refetch: refetchBalance } = useBalance({
    address: user?.address as Address,
  });

  const { data: dataToken, refetch: refetchToken } = useToken({
    address: contractAddress as Address,
  });

  const setTxType = (type: "buy" | "sell") => {
    setTxTypeInternal(type);
    setAmount(""); // Reset amount field
  };

  // UseEffect for setting token balance
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
    if (dataToken?.symbol) {
      setQuoteTokenName(dataToken.symbol);
    }
  }, [dataToken]);

  if (!quoteTokenName) {
    return <div className="text-center text-gray-500 py-10">Loading token info...</div>;
  }

  return (
    <Tabs
      defaultValue="buy"
      className="w-full"
      value={txType}
      onValueChange={(val) => {
        setTxType(val as "buy" | "sell");
        setAmount("");
      }}
    >
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
          bondingCurveAddress={bondingCurveAddress as string}
          contractAddress={contractAddress as string}
          refetchNativeBalance={refetchBalance}
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
          bondingCurveAddress={bondingCurveAddress as string}
          contractAddress={contractAddress as string}
          refetchNativeBalance={refetchBalance}
        />
      </TabsContent>
    </Tabs>
  );
}