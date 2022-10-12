const ETHToken = artifacts.require("./ETHToken")
const BSCToken = artifacts.require("./BSCToken")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('Token', ([deployer]) => {

    const name = 'DApp University'
    const symbol = 'DAPP'

    let ethToken, bscToken, result

    describe('Deployment', () => {

        beforeEach(async () => {
            ethToken = await ETHToken.new(name, symbol)
            bscToken = await BSCToken.new(name, symbol)
        })

        it('Returns the token name', async () => {
            result = await ethToken.name()
            result.should.equal(name)

            result = await bscToken.name()
            result.should.equal(name)
        })

        it('Returns the token symbol', async () => {
            result = await ethToken.symbol()
            result.should.equal(symbol)

            result = await bscToken.symbol()
            result.should.equal(symbol)
        })

        it('Returns owner address', async () => {
            result = await ethToken.owner()
            result.should.equal(deployer)

            result = await bscToken.owner()
            result.should.equal(deployer)
        })

        it('Returns bridge address', async () => {
            // Remember, initial deployment of contract assigns deployer as bridge (to allow inital mint)
            result = await ethToken.bridge()
            result.should.equal(deployer)

            result = await bscToken.bridge()
            result.should.equal(deployer)
        })
    })
})