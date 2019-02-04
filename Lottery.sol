pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    // block and now are global variables
    // keccak256() preferred over deprecated sha3()
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
    }

    function pickWinner() public restricted {

        // will only return valid array index nums
        uint index = random() % players.length;

        // access the selected player address object
        // call its transfer method and pass in reference to the contract balance
        players[index].transfer(this.balance);

        // reset contract state
        // create a new dynamic array of type address
        // note that when resizing dynamic array you must specify initial length (0)
        players = new address[](0);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

}