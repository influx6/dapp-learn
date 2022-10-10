const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { developmentChains, networkConfig } = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");
const {min} = require("hardhat/internal/util/bigint");

developmentChains.includes(network.name) ?
    describe("RandomIPSNFT", async  () => {
        let chainId = network.config.chainId
        const networkConfiguration = networkConfig[chainId]

        let contractInstance, mockVRFCoordinatorV2Mock, namedAccounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            // deploy contracts
            await deployments.fixture("all")

            // get raffle contract and entrance fee
            contractInstance = await ethers.getContract("RandomIPFSNFT", deployer);
            mockVRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
        });

        describe("Deployment", async () => {
            it("should have being deployed", async () => {
                assert(contractInstance.address);
            })

            it("Should have been initialized", async () => {
                const contractInitialized = await contractInstance.getInitialized();
                assert.equal(contractInitialized.toString(), "true");
            });

            it("Should have correct tokenCounter of 0 ", async () => {
                const tokenCounter = await contractInstance.getTokenCounter();
                assert.equal(tokenCounter.toString(), 0);
            });
        })

        describe("mint", async () => {
            it("Should be able to mint an nft ", async () => {
                const mintFee = await contractInstance.getMintFee()
                assert(mintFee)

                const tx = await contractInstance.requestNFT({ value: mintFee.toString() })
                const txR = await tx.wait(1)
                const requestId = txR.events[1].args.requestId
                assert(requestId)

                await mockVRFCoordinatorV2Mock.fulfillRandomWords(
                    requestId,
                    contractInstance.address,
                );

                const tokenCounter = await contractInstance.getTokenCounter();
                assert.equal(tokenCounter.toString(), "1");
            });
        })

    }) : describe.skip("skip staging tests");
