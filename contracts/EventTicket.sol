// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EventTicket is Ownable {
    struct Ticket {
        uint256 id;
        string eventName;
        uint256 price;
        uint256 totalSupply;
        uint256 sold;
    }

    mapping(uint256 => Ticket) public tickets;
    uint256 public ticketCounter;

    event TicketCreated(uint256 id, string eventName, uint256 price, uint256 totalSupply);
    event TicketPurchased(uint256 id, address buyer, uint256 amount);

    function createTicket(string memory _eventName, uint256 _price, uint256 _totalSupply) public onlyOwner {
        ticketCounter++;
        tickets[ticketCounter] = Ticket(ticketCounter, _eventName, _price, _totalSupply, 0);
        emit TicketCreated(ticketCounter, _eventName, _price, _totalSupply);
    }

    function purchaseTicket(uint256 _id, uint256 _amount) public payable {
        require(tickets[_id].totalSupply > tickets[_id].sold, "Sold out");
        require(msg.value == tickets[_id].price * _amount, "Incorrect payment amount");

        tickets[_id].sold += _amount;
        emit TicketPurchased(_id, msg.sender, _amount);
    }
}
