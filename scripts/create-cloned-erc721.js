const hre = require("hardhat");
const {ethers} = require("hardhat");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/dist/src/helpers");

async function main() {

  const accounts = await ethers.getSigners();

  const ERC721Cloner = await hre.ethers.getContractFactory("ERC721Cloner");
  const ERC721ClonerInstance = await getContractAt(hre, "ERC721Cloner", '0x5FbDB2315678afecb367f032d93F642f64180aa3');

  const newTokenAddress = await ERC721ClonerInstance.createToken("NFT1Name", "NFT1Sym", "http://localhost:3000/nft/", accounts[0].address);

  const { gasUsed: createGasUsed, events } = await newTokenAddress.wait();
  const { address } = events.find(Boolean);

  console.log("ERC721Cloner createdToken:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
