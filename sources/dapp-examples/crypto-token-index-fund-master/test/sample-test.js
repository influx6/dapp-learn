const IndexFundABI = require("../src/artifacts/src/contracts/IndexFund.sol/IndexFund.json");
const hre = require("hardhat");

require('chai')
    .use(require('chai-as-promised'))
    .should()

describe("Token contract", function () {

  let indexFundContract

  beforeEach(async () => {
    const IndexFund = await ethers.getContractFactory("IndexFund");
    indexFundContract = await IndexFund.deploy();
  })

  it("should get the price per token", async function () {
    const pricePerToken = await indexFundContract.pricePerToken()
    console.log("price per token = ", pricePerToken.toString() / 1e18)
    pricePerToken.toString().should.not.equal(0)
  });

  it("should return 300 ether balance of contract", async function () {
    // unlock account and send 300 ether
    const user1Address = "0x51c2cef9efa48e08557a361b52db34061c025a1b"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user1Address],
    });
    const user1 = await ethers.getSigner(user1Address)
    await user1.sendTransaction({
      to: indexFundContract.address,
      value: ethers.utils.parseEther("300") 
    })

    const contractBalance = await indexFundContract.getBalance()
    console.log("balance of contract in ether = ", contractBalance.toString() / 1e18)
    contractBalance.toString().should.not.equal(0)
  });


  it("should get the price of all defi tokens", async function () {
    await indexFundContract.getPricesOfAllCoins()
    const uniPrice = await indexFundContract.uniPrice();
    console.log("uniwwap token price in ether = ", uniPrice.toString() / 1e18)

    const compPrice = await indexFundContract.compPrice();
    console.log("compount token price in ether = ", compPrice.toString() / 1e18)

    const snxPrice = await indexFundContract.snxPrice();
    console.log("synthetix token price in ether = ", snxPrice.toString() / 1e18)

    const mkrPrice = await indexFundContract.mkrPrice();
    console.log("maker token price in ether = ", mkrPrice.toString() / 1e18)

    const kncPrice = await indexFundContract.kncPrice();
    console.log("kyber network crystal token price = ", kncPrice.toString() / 1e18)

    uniPrice.toString().should.not.equal(0)
    compPrice.toString().should.not.equal(0)
    snxPrice.toString().should.not.equal(0)
    mkrPrice.toString().should.not.equal(0)
    kncPrice.toString().should.not.equal(0)
  });

  it("should buy 3 tokens", async function () {
    // unlock account
    const user2Address = "0x35d0Ca92152d1fEA18240d6C67C2ADfE0cCA287C"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user2Address],
    });
    const user2 = await ethers.getSigner(user2Address)
  
    // buying token
    const provider = ethers.provider;

    let balanceTokens = await indexFundContract.balanceOf(user2Address);
    let balanceEther = await provider.getBalance(user2Address);
    console.log("before buying ether balance of user2 = ", balanceEther.toString() / 1e18); 
    console.log("before buying token balance of user2 = ", balanceTokens.toString() / 1e18)

    await indexFundContract.connect(user2).buyToken(3, { value: ethers.utils.parseEther("10") }); 

    balanceTokens = await indexFundContract.balanceOf(user2Address);
    balanceEther = await provider.getBalance(user2Address);
    console.log("after buying ether balance of user2 = ", balanceEther.toString() / 1e18); 
    console.log("after buying tokens balance of user2 = ", balanceTokens.toString())

    balanceTokens.toString().should.equal("3")
  });

  it("should test the defi increased and redeemToken function", async function () {

    // put ether in contract
    const user1Address = "0x51c2cef9efa48e08557a361b52db34061c025a1b"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user1Address],
    });
    const user1 = await ethers.getSigner(user1Address)
    await user1.sendTransaction({
      to: indexFundContract.address,
      value: ethers.utils.parseEther("23") 
    })

    // buying token
    const user2Address = "0x35d0Ca92152d1fEA18240d6C67C2ADfE0cCA287C"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [user2Address],
    });
    const user2 = await ethers.getSigner(user2Address)
  
    
    const provider = ethers.provider;

    let balanceTokens = await indexFundContract.balanceOf(user2Address);
    let balanceEther = await provider.getBalance(user2Address);
    console.log("before buying ether balance of user2 = ", balanceEther.toString() / 1e18); 
    console.log("before buying token balance of user2 = ", balanceTokens.toString() / 1e18)

    await indexFundContract.connect(user2).buyToken(3, { value: ethers.utils.parseEther("10") }); 

    balanceTokens = await indexFundContract.balanceOf(user2Address);
    balanceEther = await provider.getBalance(user2Address);
    console.log("after buying ether balance of user2 = ", balanceEther.toString() / 1e18); 
    console.log("after buying tokens balance of user2 = ", balanceTokens.toString())

    // defi increased
    await indexFundContract.defiIncreased();

    // redeem tokens
    await indexFundContract.connect(user2).redeemToken(); 

    balanceTokens = await indexFundContract.balanceOf(user2Address);
    balanceEther = await provider.getBalance(user2Address);
    console.log("after redeeming ether balance of user2 = ", balanceEther.toString() / 1e18); 
    console.log("after redeeming tokens balance of user2 = ", balanceTokens.toString())
  });

});
