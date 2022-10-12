import logo from './logo.png';
import './App.css';
import { ethers } from "ethers"
import IndexFundABI from "./artifacts/src/contracts/IndexFund.sol/IndexFund.json"
import { useEffect, useState } from "react"

const address = "0xa6e99A4ED7498b3cdDCBB61a6A607a4925Faa1B7"

function App() {

  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("0");
  const [pricePerToken, setPricePerToken] = useState(0)

  useEffect(async () =>  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    setSigner(signer)
    const indexFundContract = new ethers.Contract(address, IndexFundABI.abi, signer)
    setContract(indexFundContract)

    // load price per token
    const pricePerToken = await indexFundContract.pricePerToken()
    setPricePerToken(Math.ceil(pricePerToken.toString() / 1e18))    

    // load balance of signer
    const addressOfSigner = await signer.getAddress()
    const balance = await indexFundContract.balanceOf(addressOfSigner)
    setBalance(parseInt(balance.toString()))

  }, [])

  async function depositHandler() {
    const options = {value: ethers.utils.parseEther(amount)}
    const amountToBuy = parseInt(amount) / pricePerToken
    console.log(amountToBuy)
    const tx = await contract.connect(signer).buyToken(amountToBuy.toString(), options);
    await tx.wait()
    
    const addressOfSigner = await signer.getAddress()
    const balance = await contract.balanceOf(addressOfSigner)
    setBalance(parseInt(balance.toString()))
  }

  function onChangeEther(e) {
    setAmount(e.target.value)
  }

  async function defiIncreased() {
    const tx = await contract.defiIncreased()
    await tx.wait()

    const pricePerToken = await contract.pricePerToken()
    setPricePerToken(Math.ceil(pricePerToken.toString() / 1e18))
  }

  async function withdraw() {
    const tx = await contract.connect(signer).redeemToken();
    await tx.wait()

    const addressOfSigner = await signer.getAddress()
    const balance = await contract.balanceOf(addressOfSigner)
    setBalance(parseInt(balance.toString()))
  }

  return (
    <div className='center'>
          <div>
            <h1>Token index</h1>
            <img src={logo} className="App-logo" alt="logo" />
            <br/>
            <input  onChange={(e) => {onChangeEther(e)}} type="text" placeholder='Amount in ether' />
            <br/>   
            <button onClick={() => {depositHandler()}}>Deposit</button>
            <br/>   
            <button onClick={() => {defiIncreased()}}>Defi increased</button>
            <br/>   
            <button onClick={() => {withdraw()}}>Withdraw</button>
            <br/>       
          </div>

          <br/>
          <span>Balance : {balance} tokens</span>     
          <br/>
          <span>Price per token : {pricePerToken} ether</span> 
    </div>
  );
}

export default App;
