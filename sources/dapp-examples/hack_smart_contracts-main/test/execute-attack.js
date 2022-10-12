const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Execute Attack", function () {
  let deployer, hacker;
  // Pool has 1000 ETH in balance
  const ETHER_IN_POOL = ethers.utils.parseEther('1000');

  // Receiver has 10 ETH in balance
  const ETHER_IN_RECEIVER = ethers.utils.parseEther('10');

  before(async function () {
    // setup scenario //
    [deployer, hacker] = await ethers.getSigners();

    const LenderPoolFactory = await ethers.getContractFactory('LenderPool', deployer);
    const FlashLoanReceiverFactory = await ethers.getContractFactory('FlashLoanReceiver', deployer);

    this.pool = await LenderPoolFactory.deploy();
    await this.pool.deposit({ value: ETHER_IN_POOL });

    expect(await ethers.provider.getBalance(this.pool.address)).to.be.equal(ETHER_IN_POOL);
    expect(await this.pool.FEE()).to.be.equal(ethers.utils.parseEther('1'));

    this.receiver = await FlashLoanReceiverFactory.deploy(this.pool.address);
    await deployer.sendTransaction({ to: this.receiver.address, value: ETHER_IN_RECEIVER });

    expect(await ethers.provider.getBalance(this.receiver.address)).to.be.equal(ETHER_IN_RECEIVER);

    // Hacker starts with 0.1 ETH in balance
    await ethers.provider.send("hardhat_setBalance", [
      hacker.address,
      "0x16345785d8a0000", // 0.1 ETH
    ]);

    this.hackerInitialEthBalance = await ethers.provider.getBalance(hacker.address);

    expect(
      await ethers.provider.getBalance(hacker.address)
    ).to.equal(ethers.utils.parseEther('0.1'));

  });
  it('Exploit', async function () {
    const AttackFactory = await ethers.getContractFactory('Attack', hacker)
    this.attack = await AttackFactory.deploy(this.pool.address, this.receiver.address)
    await this.attack.flashLoanAttack()
  });

  after(async function () {
    // success conditions //

    // All ETH has been drained from the receiver and the pool
    expect(
      await ethers.provider.getBalance(this.receiver.address)
    ).to.be.equal('0');
    expect(
      await ethers.provider.getBalance(this.pool.address)
    ).to.be.equal('0');

    // Not checking exactly how much is the final balance of the hacker,
    // because it'll depend on how much gas the hacker spends in the attack
    // If there were no gas costs, it would be balance before attack + ETHER_IN_POOL + ETHER_IN_RECIEVER

    const hackerFinalEthBalance = await ethers.provider.getBalance(hacker.address)
    expect(hackerFinalEthBalance).to.be.gt(this.hackerInitialEthBalance);
    
    console.log(`${ethers.utils.formatEther(hackerFinalEthBalance)} is approx. ${
      +ethers.utils.formatEther(this.hackerInitialEthBalance) + +ethers.utils.formatEther(ETHER_IN_POOL) + +ethers.utils.formatEther(ETHER_IN_RECEIVER)
    }`)

  });
});
