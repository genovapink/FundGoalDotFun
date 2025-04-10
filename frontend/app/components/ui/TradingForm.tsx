import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BONDING_CURVE_ABI } from "~/constants/BONDING_CURVE_ABI";
import { decodeEventLog, maxUint256, parseEther, parseUnits } from "viem";
import { useFundWallet } from "@fund/wallet/provider";
import { ClientOnly } from "remix-utils/client-only";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { ButtonArrow, ButtonMagnet } from "@fund/button";
import { Button } from "@shadcn/button";
import { useCallback, useEffect } from "react";
import { ERC20_ABI } from "~/constants/ERC20_ABI";

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
  contractAddress: `0x${string}`;
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
  contractAddress,
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
    const adjustedPercentage = percentage === 100 ? 98 : percentage; // to avoid 100% for trade, we need gas
    const calculatedAmount = (balance * adjustedPercentage) / 100;

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

  const { writeContract: approve, data: txApprove } = useWriteContract();
  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: txApprove,
  });

  const handleApprove = () => {
    try {
      approve({
        abi: ERC20_ABI,
        address: contractAddress,
        functionName: "approve",
        args: [bondingCurveAddress, maxUint256],
      });
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  const doTransactions = useCallback(async () => {
    try {
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: "buy",
        value: parseEther(amount),
      });
    } catch (error) {
      console.error("Transaction error:", error);
    }
  }, [tx, bondingCurveAddress, type, amount]);

  useEffect(() => {
    const tokenAmount = parseUnits(amount, 18);

    if (approveReceipt?.status === "success") {
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: "sell",
        args: [tokenAmount],
      });
    }
  }, [approveReceipt]);

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
            src={
              type === "buy"
                ? "/logo-color.png"
                : displayToken.icon === ""
                  ? "/logo-color.png"
                  : displayToken.icon
            }
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
              onClick={() => (type === "sell" ? handleApprove() : doTransactions())}
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
