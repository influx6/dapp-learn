const {network, ethers } = require("hardhat");
const { verify } = require("../utils/eth-verify.js")
const { networkConfig, developmentChains } = require("../utils/helper-hardhat-config.js");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30");

async function deployRaffle(hre){
    const { getNamedAccounts,  deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying raffle....");

    let vrfCoordinatorAddress, subscriptionId;
    const chainId = network.config.chainId;
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

    const callbackGasLimit = networkConfig[chainId].callbackGasLimit;
    const entranceFee = networkConfig[chainId].entranceFee;
    const gasLane = networkConfig[chainId].gasLane;
    const timeInterval = networkConfig[chainId].timeInterval;

    const raffleArgs = [
        entranceFee,
        subscriptionId,
        vrfCoordinatorAddress,
        gasLane,
        callbackGasLimit,
        timeInterval,
    ];
    const raffleContractName = "Raffle";
    const raffle = await deploy(raffleContractName, {
        log: true,
        from: deployer,
        args: raffleArgs,
        contract: raffleContractName,
        waitConfirmations: network.config.blockConfirmations || 1,
    })


    // add raffle contract as consumer to vrfCoi
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

        log("Adding raffle contract with address: ", raffle.address, " to vrfCoordinatorV2 consumer list with subscription: ", subscriptionId.toNumber());
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), raffle.address);
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(raffle.address, raffleArgs);
    }
}

module.exports = deployRaffle;
module.exports.tags = ["all", "raffle"];