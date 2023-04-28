const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Guess the secret number challege', function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory('GuessTheSecretNumberChallenge', deployer);
        this.guessTheSecretNumberChallenge = await Factory.deploy({value: ethers.utils.parseEther("1")});
    });

    it('Exploit', async function () {
      for(let i = 0; i<256; i++) {
        if(ethers.utils.keccak256(i) == "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365") {
            let attackerInstance = this.guessTheSecretNumberChallenge.connect(attacker)
            await attackerInstance.guess(i, {value: ethers.utils.parseEther("1")})
        }
      }
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(
            await this.guessTheSecretNumberChallenge.isComplete()
        ).to.be.eq(true);
    });
});