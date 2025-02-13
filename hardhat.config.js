require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: "0.8.0",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
