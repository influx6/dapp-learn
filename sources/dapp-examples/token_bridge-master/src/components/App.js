import { useState, useEffect } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { ethers } from "ethers"
import './App.css'

// Import Components
import Navbar from './Navbar'

// Import Contract's JSON
import ETHToken from '../abis/ETHToken.json';
import ETHBridge from '../abis/ETHBridge.json';
import BSCToken from '../abis/BSCToken.json';
import BSCBridge from '../abis/BSCBridge.json';

function App() {
	const [networkId, setNetworkId] = useState(null)
	const [otherNetwork, setOtherNetwork] = useState("")

	const [ethProvider, setETHProvider] = useState(null)
	const [bscProvider, setBSCProvider] = useState(null)

	const [ethBridge, setETHBridge] = useState(null)
	const [bscBridge, setBSCBridge] = useState(null)

	const [ethToken, setETHToken] = useState(null)
	const [bscToken, setBSCToken] = useState(null)

	const [account, setAccount] = useState(null)
	const [ethSigner, setETHSigner] = useState(null)
	const [bscSigner, setBSCSigner] = useState(null)

	const [amount, setAmount] = useState(0)

	const [isLoading, setIsLoading] = useState(true)
	const [hasProcessed, setHasProcessed] = useState(false)
	const [message, setMessage] = useState("Awaiting MetaMask Connection...")

	const loadWeb3 = async () => {
		console.log('called')

		if (window.ethereum.networkVersion === '4') {
			// Set provider for Rinkeby (MetaMask)
			const ethProvider = new ethers.providers.Web3Provider(window.ethereum)
			setETHProvider(ethProvider)

			// Set provider for BSC Testnet
			const bscProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
			setBSCProvider(bscProvider)

			// Set signer
			const ethSigner = ethProvider.getSigner()
			setETHSigner(ethSigner)

			setOtherNetwork("Binance")

			await loadContracts()
		}

		if (window.ethereum.networkVersion === '97') {
			// Set provider for BSC Testnet (MetaMask)
			const bscProvider = new ethers.providers.Web3Provider(window.ethereum)
			setBSCProvider(bscProvider)

			// Set provider for Rinkeby
			const ethProvider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`)
			setETHProvider(ethProvider)

			// Set signer
			const bscSigner = bscProvider.getSigner()
			setBSCSigner(bscSigner)

			setOtherNetwork("Rinkeby")

			await loadContracts()
		}

		if (window.ethereum.networkVersion === '5777') {
			// Set provider for BSC Testnet
			const bscProvider = new ethers.providers.Web3Provider(window.ethereum)
			setBSCProvider(bscProvider)

			// Set provider for Rinkeby (MetaMask)
			const ethProvider = new ethers.providers.Web3Provider(window.ethereum)
			setETHProvider(ethProvider)

			// Set signer
			const ethSigner = ethProvider.getSigner()
			setETHSigner(ethSigner)

			await loadContracts()
		}

		window.ethereum.on('chainChanged', (chainId) => {
			window.location.reload();
		})

		window.ethereum.on('accountsChanged', function (accounts) {
			setAccount(accounts[0])
		})
	}

	const loadContracts = async () => {
		if (!ethProvider && !bscProvider) {
			return
		}

		if (networkId !== '5777') {
			setMessage("Loading Contracts...")

			const ethBridge = new ethers.Contract(ETHBridge.networks[4].address, ETHBridge.abi, ethProvider)
			setETHBridge(ethBridge)

			const bscBridge = new ethers.Contract(BSCBridge.networks[97].address, BSCBridge.abi, bscProvider)
			setBSCBridge(bscBridge)

			const ethTokenAddress = await ethBridge.token()
			const ethToken = new ethers.Contract(ethTokenAddress, ETHToken.abi, ethProvider)
			setETHToken(ethToken)

			const bscTokenAddress = await bscBridge.token()
			const bscToken = new ethers.Contract(bscTokenAddress, BSCToken.abi, bscProvider)
			setBSCToken(bscToken)

			// Depending on the network, we listen for when tokens are burned from the bridgeto mint 
			// tokens on the other network... This is only for demonstration, for security it's more ideal to
			// have this specific logic on a server somewhere else, with a more secure implementation in place
			// incase of potential downtime (or if a user refreshes the page)!

			// If networkId === 4 (Rinkeby), listen to transfer events from the ETHBridge, then make a call to BSCBridge
			if (networkId === '4') {
				ethBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
					const bscWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
					const bscSigner = bscWallet.connect(bscProvider)
					const bridge = bscBridge.connect(bscSigner)

					// Call mint function from here...
					await bridge.mint(from, to, amount, nonce, signature)

					setHasProcessed(true)
					setIsLoading(false)
				})
			}

			// If networkId === 97 (BSC Testnet), listen to transfer events from the BSCBridge, then make a call to ETHBridge
			if (networkId === '97') {
				bscBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
					const ethWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
					const ethSigner = ethWallet.connect(ethProvider)
					const bridge = ethBridge.connect(ethSigner)

					// Call mint function from here...
					await bridge.mint(from, to, amount, nonce, signature)

					setHasProcessed(true)
					setIsLoading(false)
				})
			}
		} else if (networkId === '5777') {

			// If testing on localhost, setup contracts on same network...
			const ethBridge = new ethers.Contract(ETHBridge.networks[5777].address, ETHBridge.abi, ethProvider);
			setETHBridge(ethBridge)

			const bscBridge = new ethers.Contract(BSCBridge.networks[5777].address, BSCBridge.abi, ethProvider);
			setBSCBridge(bscBridge)

			ethBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
				const bscWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
				const bscSigner = bscWallet.connect(bscProvider)
				const bridge = bscBridge.connect(bscSigner)

				// Call mint function from here...
				await bridge.mint(from, to, amount, nonce, signature)

				setHasProcessed(true)
				setIsLoading(false)
			})
		} else {
			return
		}
		setIsLoading(false)
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		setAccount(accounts[0])
		setNetworkId(window.ethereum.networkVersion)
	}

	const bridgeHandler = async () => {
		const amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether')

		if (networkId === '4') { // Rinkeby
			// Connect account with contract...
			const bridge = await ethBridge.connect(ethSigner)
			const id = await bridge.transferCount(account)

			// Create hash message, and have user sign it...
			const hashedMessage = ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], [account, amountInWei, (Number(id) + 1)])
			const other = ethers.utils.arrayify(hashedMessage)
			const signature = await ethSigner.signMessage(other)

			setMessage("Bridging over... Do NOT refresh the page!")
			setIsLoading(true)

			// Burn tokens...
			await bridge.burn(account, amountInWei, signature)
		}

		if (networkId === '97') { // Binance Testnet
			// Connect account with contract...
			const bridge = await bscBridge.connect(bscSigner)
			const id = await bridge.transferCount(account)

			// Create hash message, and have user sign it...
			const hashedMessage = ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], [account, amountInWei, (Number(id) + 1)])
			const other = ethers.utils.arrayify(hashedMessage)
			const signature = await bscSigner.signMessage(other)

			setMessage("Bridging over... Do NOT refresh the page!")
			setIsLoading(true)

			// Burn tokens...
			await bridge.burn(account, amountInWei, signature)
		}
	}

	const addTokenHandler = async () => {
		let address

		if (networkId === '4') { // Rinkeby
			address = ethToken.address
		}

		if (networkId === '97') { // Binance Testnet
			console.log(bscToken)
			address = bscToken.address
		}

		await window.ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: {
					address: address,
					symbol: "DAPP",
					decimals: 18,
				},
			},
		})
	}

	const changeNetworkHandler = async () => {
		let chainId

		if (networkId === '4') { // Rinkeby
			chainId = '0x61'
		}

		if (networkId === '97') { // Binance Testnet
			chainId = '0x4'
		}

		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: chainId }],
		})
	}

	useEffect(() => {
		loadWeb3()
	}, [account, networkId]);

	return (
		<div className="App">

			<Navbar web3Handler={web3Handler} account={account} />

			{isLoading ? (
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
					<Spinner animation="border" style={{ display: 'flex' }} />
					<p className='mx-3 my-0'>{message}</p>
				</div>
			) : (
				<main className='p-3'>
					<h1 className='my-4'>Token Bridge DApp</h1>
					<hr />
					<Row className='text-center'>
						<h2>Bridge your funds</h2>
						<div>
							<input type="number" onChange={(e) => { setAmount(e.target.value) }} placeholder='Amount' />
							<button onClick={bridgeHandler} className='button btn-sm mx-3'>{`Bridge to ${otherNetwork}`}</button>
						</div>
					</Row>
					<hr />
					<Row className='text-center'>
						{networkId === '4' ? (
							<div>
								<p>Currently connected to Rinkeby</p>
								<button onClick={addTokenHandler} className='button btn-sm p-2'>Add Token to MetaMask</button>
							</div>
						) : networkId === '97' ? (
							<div>
								<p>Currently connected to Binance Testnet</p>
								<button onClick={addTokenHandler} className='button btn-sm p-2'>Add Token to MetaMask</button>
							</div>
						) : (
							<p>Unidentified network, please connect to Rinkeby or Binance Testnet</p>
						)}
					</Row>
					{hasProcessed ? (
						<Row className='text-center'>
							<div>
								<button onClick={changeNetworkHandler} className='button btn-sm'>Switch Network</button>
							</div>
						</Row>
					) : (
						<Row></Row>
					)}
				</main>
			)}
		</div>
	);
}

export default App;
