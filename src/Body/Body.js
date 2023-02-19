import { Button } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import styles from './Game/Game.module.css'

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import Game from "./Game/Game";
import { MyContainedButton } from "../stylizedComponents";

export default function Body(props) {
    const { address, isConnected } = useAccount()
    const [isStarted, setIsStarted] = useState(false)
    const { switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();
    

    useEffect(() => {
        if (chain) {
            if (chain?.id !== 97) switchNetwork?.(97) 
        }
    }, [chain, switchNetwork])

    useEffect(() => {
        console.log(address)
        console.log(isConnected)
    }, [isConnected])

    return (
        <Container className={styles.game}>
            {isConnected ?
                chain.id === 97 ? (
                    isStarted ? (
                        <Game setIsStarted={setIsStarted} handleSnackbar={props.handleSnackbar} />
                    )
                        : (<MyContainedButton
                            onClick={() => setIsStarted(true)}
                            size="large"
                        >
                            Начать играть
                        </MyContainedButton>)
                )
                    : <h2>Необходимо сменить сеть на Binance Smart Chain Testnet</h2>
                : (
                        <h2>Данный сайт представляет собой децентрализованное приложение по всем известной игре "Камень-ножницы-бумага".
                            Для начала игры подключите свой кошелек к сайту.
                        </h2>
                )}

        </Container>
    )
}