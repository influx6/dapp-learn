const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
}

const developmentChains = ["hardhat", "localhost"];

const priceFeeds = {
    basic: {
        decimals: 8, // 8 decimal places
        initial_price: 2000000000,
    },
}

module.exports = { networkConfig, developmentChains, priceFeeds };