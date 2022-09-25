require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("./tasks/block-number");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas_report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: process.env.COIN_MARKET_API_KEY,
    token: "MATIC",
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    rinkeby: {
      url: process.env.CHAIN_ENDPOINT,
      chainId: parseInt(process.env.CHAIN_NUMBER),
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
