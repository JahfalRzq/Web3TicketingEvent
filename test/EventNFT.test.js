const { expect } = require("chai");

describe("EventNFT", function () {
    let EventNFT, eventNFT, owner, addr1;

    beforeEach(async function () {
        EventNFT = await ethers.getContractFactory("EventNFT");
        [owner, addr1] = await ethers.getSigners();
        eventNFT = await EventNFT.deploy();
        await eventNFT.deployed();
    });

    it("Should mint an NFT", async function () {
        const tokenURI = "https://example.com/metadata/1";
        await eventNFT.mintNFT(addr1.address, tokenURI);
        const ownerOfToken = await eventNFT.ownerOf(1);
        expect(ownerOfToken).to.equal(addr1.address);
    });

    it("Should return the correct token URI", async function () {
        const tokenURI = "https://example.com/metadata/1";
        await eventNFT.mintNFT(addr1.address, tokenURI);
        const uri = await eventNFT.tokenURI(1);
        expect(uri).to.equal(tokenURI);
    });
});
