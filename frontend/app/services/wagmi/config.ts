import { createClient, http } from "viem";
import { createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

export const WAGMI_CONFIG = createConfig({
  chains: [sepolia],
  connectors: [injected(), metaMask()],
  ssr: true,
  transports: {
    [sepolia.id]: http("https://sepolia.infura.io/v3/ff13c1b25d9f4e939b5143372e0f5f41"),
  },
  // client({ chain }) {
  //   return createClient({ chain, transport: http("https://...") });
  // },
});
