require("dotenv").config()
require("@nomicfoundation/hardhat-toolbox");
require("./tasks/block-number");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    "rinkeby": {
      url: process.env.CHAIN_ENDPOINT,
      chainId: process.env.CHAIN_NUMBER,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
