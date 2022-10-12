# Foundry Overview
Learn everything you need to know to get started with Foundry

## Technology Stack & Dependencies

- Solidity (Writing Smart Contract)
- [Infura](https://www.alchemy.com/) As a node provider
https://infura.io/


### 1. Clone/Download the Repository

### 2. Compile Smart Contracts
```
forge build
```

### 3. Test and Debug(console.log) Smart Contracts
```
forge test
```

### 6. Deploy Contract to public testnet
```
forge create --rpc-url <infuraRpc> --private-key <yourPrivateKey> src/Contract.sol:Contract
```
