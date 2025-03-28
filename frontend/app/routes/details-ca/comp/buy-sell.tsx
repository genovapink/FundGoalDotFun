import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import { useFundWallet } from "@fund/wallet/provider";
import { ClientOnly } from "remix-utils/client-only";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { ButtonArrow } from "@fund/button";

// WIP: need to change to real flow
interface TradingFormProps {
  type: "buy" | "sell";
  baseToken: { icon: string; name: string };
  quoteToken: { icon: string; name: string };
  balance: number;
  price: number;
}

const TradingForm = ({ type, baseToken, quoteToken, balance, price }: TradingFormProps) => {
  const { isConnected, connectors } = useFundWallet();
  const [amount, setAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const displayToken = type === "buy" ? baseToken : quoteToken;
  const balanceToken = type === "buy" ? quoteToken : baseToken;
  const receiveToken = type === "buy" ? baseToken : quoteToken;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setAmount(value);
    }
  };

  const setPercentage = (percentage: number) => {
    const calculatedAmount = (balance * percentage) / 100 / (type === "buy" ? price : 1);
    setAmount(calculatedAmount.toFixed(2));
  };

  const receiveAmount = amount
    ? type === "buy"
      ? (Number(amount) * price).toFixed(2)
      : (Number(amount) / price).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center border rounded-md p-2">
          <img
            src={displayToken.icon}
            alt={displayToken.name}
            className="w-6 h-6 mr-2 rounded-xl"
          />
          <span className="mr-2">{displayToken.name}</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full outline-none"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Available: {balance.toFixed(2)} {balanceToken.name}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setPercentage(25)}
          className="flex-1 py-1 px-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 cursor-pointer"
        >
          25%
        </button>
        <button
          onClick={() => setPercentage(50)}
          className="flex-1 py-1 px-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 cursor-pointer"
        >
          50%
        </button>
        <button
          onClick={() => setPercentage(75)}
          className="flex-1 py-1 px-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 cursor-pointer"
        >
          75%
        </button>
        <button
          onClick={() => setPercentage(100)}
          className="flex-1 py-1 px-2 bg-gray-800 text-gray-200 rounded hover:bg-gray-700 cursor-pointer"
        >
          Max
        </button>
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between text-sm">
          <span>You {type === "buy" ? "receive" : "spend"}:</span>
          <span>
            {receiveAmount} {receiveToken.name}
          </span>
        </div>
      </div>

      <ClientOnly>
        {() =>
          isConnected ? (
            <button
              className={`w-full py-2 rounded cursor-pointer ${
                type === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              {type === "buy" ? "Buy" : "Sell"} {baseToken.name}
            </button>
          ) : (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <ClientOnly>
                {() => (
                  <button
                    onClick={() => setIsOpen(true)}
                    className={`w-full py-2 rounded cursor-pointer ${
                      type === "buy"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    Connect Wallet
                  </button>
                )}
              </ClientOnly>
              <DrawerContent className="pb-10">
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle className="text-center font-bold">Connect a Wallet</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-10">
                    {connectors.map((connector) => (
                      <ButtonArrow
                        key={connector.id}
                        onClick={() => connector.connect()}
                        iconB64={connector.icon}
                        direction="left"
                        className="w-max"
                      >
                        {connector.name}
                      </ButtonArrow>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )
        }
      </ClientOnly>
    </div>
  );
};

export function BuySellTabs() {
  // WIP: change to real data
  const pairData = {
    baseToken: { icon: "https://placehold.co/50", name: "ETH" },
    quoteToken: { icon: "https://placehold.co/50", name: "USDC" },
    balance: 1000,
    price: 3000,
  };

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
          baseToken={pairData.baseToken}
          quoteToken={pairData.quoteToken}
          balance={pairData.balance}
          price={pairData.price}
        />
      </TabsContent>
      <TabsContent value="sell" className="mt-4">
        <TradingForm
          type="sell"
          baseToken={pairData.baseToken}
          quoteToken={pairData.quoteToken}
          balance={pairData.balance}
          price={pairData.price}
        />
      </TabsContent>
    </Tabs>
  );
}
