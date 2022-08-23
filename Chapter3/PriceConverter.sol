// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    // Use Georli Chainlink address
    address constant private chainLinkAggregatorInterfaceAddress = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e;
    int256 constant private oneWei = 1e10;

    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(chainLinkAggregatorInterfaceAddress);
        (, int256 answer, , ,) = priceFeed.latestRoundData();

        // ETH/USD rate in 18 bits (wei)
        return uint256(answer * oneWei);
    }

    function getConversionRate(uint256 ethAmount) internal view returns (uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        // the actual ETH/USD conversion rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}