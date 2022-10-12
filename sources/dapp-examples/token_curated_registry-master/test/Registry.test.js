const Token = artifacts.require("Token")
const Registry = artifacts.require("Registry")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const EVM_REVERT = 'VM Exception while processing transaction: revert'

contract('Registry', ([executor, proposer, challenger, voter1, voter2, voter3]) => {

    const name = "DApp University"
    const symbol = "DAPPU"
    const supply = web3.utils.toWei('1000', 'ether') // 1000 Tokens
    const cost = web3.utils.toWei('100', 'ether')
    const amount = web3.utils.toWei('50', 'ether')

    let token, registry

    beforeEach(async () => {
        token = await Token.new(name, symbol, supply)
        registry = await Registry.new(token.address)

        await token.transfer(proposer, cost, { from: executor })
        await token.transfer(challenger, cost, { from: executor })
    })

    describe('Deployment', () => {
        let result

        it('Returns the contract address', async () => {

        })
    })

    describe('Proposals', () => {
        const name = "Square"

        beforeEach(async () => {
            await token.approve(registry.address, cost, { from: proposer })
            await registry.propose(name, { from: proposer })
        })

        it('confirms an item has been proposed', async () => {
            result = await registry.isProposed()
            result.should.equal(true)
        })

        it('updates the contract balance', async () => {
            result = await token.balanceOf(registry.address)
            result.toString().should.equal(cost.toString())
        })
    })

    describe('Challenges', () => {
        const name = "Square"

        beforeEach(async () => {
            await token.approve(registry.address, cost, { from: proposer })
            await registry.propose(name, { from: proposer })

            await token.approve(registry.address, cost, { from: challenger })
            await registry.challenge("Circle", { from: challenger })
        })

        it('confirms an item has been challenged', async () => {
            result = await registry.isChallenged()
            result.should.equal(true)
        })

        it('updates the contract balance', async () => {
            result = await token.balanceOf(registry.address)
            result.toString().should.equal((Number(cost) * 2).toString())
        })
    })

    describe('Voting', () => {
        beforeEach(async () => {
            await token.transfer(voter1, amount, { from: executor })
            await token.delegate(voter1, { from: voter1 })

            await token.approve(registry.address, cost, { from: proposer })
            await registry.propose("Square", { from: proposer })

            await token.approve(registry.address, cost, { from: challenger })
            await registry.challenge("Circle", { from: challenger })

            await registry.vote(true, { from: voter1 })
        })

        describe('success', () => {
            it('updates voting status', async () => {
                result = await registry.hasVoted(1, voter1)
                result.should.equal(true)
            })
        })

        describe('failure', () => {
            it('prevents a voter from voting again', async () => {
                await registry.vote(true, { from: voter1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('Redeeming', () => {
        beforeEach(async () => {
            await token.transfer(voter1, amount, { from: executor })
            await token.transfer(voter2, amount, { from: executor })
            await token.transfer(voter3, amount, { from: executor })

            await token.delegate(voter1, { from: voter1 })
            await token.delegate(voter2, { from: voter2 })
            await token.delegate(voter3, { from: voter3 })

            await token.approve(registry.address, cost, { from: proposer })
            await registry.propose("Square", { from: proposer })

            await token.approve(registry.address, cost, { from: challenger })
            await registry.challenge("Circle", { from: challenger })

            await registry.vote(true, { from: voter1 })
            await registry.vote(false, { from: voter2 })
            await registry.vote(true, { from: voter3 })

            await registry.approveProposal({ from: executor })

            await registry.redeem(1, { from: voter1 })
        })

        describe('success', async () => {
            it('allows redeem status', async () => {
                result = await registry.hasRedeemed(1, voter1)
                result.should.equal(true)
            })
        })

        describe('failure', async () => {
            it('prevents a voter from redeeming again', async () => {
                await registry.redeem(1, { from: voter1 }).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })
})