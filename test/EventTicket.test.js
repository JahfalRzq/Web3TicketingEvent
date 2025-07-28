const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventNFT Contract", function () {
  let EventNFT, eventNFT, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    EventNFT = await ethers.getContractFactory("EventNFT");
    eventNFT = await EventNFT.deploy();
    await eventNFT.waitForDeployment();
  });

  it("Should deploy with correct name and symbol", async () => {
    expect(await eventNFT.name()).to.equal("EventNFT");
    expect(await eventNFT.symbol()).to.equal("EVNT");
  });

  it("Should mint an NFT and assign it to addr1", async () => {
    const tokenURI = "https://example.com/token/1.json";

    const tx = await eventNFT.connect(owner).mintNFT(addr1.address, tokenURI);
    await tx.wait();

    const tokenId = 0;
    expect(await eventNFT.ownerOf(tokenId)).to.equal(addr1.address);
    expect(await eventNFT.tokenURI(tokenId)).to.equal(tokenURI);
  });

  it("Should emit NFTMinted event on minting", async () => {
    const tokenURI = "https://example.com/token/1.json";

    const tx = await eventNFT.connect(owner).mintNFT(addr1.address, tokenURI);
    const receipt = await tx.wait();

    const event = receipt.logs
      .map(log => eventNFT.interface.parseLog(log))
      .find(log => log.name === "NFTMinted");

    expect(event).to.not.be.undefined;
    expect(event.args[0]).to.equal(0n);
    expect(event.args[1]).to.equal(addr1.address);
    expect(event.args[2]).to.equal(tokenURI);
  });

  it("Should revert if non-owner tries to mint", async () => {
    let reverted = false;
    try {
      await eventNFT.connect(addr1).mintNFT(addr1.address, "uri");
    } catch (error) {
      reverted = true;
      expect(error.message).to.include("Ownable: caller is not the owner");
    }
    expect(reverted).to.be.true;
  });
});
