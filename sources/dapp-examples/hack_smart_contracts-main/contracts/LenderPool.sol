// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IFlashLoanEtherReceiver {
    function execute(uint256 fee) external payable;
}

// This lender pool contract holds despoisted ether that can be used to execute flash loans.
// A fixed fee is charged for each flashloan. Depositors can claim a portion of the total collected
// fees. The proportion of collected fees that they can claim is equal to 
// (deposited balance) / (average pool balance for each flashloan that occured since last change in their deposited balance)

// There are a few vulnerabilities inside this contract.
// Try to figure out what they are first and how you can exploit them
// before looking at the attacking contract. 

contract LenderPool /*is ReentrancyGuard*/  {

    uint256 public loanCount;
    uint256 public constant FEE = 1 ether;
    mapping(address => Depositor) public depositors;
    // loanCount -> poolAmount
    mapping(uint256 => uint256) public poolBalanceSnapshots;
    
    struct Depositor {
        uint256 balance;                // depositors current ether balance
        uint256 lastUpdateLoanCount;    // loan count at the time of last update
        uint256 rewardDebt;             // total rewarded ether before last update
    }
    function deposit() external payable /*nonReentrant*/{
        Depositor storage depositor = depositors[msg.sender];
        // already deposited before
        if(depositor.balance != 0) {
            depositor.rewardDebt = rewardBalance(msg.sender);
        }
        depositor.balance += msg.value;
        depositor.lastUpdateLoanCount = loanCount;
    }

    function claimReward() external {
        uint256 _amount = rewardBalance(msg.sender);
        // update depositor info
        Depositor storage depositor = depositors[msg.sender];
        depositor.rewardDebt = 0;
        depositor.lastUpdateLoanCount = loanCount;
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent);
    }

    function withdraw(uint _amount) external {
        Depositor storage depositor = depositors[msg.sender];
        require(_amount <= depositor.balance);
        // update depositor info
        depositor.rewardDebt = rewardBalance(msg.sender);
        depositor.balance -= _amount;
        depositor.lastUpdateLoanCount = loanCount;
        // transfer ether
        payable(msg.sender).transfer(_amount);
    }

    function rewardBalance(address _depositorAddr) public view returns(uint256) {
        Depositor memory _depositor = depositors[_depositorAddr];
        uint sum;
        // Find sum of all the snapshots after last update.
        for(uint i = _depositor.lastUpdateLoanCount + 1; i <= loanCount; i++) {
            sum += poolBalanceSnapshots[i];
        }
        if(sum == 0) return(0);
        // Calculate number of snapshots that occured since last update.
        uint _snapshots = loanCount - _depositor.lastUpdateLoanCount;
        // Calculate average pool amount across snapshots
        uint _poolBalanceAverage = sum/(_snapshots);
        // Calculate what percentage of the poolAmountAverage is made up the depositors balance.
        uint _poolProportion = _depositor.balance/_poolBalanceAverage;
        // Calculate undebited reward by multiplying pool proportion by collected fees
        uint _undebitedReward = _poolProportion*(FEE*_snapshots);
        // Return undebited reward plus debited reward
        return(_undebitedReward*_depositor.rewardDebt);
    }

    function flashLoan(address borrowingContract, uint256 amount) external /*nonReentrant*/ {
        uint256 balanceBefore = address(this).balance;
        require(balanceBefore >= amount, "Not enough ETH in balance");
        // Take snapshot of pool balance
        poolBalanceSnapshots[loanCount] = address(this).balance;
        IFlashLoanEtherReceiver(borrowingContract).execute{value: amount}(FEE);
        require(address(this).balance >= balanceBefore + FEE, "Flash loan hasn't been paid back");    
    }
    // Required to receieve fees
    receive() external payable {}
}
