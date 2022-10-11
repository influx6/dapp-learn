const { network, ethers } = require("hardhat");
const { developmentChains } = require("../utils/helper-hardhat-config.js");
const { networkConfig } = require("../utils/helper-hardhat-config");
const { verify } = require("../utils/eth-verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : 3

    log("----------------------------------------------------")
    const arguments = []
    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(nftMarketplace.address, arguments)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
