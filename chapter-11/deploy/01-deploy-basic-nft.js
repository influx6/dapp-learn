const { network } = require("hardhat")
const { developmentChains } = require("../utils/helper-hardhat-config")
const { verify } = require("../utils/eth-verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    arguments = []
    const contractName = "BasicNFT"
    const basicNft = await deploy(contractName, {
        from: deployer,
        contract: contractName,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, arguments)
    }
}

module.exports.tags = ["all", "basicnft", "main"]
