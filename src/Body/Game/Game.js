import { Box, Button, Grid, Modal, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import rock from '../../icons/stone.png'
import scissors from '../../icons/scissors.png'
import paper from '../../icons/new-document.png'
import styles from './Game.module.css'
import { ethers } from 'ethers';
import { useEffect, useState } from "react";
import { useAccount, useContractEvent, useContractWrite, usePrepareContractWrite } from 'wagmi'
import { abiMyContract, abiErc20, items, currencies, style, contractAddress } from './constants';
import { fromWei, toWei } from 'web3-utils';
import { MyContainedButton, MyTextField } from "../../stylizedComponents";

const provider = new ethers.providers.Web3Provider(window.ethereum)
const { ethereum } = window;

export default function Game(props) {
    const { setIsStarted, handleSnackbar } = props;
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(0);
    const [currency, setCurrency] = useState(currencies[0]);
    const [value, setValue] = useState(0);
    const [error, setError] = useState([false, '']);
    const [balance, setBalance] = useState(0);
    const [enabled, setEnabled] = useState({
        bnb: false,
        erc20: true
    })

    const { address } = useAccount()

    // useEffect(() => {
    //     console.log(ethereum)
    //     console.log(provider)
    // }, [])

    useContractEvent({
        address: contractAddress,
        abi: abiMyContract,
        eventName: 'GameEnd',
        listener(data, player, result) {
            if (player === address) {
                if (result === 0) handleSnackbar('success', 'К сожалению, вы проиграли')
                if (result === 1) handleSnackbar('success', 'Ничья! Попробуете еще раз?')
                if (result === 2) handleSnackbar('success', 'Вы выиграли, поздравляем!')
            }
        },
    })

    const [alignment, setAlignment] = useState(currencies[0][0]);

    const handleAlignment = (event, newAlignment) => {
        setAlignment(newAlignment);
    };

    const getBalance = async (token) => {
        if (token) {
            const contract = new ethers.Contract(token, [
                'function balanceOf(address) public view returns (uint256)'
            ], provider)
            const result = await contract.balanceOf(address)
            setBalance(Math.floor(fromWei(result.toString()) * 100) / 100)
        }
        else {
            const result = await provider.getBalance(address)
            setBalance(Math.floor(fromWei(result.toString()) * 100) / 100)
        }
    }

    const { startGameBnbConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        enabled: enabled.bnb,
        functionName: 'startGameBnb',
        args: [item + 1],
        overrides: {
            value: value
        },
        onError: (e) => {
            const error = e?.error?.data?.message || e.data.message;
            setError([true, error])
            handleSnackbar('error', error)
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })

    const { write: startGameBnbCall } = useContractWrite({
        ...startGameBnbConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Транзакция была успешно отправлена")
        }
    })

    const { config: startGameConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        enabled: enabled.erc20,
        functionName: 'startGame',
        args: [currency?.[1],
        item + 1, value],
        onError: (e) => {
            const error = e?.error?.data?.message || e.data.message;
            setError([true, error])
            handleSnackbar('error', error)
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })
    const { write: startGameCall } = useContractWrite({
        ...startGameConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Транзакция была успешно отправлена")
        }
    })

    const { config: approveConfig } = usePrepareContractWrite({
        address: currency?.[1] || currencies[0][1],
        abi: abiErc20,
        functionName: 'approve',
        args: [contractAddress, "115792089237316195423570985008687907853269984665640564039457"],
        onError: (e) => {
            const error = e.error.data.message;
            setError([true, error])
            handleSnackbar('error', error)
        },
        onSuccess(data) {
            if (error[0]) setError([false, ''])
        }
    })
    const { write: approveCall } = useContractWrite({
        ...approveConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Токен одобрен")
        }
    })

    const selectItem = (item) => {
        setItem(item);
        setOpen(true);
        getBalance(currencies[currencies.indexOf(currency)][1])
    }

    const infinityApprove = () => {
        approveCall()
    }

    const handleClose = () => {
        setOpen(false)
        setValue(0)
        setItem(0)
        setError([false, ''])
    }

    const startGame = () => {
        if (!value || !currency || value === 0) {
            alert("Одно из значений пустое");
            return 0;
        }
        else {
            if (currencies.indexOf(currency) !== 3) startGameCall();
            else startGameBnbCall()
        }
    }

    const handleChange = ({ target: { value } }) => {
        if (value) setValue(toWei(value))
        else setValue(0)
    }

    const selectCurrency = (currency) => {
        if(currency !== 3) setEnabled({erc20: true, bnb: false})
        else setEnabled({erc20: false, bnb: true})
        setCurrency(currencies[currency])
        if (currencies[currency][1]) getBalance(currencies[currency][1])
        else getBalance()
    }

    return (
        <>
            <div className={styles.playArea}>
                <h2 className={styles.gameTitle}>Выберите элемент:</h2>
                <Grid sx={{ mb: "50px" }} container justifyContent="space-around">
                    <Paper onClick={() => selectItem(0)} className={styles.paper}><img alt="камень" className={styles.icon} src={rock}></img></Paper>
                    <Paper onClick={() => selectItem(1)} className={styles.paper}><img alt="ножницы" className={styles.icon} src={scissors}></img></Paper>
                    <Paper onClick={() => selectItem(2)} className={styles.paper}><img alt="бумага" className={styles.icon} src={paper}></img></Paper>
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
                            {currencies.map((token, index) => (
                                <ToggleButton key={index} value={token[0]} onClick={() => selectCurrency(index)}>{token[0]}</ToggleButton >
                            ))}
                        </ToggleButtonGroup>
                        {currency ? (
                            <>
                                <Grid spacing={2} container alignItems='center' sx={{ marginBottom: "10px" }}>
                                    <Grid item><p>Выбранная монета: <span className={styles.strongText}>{currency[0]}</span></p></Grid>
                                    {error[1]?.includes("approve") ?
                                        <Grid item>
                                            <MyContainedButton onClick={infinityApprove}>Approve</MyContainedButton>
                                        </Grid>
                                        : null}
                                </Grid>
                                Баланс: <span className={styles.strongText}>{balance}</span>
                            </>
                        ) : null}
                        <MyTextField type="number" onChange={handleChange} className={styles.input} label="Введите количество" size="small" variant="outlined" fullWidth />
                        {error[1]?.length ? <span className={styles.error}>{error[1]}</span> : null}
                        <div className={styles.modal}>
                            <Grid container justifyContent="space-around">
                                <MyContainedButton onClick={handleClose}>Отменить выбор</MyContainedButton>
                                <Button color="success" disabled={!value || Number(value) === NaN || Number(value) <= 0 || !currency || error[0] || value === 0} onClick={startGame} variant="contained">Подтвердить выбор</Button>
                            </Grid>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    )
}