# Token Bridge

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Web3](https://web3js.readthedocs.io/en/v1.5.2/) (Blockchain Interaction)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle version`. To install truffle run `npm i -g truffle`. Ideal to have truffle version 5.4 to avoid dependency issues.
- Install [Ganache](https://www.trufflesuite.com/ganache).

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Add Binance Testnet to your MetaMask wallet
1. Log in to your MetaMask, and click the profile image in the top right.
2. Navigate to Settings -> Networks -> Add Network
3. Fill in the following:
  - **Network Name**: BSC - Testnet
  - **New RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545/
  - **Chain ID**: 97
  - **Currency Symbol**: BNB
  - **Block Explorer URL**: https://testnet.bscscan.com

### 4. Fund Your Wallet
You'll need both ETH on Rinkeby & BNB on Binance Testnet in order to deploy your contracts. You'll also want to make sure you fund the same address!

- You can get ETH from the chainlink faucet: [https://faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby)
- You can get BNB from the binance faucet: [https://testnet.binance.org/faucet-smart](https://testnet.binance.org/faucet-smart)

### 5. Create .env file
You'll want to create a .env file with the following values (see .env.example):

- **INFURA_API_KEY=""**
- **PRIVATE_KEY=""** (Private key for the account used in deploying)
- **REACT_APP_INFURA_API_KEY=""** (Will need to connect to a node while on a different network)
- **REACT_APP_PRIVATE_KEY=""** (Private key for the account used to call contract methods on behalf of the user)

Note: The REACT_APP variables should/can be the same as your INFURA_API_KEY & PRIVATE_KEY.

### 6. Migrate Smart Contracts
1. `$ truffle migrate --reset --network rinkeby`
2. `$ truffle migrate --reset --network bsc_testnet`

### 7. Launch Frontend
`$ npm start`

### 6. Verify Network & Add Token to MetaMask
You'll want to make sure you are connected to Rinkeby, as this is the main network for the tokens we have deployed. On the frontend there will be a button called "Add Token to MetaMask". This will add the token we deployed to your MetaMask, you should see 1,000,000 tokens in your wallet.

### 7. Bridge Over Some Tokens
In the input field, input how many tokens you want to "bridge" over, then click the button "Bridge to Binance". It's important to wait until the spinner stops to avoid losing tokens.

### 8. Switch to Binance
After the completion, a new button should appear to switch networks. Click on that, connect your wallet, add the token to your MetaMask, and you should see the amount you bridged over now in your wallet.

### 9. Bridge over to Rinkeby
Once on the Binance network, you can bridge over funds back to Rinkeby using the same steps as you did to bridge from Rinkeby.
