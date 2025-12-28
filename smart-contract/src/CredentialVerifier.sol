
// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract CredentialVerifier {
    address public owner;

    struct Record {
        bytes32 dataHash;
        uint256 expiration;
        bool isRevoked;
    }

    mapping(string => Record) public records;


    constructor() {
        owner = msg.sender;
    }

    // Modifier now just calls an internal function to save gas/bytecode size
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    // The logic is centralized here
    function _checkOwner() internal view {
        require(msg.sender == owner, "Only the University can perform this action");
    }




    function addRecord(string calldata _recordId, bytes32 _dataHash, uint256 _expiration) public onlyOwner() {
        records[_recordId] = Record({
            dataHash: _dataHash,
            expiration: _expiration,
            isRevoked: false
        });

    }

    function revokeRecord(string calldata _recordId) public onlyOwner {
        require(!records[_recordId].isRevoked, "Record is already revoked");

        records[_recordId].isRevoked = true;
    }

    function restoreRecord(string calldata _recordId) public onlyOwner { 
        require(records[_recordId].isRevoked, "Record is not revoked");

        records[_recordId].isRevoked = false;

    }

    
}