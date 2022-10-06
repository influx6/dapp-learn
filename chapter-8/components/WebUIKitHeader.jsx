import { ConnectButton } from "web3uikit"

export default function WebUIKitHeader() {
    return (
        <div>
            <ConnectButton moralisAuth={false}></ConnectButton>
        </div>
    )
}
