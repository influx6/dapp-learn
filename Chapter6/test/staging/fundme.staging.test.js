const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helpers/helper-hardhat-config.js");
const { assert, expect } =  require("chai");

!developmentChains.includes(network.name) ?
    describe("FundMe::Staging", async  () => {
        describe("allow people to fund and withdraw from fund", async () => {
            let fundMe, deployer, mockV3Aggregator;
            const sendValue = ethers.utils.parseEther("1");

            beforeEach(async () => {
                // get accounts
                deployer = (await getNamedAccounts()).deployer;

                // get deployed contract
                fundMe = await ethers.getContract("FundMe", deployer);
            });

            it("should set the aggregator account correctly", async () => {
                await fundMe.fund({ value: sendValue });
                await fundMe.withdrawal();

                const endFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                assert.equal(endFundMeBalance,"0");
            });
        });
    }) : describe.skip("skipped staging test");
