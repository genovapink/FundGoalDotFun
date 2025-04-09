import { createClient, http } from "viem";
import { createConfig } from "wagmi";
import { eduChainTestnet, sepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

export const WAGMI_CONFIG = createConfig({
  chains: [
    // sepolia
    eduChainTestnet,
  ],
  connectors: [injected(), metaMask()],
  ssr: true,
  transports: {
    // [sepolia.id]: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
    [eduChainTestnet.id]: http("https://rpc.open-campus-codex.gelato.digital"),
  },
  // client({ chain }) {
  //   return createClient({ chain, transport: http("https://...") });
  // },
});
