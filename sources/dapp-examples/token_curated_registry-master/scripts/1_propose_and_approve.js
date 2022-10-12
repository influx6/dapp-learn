const Token = artifacts.require("Token")
const Registry = artifacts.require("Registry")

module.exports = async function (callback) {
    const [executor, proposer, challenger, voter1, voter2, voter3, voter4] = await web3.eth.getAccounts()

    const cost = web3.utils.toWei('100', 'ether')

    const token = await Token.deployed()

    // Transfer funds to a proposer & challenger
    await token.transfer(proposer, cost, { from: executor })
    await token.transfer(challenger, cost, { from: executor })

    // Allow voters to delegate themselves
    await token.delegate(voter1, { from: voter1 })
    await token.delegate(voter2, { from: voter2 })
    await token.delegate(voter3, { from: voter3 })
    await token.delegate(voter4, { from: voter4 })

    const registry = await Registry.deployed()

    console.log(`User making a proposal...\n`)

    // Token holder makes a proposal
    await token.approve(registry.address, cost, { from: proposer })
    await registry.propose("Square", { from: proposer })

    console.log(`User making a challenge...\n`)

    // Another token holder makes a challenge
    await token.approve(registry.address, cost, { from: challenger })
    await registry.challenge("Circle", { from: challenger })

    console.log(`Voting period begins...\n`)

    // Allow other token holders to vote
    await registry.vote(true, { from: voter1 })
    await registry.vote(false, { from: voter2 })
    await registry.vote(true, { from: voter3 })

    console.log(`Approve proposal or challenge...\n`)

    // Deployer executes for approval
    await registry.approveProposal({ from: executor })

    // Fetch & display List
    const listStream = await registry.getPastEvents('List', { fromBlock: 0, toBlock: 'latest' })
    const list = listStream.map(event => event.returnValues)

    console.log(`Current List:`)
    console.log(list)

    console.log(`\nAllowing voters to redeem tokens...`)
    await registry.redeem(1, { from: voter1 })
    await registry.redeem(1, { from: voter3 })

    console.log(`Showing token balances...\n`)

    let balance

    balance = await token.balanceOf(proposer)
    console.log(`Proposer balance: ${web3.utils.fromWei(balance.toString(), 'ether')}\n`)

    balance = await token.balanceOf(challenger)
    console.log(`Challenger balance: ${web3.utils.fromWei(balance.toString(), 'ether')}\n`)

    balance = await token.balanceOf(voter1)
    console.log(`Voter1: ${web3.utils.fromWei(balance.toString(), 'ether')}`)

    balance = await token.balanceOf(voter2)
    console.log(`Voter2: ${web3.utils.fromWei(balance.toString(), 'ether')}`)

    balance = await token.balanceOf(voter3)
    console.log(`Voter3: ${web3.utils.fromWei(balance.toString(), 'ether')}`)

    callback()
}