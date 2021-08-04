// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

interface IERC1155 is IERC165 {
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );
    event ApprovalForAll(
        address indexed account,
        address indexed operator,
        bool approved
    );
    event URI(string value, uint256 indexed id);

    function balanceOf(address account, uint256 id)
        external
        view
        returns (uint256);

    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        external
        view
        returns (uint256[] memory);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address account, address operator)
        external
        view
        returns (bool);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
}

contract ERC1155 is IERC1155 {
    struct Token {
        uint256 balance;
        uint256 price;
    }
    struct SwapRequest {
        uint256 id;
        address initializer;
        address confirmer;
        uint256 confirmerTokenId;
        uint256 confirmerAmount;
        uint256 initializerTokenId;
        uint256 initializerAmount;
    }
    string public baseUri = "";
    uint256 public lastId = 1;
    //address => tokenId => amount
    mapping(address => mapping(uint256 => Token)) public balances;
    //real owner => account => is allowed to spend owners balance? yes | no
    mapping(address => mapping(address => bool)) public approvals;
    //tokenId => creator of the token
    mapping(uint256 => address) public creators;
    //array of swap requests
    SwapRequest[] public requests;
    //tokenId => owners
    mapping(uint256 => address[]) owners;

    constructor(string memory uri) {
        baseUri = uri;
    }

    function balanceOf(address account, uint256 id)
        public
        view
        override
        returns (uint256)
    {
        return balances[account][id].balance;
    }

    function priceOf(address account, uint256 id)
        public
        view
        returns (uint256)
    {
        return balances[account][id].price;
    }

    function getRequests() public view returns (SwapRequest[] memory) {
        return requests;
    }

    function creatorOf(uint256 id) public view returns (address) {
        return creators[id];
    }

    function ownersOf(uint256 tokenId) public view returns (address[] memory) {
        return owners[tokenId];
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        view
        override
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            "The length of ids needs to be equal to length of ammounts"
        );
        uint256[] memory batchBalances = new uint256[](accounts.length);
        for (uint256 i = 0; i <= accounts.length; i++) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }
        return batchBalances;
    }

    function setApprovalForAll(address operator, bool approved)
        public
        override
    {
        approvals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator)
        public
        view
        override
        returns (bool)
    {
        return approvals[account][operator];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(to != address(0), "You can't make a transfer to address 0");
        require(from == msg.sender || approvals[from][msg.sender] == true, "");
        require(
            balances[from][id].balance >= amount,
            "Your balance is insufficient"
        );
        if (balances[from][id].balance - amount == 0) {
            delete balances[from][id];
            //removes the address from the owners array
            for (uint256 i = 0; i < owners[id].length; i++) {
                if (owners[id][i] == from) {
                    delete owners[id][i];
                }
            }
        } else {
            balances[from][id].balance -= amount;
        }
        if (balances[to][id].balance == 0) {
            balances[to][id] = Token(amount, balances[from][id].price);
        } else {
            balances[to][id].balance += amount;
        }
        owners[id].push(to);

        emit TransferSingle(msg.sender, from, to, id, amount);
        if (isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155Received(
                    msg.sender,
                    from,
                    id,
                    amount,
                    data
                )
            returns (bytes4 response) {
                if (response != IERC1155Receiver.onERC1155Received.selector) {
                    revert("ERC1155Receiver rejected tokens :(");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("You can't transfer to non ERC1155Receiver contract");
            }
        }
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) public override {
        require(to != address(0), "You can't make a transfer to address 0");
        require(
            ids.length == amounts.length,
            "The length of ids needs to be equal to length of ammounts"
        );
        for (uint256 i = 0; i <= ids.length; i++) {
            require(
                msg.sender == from || approvals[from][msg.sender] == true,
                "You are not allowed to do this!"
            );
            require(
                balances[from][ids[i]].balance >= amounts[i],
                "Your balance is insufficient!"
            );
            if (balances[from][ids[i]].balance - amounts[i] == 0) {
                delete balances[from][ids[i]];
                //removes the address from the owners array
                for (uint256 j = 0; j < owners[ids[i]].length; j++) {
                    if (owners[ids[i]][j] == from) {
                        delete owners[ids[i]][j];
                    }
                }
            } else {
                balances[from][ids[i]].balance -= amounts[i];
            }
            balances[to][ids[i]].balance += amounts[i];
        }
        emit TransferBatch(msg.sender, from, to, ids, amounts);
        if (isContract(to)) {
            try
                IERC1155Receiver(to).onERC1155BatchReceived(
                    msg.sender,
                    from,
                    ids,
                    amounts,
                    data
                )
            returns (bytes4 response) {
                if (
                    response != IERC1155Receiver.onERC1155BatchReceived.selector
                ) {
                    revert("ERC1155Receiver rejected tokens :(");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("You can't transfer to non ERC1155Receiver contract");
            }
        }
    }

    function mint(uint256 amount, uint256 price) public {
        require(amount > 0, "Amount needs to be bigger than 0");
        balances[msg.sender][lastId] = Token(amount, price);
        creators[lastId] = msg.sender;
        owners[lastId].push(msg.sender);
        lastId++;
    }

    function buy(
        uint256 tokenId,
        address from,
        uint256 amount,
        uint256 sellPrice
    ) public payable {
        require(
            msg.value >= balances[from][tokenId].price * amount,
            "Ova kolicina ethereuma nije dovoljna za ovu tranzakciju!"
        );
        //checks if the seller sold all of his tokens
        if (balances[from][tokenId].balance == amount) {
            delete balances[from][tokenId];
            //removes the address from the owners array
            for (uint256 i = 0; i < owners[tokenId].length; i++) {
                if (owners[tokenId][i] == from) {
                    delete owners[tokenId][i];
                }
            }
        } else {
            balances[from][tokenId].balance -= amount;
        }
        if (balances[msg.sender][tokenId].balance == 0) {
            balances[msg.sender][tokenId] = Token(amount, sellPrice);
            owners[tokenId].push(msg.sender);
        } else {
            balances[msg.sender][tokenId].balance += amount;
            balances[msg.sender][tokenId].price = sellPrice;
        }
        if (from == creators[tokenId]) {
            payable(from).transfer(msg.value);
        } else {
            uint256 fee = msg.value / 10;
            payable(creators[tokenId]).transfer(fee);
            payable(from).transfer(msg.value - fee);
        }
    }

    function createSwapRequest(
        uint256 yourTokenId,
        uint256 yourAmount,
        uint256 confirmerTokenId,
        uint256 confirmerAmount,
        address confirmer
    ) public {
        requests.push(
            SwapRequest(
                requests.length,
                msg.sender,
                confirmer,
                confirmerTokenId,
                confirmerAmount,
                yourTokenId,
                yourAmount
            )
        );
    }

    function confirmSwapRequest(uint256 swapRequestId) public {
        //sending to initializer
        SwapRequest memory request = requests[swapRequestId];
        require(msg.sender == request.confirmer);
        require(
            balances[msg.sender][request.confirmerTokenId].balance >=
                request.confirmerAmount,
            "Your balance is insufficient"
        );
        require(
            balances[request.initializer][request.initializerTokenId].balance >=
                request.initializerAmount,
            "The balance of the requester is insufficient"
        );
        if (
            balances[request.initializer][request.confirmerTokenId].balance == 0
        ) {
            balances[request.initializer][request.confirmerTokenId] = Token(
                request.confirmerAmount,
                balances[request.confirmer][request.confirmerTokenId].price
            );
        } else {
            balances[request.initializer][request.confirmerTokenId]
                .balance += request.confirmerAmount;
        }
        if (
            balances[msg.sender][request.confirmerTokenId].balance -
                request.confirmerAmount ==
            0
        ) {
            delete balances[msg.sender][request.confirmerTokenId];
            //removes the address from the owners array
            for (
                uint256 i = 0;
                i < owners[request.confirmerTokenId].length;
                i++
            ) {
                if (owners[request.confirmerTokenId][i] == msg.sender) {
                    delete owners[request.confirmerTokenId][i];
                }
            }
        } else {
            balances[msg.sender][request.confirmerTokenId].balance -= request
                .confirmerAmount;
        }
        owners[request.confirmerTokenId].push(request.initializer);

        //sending to confirmer
        if (
            balances[request.confirmer][request.initializerTokenId].balance == 0
        ) {
            balances[request.confirmer][request.initializerTokenId] = Token(
                request.initializerAmount,
                balances[request.initializer][request.initializerTokenId].price
            );
        } else {
            balances[request.confirmer][request.initializerTokenId]
                .balance += request.initializerAmount;
        }
        if (
            balances[request.initializer][request.initializerTokenId].balance -
                request.initializerAmount ==
            0
        ) {
            delete balances[request.initializer][request.initializerTokenId];
            //removes the address from the owners array
            for (
                uint256 i = 0;
                i < owners[request.initializerTokenId].length;
                i++
            ) {
                if (
                    owners[request.initializerTokenId][i] == request.initializer
                ) {
                    delete owners[request.initializerTokenId][i];
                }
            }
        } else {
            balances[request.initializer][request.initializerTokenId]
                .balance -= request.initializerAmount;
        }
        owners[request.initializerTokenId].push(request.confirmer);
        delete requests[swapRequestId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return interfaceId == type(IERC1155).interfaceId;
    }

    function isContract(address _address) private returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(_address)
        }
        return (size > 0);
    }
}
