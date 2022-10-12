const {network, ethers } = require("hardhat");
const { BASE_FEE, GAS_PRICE_LINK, developmentChains, priceFeeds } = require("../utils/helper-hardhat-config.js");
const {verify} = require("../utils/eth-verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!developmentChains.includes(network.name)) {
        return;
    }

    log("Compiling BoxV2 contracts");

    const contractName = "BoxV2";
    const contract = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
    })


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(contract.address, []);
    }

}

module.exports.tags = ["all", "mocks"];