const { deployments, ethers, getNamedAccounts, network} = require("hardhat");
const {developmentChains} = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");

!developmentChains.includes(network.name) ?
    describe("Raffle", async  () => {
        let raffleContract, namedAccounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            raffleContract = await ethers.getContract("Raffle", deployer);
        });

        describe("constructor", async () => {
            it("should set the aggregator account correctly", async () => {

            })
        });


    }) : describe.skip("skip staging tests");
