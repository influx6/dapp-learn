const {network} = require("hardhat");
const { networkConfig, developmentChains } = require("../helpers/helper-hardhat-config.js");
const { verify } = require("../utils/eth-verify.js")

async function deployFundMe(hre){
    const { getNamedAccounts,  deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying fundme....");

    const chainId = network.config.chainId;
    let ethUsdPriceFeed;
    if (developmentChains.includes(network.name)) {
        const ethUSDAggregator = deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = (await ethUSDAggregator).address;
    } else {
        ethUsdPriceFeed = networkConfig[chainId].ethUsdPriceFeed;
    }

    const fundMeArgs = [ ethUsdPriceFeed];

    const fundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        log: true,
        args: fundMeArgs,
        waitConfirmations: network.config.blockConfirmations || 1,
    })


    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, fundMeArgs);
    }
}

module.exports = deployFundMe;
module.exports.tags = ["all", "fundme"];