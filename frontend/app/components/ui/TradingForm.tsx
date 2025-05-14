import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { decodeEventLog, maxUint256, parseEther, parseUnits } from "viem";
import { useFundWallet } from "@fund/wallet/provider";
import { ClientOnly } from "remix-utils/client-only";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@shadcn/drawer";
import { ButtonArrow, ButtonMagnet } from "@fund/button";
import { Button } from "@shadcn/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TradingFormProps {
  type: "buy" | "sell";
  baseToken: { icon: string; name: string };
  quoteToken: { icon: string; name: string | null };
  balance: number;
  amount: string;
  setAmount: (amount: string) => void;
  setIsOpen: (open: boolean) => void;
  isOpen: boolean;
  setTxType: (type: "buy" | "sell") => void;
  bondingCurveAddress: `0x${string}`;
  contractAddress: `0x${string}`;
  refetchNativeBalance?: () => void;
}

export const TradingForm = ({
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
  refetchNativeBalance,
}: TradingFormProps) => {
  const { isConnected, connectors } = useFundWallet();
  const LIST_SHORTCUT = [25, 50, 75, 100];

  const displayToken = type === "buy" ? baseToken : quoteToken;
  const balanceToken = type === "buy" ? baseToken : quoteToken;
  const receiveToken = type === "buy" ? quoteToken : baseToken;

  const { address: userAddress } = useFundWallet();
  const shouldExecuteAfterApprove = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { data: contractReturn } = useReadContract({
    abi: BONDING_CURVE_ABI,
    address: bondingCurveAddress,
    functionName: type === "buy" ? "calculateBuyReturn" : "calculateSellReturn",
    args: [parseUnits(amount || "0", 18)],
    query: {
      enabled: !!amount && Number(amount) > 0,
    },
  });

  const receiveAmount =
    !amount || Number(amount) <= 0
      ? "0.00"
      : contractReturn
        ? (Number(contractReturn) / 1e18).toFixed(2)
        : "Calculating...";

  // Allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    abi: ERC20_ABI,
    address: contractAddress,
    functionName: "allowance",
    args: [userAddress, bondingCurveAddress],
    query: {
      enabled: !!userAddress && !!bondingCurveAddress,
    },
  });

  // Approve
  const {
    writeContract: approve,
    data: txApprove,
    isPending: isApprovePending,
    error: approveError,
    reset: resetApprove,
  } = useWriteContract();

  const { data: approveReceipt } = useWaitForTransactionReceipt({
    hash: txApprove,
  });

  // Tx
  const {
    writeContract: tx,
    data: txHash,
    isPending: isTxPending,
    error: txError,
    reset: resetTx,
  } = useWriteContract();

  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Check balance
  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    abi: ERC20_ABI,
    address: contractAddress,
    functionName: "balanceOf",
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  });

  const doTransactions = async () => {
    try {
      const tokenAmount = parseUnits(amount, 18);
      setIsSubmitting(true);

      const needsApproval =
        type === "sell" &&
        currentAllowance !== undefined &&
        currentAllowance !== null &&
        BigInt(currentAllowance.toString()) < tokenAmount;

      if (needsApproval) {
        toast.info("Approving tokens...");
        shouldExecuteAfterApprove.current = true;
        approve({
          abi: ERC20_ABI,
          address: contractAddress,
          functionName: "approve",
          args: [bondingCurveAddress, maxUint256],
        });
        return;
      }

      toast.info(`Processing ${type} transaction...`);
      shouldExecuteAfterApprove.current = false;
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: type,
        ...(type === "sell" && { args: [tokenAmount] }),
        ...(type === "buy" && { value: parseEther(amount) }),
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
    if (approveReceipt?.status === "success" && shouldExecuteAfterApprove.current) {
      toast.success("Approval successful!");

      const tokenAmount = parseUnits(amount, 18);
      tx({
        abi: BONDING_CURVE_ABI,
        address: bondingCurveAddress,
        functionName: type,
        ...(type === "sell" && { args: [tokenAmount] }),
        ...(type === "buy" && { value: parseEther(amount) }),
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
            topics: log.topics,
          });

          if (decoded.eventName === "Bought") {
            setTimeout(() => toast.success("Buy successful! 🥳"), 3000);
            refetchBalance?.();
            refetchNativeBalance?.();
          } else if (decoded.eventName === "Sold") {
            setTimeout(() => toast.success("Sell successful! 🥳"), 3000);
            refetchBalance?.();
            refetchNativeBalance?.();
          }
        } catch (error) {
          console.error("Decoding error:", error);
        }
      }
    }
  }, [txReceipt]);

  useEffect(() => {
    if (approveReceipt?.status === "success") {
      refetchAllowance?.();
    }
  }, [approveReceipt]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-base font-medium">Quantity</p>
      </div>

      <div className="relative">
        <div className="flex items-center border rounded-md p-2">
          <img
            src={displayToken.icon === "" ? "/logo-color.png" : displayToken.icon}
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
        Available:{" "}
        {isConnected
          ? type === "buy"
            ? `${balance.toFixed(4)} ${balanceToken.name}`
            : `${tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(4) : "0.00"} ${balanceToken.name}`
          : "0"}
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
              disabled={isApprovePending || isSubmitting}
            >
              {isApprovePending
                ? "Approving..."
                : isSubmitting
                  ? "Processing..."
                  : type === "buy"
                    ? "Buy"
                    : "Sell"}
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