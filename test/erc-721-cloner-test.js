const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deploy(name, ...params) {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.deploy(...params).then(f => f.deployed());
}

describe('factories', function() {
    for (const name of [ 'ERC721Cloner', 'ERC721PresetMinterPauserAutoIdUpgradeable' ]) {
        describe(name, function() {
            before(async function() {
                this.accounts = await ethers.getSigners();
                this.factory = await deploy(name);
            });

            it('factory deployment cost', async function() {
                const { gasUsed: createGasUsed, events } = await this.factory.deployTransaction.wait();
                console.log(`${name}.deploy: ${createGasUsed.toString()}`);
            });

            it('token deployment cost', async function() {
                const tx1 = await this.factory.createToken('name', 'symbol', 'baseUri', this.accounts[0].address, { from: this.accounts[0].address });

                const { gasUsed: createGasUsed, events } = await tx1.wait();
                const { address } = events.find(Boolean);

                console.log(`${name}.createToken: ${createGasUsed.toString()}`);
                console.log(`${name}.createToken.from: ${this.accounts[0].address}`);
                console.log(`${name}.createToken.address: ${address.toString()}`);

                const { interface } = await ethers.getContractFactory('ERC721PresetMinterPauserAutoIdUpgradeable');
                const instance = new ethers.Contract(address, interface, this.accounts[0]);


                const mintTx = await instance.mint(this.accounts[0].address, { from: this.accounts[0].address });

                const mintTx2 = await instance.mint(this.accounts[1].address, { from: this.accounts[0].address });


                const balanceOf0 = await instance.balanceOf(this.accounts[0].address)
                console.log(`${name}.balanceOfAccount0:           ${balanceOf0}`);

                const balanceOf1 = await instance.balanceOf(this.accounts[1].address)
                console.log(`${name}.balanceOfAccount1:           ${balanceOf1}`);


                // const tx2 = await instance.transfer(this.accounts[1].address, 100, { from: this.accounts[0].address });
                // const { gasUsed: transferGasUsed } = await tx2.wait();
                // console.log(`ERC20.transfer:           ${transferGasUsed.toString()}`);
            });
        });
    }
});