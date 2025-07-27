import { ethers } from "ethers";
const hre = require("hardhat");
const { upgrades } = hre;


async function main() {
  const TicketingFactory = await hre.ethers.getContractFactory("TicketingSmartContract");
  const ticketing = await hre.upgrades.deployProxy(TicketingFactory, [], {
    initializer: "initialize",
  });

  await ticketing.waitForDeployment();
  console.log("Deployed to:", await ticketing.getAddress());
}
