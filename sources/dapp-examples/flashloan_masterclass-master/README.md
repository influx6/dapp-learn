## Flashloan LeveragedYieldFarm 

Make use of Flashloan from DY/DX to earn more from Compouond. 

## 🔧 Project Diagram: - How it works

## 🔧 Deposit Diagram:
![Deposit Diagram](https://i.gyazo.com/77913f25dd333c7f8a9ea99813053c61.png)
</br>
## 🔧 Withdraw Diagram:
![Deposit Diagram](https://i.gyazo.com/3c5736a988fe92fc7bd3c373230c2663.png)

### Technology Stack and Tools

* [Node Version Manager](https://heynode.com/tutorial/install-nodejs-locally-nvm) - node version manager
* [Yarn](https://yarnpkg.com/) - Alternative package manager to NPM 
* [Truffle](https://www.trufflesuite.com/) - development framework
* [Solidity](https://docs.soliditylang.org/en/v0.7.4/) - ethereum smart contract language
* [Ganache](https://www.trufflesuite.com/ganache) - local blockchain development
* [Web3](https://web3js.readthedocs.io/en/v1.3.0/) - library interact with ethereum nodes 
* [JavaScript](https://www.javascript.com/) - logic front end and testing smart contracts
* [Infura](https://infura.io/) - connection to ethereum networks 
* [Flashloan](https://coinmarketcap.com/alexandria/glossary/flash-loans) - Flashloans allow you to borrow lots of funds for a very small fee without need for collateral do anything else with funds as long as repayments happens in same transaction.
* [Metamask Wallet](https://metamask.io/) - You need to install Metamask Wallet
   - [How to install Metamask](https://blog.wetrust.io/how-to-install-and-use-metamask-7210720ca047)
* [ERC20](https://docs.openzeppelin.com/contracts/2.x/api/token/erc20) - ERC20 Token standards
* [Compound Protocol](https://app.compound.finance/) - supply or borrow tokens and earn cTokens
* Flashloan Providers 
  * [DY/DX]() - Decentralized Exchange offering flashloans with cheap feess; that is used on this example code 
  Alternative Flashloan Providers that can be used or to investigate
    * [UniswapV2 Flashswaps](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/flash-swaps) - access temporary funds 
      - Example Uniswap FlashSwap can be [found here](https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/examples/ExampleFlashSwap.sol)
    * [Aave Flashloan](https://docs.aave.com/developers/guides/flash-loans) - uncollaterized loan that must be returned in same transaction
    * [Binance Smart Chain - Pancake Swap]() - PancakeSwap as a fork of Uniswap deployed on Binance Smart Chain has the same functionality for Flashloan using e.g ..pancakeCall vs UniswapV2Cal when considering version2 Uniswap
    * [Kollateral](https://www.kollateral.co/) - a liquidity aggregator 
    * [UniLend](https://docs.unilend.finance/the-protocol/flash-loan/performing-flashloan) - UniLend Flashloans
* [Augement your profits with trading bot](https://dappuniversity.teachable.com/courses/940808/lectures/24527435) - TradingBot Masterclass
* Uses of Flashloans
  * Arbitrage - use the vast funds to make profits from price discrepencies e.g on Exchange See SimpleArb.sol 
  * Leverage - increase exposure e.g earn more with Yield Farmin on protocols like Compound. See FlashloanLeveragedYieldFarm project

##### Folder / Directory Structure (key folders and files)
* FlashloanLeveragedYieldFarm
  * flats
  * migrations
  * node_modules
  * src
    * abis
    * contracts
  * test
  * flatten.sh
  * truffle.js
  * package.json
  * .gitignore
  * README.md
  * yarn.lock

### Preconfiguration, Installation 

1. You will need nvm  if not laready installed; so you can use specific version node version 14 and above 
```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```
Restart your terminal

2. Install node v12.0.0 or versions above e.g node v14.16.0
```sh
$ nvm install 14.16.0 
$ nvm alias default 14.16.0 
$ nvm use default
```

3. Install truffle globally if not installed. 
Check if installed using 
```sh
truffle version
```
If not installed install with below 
```sh
$ npm install -g truffle
```

4. Ignore if either installed already! If opting to use ganache-cli vs [Ganache GUI](https://www.trufflesuite.com/ganache), install ganache-cli globally. Note that ganache-cli rus on port 8545 and ganache-gui runs on port 7545 as placced in truffle-config.js. 
Check if ganache-cli installed first with
```sh
ganache --version
```
If not installed install with below
```sh
$ npm install -g ganache
$ ganache
```
Run ganache-cli in different terminal and keep running when compiling, testing, migrating, running app, etc.

## Running the project
1. Enter project directory and install dependancies
```sh
$ cd flashloan_masterclass
$ npm install  
```

2. Run Ganache Fork 
```sh
$ ganache -p 7545 -f
```

3. Run the test that will show example flashloan and leveraged yield farming compound and repay
Open a new terminal and run 
```sh
$ truffle test 
```
If you have problems with test e.g archived state, rpc etc, you may need to restart your ganache running fork
To reset and run again, you will need to restart the terminal with ganache and rerun the fork