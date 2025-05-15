import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [new PhantomWalletAdapter()];

<ConnectionProvider endpoint="https://api.devnet.solana.com">
  <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
    </WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
