const {network, ethers } = require("hardhat");
const { verify } = require("../utils/eth-verify.js")
const { networkConfig, developmentChains, INITIAL_SUPPLY } = require("../utils/helper-hardhat-config.js");


async function deployRaffle(hre){
    const { getNamedAccounts,  deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying raffle....");

    const chainId = network.config.chainId;
    if (developmentChains.includes(network.name)) {

    }

    const deploymentConfig = networkConfig[chainId];

    const contractName = "Mica20";
    const micaArgs = [INITIAL_SUPPLY];
    const mica20 = await deploy(contractName, {
        log: true,
        from: deployer,
        args: micaArgs,
        contract: contractName,
        waitConfirmations: network.config.blockConfirmations || 1,
    })


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(mica20.address, micaArgs);
    }
}

module.exports = deployRaffle;
module.exports.tags = ["all", "mica20"];