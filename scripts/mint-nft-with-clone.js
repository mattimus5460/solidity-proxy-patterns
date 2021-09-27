const hre = require("hardhat");
const {ethers} = require("hardhat");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/dist/src/helpers");

async function main() {

  const accounts = await ethers.getSigners();

  const ERC721Cloned = await hre.ethers.getContractFactory("ERC721PresetMinterPauserAutoIdUpgradeable");
  const ERC721ClonedInstance = await getContractAt(hre, "ERC721PresetMinterPauserAutoIdUpgradeable", '0x9CfA6D15c80Eb753C815079F2b32ddEFd562C3e4');

  const newTokenAddress = await ERC721ClonedInstance.mint('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199');

  const { gasUsed: createGasUsed, events } = await newTokenAddress.wait();
  const { address } = events.find(Boolean);

  console.log("ERC721Cloner createdToken: ", address, newTokenAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
