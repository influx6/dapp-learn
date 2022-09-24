require("dotenv").config();

const ethers = require("ethers");
const fs = require("fs-extra");

async function deploy() {
    
}

deploy()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});