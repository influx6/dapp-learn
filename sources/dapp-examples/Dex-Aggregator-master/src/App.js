import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DexAggregatorABI from './artifacts/src/contracts/DexAggregator.sol/DexAggregator.json';
import WETHContract from '../src/ABIs/WETHContract.json';
import USDCContractABI from '../src/ABIs/USDCContract.json';
import Swap from './components/Swap';

function App() {
  const DexAggregatorAddress = '0x0a17FabeA4633ce714F1Fa4a2dcA62C3bAc4758d';
  const usdcContractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; //0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
  const wethContractAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState('');
  const [loading, setLoading] = useState(false);
  const [USDCContract, setUSDCContract] = useState('')

  const [USDCBalance, setUSDCBalance] = useState(0);
  const [WETHBalance, setWETHBalance] = useState(0);


  useEffect(() => {
    checkIfWalletIsConnected();

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0]);
      await checkIfWalletIsConnected();
      window.location.reload();
    });
  },[]);


  //Check if wallet is Connected
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length !== 0) {
          setAccount(accounts[0]);
          loadContracts();
        } else {
          console.log('Please Connect Your Wallet');
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('No Web3 Provider Detected. Kindly Install Metamask');
      } else {
        setLoading(true);
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        loadContracts();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  //Load the DexAggregator, USDC and WETH Contracts
  const loadContracts = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const usdcCont = new ethers.Contract(
        usdcContractAddress,
        USDCContractABI.abi,
        signer
      );

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      setUSDCContract(usdcCont);

      let USDCBal = await usdcCont.balanceOf(accounts[0]);
      setUSDCBalance(USDCBal.toString() / 10 ** 6);

      const wethCont = new ethers.Contract(
        wethContractAddress,
        WETHContract.abi,
        signer
      );

      let WETHBal = await wethCont.balanceOf(accounts[0]);
      setWETHBalance(WETHBal.toString() / 10 ** 18);

      const dex = new ethers.Contract(
        DexAggregatorAddress,
        DexAggregatorABI.abi,
        signer
      );
      setContract(dex);

      console.log('Contracts Loaded!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar
        account={account}
        connectWallet={connectWallet}
        loading={loading}
      />
      <Swap
        account={account}
        contract={contract}
        USDCBalance={USDCBalance}
        WETHBalance={WETHBalance}
        USDCContract={USDCContract}
      />
    </div>
  );
}

export default App;
