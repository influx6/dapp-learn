const {getNamedAccounts, ethers, network } = require("hardhat");
const { networkConfig } = require("../utils/helper-hardhat-config.js")


const AMOUNT = ethers.utils.parseEther("0.02")

async function getWeth() {
    const chainId = network.config.chainId;
    const configuration = networkConfig[chainId]
    const { deployer } = await getNamedAccounts()

    // call the deposit function on the weth contract
    // need: abi and contract address
    // main net address:
    const iWeth = await ethers.getContractAt("IWeth", configuration.wethTokenAddress, deployer)

    const tx = await iWeth.deposit({ value: AMOUNT })
    await tx.wait(1)

    const wethBalance = await iWeth.balanceOf(deployer)
    console.log(`Got ${wethBalance.toString()} WETH`)

    return AMOUNT
}

module.exports = {
    getWeth,
}