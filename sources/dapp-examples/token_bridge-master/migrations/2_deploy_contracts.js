const ethers = require("ethers")

const ETHToken = artifacts.require("./ETHToken")
const ETHBridge = artifacts.require("./ETHBridge")

const BSCToken = artifacts.require("./BSCToken")
const BSCBridge = artifacts.require("./BSCBridge")

module.exports = async function (deployer, network, addresses) {

    const name = "DApp University"
    const symbol = "DAPP"
    const supply = ethers.utils.parseUnits('1000000', 'ether') // 1,000,000 Tokens

    // Ideally we first deploy to rinkeby, then we deploy to binance testnet.

    if (network === 'rinkeby') {
        await deployer.deploy(ETHToken, name, symbol)
        const token = await ETHToken.deployed()

        await token.mint(addresses[0], supply)

        await deployer.deploy(ETHBridge, token.address)
        const bridge = await ETHBridge.deployed()

        await token.setBridge(bridge.address)
    }

    if (network === 'bsc_testnet') {
        await deployer.deploy(BSCToken, name, symbol)
        const token = await BSCToken.deployed()

        await deployer.deploy(BSCBridge, token.address)
        const bridge = await BSCBridge.deployed()

        await token.setBridge(bridge.address)
    }

    if (network === 'development') {
        let token, bridge

        await deployer.deploy(ETHToken, name, symbol)
        token = await ETHToken.deployed()

        await token.mint(addresses[0], supply)

        await deployer.deploy(ETHBridge, token.address)
        bridge = await ETHBridge.deployed()

        await token.setBridge(bridge.address)

        await deployer.deploy(BSCToken, name, symbol)
        token = await BSCToken.deployed()

        await deployer.deploy(BSCBridge, token.address)
        bridge = await BSCBridge.deployed()

        await token.setBridge(bridge.address)
    }
}