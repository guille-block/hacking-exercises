const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Elevator', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const ElevatorFactory = await ethers.getContractFactory('Elevator', deployer);
        this.elevator = await ElevatorFactory.deploy();
    });
    // After the first call the value returns true. First false then true
    it('Exploit', async function () {
        const Factory = await ethers.getContractFactory('ElevatorAttacker', attacker);
        this.attackerElevator = await Factory.deploy();
        await this.attackerElevator.attack(this.elevator.address)
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.elevator.top()
        ).to.be.eq(true);
    });
});