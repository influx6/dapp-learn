const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");

developmentChains.includes(network.name) ?
    describe("BasicNFT", async  () => {
        let chainId = network.config.chainId
        const networkConfiguration = networkConfig[chainId]

        let contractInstance, namedAccounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            // deploy contracts
            await deployments.fixture("all")

            // get raffle contract and entrance fee
            contractInstance = await ethers.getContract("BasicNFT", deployer);
        });

        describe("Deployment", async () => {
            it("should have being deployed", async () => {
                assert(contractInstance.address);
            })

            it("Should have correct tokenCounter of 0 ", async () => {
                const tokenCounter = await contractInstance.getTokenCounter();
                assert.equal(tokenCounter.toString(), "0");
            });
        })

        describe("mint", async () => {
            it("Should be able to mint an nft ", async () => {
                await expect(contractInstance.mintNft()).not.be.reverted

                const tokenCounter = await contractInstance.getTokenCounter();
                assert.equal(tokenCounter.toString(), "1");
            });
        })

    }) : describe.skip("skip staging tests");
