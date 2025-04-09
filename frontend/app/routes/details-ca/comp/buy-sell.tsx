import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";
import { useFundWallet } from "@fund/wallet/provider";
import { ClientOnly } from "remix-utils/client-only";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { ButtonArrow, ButtonMagnet } from "@fund/button";
import { Button } from "@shadcn/button";
import { getToken } from "@wagmi/core";
import { WAGMI_CONFIG } from "@services/wagmi/config";

// WIP: need to change to real flow
interface TradingFormProps {
  type: "buy" | "sell";
  baseToken: { icon: string; name: string };
  quoteToken: { icon: string; name: string };
  balance: number;
  price: number;
}

interface BuySellTabsProps {
  contractAddress: string;
}

const TradingForm = ({ type, baseToken, quoteToken, balance, price }: TradingFormProps) => {
  const { isConnected, connectors } = useFundWallet();

  const LIST_SHORTCUT = [25, 50, 75, 100];

  const [amount, setAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const displayToken = type === "buy" ? baseToken : quoteToken;
  const balanceToken = type === "buy" ? baseToken : quoteToken;
  const receiveToken = type === "buy" ? quoteToken : baseToken;

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
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-base font-medium">Quantity</p>
      </div>

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
        Available: {isConnected ? `${balance.toFixed(2)} ${balanceToken.name}` : "0"}
      </div>

      <div className="flex flex-row gap-2">
        {LIST_SHORTCUT.map((val, idx) => (
          <Button key={idx} onClick={() => setPercentage(val)} variant="outline" className="flex-1">
            {val == 100 ? "MAX" : val + "%"}
          </Button>
        ))}
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between text-sm">
          <span>What you receive:</span>
          <span>
            {receiveAmount} {receiveToken.name}
          </span>
        </div>
      </div>

      <ClientOnly>
        {() =>
          isConnected ? (
            <ButtonMagnet onClick={() => setIsOpen(true)} color={type === "buy" ? "green" : "pink"}>
              {type === "buy" ? `Buy ` : `Sell `}
            </ButtonMagnet>
          ) : (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <ClientOnly>
                {() => (
                  <ButtonMagnet
                    onClick={() => setIsOpen(true)}
                    color={type === "buy" ? "green" : "pink"}
                  >
                    Connect Wallet
                  </ButtonMagnet>
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

export function BuySellTabs({ contractAddress }: BuySellTabsProps) {
  const [quoteTokenName, setQuoteTokenName] = useState<string | null>(null);

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

  const pairData = {
    baseToken: { icon: "https://placehold.co/50", name: "EDU" },
    quoteToken: { icon: "https://placehold.co/50", name: quoteTokenName },
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
        <TradingForm type="buy" {...pairData} />
      </TabsContent>
      <TabsContent value="sell" className="mt-4">
        <TradingForm type="sell" {...pairData} />
      </TabsContent>
    </Tabs>
  );
}
