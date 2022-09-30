const { network } = require("hardhat")
const { developmentChains, priceFeeds } = require("../helpers/helper-hardhat-config.js");

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
}

module.exports.tags = ["all", "mocks"];