require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.9",
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
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
      blockConfirmations: 1,
    },
    georli: {
      url: process.env.CHAIN_ENDPOINT,
      chainId: parseInt(process.env.CHAIN_NUMBER),
      accounts: [process.env.PRIVATE_KEY],
      blockConfirmations: 3,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      // set network chain id and value is the account we want to use.
      31337: 0,
    }
  }
};
