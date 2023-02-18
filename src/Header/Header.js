import { Container } from '@mui/system'
import styles from './Header.module.css'
import { Web3Button, Web3Modal } from "@web3modal/react";
import { Grid } from '@mui/material';


export default function Header({ ethereumClient }) {

    return (
        <>
            <Container>
                <Grid container justifyContent='space-between' alignItems='center'>
                    <h1 className={styles.logo}>
                        Rock Paper Scissors
                    </h1>

                    <Web3Modal
                        themeMode='dark'
                        themeColor='orange'
                        themeBackground="gradient"
                        projectId="fce1807c0f933d7d40b1889b819f3ee1"
                        ethereumClient={ethereumClient}
                    />
                    <Web3Button icon='hide' />
                </Grid>
            </Container>
        </>
    )
}