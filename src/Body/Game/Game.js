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
    const [errorWrite, setErrorWrite] = useState([false, '']);
    const [errorGetTokens, setErrorGetTokens] = useState([false, '']);
    const [balance, setBalance] = useState(0);
    const [enabled, setEnabled] = useState({
        bnb: false,
        erc20: true
    })

    const { address } = useAccount()

    useContractEvent({
        address: contractAddress,
        abi: abiMyContract,
        eventName: 'GameEnd',
        listener(data, player, result) {
            if (player === address) {
                if (result === 0) handleSnackbar('success', 'К сожалению, вы проиграли')
                if (result === 1) handleSnackbar('success', 'Ничья! Попробуете еще раз?')
                if (result === 2) handleSnackbar('success', 'Вы выиграли, поздравляем!')
                setTimeout(getBalance, 1500, currencies[currencies.indexOf(currency)][1])
            }
        },
    })

    useContractEvent({
        address: currency[1],
        abi: abiErc20,
        eventName: 'Approval',
        listener(owner, spender, valueApprove) {
            console.log(owner, spender, valueApprove)
            if (owner === address && spender === contractAddress && valueApprove >= value) {
                if (errorWrite[0] && errorWrite[1].includes("approve")){
                    handleSnackbar('success', "Токен одобрен");
                    setErrorWrite([false, '']);
                }
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

    const { config: startGameBnbConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        enabled: enabled.bnb && open && value,
        functionName: 'startGameBnb',
        args: [item + 1],
        overrides: {
            value: value,
        },
        onError: (e) => {
            const error = e?.error?.data?.message || e.data.message;
            setErrorWrite([true, error])
            handleSnackbar('error', error)
        }
    })
    const { write: startGameBnbCall } = useContractWrite({
        ...startGameBnbConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Транзакция была успешно отправлена")
        },
        onError: (e) => {
            const error = e?.message || "Error!";
            handleSnackbar('error', error)
        }
    })

    const { config: startGameConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        enabled: enabled.erc20 && open && value,
        functionName: 'startGame',
        args: [currency?.[1],
        item + 1, value],
        onError: (e) => {
            const error = e?.error?.data?.message || e.data.message;
            setErrorWrite([true, error])
            handleSnackbar('error', error)
        }
    })
    const { write: startGameCall } = useContractWrite({
        ...startGameConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Транзакция была успешно отправлена")
        },
        onError: (e) => {
            const error = e?.message || "Error!";
            handleSnackbar('error', error)
        }
    })

    const { config: approveConfig } = usePrepareContractWrite({
        address: currency?.[1] || currencies[0][1],
        abi: abiErc20,
        enabled: open,
        functionName: 'approve',
        args: [contractAddress, "115792089237316195423570985008687907853269984665640564039457"],
        onError: (e) => {
            const error = e.error.data.message;
            setErrorWrite([true, error])
            handleSnackbar('error', error)
        }
    })
    const { write: approveCall } = useContractWrite({
        ...approveConfig,
        onError: (e) => {
            const error = e?.message || "Error!";
            handleSnackbar('error', error)
        }
    })

    const { config: getTokensConfig } = usePrepareContractWrite({
        address: contractAddress,
        abi: abiMyContract,
        enabled: enabled.erc20 && open && value,
        functionName: 'getTestTokens',
        args: [currency[1]],
        onError: (e) => {
            const error = e?.error?.data?.message || e.data.message;
            setErrorGetTokens([true, error])
        }
    })
    const { write: getTokensCall } = useContractWrite({
        ...getTokensConfig,
        onSuccess: (data) => {
            handleSnackbar('success', "Токен запрошен")
        },
        onError: (e) => {
            const error = e?.message || "Error!";
            handleSnackbar('error', error)
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

    const getTokens = () => {
        if(errorGetTokens[0]) handleSnackbar('error', errorGetTokens[1])
        else getTokensCall()
    }

    const handleClose = () => {
        setOpen(false)
        setValue(0)
        setItem(0)
        setErrorWrite([false, ''])
    }

    const startGame = () => {
        if (!value || !currency || value === 0) {
            alert("Одно из значений пустое");
            return 0;
        }
        else {
            if (enabled.erc20) startGameCall();
            else startGameBnbCall()
        }
    }

    const handleChangeValue = ({ target: { value } }) => {
        if (errorWrite[0]) setErrorWrite([false, '']);

        if (value) setValue(toWei(value));
        else setValue(0);
    }

    const selectCurrency = (selectedCurrency) => {
        if (errorWrite[0] && currencies[selectedCurrency] !== currency) setErrorWrite([false, '']);
        // if (errorGetTokens[0] && currencies[selectedCurrency] !== currency) setErrorGetTokens([false, ''])

        if (selectedCurrency !== 3) setEnabled({ erc20: true, bnb: false });
        else setEnabled({ erc20: false, bnb: true });

        setCurrency(currencies[selectedCurrency]);

        getBalance(currencies[selectedCurrency][1])
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
                                    {errorWrite[1]?.includes("approve") ?
                                        <Grid item>
                                            <MyContainedButton onClick={infinityApprove}>Approve</MyContainedButton>
                                        </Grid>
                                        : null}
                                    {errorWrite[1]?.includes("insufficent") && !errorWrite[1]?.includes("contract") ?
                                        <Grid item>
                                            <MyContainedButton onClick={getTokens}>Get 100 {currency[0]}</MyContainedButton>
                                        </Grid>
                                        : null}
                                </Grid>

                                Баланс: <span className={styles.strongText}>{balance}</span>
                            </>
                        ) : null}
                        <MyTextField type="number" onChange={handleChangeValue} className={styles.input} label="Введите количество" size="small" variant="outlined" fullWidth />
                        {errorWrite[1]?.length ? <span className={styles.error}>{errorWrite[1]}</span> : null}
                        <div className={styles.modal}>
                            <Grid container justifyContent="space-around">
                                <MyContainedButton onClick={handleClose}>Отменить выбор</MyContainedButton>
                                <Button color="success" disabled={!value || isNaN(value) || Number(value) <= 0 || !currency || errorWrite[0] || value === 0} onClick={startGame} variant="contained">Подтвердить выбор</Button>
                            </Grid>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    )
}