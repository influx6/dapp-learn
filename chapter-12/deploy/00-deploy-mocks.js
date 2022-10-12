const {network, ethers } = require("hardhat");
const { BASE_FEE, GAS_PRICE_LINK, developmentChains, priceFeeds } = require("../utils/helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!developmentChains.includes(network.name)) {
        return;
    }

    log("Compiling mocks contracts");

    await deploy("MockV3Aggregator",{
        contract: "MockV3Aggregator",
        from: deployer,
        log: true,
        args: [
            // takes two argument: the decimal and the initial price
            priceFeeds.basic.decimals,
            priceFeeds.basic.initial_price,
        ]
    })

    const vrfContractName = "VRFCoordinatorV2Mock";
    await deploy(vrfContractName, {
        contract: vrfContractName,
        from: deployer,
        log: true,
        args: [
            BASE_FEE,
            GAS_PRICE_LINK,
        ],
        waitConfirmations: network.config.blockConfirmations || 1,
    })

}

module.exports.tags = ["all", "mocks"];