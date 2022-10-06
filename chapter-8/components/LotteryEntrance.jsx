import { useEffect, useState } from "react"

// dont export from moralis when using react
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"

// application import
import { addresses, abi } from "../constants/index"


export default function LotteryEntrance() {
    const dispatch = useNotification()

    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex);

    const raffleAddress = chainId in addresses ? addresses[chainId]: null;

    const [ entranceFee, setEntranceFee ] = useState("0");
    const [ recentWinner, setRecentWinner ] = useState("0");
    const [ numberOfPlayers, setNumberOfPlayers ] = useState("0");

    const { runContractFunction: enterRaffle, data: enterTxResponse, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    console.log("Contract Address: ", raffleAddress)
    console.log("Contract ChainId: ", chainId)


    const { runContractFunction: getEntranceFee, } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        msgValue: entranceFee,
        params: {},
    })


    const { runContractFunction: getPlayersNumber, } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getTotalPlayers",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getRecentWinner, } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        msgValue: entranceFee,
        params: {},
    })

    const isReady = !isLoading && !isFetching

    const handleNewNotification = (tx) => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const updateUI = async () => {
        const entranceTx = await getEntranceFee()
        console.log("entranceTx: ", entranceTx)
        if (entranceTx) setEntranceFee(entranceTx.toString)

        const numbPlayersFromContractTx = await getPlayersNumber();
        console.log("playerNumbers: ", numbPlayersFromContractTx)
        if (numbPlayersFromContractTx) setNumberOfPlayers(numbPlayersFromContractTx.toString())

        const recentWinnerCallTx = await getRecentWinner();
        console.log("recentWinner: ", recentWinnerCallTx)
        if (recentWinnerCallTx) setRecentWinner(recentWinnerCallTx.toString)
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        await updateUI()
        handleNewNotification(tx)
    }

    const enterRaffleAction = async () => {
        await enterRaffle({
                onSuccess: handleSuccess,
                onError: (err) => console.log("Failed: ", err),
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) updateUI();
    }, [isWeb3Enabled])

    return (
        <div className="p-5">
            <h1 className="py-4 px-5 font-bold text-3xl">Lottery</h1>
            { !raffleAddress ? (
                <div> Please connect to a supported chain</div>
            ) : (
                <>
                    <button onClick={enterRaffleAction} disabled={!isReady} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                        {
                            isReady ? "Enter Raffle" : (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            )
                        }
                    </button>
                    <br/>
                    <div> Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} Eth</div>
                    <div> The current number of players is: {numberOfPlayers}</div>
                    <div> The most previous winner was: {recentWinner}</div>
                </>
            )}
        </div>
    )
}