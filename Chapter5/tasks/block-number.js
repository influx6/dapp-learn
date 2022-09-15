const { task } = require("hardhat/config");

task("block-number", "Prints current block number")
    .setAction(async (taskArgs, hre, runSuper) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber();
        console.log(`block number: ${blockNumber}`);
    });


module.exports = {};