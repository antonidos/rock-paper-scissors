import { Box, Button, Grid, Modal, Paper } from "@mui/material";
import rock from '../../icons/stone.png'
import scissors from '../../icons/scissors.png'
import paper from '../../icons/new-document.png'
import styles from './Game.module.css'
import { Container } from "@mui/system";
import { useState } from "react";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Game(props) {
    const { setIsStarted } = props;
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState();
    const items = ["камень", "ножницы", "бумага"]

    const selectItem = (item) => {
        setItem(items[item])
        setOpen(true);
    }

    return (
        <div className={styles.game}>
            <Container>
                <h2 className={styles.gameTitle}>Выберите элемент:</h2>
                <Grid container justifyContent="space-around">
                    <Paper onClick={() => selectItem(0)} className={styles.paper}><img className={styles.icon} src={rock}></img></Paper>
                    <Paper onClick={() => selectItem(1)} className={styles.paper}><img className={styles.icon} src={scissors}></img></Paper>
                    <Paper onClick={() => selectItem(2)} className={styles.paper}><img className={styles.icon} src={paper}></img></Paper>
                </Grid>
                <Button
                    onClick={() => setIsStarted(false)}
                    sx={{ mt: "50px" }}
                    variant="contained"
                >
                    Прервать игру
                </Button>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                >
                    <Box sx={style}>
                        <h2>Выбранный элемент: {item}</h2>
                        Выберите монету, принимаемую в виде ставки:
                        <Grid container justifyContent="space-around">
                            <Paper>USDT</Paper>
                            <Paper>USDC</Paper>
                            <Paper>BUSD</Paper>
                            <Paper>BNB</Paper>
                        </Grid>
                        <Grid container justifyContent="space-around">
                            <Button onClick={() => setOpen(false)} variant="contained">Отменить выбор</Button>
                            <Button variant="contained">Подтвердить выбор</Button>
                        </Grid>
                    </Box>
                </Modal>
            </Container>
        </div>
    )
}