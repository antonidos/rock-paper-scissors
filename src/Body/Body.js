import { Container } from "@mui/system";
import { useEffect } from "react";

import { useAccount, useConnect } from 'wagmi'

export default function Body() {
    const { address, isConnected } = useAccount()
    useEffect(() => {
        console.log(address)
        console.log(isConnected)
    }, [isConnected])
    return (
        <body>
            {isConnected ? (
                <Container>

                </Container>
            ) : (
                <Container>
                    <h1>Вы не подключили кошелёк</h1>
                </Container>
            )}

        </body>
    )
}