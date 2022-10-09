const {getNamedAccounts, network, ethers} = require("hardhat");

const {getWeth} = require("./getWeth");
const {networkConfig} = require("../utils/helper-hardhat-config");

async function getLendingPool(account, configuration) {
    const lendingPoolProviderContract = await ethers.getContractAt("ILendingPoolAddressesProvider", configuration.lendingPoolAddressesProvider, account)
    const lendingPoolAddress = await lendingPoolProviderContract.getLendingPool()
    const lendingPoolContract = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account)
    console.log("LendingPoolAddress: ", lendingPoolAddress, lendingPoolContract.address)
    return lendingPoolContract
}

async function approveERC20(account, contractAddress, spenderAddress, amountToSpend) {
    const Erc20Token = await ethers.getContractAt("IERC20", contractAddress, account)
    const tx = await Erc20Token.approve(spenderAddress, amountToSpend)
    await tx.wait(1)

    console.log("Approved spending of token for: ", spenderAddress, " in contract: ", contractAddress, " for amount: ", amountToSpend.toString())
}

async function getBorrowUserData(lendingPool, account) {
    const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(account);
    console.log(`You have ${totalCollateralETH} worth of ETH deposited.`)
    console.log(`You have ${totalDebtETH} worth of ETH borrowed.`)
    console.log(`You can borrow ${availableBorrowsETH} from AAVE.`)
    return {availableBorrowsETH, totalDebtETH}
}

async function getDAIPrice(configuration) {
    const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface", configuration.aggregatorV3Address)
    const priceDetailList = await daiEthPriceFeed.latestRoundData()
    const price = priceDetailList[1]
    console.log(`The DAI/ETH price is ${price.toString()}`)
    return price
}

async function borrowFromAAVE(daiAddress, lendingPool, amountToBorrowInWei, account) {
    const borrowTx = await lendingPool.borrow(daiAddress, amountToBorrowInWei, 1 , 0, account)
    await borrowTx.wait(1)
    console.log(`You have borrowed: ${amountToBorrowInWei} DAI from Aave`)
    return borrowTx
}

async function repayBorrowedDaiToAAVE(amount, daiAddress, lendingPool, account){
    // first need to approve the lending pool address to access our dai to send back to AAVE
    await approveERC20(account, daiAddress, lendingPool.address, amount)

    // repay using the lendingPool.repay function
    const replayTx = await lendingPool.repay(daiAddress, amount, 1, account)
    replayTx.wait(1)

    console.log(`Repayed borrowed amount ${amount} to AAVE`)
}

async function main() {
    const chainId = network.config.chainId;
    const configuration = networkConfig[chainId]

    // the protocol treats everything as an ECR20 token
    const tokenAmount = await getWeth()

    const { deployer } = await getNamedAccounts()
    const lendingPool = await getLendingPool(deployer, configuration)

    // get weth token address
    // approve lending pool to our weth token
    console.log("Approving...")
    await approveERC20(deployer, configuration.wethTokenAddress, lendingPool.address, tokenAmount)

    console.log("Depositing...")
    await lendingPool.deposit(configuration.wethTokenAddress, tokenAmount, deployer, "0")
    console.log("Deposited")


    // Borrow
    // 1. How much do we have in collatoral
    // 2. How much can we borrow
    const {availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, deployer)
    const daiPrice = await getDAIPrice(configuration)
    const amountDaiToBorrow = availableBorrowsETH.toString() * 0.95 * (1 / daiPrice.toNumber())
    console.log(`Amount to borrow from Aave: ${amountDaiToBorrow}`)
    const amountDaiToBorrowWei = ethers.utils.parseEther(amountDaiToBorrow.toString())
    await borrowFromAAVE(configuration.daiContractAddress, lendingPool, amountDaiToBorrowWei, deployer)

    // Replay borrowed DAI
    await repayBorrowedDaiToAAVE(amountDaiToBorrowWei, configuration.daiContractAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)


    // there is still a missing final piece here, as the user still has some DAI interest to pay back to the
    // user still has some DAI that needs to be payed back in interest and will need to manually go get some DAI
    // from the free market and use uniswap to pay back that interest.

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })