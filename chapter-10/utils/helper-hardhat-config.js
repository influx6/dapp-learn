const {ethers} = require("hardhat");

const INITIAL_SUPPLY = "1000000000000000000000000"
const networkConfig = {
    5: {
        name: "goerli",
        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        wethTokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        aggregatorV3Address: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiContractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    },
    31337: {
        name: "hardhat",
        lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        wethTokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        aggregatorV3Address: "0x773616E4d11A78F511299002da57A0a94577F1f4",
        daiContractAddress: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    },
}

const developmentChains = ["hardhat", "localhost"];

module.exports = { networkConfig, developmentChains, INITIAL_SUPPLY };