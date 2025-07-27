const hre = require("hardhat");

async function main() {
  const TicketingFactory = await hre.ethers.getContractFactory("TicketingSmartContract");
  const ticketing = await hre.upgrades.deployProxy(TicketingFactory, [], {
    initializer: "initialize",
  });

  await ticketing.waitForDeployment();
  console.log("Deployed to:", await ticketing.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
