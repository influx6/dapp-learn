const {network, ethers } = require("hardhat");
const { developmentChains, priceFeeds } = require("../utils/helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { getNamedAccounts,  deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying contract ....");


    const chainId = network.config.chainId;

    let ethUsdPriceFeed;
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = (await ethUSDAggregator).address;
    } else {
        ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
    }

    let vrfCoordinatorAddress, subscriptionId;
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorAddress = vrfCoordinatorV2Mock.address;

        const subscriptionTransactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const subscriptionTransactionReceipt = await subscriptionTransactionResponse.wait(1);
        subscriptionId = subscriptionTransactionReceipt.events[0].args.subId;

        // fund token
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);

    } else {
        vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

}

module.exports.tags = ["all", "mocks"];