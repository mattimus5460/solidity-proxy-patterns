const hre = require("hardhat");

async function main() {
  const ERC721Cloner = await hre.ethers.getContractFactory("ERC721Cloner");
  const clonerContract = await ERC721Cloner.deploy();

  await clonerContract.deployed();

  console.log("ERC721Cloner deployed to:", clonerContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
