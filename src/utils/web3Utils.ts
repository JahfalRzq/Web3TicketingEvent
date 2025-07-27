// 
// // src/utils/web3Utils.ts
// import { ethers } from "ethers";
// import EventNFT from "../abis/EventNFT.json";
// import TicketingSmartContract from "../abis/TicketingSmartContract.json";

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();

// export const getEventContract = (address: string) => {
//   return new ethers.Contract(address, EventNFT.abi, signer);
// };

// export const getTicketingContract = (address: string) => {
//   return new ethers.Contract(address, TicketingSmartContract.abi, signer);
// };

// // Contoh memanggil nama event
// export const getEventDetails = async (contractAddress: string) => {
//   const contract = getTicketingContract(contractAddress);
//   const eventFragment = contract.interface.getEvent("EventCreated"); // ✅ perbaikan
//   console.log(eventFragment);
// };
