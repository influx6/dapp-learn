require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    "rinkeby": {
      url: process.env.CHAIN_ENDPOINT,
      chainId: process.env.CHAIN_NUMBER,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
