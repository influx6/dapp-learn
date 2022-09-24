const { assert } = require("chai");
const hre = require("hardhat");
const {ethers} = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorageInstance;
  let SimpleStorageFactory

  beforeEach(async () => {
      SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

      simpleStorageInstance = await SimpleStorageFactory.deploy();
      await simpleStorageInstance.deployed();
  });

  it("should start with a favorite number of zero", async () => {
     const currentValue = await simpleStorageInstance.retrieve();
     assert.equal("0", currentValue.toString())
  });


    it("should should update when we call store", async () => {
        const transactionResponse = await simpleStorageInstance.store("7");
        await transactionResponse.wait(1);

        const currentValue = await simpleStorageInstance.retrieve();
        assert.equal("7", currentValue.toString())
    });
});
