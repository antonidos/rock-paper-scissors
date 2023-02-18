import { Button } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";

import { useAccount, useBalance } from 'wagmi'
import Game from "./Game/Game";

export default function Body(props) {
    const { address, isConnected } = useAccount()
    const [isStarted, setIsStarted] = useState(false)

    useEffect(() => {
        console.log(address)
        console.log(isConnected)
    }, [isConnected])

    return (
        <>
            {isConnected ?
                isStarted ?
                    <Game setIsStarted={setIsStarted} /> : (<Button
                        onClick={() => setIsStarted(true)}
                        variant="contained"
                        size="large"
                    >
                        Начать играть
                    </Button>)

                : (
                    <Container>
                        <h2>Данный сайт представляет собой децентрализованное прилоэение по всем известной игре "Камень-ножницы-бумага".
                            Для начала игры подключите свой кошелек к сайту.
                        </h2>
                    </Container>
                )}

        </>
    )
}