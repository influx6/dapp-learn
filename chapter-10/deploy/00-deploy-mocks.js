const {network, ethers } = require("hardhat");
const { developmentChains } = require("../utils/helper-hardhat-config.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!developmentChains.includes(network.name)) {
        return;
    }

    log("Compiling mocks contracts");

}

module.exports.tags = ["all", "mocks"];