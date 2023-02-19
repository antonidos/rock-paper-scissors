import { Box, Button, Grid, Modal, Paper, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import rock from '../../icons/stone.png'
import scissors from '../../icons/scissors.png'
import paper from '../../icons/new-document.png'
import styles from './Game.module.css'
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { abiMyContract, abiErc20, items, currencies, style, contractAddress } from './constants';
import { toWei } from 'web3-utils';
import { MyContainedButton, MyTextField } from "../../stylizedComponents";


export default function Game(props) {
    const { setIsStarted, handleSnackbar } = props;
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(0);
    const [currency, setCurrency] = useState();
    const [value, setValue] = useState(0);
    const [error, setError] = useState([false, ''])

    const [alignment, setAlignment] = useState('left');

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const { config: startGameConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        functionName: 'startGame',
        args: [currency?.[1] || currencies[0][1],
        item + 1, value],
        onError: (e) => {
            const error = e.message.slice(151, 151 + e.message.slice(151).indexOf('\"'));
            setError([true, error])
            handleSnackbar('error', error)
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })
    const { write: startGameCall } = useContractWrite(startGameConfig)

    const { config: approveConfig } = usePrepareContractWrite({
        address: currency?.[1] || currencies[0][1],
        abi: abiErc20,
        functionName: 'approve',
        args: [contractAddress, "115792089237316195423570985008687907853269984665640564039457"],
        onError: (e) => {
            const error = e.message.slice(151, 151 + e.message.slice(151).indexOf('\"'));
            setError([true, error])
            handleSnackbar('error', error)
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })
    const { write: approveCall } = useContractWrite(approveConfig)

    const selectItem = (item) => {
        setItem(item)
        setOpen(true);
    }

    const infinityApprove = () => {
        approveCall()
    }

    const handleClose = () => {
        setOpen(false)
        setCurrency()
        setValue(0)
        setItem(0)
        setError([false, ''])
    }

    const startGame = () => {
        if (!value || !currency || value == 0) {
            alert("Одно из значений пустое");
            return 0;
        }
        else {
            startGameCall()
        }
    }

    const handleChange = ({ target: { value } }) => {
        if (value) setValue(toWei(value))
        else setValue(0)
    }

    const selectCurrency = (currency) => {
        setCurrency(currencies[currency])
    }

    return (
        <>
            <div className={styles.playArea}>
                <h2 className={styles.gameTitle}>Выберите элемент:</h2>
                <Grid sx={{ mb: "50px" }} container justifyContent="space-around">
                    <Paper onClick={() => selectItem(0)} className={styles.paper}><img className={styles.icon} src={rock}></img></Paper>
                    <Paper onClick={() => selectItem(1)} className={styles.paper}><img className={styles.icon} src={scissors}></img></Paper>
                    <Paper onClick={() => selectItem(2)} className={styles.paper}><img className={styles.icon} src={paper}></img></Paper>
                </Grid>
                <MyContainedButton
                    onClick={() => setIsStarted(false)}
                >
                    Прервать игру
                </MyContainedButton>
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box sx={style}>
                        <h2>Выбранный элемент: <span className={styles.strongText}>{items[item]}</span></h2>
                        <p className={styles.modal}>Выберите монету, принимаемую в виде ставки:</p>
                        <ToggleButtonGroup
                            exclusive
                            className={styles.modal}
                            value={alignment}
                            onChange={handleAlignment}>
                            <ToggleButton value="USDT" onClick={() => selectCurrency(0)}>USDT</ToggleButton >
                            <ToggleButton value="USDC" onClick={() => selectCurrency(1)}>USDC</ToggleButton >
                            <ToggleButton value="BUSD" onClick={() => selectCurrency(2)}>BUSD</ToggleButton >
                            <ToggleButton value="BNB" onClick={() => selectCurrency(3)}>BNB</ToggleButton >
                        </ToggleButtonGroup>
                        {currency ? (<Grid spacing={2} container alignItems='center' sx={{ marginBottom: "10px" }}>
                            <Grid item><p>Выбранная монета: <span className={styles.strongText}>{currency[0]}</span></p></Grid>
                            {error[1]?.includes("approve") ?
                                <Grid item>
                                    <MyContainedButton onClick={infinityApprove}>Approve</MyContainedButton>
                                </Grid>
                                : null}
                        </Grid>) : null}
                        <MyTextField type="number" onChange={handleChange} className={styles.modal} label="Введите количество" size="small" variant="outlined" fullWidth />
                        {error[1]?.length ? <span className={styles.error}>{error[1]}</span> : null}
                        <div className={styles.modal}>
                            <Grid container justifyContent="space-around">
                                <MyContainedButton onClick={handleClose}>Отменить выбор</MyContainedButton>
                                <Button color="success" disabled={!value || !currency || error[0] || value == 0} onClick={startGame} variant="contained">Подтвердить выбор</Button>
                            </Grid>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    )
}