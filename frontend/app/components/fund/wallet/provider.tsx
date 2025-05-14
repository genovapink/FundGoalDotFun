import { createContext, useContext, useMemo } from "react";
import {
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import type { WalletContextState } from "@solana/wallet-adapter-react/lib/types/wallet";
import type { PublicKey } from "@solana/web3.js";

export interface FundWalletContextType {
  connectors: WalletContextState["wallets"];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  address: string;
  isConnected: boolean;
}

const FundWalletContext = createContext<FundWalletContextType | null>(null);

export function FundWalletProvider({ children }: { children: React.ReactNode }) {
  const { wallets: connectors, connect, disconnect, publicKey, connected } = useWallet();

  const address = useMemo(() => publicKey?.toBase58() ?? "", [publicKey]);

  return (
    <FundWalletContext.Provider
      value={{
        connectors,
        connect,
        disconnect,
        address,
        isConnected: connected,
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