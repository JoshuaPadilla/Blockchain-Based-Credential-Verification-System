
// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract CredentialVerifier {
    address public owner;

    event RecordSigned(string recordIdRaw, address indexed signer, uint256 timestamp);

    mapping(bytes32 => mapping(address => bool)) public credentialTypeSigner;
    mapping(string => Record) public records;
    // the required signature count for each credential type id
    mapping(bytes32 => uint8) public requiredSignatureCount;
    // the required signers for each credential type id
    struct Record {
        bytes32 dataHash;
        uint256 expiration;
        bool isRevoked;
        bytes32 credentialTypeId;
        uint8 currentSignatures;
        mapping(address => bool) signedBy; // it stores the address of signers who signed
    }

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

    function addRecord(string calldata _recordId, bytes32 _dataHash, uint256 _expiration, bytes32 _credentialTypeId) public onlyOwner() {
       // 1. Create a pointer to the specific slot in storage
        Record storage newRecord = records[_recordId];
        require(newRecord.dataHash == bytes32(0), "Record already exists");

        // 2. Assign values individually
        newRecord.dataHash = _dataHash;
        newRecord.expiration = _expiration;
        newRecord.isRevoked = false;
        newRecord.currentSignatures = 0;
        newRecord.credentialTypeId = _credentialTypeId;
    }

    function revokeRecord(string calldata _recordId) public onlyOwner {
        require(!records[_recordId].isRevoked, "Record is already revoked");

        records[_recordId].isRevoked = true;
    }

    function restoreRecord(string calldata _recordId) public onlyOwner { 
        require(records[_recordId].isRevoked, "Record is not revoked");

        records[_recordId].isRevoked = false;

    }

    function signRecord(string calldata recordId) external {
        _signRecordLogic(recordId, msg.sender);
    }

    // check record if it is fully signed
    function isFullySigned(string calldata recordId) external view returns (bool) {
        Record storage r = records[recordId];
        return r.currentSignatures >= requiredSignatureCount[r.credentialTypeId];
    }

    // set authorized signer for each credential type
    function setCredentialTypeSigner(bytes32 credentialTypeId, address signer, bool allowed) external onlyOwner {
        credentialTypeSigner[credentialTypeId][signer] = allowed;
    }

    // Check if the signer already signed
    function hasSigned(string calldata recordId, address signer) external view returns (bool) {
        return records[recordId].signedBy[signer];
    }

    function batchSignRecords(string[] calldata recordIds) external {
        // Optional: Limit batch size to prevent "Out of Gas" errors
        require(recordIds.length <= 50, "Batch too large (max 50)");

        for (uint i = 0; i < recordIds.length; i++) {
            _signRecordLogic(recordIds[i], msg.sender);
        }
    }

    // 1. Extract logic to internal function
    function _signRecordLogic(string calldata recordId, address signer) internal {
        Record storage r = records[recordId];

        require(r.dataHash != bytes32(0), "Record does not exist");
        require(!r.isRevoked, "Record revoked");
        require(
            r.expiration == 0 || block.timestamp <= r.expiration,
            "Record expired"
        );

        // Optimization: Check mapping directly
        require(credentialTypeSigner[r.credentialTypeId][signer], "Not authorized Signer");
        require(!r.signedBy[signer], "Already signed!");

        r.signedBy[signer] = true;
        r.currentSignatures++;

        emit RecordSigned(recordId, signer, block.timestamp);
    }
}