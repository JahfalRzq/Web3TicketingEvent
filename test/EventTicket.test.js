const { expect } = require("chai");

describe("EventTicket", function () {
  let EventTicket, eventTicket, owner, addr1;

  beforeEach(async function () {
    EventTicket = await ethers.getContractFactory("EventTicket");
    [owner, addr1] = await ethers.getSigners();
    eventTicket = await EventTicket.deploy();
    await eventTicket.deployed();
  });

  it("Should create a ticket", async function () {
    await eventTicket.createTicket("Event 1", ethers.utils.parseEther("0.1"), 10);
    const ticket = await eventTicket.tickets(1);
    expect(ticket.eventName).to.equal("Event 1");
    expect(ticket.price).to.equal(ethers.utils.parseEther("0.1"));
    expect(ticket.totalSupply).to.equal(10);
    expect(ticket.sold).to.equal(0);
  });

  it("Should purchase a ticket", async function () {
    await eventTicket.createTicket("Event 1", ethers.utils.parseEther("0.1"), 10);
    await eventTicket.connect(addr1).purchaseTicket(1, 1, { value: ethers.utils.parseEther("0.1") });
    const ticket = await eventTicket.tickets(1);
    expect(ticket.sold).to.equal(1);
  });
});
