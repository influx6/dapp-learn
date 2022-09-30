const {network} = require("hardhat");
const { networkConfig, developmentChains } = require("../helpers/helper-hardhat-config.js");

async function deployFundMe(hre){
    const { getNamedAccounts,  deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying fundme....");

    const chainId = network.config.chainId;
    let ethUsdPriceFeed;
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = (await ethUSDAggregator).address;
    } else {
        ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
    }

    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: [
            // set Chainlink price feed address
            ethUsdPriceFeed,
        ]
    })
}

module.exports = deployFundMe;
module.exports.tags = ["all", "fundme"];