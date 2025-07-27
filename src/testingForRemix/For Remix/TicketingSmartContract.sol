// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TicketSale is ERC721URIStorage {
    address public owner;
    mapping(address => uint256) public balances;
    string[] private eventNames;

    event EventRegistered(string eventName);

    constructor() ERC721("Ticket Sale", "TICKET") {
        owner = msg.sender;
    }

    function purchaseTicket(string memory _eventName, string memory _tokenUri)
        external payable {
            require(
                msg.sender == owner || balances[msg.sender] < 10,
                "Only owner or users with <10 tickets can buy"
            );

            int256 index = getEventIndex(_eventName);
            require(index != -1, "Event not registered");

            balances[msg.sender]++;
            _safeMint(msg.sender, uint256(index));
            _setTokenURI(uint256(index), _tokenUri);
        }

    function registerEvent(string memory _eventName) public {
        int256 index = getEventIndex(_eventName);
        require(index == -1, "Event name must be unique");

        eventNames.push(_eventName);
        emit EventRegistered(_eventName);
    }

    function getEventIndex(string memory _eventName) private view returns (int256) {
        for (uint256 i = 0; i < eventNames.length; i++) {
            if (keccak256(bytes(eventNames[i])) == keccak256(bytes(_eventName))) {
                return int256(i);
            }
        }
        return -1;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute");
        _;
    }
}
