import { Container } from '@mui/system'
import styles from './Header.module.css'
import {
    EthereumClient,
    modalConnectors,
    walletConnectProvider,
} from "@web3modal/ethereum";

import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { Grid } from '@mui/material';

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

export default function Header(props) {
      
    return (
        <header>
            <Container>
                <Grid container justifyContent='space-between' alignItems='center'>
                    <h1 className={styles.logo}>
                        Rock Paper Scissors
                    </h1>
                    <WagmiConfig client={wagmiClient} />
                    <Web3Modal
                        themeMode='dark'
                        themeColor='orange'
                        themeBackground= "gradient"
                        projectId="fce1807c0f933d7d40b1889b819f3ee1"
                        ethereumClient={ethereumClient}
                    />
                    <Web3Button icon='hide' />
                </Grid>
            </Container>
        </header>
    )
}