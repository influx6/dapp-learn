const { deployments, ethers, getNamedAccounts, network} = require("hardhat");
const { assert, expect } =  require("chai");
const {developmentChains} = require("../../helpers/helper-hardhat-config");

developmentChains.includes(network.name) ?
describe("FundMe", async  () => {
    let fundMe, FundMe_NotOwner, deployer, mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");

    beforeEach(async () => {
        // deploy with hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);

        fundMe = await ethers.getContract("FundMe", deployer);
        FundMe_NotOwner
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    });

    describe("constructor", async () => {
        it("should set the aggregator account correctly", async () => {
            const response = await fundMe.priceFeed();
            assert.equal(mockV3Aggregator.address, response);
        })
    });

    describe("withdraw", async () => {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue });
        })

        it("should allow to withdraw with multiple fundders", async () => {
            const accounts = await ethers.getSigners();
            for (let i = 0; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i]);
                await fundMeConnectedContract.fund({ value: sendValue });
            }

            // assert accounts have amount in fund listj
            for (let i = 0; i < 6; i++) {
                const connectedFundedAccountAmount = await fundMe.addressToAmountFunded(accounts[i].address);
                assert.notEqual(0, connectedFundedAccountAmount)
            }

            const startFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startFundDeployerBalance = await fundMe.provider.getBalance(deployer);
            // Act
            const transactionResponse = await fundMe.withdrawal();
            const transactionReceipt = await transactionResponse.wait(1);

            // get gasCost = effective gas price * gas used;
            const gasCost = transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice);

            const endFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endFundDeployerBalance = await fundMe.provider.getBalance(deployer);

            // Assert
            assert.equal(endFundMeBalance, 0);
            assert.equal(endFundDeployerBalance.add(gasCost).toString(), startFundMeBalance.add(startFundDeployerBalance).toString());

            for (let i = 0; i < 6; i++) {
                const connectedFundedAccountAmount = await fundMe.addressToAmountFunded(accounts[i].address);
                assert.equal(0, connectedFundedAccountAmount)
            }

        })

        it("should only be withdrawable by owner", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerContract = await fundMe.connect(attacker);

            await expect(attackerContract.withdrawal()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")

        })

        it("should be able to withdraw funds", async () => {
            // Arrange
            const startFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const startFundDeployerBalance = await fundMe.provider.getBalance(deployer);
            // Act
            const transactionResponse = await fundMe.withdrawal();
            const transactionReceipt = await transactionResponse.wait(1);

            const endFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
            const endFundDeployerBalance = await fundMe.provider.getBalance(deployer);

            // get gasCost = effective gas price * gas used;
            const gasCost = transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice);

            // Assert
            assert.equal(endFundMeBalance, 0);
            assert.equal(endFundDeployerBalance.add(gasCost).toString(), startFundMeBalance.add(startFundDeployerBalance).toString());
        })
    });

    describe("fund", async () => {
        it("should  fail if not enough of amount is sent", async () => {
            await expect(fundMe.fund()).to.be.revertedWith("Minimum of 1 ether allowed");
        })

        it("should update amount datastructure", async () => {
            await fundMe.fund({ value: sendValue });
            const response = await fundMe.addressToAmountFunded(deployer);
            assert.equal(sendValue.toString(), response.toString());
        })

        it("should add funders to funders array", async () => {
            await fundMe.fund({ value: sendValue });
            const funder = await fundMe.funders(0);
            assert.equal(deployer, funder);
        })
    });

}) : describe.skip("skip unit tests");