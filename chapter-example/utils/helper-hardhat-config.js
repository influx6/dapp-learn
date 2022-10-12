const {ethers} = require("hardhat");

const priceFeeds = {
    basic: {
        decimals: 8, // 8 decimal places
        initial_price: 2000000000,
    },
}

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");

// premium cost of each request in chainlink LINK
const BASE_FEE = ethers.utils.parseEther("0.25");

// calculated value based on chain gas cost
const GAS_PRICE_LINK = 1e9;

const INITIAL_SUPPLY = "1000000000000000000000000"
const networkConfig = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.1"),
        subscriptionId: "3528",
        timeInterval: 30,
        callbackGasLimit: "500000"
    },
    31337: {
        name: "hardhat",
        timeInterval: 30,
        callbackGasLimit: "500000",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    },
}

const developmentChains = ["hardhat", "localhost"];

module.exports = { BASE_FEE, GAS_PRICE_LINK, VRF_SUB_FUND_AMOUNT, networkConfig, developmentChains, INITIAL_SUPPLY, priceFeeds };