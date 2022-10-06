/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

module.exports = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  solidity: {
    compilers: [
      {
        version:"0.8.9",
      },
      {
        version:"0.8.8",
      },
      {
        version:"0.6.6",
      },
    ]
  },
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
  mocha: {
    timeout: 900000, // 200 secs max
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    georli: {
      url: process.env.CHAIN_ENDPOINT,
      chainId: parseInt(process.env.CHAIN_NUMBER),
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 6,
    },
  },
};
