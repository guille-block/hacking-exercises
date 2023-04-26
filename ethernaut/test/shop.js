const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Shop', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const ShopFactory = await ethers.getContractFactory('Shop', deployer);
        this.shop = await ShopFactory.deploy();

    });
    //given the gas consumption change the return value once 28096381 or lower is the gas left
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('ShopAttacker', attacker);
        this.attackerShop = await Factory.deploy();
        await this.attackerShop.attack(this.shop.address)
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.shop.price()
        ).to.be.eq(0);
    });
});