const { ethers, deployments, getNamedAccounts, network} = require("hardhat");
const {developmentChains, INITIAL_SUPPLY} = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");

developmentChains.includes(network.name) ?
    describe("Mica20", async  () => {
        let micaContract, namedAccounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            // deploy contracts
            await deployments.fixture("all")

            // get raffle contract and entrance fee
            micaContract = await ethers.getContract("Mica20", deployer);
        });

        describe("Deployment", async () => {
            it("should have being deployed", async () => {
                assert(micaContract.address);
            })

            it("Should have correct INITIAL_SUPPLY of token ", async () => {
                const totalSupply = await micaContract.totalSupply();
                assert.equal(totalSupply.toString(), INITIAL_SUPPLY);
            });
        })


    }) : describe.skip("skip staging tests");
