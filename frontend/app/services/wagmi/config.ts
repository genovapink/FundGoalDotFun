import { createClient, http } from "viem";
import { createConfig } from "wagmi";
import { optimismSepolia } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";

export const WAGMI_CONFIG = createConfig({
  chains: [optimismSepolia],
  connectors: [injected(), metaMask()],
  ssr: true,
  client({ chain }) {
    return createClient({ chain, transport: http("https://...") });
  },
});
