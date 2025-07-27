import { ethers, upgrades } from "hardhat";

async function main() {
  const TicketingFactory = await ethers.getContractFactory("EventTicket");
  const ticketing = await TicketingFactory.deploy();
  await ticketing.waitForDeployment();
  console.log("Deployed to:", await ticketing.getAddress());
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
