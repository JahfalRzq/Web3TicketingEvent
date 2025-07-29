import { HardhatUserConfig } from "hardhat/config";
import "@openzeppelin/hardhat-upgrades";
// import "@nomicfoundation/hardhat-chai-matchers";


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts", // default
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  // networks: {
  //   mumbai: {
  //     url: "https://rpc-mumbai.maticvigil.com", // atau dari Alchemy/Infura
  //     accounts: ["0xYOUR_PRIVATE_KEY"], // harus 32 bytes
  //   },
  // },
};

export default config;



//with mumbai network
// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-ethers";
// import "@openzeppelin/hardhat-upgrades";
// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   solidity: "0.8.20",
//   networks: {
//     mumbai: {
//       url: "https://rpc-mumbai.maticvigil.com",
//       accounts: [process.env.PRIVATE_KEY as string],
//     },
//   },
// };

// export default config;



