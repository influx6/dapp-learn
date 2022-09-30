const { deployments, ethers, getNamedAccounts} = require("hardhat");
const { assert, expect } =  require("chai");

describe("FundMe", async  () => {
    let fundMe, deployer, mockV3Aggregator;

    beforeEach(async () => {
        // deploy with hardhat-deploy
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);

        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    });

    describe("constructor", async () => {
        it("should set the aggregator account correctly", async () => {
            const response = await fundMe.priceFeed();
            assert.equal(mockV3Aggregator.address, response);
        })
    });

    describe("fund", async () => {
        it("should  fail if not enough of amount is sent", async () => {
            await expect(fundMe.fund()).to.be.revertedWith("Minimum of 1 ether allowed");
        })
    });

});