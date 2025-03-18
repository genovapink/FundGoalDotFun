import { createContext, useContext, useState } from "react";
import type { Address } from "viem";
import { useAccount, useConnect, useDisconnect, type Config } from "wagmi";
import type { ConnectMutate } from "wagmi/query";

export interface FundWalletContextType {
  // isOpen: boolean;
  // setIsOpen: (isOpen: boolean) => void;
  connectors: Config["connectors"];
  connect: ConnectMutate<Config, unknown>;
  disconnect: () => void;
  address: Address;
  isConnected: boolean;
}

const FundWalletContext = createContext<FundWalletContextType | null>(null);

export function FundWalletProvider({ children }: { children: React.ReactNode }) {
  // const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <FundWalletContext.Provider
      value={{
        // isOpen,
        // setIsOpen,
        address: address ?? "0x0",
        isConnected,
        connectors,
        connect,
        disconnect,
      }}
    >
      {children}
    </FundWalletContext.Provider>
  );
}

export function useFundWallet() {
  const context = useContext(FundWalletContext);
  if (!context) {
    throw new Error("useFundWallet must be used within a FundWalletProvider");
  }
  return context;
}
