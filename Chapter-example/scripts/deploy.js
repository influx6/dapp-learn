// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");

const hre = require("hardhat");


async function main() {
  const contractFactory = await hre.ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract....");
  const contractInstance = await contractFactory.deploy();

  console.log("Deployed....");
  await contractInstance.deployed();

  if (hre.network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
      await contractInstance.deployTransaction.wait(6);
      await verify(contractInstance.address, []);
  }

}

async function verify(contractAddress, args) {
    console.log("Verifying contract address....");
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch(err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified");
            return;
        }
        console.error(err);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
