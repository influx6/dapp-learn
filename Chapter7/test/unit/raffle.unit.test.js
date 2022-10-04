const { deployments, ethers, getNamedAccounts, network} = require("hardhat");
const {developmentChains, networkConfig } = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");

developmentChains.includes(network.name) ?
    describe("Raffle", async  () => {
        const chainId = network.config.chainId;
        const netConfig = networkConfig[chainId];

        let raffleContract, raffleEntraceFee, mockVRFCoordinatorV2Mock, namedAccounts, accounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            accounts = await ethers.getSigners();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            await deployments.fixture(["all"]);

            raffleContract = await ethers.getContract("Raffle", deployer);
            raffleEntraceFee = await raffleContract.getEntranceFee();

            mockVRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer);
        });

        describe("constructor", async () => {
            it("should create the raffle contract open state", async () => {
                const raffleState = await raffleContract.getRaffleState();
                assert.equal(raffleState.toString(), "0");
            })
            it("should create the raffle contract correct interval value", async () => {
                const timeInterval = await raffleContract.getTimeInterval();
                assert.equal(timeInterval.toString(), netConfig.timeInterval.toString());
            })
            it("should create the raffle contract correct requestConfirmations value", async () => {
                const value = await raffleContract.getRequestConfirmations();
                assert.equal(value.toString(), "3");
            })
            it("should create the raffle contract correct entranceFee value", async () => {
                const value = await raffleContract.getEntranceFee();
                assert.equal(value.toString(), netConfig.entranceFee.toString());
            })
            it("should create the raffle contract correct owner", async () => {
                const value = await raffleContract.getOwner();
                assert.equal(value.toString(), accounts[0].address);
            })
        });

        describe("enterRaffle", async () => {
            it("should add a new player with enough eth", async () => {
                await raffleContract.enterRaffle({ value: raffleEntraceFee });
                const totalPlayers = await raffleContract.getTotalPlayers();
                assert.equal(1, totalPlayers);

                const recordedPlayer = await raffleContract.getPlayer(0);
                assert.equal(recordedPlayer, accounts[0].address)
                assert.equal(recordedPlayer, deployer)
            })
            it("should revert when not enough eth is sent", async () => {
                // await expect(raffleContract.enterRaffle()).to.be.revertedWithCustomError(raffleContract, "Raffle__BelowEntranceFee");
                await expect(raffleContract.enterRaffle()).to.be.reverted;
            })
        })

    }) : describe.skip("skip unit tests");
