// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "hardhat/console.sol";

//import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error RandomIPFSNFT__BelowMintFee();
error AlreadyInitialized();
error RangeOutOfBounds();
error OnlyOwnerAllowed();

contract RandomIPFSNFT is ERC721URIStorage, VRFConsumerBaseV2 {
    enum Breed {
        PUG,
        SHIBA_INU,
        SAINT_BERNARD
    }

    address private immutable i_owner;
    uint256 private immutable i_mintFee;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    VRFCoordinatorV2Interface private immutable I_COORDINATOR;

    /** const vars **/
    uint16 private constant requestConfirmationValue = 3;
    uint16 private constant requestTotalWords = 1;
    uint256 internal constant MAX_CHANCE_VALUE = 100;

    /** state storage **/
    string[] internal s_dogTokenURIS;
    uint256 private s_tokenCounter;
    bool private s_initialized;

    // know which requestId is for which sender/minter.
    mapping(uint256 => address) public s_requestIdToSender;
    mapping(uint256 => Breed) private s_tokenIdToBreed;

    /** Events **/
    event NFTRequested(uint256 indexed requestId, address requester);
    event NFTMinted(Breed breed, address minter);

    constructor(address vrfCoordinatorV2, uint64 subscriptionId, bytes32 gasLane, uint256 mintFee, uint32 callbackGasLimit, string[3] memory tokenURIS) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random NFT", "RIN") {
        // constant vars
        i_owner = msg.sender;
        i_gasLane = gasLane;
        i_mintFee = mintFee;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        I_COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        _initializeContract(tokenURIS);
    }

    modifier m_belowMintFee {
        if (msg.value < i_mintFee) {
            revert RandomIPFSNFT__BelowMintFee();
        }
        _;
    }

    modifier m_onlyOwner {
        if (address(msg.sender) != i_owner) {
            revert OnlyOwnerAllowed();
        }
        _;
    }

    fallback() external payable {
        requestNft();
    }

    receive() external payable {
        requestNft();
    }

    function requestNft() m_belowMintFee public payable returns (uint256 requestId) {
        requestId = I_COORDINATOR.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            requestConfirmationValue,
            i_callbackGasLimit,
            requestTotalWords
        );

        s_requestIdToSender[requestId] = msg.sender;
        emit NFTRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address minter = s_requestIdToSender[requestId];
        uint256 currenTokenCounter = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;

        uint256 moddedRNG = randomWords[0] % MAX_CHANCE_VALUE;
        Breed dogBreed = getBreedFromModdedRng(moddedRNG);

        _safeMint(minter, currenTokenCounter);
        _setTokenURI(currenTokenCounter, s_dogTokenURIS[uint256(dogBreed)]);

        emit NFTMinted(dogBreed, minter);
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE_VALUE];
    }

    function getBreedFromModdedRng(uint256 moddedRng) public pure returns (Breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChanceArray();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            // if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArray[i]) {
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
                return Breed(i);
            }
            // cumulativeSum = cumulativeSum + chanceArray[i];
            cumulativeSum = chanceArray[i];
        }
        revert RangeOutOfBounds();
    }

    function _initializeContract(string[3] memory dogTokenUris) private {
        if (s_initialized) {
            revert AlreadyInitialized();
        }
        s_dogTokenURIS = dogTokenUris;
        s_initialized = true;
    }

    function getTokenCounter() public returns (uint256) {
        return s_tokenCounter;
    }

    function withdraw() public m_onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getDogTokenURIS(uint256 index) public returns (string memory) {
        return s_dogTokenURIS[index];
    }
}