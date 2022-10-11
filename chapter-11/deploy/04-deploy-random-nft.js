const {network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../utils/helper-hardhat-config.js");
const {VRF_SUB_FUND_AMOUNT} = require("../utils/helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying contract ....");


    const chainId = network.config.chainId;
    const networkConfiguration = networkConfig[chainId]

    let vrfCoordinatorAddress, subscriptionId;
    if (developmentChains.includes(network.name)) {
        const vrfCoordinator = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorAddress = vrfCoordinator.address;

        const subscriptionTransactionResponse = await vrfCoordinator.createSubscription();
        const subscriptionTransactionReceipt = await subscriptionTransactionResponse.wait(1);
        subscriptionId = subscriptionTransactionReceipt.events[0].args.subId;

        // fund token
        await vrfCoordinator.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);

    } else {
        vrfCoordinatorAddress = networkConfiguration.vrfCoordinator;
        subscriptionId = networkConfiguration.subscriptionId;
    }

    const nftURI = [
        "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
        "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
        "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
    ]

    const args = [
        vrfCoordinatorAddress,
        subscriptionId,
        networkConfiguration.gasLane,
        networkConfiguration.entranceFee,
        networkConfiguration.callbackGasLimit,
        nftURI,
    ]

    const contractName = "RandomIPFSNFT";
    const nftContract = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

        log("Adding raffle contract with address: ", nftContract.address, " to vrfCoordinatorV2 consumer list with subscription: ", subscriptionId.toNumber());
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), nftContract.address);
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(raffle.address, raffleArgs);
    }
}

module.exports.tags = ["all", "mocks"];