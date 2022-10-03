const {network, ethers } = require("hardhat");
const { developmentChains } = require("../utils/helper-hardhat-config.js");

// premium cost of each request in chainlink LINK
const BASE_FEE = ethers.utils.parseEther("0.25");

// calculated value based on chain gas cost
const GAS_PRICE_LINK = 1e9;

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!developmentChains.includes(network.name)) {
        return;
    }

    log("Compiling mocks contracts");

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