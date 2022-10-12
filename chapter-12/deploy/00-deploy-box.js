const {network, ethers } = require("hardhat");
const { developmentChains } = require("../utils/helper-hardhat-config.js");
const {verify} = require("../utils/eth-verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (!developmentChains.includes(network.name)) {
        return;
    }

    log("Compiling Box contracts");

    const contractName = "Box";
    const contract = await deploy(contractName, {
        contract: contractName,
        from: deployer,
        log: true,
        args: [],
        waitConfirmations: network.config.blockConfirmations || 1,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            }
        }
    })


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(contract.address, []);
    }
}

module.exports.tags = ["all", "mocks"];