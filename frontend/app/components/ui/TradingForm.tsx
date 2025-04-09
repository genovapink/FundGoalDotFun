import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BONDING_CURVE_ABI } from "~/constants/BONDING_CURVE_ABI";
import { decodeEventLog, parseEther } from "viem";
import { useFundWallet } from "@fund/wallet/provider";
import { ClientOnly } from "remix-utils/client-only";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { ButtonArrow, ButtonMagnet } from "@fund/button";
import { Button } from "@shadcn/button";
import { useCallback, useEffect } from "react";

interface TradingFormProps {
  type: "buy" | "sell";
  baseToken: { icon: string; name: string };
  quoteToken: { icon: string; name: string | null };
  balance: number;
  price: number;
  amount: string;
  setAmount: (amount: string) => void;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  setTxType: (type: "buy" | "sell") => void;
  bondingCurveAddress: `0x${string}`;
}

export const TradingForm = ({
  type,
  baseToken,
  quoteToken,
  balance,
  price,
  amount,
  setAmount,
  setIsOpen,
  setTxType,
  isOpen,
  bondingCurveAddress,
}: TradingFormProps) => {
  const { isConnected, connectors } = useFundWallet();
  const LIST_SHORTCUT = [25, 50, 75, 100];

  useEffect(() => {
    setTxType(type);
  }, [type, setTxType]);

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

  const { writeContract: tx, data: txHash } = useWriteContract();
  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const doTransactions = useCallback(async () => {
    try {
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: type === "buy" ? "buy" : "sell",
        value: type === "buy" ? parseEther(amount) : undefined,
      });
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }, [tx, bondingCurveAddress, type, amount]);

  useEffect(() => {
    if (txReceipt) {
      for (const log of txReceipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: BONDING_CURVE_ABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "Bought") {
            console.log("Buy successful", decoded.args);
          } else if (decoded.eventName === "Sold") {
            console.log("Sell successful", decoded.args);
          }
        } catch (error) {
          console.error("Decoding error:", error);
        }
      }
    }
  }, [txReceipt]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-base font-medium">Quantity</p>
      </div>

      <div className="relative">
        <div className="flex items-center border rounded-md p-2">
          <img
            src={displayToken.icon}
            alt={displayToken.name || ""}
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
            <ButtonMagnet
              onClick={() => doTransactions()}
              color={type === "buy" ? "green" : "pink"}
            >
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
