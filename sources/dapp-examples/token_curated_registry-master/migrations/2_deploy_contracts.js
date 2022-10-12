const Token = artifacts.require("Token")
const Registry = artifacts.require("Registry")

module.exports = async function (deployer) {

    const [executor, proposer, challenger, voter1, voter2, voter3, voter4] = await web3.eth.getAccounts()

    const name = "DApp University"
    const symbol = "DAPPU"
    const supply = web3.utils.toWei('100000', 'ether') // 100,000 Tokens

    // Deploy & distribute tokens
    await deployer.deploy(Token, name, symbol, supply)
    const token = await Token.deployed()

    const amount = web3.utils.toWei('50', 'ether')
    await token.transfer(voter1, amount, { from: executor })
    await token.transfer(voter2, amount, { from: executor })
    await token.transfer(voter3, amount, { from: executor })
    await token.transfer(voter4, amount, { from: executor })

    // Deploy Registry
    await deployer.deploy(Registry, token.address)
};