const {network, ethers } = require("hardhat");
const { developmentChains, priceFeeds } = require("../utils/helper-hardhat-config.js");
const {networkConfig} = require("../utils/helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    // const { deploy, log } = deployments;
    // const { deployer } = await getNamedAccounts();
    //
    // log("Deploying contract ....");
    //
    //
    // const chainId = network.config.chainId;
    // const networkConfiguration = networkConfig[chainId]
    //
    // let ethUsdPriceFeed;
    // if (developmentChains.includes(network.name)) {
    //     const ethUSDAggregator = deployments.get("MockV3Aggregator");
    //     ethUsdPriceFeed = (await ethUSDAggregator).address;
    // } else {
    //     ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
    // }
    //
    // let vrfCoordinatorAddress, subscriptionId;
    // if (developmentChains.includes(network.name)) {
    //     const vrfCoordinator = await ethers.getContract("VRFCoordinatorV2Mock");
    //     vrfCoordinatorAddress = vrfCoordinator.address;
    //
    //     const subscriptionTransactionResponse = await vrfCoordinator.createSubscription();
    //     const subscriptionTransactionReceipt = await subscriptionTransactionResponse.wait(1);
    //     subscriptionId = subscriptionTransactionReceipt.events[0].args.subId;
    //
    //     // fund token
    //     await vrfCoordinator.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    //
    // } else {
    //     vrfCoordinatorAddress = networkConfiguration.vrfCoordinator;
    //     subscriptionId = networkConfiguration.subscriptionId;
    // }
    //
    //
    // const contractName = "RandomIPFSNFT";
    // await deploy(contractName, {
    //     contract: contractName,
    //     from: deployer,
    //     log: true,
    //     args: args,
    //     waitConfirmations: network.config.blockConfirmations || 1,
    // })
}

module.exports.tags = ["all", "mocks"];