const hre = require("hardhat");

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

module.exports = {
    verify,
}