import './App.css';
import Header from './Header/Header';
import Body from './Body/Body';
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
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
const wagmiClient = createClient({
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
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {

  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <Header ethereumClient={ethereumClient} />
        <Body />
      </WagmiConfig>
    </div>
  );
}

export default App;
