const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Recovery', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('Recovery', deployer);
        this.recovery = await Factory.deploy();
        await this.recovery.generateToken("SimpleToken 1", 10000, {value: ethers.utils.parseUnits("0.001")});
        
    });

    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('RecoveryAttacker', deployer);
        await Factory.deploy(this.recovery.address, "0x01");
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        const calcAddress =
        "0x" +
        ethers.utils
          .keccak256(
            ethers.utils.RLP.encode([
                this.recovery.address,
                ethers.utils.hexZeroPad("0x01"),
            ])
          ).slice(26);

        expect(
            await ethers.provider.getBalance(calcAddress)
        ).to.be.eq(0);
    });
});