const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Dex 2', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DexFactory = await ethers.getContractFactory('DexTwo', deployer);
        this.dex2 = await DexFactory.deploy();
        const TokenFactory = await ethers.getContractFactory('SwappableTokenTwo', deployer);
        this.token1 = await TokenFactory.deploy(this.dex2.address, "token 1", "TKN1", 110);
        this.token2 = await TokenFactory.deploy(this.dex2.address, "token 2", "TKN2", 110);

        await this.token1.transfer(attacker.address, 10);
        await this.token2.transfer(attacker.address, 10);
        
        await this.token1.transfer(this.dex2.address, 100);    
        await this.token2.transfer(this.dex2.address, 100);

        await this.dex2.setTokens(this.token1.address, this.token2.address);
    });
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('Dex2Attacker', attacker);
        await Factory.deploy(this.dex2.address);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.token1.balanceOf(attacker.address)
        ).to.be.eq(110);

        expect(
            await this.token2.balanceOf(attacker.address)
        ).to.be.eq(110);

        expect(
            await this.token1.balanceOf(this.dex2.address)
        ).to.be.eq(0);

        expect(
            await this.token2.balanceOf(this.dex2.address)
        ).to.be.eq(0);
    });
});