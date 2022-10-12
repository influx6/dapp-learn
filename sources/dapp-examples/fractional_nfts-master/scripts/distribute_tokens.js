const NFT = artifacts.require("./NFT");
const Token = artifacts.require("./Token");

module.exports = async function (callback) {
    const [deployer, acc1, acc2, acc3] = await web3.eth.getAccounts()

    const nft = await NFT.deployed()
    const token = await Token.deployed()

    console.log(`Address of Token Contract: ${token.address}`)
    console.log(`Address of Deployer: ${deployer}\n`)

    console.log(`Deployer Minting...\n`)

    await nft.mint({ from: deployer, value: 0 })

    console.log(`Owner of NFT before transfer: ${await nft.ownerOf(1)}`)
    console.log(`Deployer Token balance before transfer: ${await token.balanceOf(deployer)}\n`)

    console.log(`Deployer sending NFT to ERC20 contract...\n`)

    await nft.approve(token.address, 1, { from: deployer })
    await token.convertToTokens(1, { from: deployer })

    console.log(`Owner of NFT after transfer: ${await nft.ownerOf(1)}`)
    console.log(`Deployer Token balance after transfer: ${await token.balanceOf(deployer)}\n`)

    console.log(`Deployer distributes tokens to others...\n`)

    await token.transfer(acc1, 250, { from: deployer })
    await token.transfer(acc2, 250, { from: deployer })
    await token.transfer(acc3, 250, { from: deployer })

    console.log(`deployer token balance after distributing | ${await token.balanceOf(deployer)}`)
    console.log(`acc1 token balance after distributing     | ${await token.balanceOf(acc1)}`)
    console.log(`acc2 token balance after distributing     | ${await token.balanceOf(acc2)}`)
    console.log(`acc3 token balance after distributing     | ${await token.balanceOf(acc3)}\n`)

    callback()
}