import { Box, Button, Grid, Modal, Paper, TextField } from "@mui/material";
import rock from '../../icons/stone.png'
import scissors from '../../icons/scissors.png'
import paper from '../../icons/new-document.png'
import styles from './Game.module.css'
import { Container } from "@mui/system";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { abi, items, currencies, style, contractAddress } from './constants';

export default function Game(props) {
    const { setIsStarted } = props;
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(0);
    const [currency, setCurrency] = useState();
    const [value, setValue] = useState(0);
    const [error, setError] = useState([false, ''])

    const { config } = usePrepareContractWrite({
        mode: 'recklesslyUnprepared',
        address: contractAddress,
        abi: abi,
        functionName: 'startGame',
        args: [currency?.[1] || currencies[0][1],
        item + 1, value],
        onError: (e) => {
            setError([true, e.message.slice(151, 151 + e.message.slice(151).indexOf('\"'))])
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    const selectItem = (item) => {
        setItem(item)
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false)
        setCurrency()
        setValue(0)
        setItem(0)
        setError([false, ''])
    }

    const startGame = () => {
        if (!value || !currency) {
            alert("Одно из значений пустое");
            return 0;
        }
        else {
            write()
        }
    }

    const handleChange = ({ target: { value } }) => {
        setValue(Number(value))
    }

    const selectCurrency = (currency) => {
        setCurrency(currencies[currency])
    }

    return (
        <div className={styles.game}>
            <Container>
                <div className={styles.playArea}>
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
                    onClose={handleClose}
                >
                    <Box sx={style}>
                        <h2>Выбранный элемент: {items[item]}</h2>
                        <p className={styles.modal}>Выберите монету, принимаемую в виде ставки:</p>
                        <Grid container justifyContent="space-around">
                            <Button onClick={() => selectCurrency(0)}>USDT</Button>
                            <Button onClick={() => selectCurrency(1)}>USDC</Button>
                            <Button onClick={() => selectCurrency(2)}>BUSD</Button>
                            <Button onClick={() => selectCurrency(3)}>BNB</Button>
                        </Grid>
                        {currency ? (<div className={styles.modal}>
                            <p>Выбранная монета: {currency[0]}</p>
                        </div>) : null}
                        <TextField type="number" onChange={handleChange} className={styles.modal} label="Введите количество" size="small" variant="outlined" fullWidth />
                        {error[1]?.length ? <span className={styles.error}>{error[1]}</span> : null}
                        <div className={styles.modal}>
                            <Grid container justifyContent="space-around">
                                <Button onClick={handleClose} variant="contained">Отменить выбор</Button>
                                <Button disabled={!value || !currency || error[0]} onClick={startGame} variant="contained">Подтвердить выбор</Button>
                            </Grid>
                        </div>
                    </Box>
                </Modal>
                </div>
            </Container>
        </div>
    )
}