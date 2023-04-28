const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token Bank', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('TokenBankChallenge', deployer);
        const AttackerFactory = await ethers.getContractFactory('TokenBankChallengeAttacker', attacker);
        this.attackerContract = await AttackerFactory.deploy();
        this.tokenBank = await Factory.deploy(this.attackerContract.address);
    });

    it('Exploit', async function () {
        await this.attackerContract.attack(this.tokenBank.address);
        const balance = await this.tokenBank.balance();
        console.log(balance.toString());
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.tokenBank.isComplete()
        ).to.be.eq(true);
    });
});