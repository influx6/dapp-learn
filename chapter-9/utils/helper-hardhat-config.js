const {ethers} = require("hardhat");

const INITIAL_SUPPLY = "1000000000000000000000000"
const networkConfig = {
    5: {
        name: "goerli",
    },
    31337: {
        name: "hardhat",
    },
}

const developmentChains = ["hardhat", "localhost"];

module.exports = { networkConfig, developmentChains, INITIAL_SUPPLY };