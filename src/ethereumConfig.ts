import { bscTestnet } from "wagmi/chains";
import { configureChains, createClient } from "wagmi";
import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
  } from "@web3modal/ethereum";

const chains = [bscTestnet];

// Wagmi client
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "fce1807c0f933d7d40b1889b819f3ee1" }),
]);
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: "fce1807c0f933d7d40b1889b819f3ee1",
    version: "1", // or "2"
    appName: "rock-paper-scissors",
    chains,
  }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, chains);