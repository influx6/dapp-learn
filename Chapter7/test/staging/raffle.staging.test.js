const { ethers, getNamedAccounts, network} = require("hardhat");
const {developmentChains} = require("../../utils/helper-hardhat-config");
const { assert, expect } =  require("chai");

!developmentChains.includes(network.name) ?
    describe("Raffle", async  () => {
        let raffleContract, raffleEntranceFee, raffleTimeInterval, namedAccounts, deployer, player;

        beforeEach(async () => {
            // deploy with hardhat-deploy
            namedAccounts = await getNamedAccounts();

            // deployers and clients
            deployer = namedAccounts.deployer;
            player = namedAccounts.player;

            // get raffle contract and entrance fee
            raffleContract = await ethers.getContractAt("Raffle", "0x3A828830628278A2BA9997C2eCBa83790f80E681", deployer);
            raffleEntranceFee = await raffleContract.getEntranceFee();
            console.log("Entrance fee: ", raffleEntranceFee.toString());

            raffleTimeInterval = await raffleContract.getTimeInterval();
            console.log("Time Interval: ", raffleTimeInterval.toString());
        });

        describe("fulfillRandomWords", async () => {

            it("should work with live chainlink keepers and chainlink VRF, we get a random winner", async () => {
                const startingTimestamp = await raffleContract.getLatestTimestamp();
                await new Promise(async (resolve, reject) => {

                    raffleContract.once("Raffle__WinnerPicked",async () => {
                        console.log("Received ready event");

                        try {
                            await expect(raffleState.getPlayer(0)).to.be.reverted;

                            const recentWinner = await raffleContract.getRecentWinner();
                            assert(recentWinner)

                            const raffleState = await raffleContract.getRaffleState();
                            assert.equal(raffleState.toString(), "0");

                            const endingTimestamp = await raffleContract.getLatestTimestamp();
                            assert.isTrue(endingTimestamp > startingTimestamp);

                            const remainingPlayers = await raffleContract.getTotalPlayers();
                            assert.equal(remainingPlayers.toString(), "0")

                            const contractBalance = await raffleContract.provider.getBalance(raffleContract.address);
                            assert.equal(contractBalance.toString(), "0")

                            resolve()
                        } catch(e) {
                            reject(e)
                        }
                    });

                    console.log("Entering raffle with fee: ", raffleEntranceFee.toString(), " as in: ", ethers.utils.parseEther("0.01").toString())
                    await raffleContract.connect(deployer).enterRaffle({ value: raffleEntraceFee });

                    console.log("Get balance of contract ")
                    const contractBalance = await raffleContract.provider.getBalance(raffleContract.address);
                    assert.notEqual(contractBalance.toString(), "0")
                    console.log("Validated contract now has balance: ", contractBalance.toString())

                })
            })
        })


    }) : describe.skip("skip staging tests");
