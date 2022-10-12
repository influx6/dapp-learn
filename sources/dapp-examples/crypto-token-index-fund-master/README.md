# Defi-Cryptocurrency index fund
Defi token index funds where you can inveset in 5 popular defi projects

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- Javascript (Testing the Smart Contracts)
- [NodeJS](https://nodejs.org/en/) To create hardhat project and install dependencis using npm
- [Infura](https://infura.io/) To fork the ethereum mainnet

### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ npm install
```

### 3. Run tests
- Input infuraProjectId in hardhat config file
```
$ npx hardhat test --network hardhat
```

### 4. Deploy to Forked Ethereum Mainnet
```
$ npx hardhat node --fork https://mainnet.infura.io/v3/<YourInfuraProjectId>
```
- Import hardhat account in MetaMask
```
$ npx hardhat run --network localhost scripts/deploy.js
```

### 5. Run frontend React app
- Input address of deployed contarct in App.js
- You may need to reset your account in MetaMask from settings
```
$ npm start
```

### 6. Index fund Token allocation 

uniPrice =   0,00344 eth    x 50  tokens   =  1.7 ether    53.543 % 
<br/>
mkrPrice =    0,66   eth    x 1   tokens   =  0,66 eter    20.787 % 
<br/>
compPrice =  0,0412  eth    x 10  tokens   =  0.4 ether    12.5984 % 
<br/>
kncPrice =  0,00095  eth    x 300 tokens  =  0.285 ether  8.97 % 
<br/>
snxPrice =  0.013    eth    x 100 tokens  =  0.13 ether   4.09448 % 
<br/>
total price per coin : ~ 3.2 ether


