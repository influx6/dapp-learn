const NFT = artifacts.require("./NFT");
const Token = artifacts.require("./Token");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('NFT', ([deployer, acc1]) => {

    const nftName = "Famous Paintings"
    const nftSymbol = "FP"

    const tokenName = "Famous Paintings Token"
    const tokenSymbol = "FPT"
    const tokenSupplyPerNft = 1000

    let nft, token

    beforeEach(async () => {
        nft = await NFT.new(
            nftName,
            nftSymbol,
            "ipfs://some_link_here/"
        )

        token = await Token.new(
            tokenName,
            tokenSymbol,
            nft.address,
            tokenSupplyPerNft
        )
    })

    describe('nft deployment', () => {
        it('returns the deployer', async () => {
            const result = await nft.owner()
            result.should.equal(deployer)
        })

        it('returns the name', async () => {
            const result = await nft.name()
            result.should.equal(nftName)
        })

        it('returns the symbol', async () => {
            const result = await nft.symbol()
            result.should.equal(nftSymbol)
        })
    })

    describe('token deployment', () => {
        it('returns the name', async () => {
            const result = await token.name()
            result.should.equal(tokenName)
        })

        it('returns the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(tokenSymbol)
        })

        it('returns the nft contract address', async () => {
            const result = await token.nftAddress()
            result.should.equal(nft.address)
        })

        it('returns the tokens per nft', async () => {
            const result = await token.supplyPerNFT()
            result.toString().should.equal(tokenSupplyPerNft.toString())
        })
    })

    describe('transfer', () => {
        let result

        describe('success', () => {
            beforeEach(async () => {
                await nft.mint({ from: deployer, value: 0 })
            })

            it('converts to ERC20', async () => {
                await nft.approve(token.address, 1, { from: deployer })
                await token.convertToTokens(1, { from: deployer })

                result = await token.balanceOf(deployer)
                result.toString().should.equal('1000')
            })

            it('successfully transfers', async () => {
                result = await nft.ownerOf(1)
                result.should.equal(deployer)

                await nft.approve(token.address, 1, { from: deployer })
                await token.convertToTokens(1, { from: deployer })

                result = await nft.ownerOf(1)
                result.should.equal(token.address)
            })
        })

        describe('failure', () => {
            beforeEach(async () => {
                await nft.mint({ from: acc1, value: web3.utils.toWei('1', 'ether') })
            })

            it('fails on without approval', async () => {
                await token.convertToTokens(1, { from: deployer }).should.be.rejected
            })
        })
    })
})