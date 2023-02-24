import { Container } from "@mui/system";
import { useEffect, useState } from "react";

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import Game from "./Game/Game";
import { MyContainedButton } from "../stylizedComponents";
import * as React from "react";
import { VariantType } from "notistack";

interface BodyProps {
    handleSnackbar: (variant: VariantType, body: any) => void
}

export default function Body(props: BodyProps) {
    const { address, isConnected } = useAccount()
    const [isStarted, setIsStarted] = useState(false)
    const { chains, switchNetwork } = useSwitchNetwork();
    const { chain } = useNetwork();

    useEffect(() => {
        if (chain) {
            if (chain?.id !== 97) switchNetwork?.(97) 
        }
    }, [chain, switchNetwork])

    return (
        <Container className='game'>
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
                        <h3>Данный сайт представляет собой децентрализованное приложение по всем известной игре "Камень-ножницы-бумага".
                            В данном приложении вы соревнуетесь со специальной программой - смартконтрактом.
                            Каждая игра выполняется в блокчейне, в следствии этого вы можете убедиться в честности и 
                            открытости метода выбора случайного числа.
                            <br/><br/>
                            Для начала игры подключите свой кошелек к сайту.
                        </h3>
                )}

        </Container>
    )
}