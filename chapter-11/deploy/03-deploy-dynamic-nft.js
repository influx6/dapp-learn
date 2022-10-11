const fs = require("fs");
const {network, ethers } = require("hardhat");
const { developmentChains } = require("../utils/helper-hardhat-config.js");
const { networkConfig } = require("../utils/helper-hardhat-config");
const { verify } = require("../utils/eth-verify");


module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying contract ....");

    const chainId = network.config.chainId;
    const networkConfiguration = networkConfig[chainId]

    let ethUsdPriceFeed;
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = (await ethUSDAggregator).address;
    } else {
        ethUsdPriceFeed = networkConfiguration.ethUsdPriceFeed;
    }


    const lowSVG = fs.readFileSync("./images/dynamicNft/frown.svg",  "utf8" );
    const highSVG = fs.readFileSync("./images/dynamicNft/happy.svg",  "utf8");

    const args = [
        ethUsdPriceFeed,
        lowSVG,
        highSVG,
    ]

    const contractName = "DynamicNFT";
    const nftContract = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(nftContract.address, args);
    }
}

module.exports.tags = ["all", "mocks"];