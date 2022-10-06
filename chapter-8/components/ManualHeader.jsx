import { useMoralis } from "react-moralis";
import {useEffect} from "react";
import Moralis from "moralis";

export default function ManualHeader() {
    const { enableWeb3, deactivateWeb3, isWeb3Enabled, account } = useMoralis();

    const toConnect = async () => {
        await enableWeb3();
        window.localStorage.setItem("connected", "injected");
    }

    const toDisconnect = async () => {
        await deactivateWeb3();
    }

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (window && window.localStorage && window.localStorage.getItem("connected"))  {
            enableWeb3();
        }
        // do something
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (!account) {
                window.localStorage.removeItem("connected");
                deactivateWeb3()
                return
            }
        })
    }, [])



    return (
        <div>
            {account ? (
                <>
                    <div>Connected to {account}</div>
                    <button onClick={toDisconnect}>Disconnect</button>
                </>
                ) : (
                <>
                    <div>Not Connected</div>
                    <button onClick={toConnect}>Connect</button>
                </>
            )}
        </div>
    )
}
