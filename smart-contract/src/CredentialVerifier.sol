
// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract CredentialVerifier {
    address public owner;

    event RecordSigned(string recordIdRaw, address indexed signer, uint256 timestamp);

    mapping(bytes32 => mapping(address => bool)) public credentialTypeSigner;
    mapping(bytes32 => Record) public records;
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

    function getRecord(string calldata recordId) external view returns (
    bytes32 dataHash, uint256 expiration, bool isRevoked, bytes32 credentialTypeId, uint8 currentSignatures) {
        bytes32 key = _recordKey(recordId);
        Record storage r = records[key];
        require(r.dataHash != bytes32(0), "Record does not exist");

        return (
            r.dataHash,
            r.expiration,
            r.isRevoked,
            r.credentialTypeId,
            r.currentSignatures
        );
    }

    function addRecord(string calldata _recordId, bytes32 _dataHash, uint256 _expiration, bytes32 _credentialTypeId) public onlyOwner() {

       // 1. Create a pointer to the specific slot in storage

        bytes32 key = _recordKey(_recordId);
        Record storage newRecord = records[key];

        require(newRecord.dataHash == bytes32(0), "Record already exists");

        // 2. Assign values individually
        newRecord.dataHash = _dataHash;
        newRecord.expiration = _expiration;
        newRecord.isRevoked = false;
        newRecord.currentSignatures = 0;
        newRecord.credentialTypeId = _credentialTypeId;
    }

    function revokeRecord(string calldata _recordId) public onlyOwner {
        bytes32 key = _recordKey(_recordId);
        require(!records[key].isRevoked, "Record is already revoked");

        records[key].isRevoked = true;
    }

    function restoreRecord(string calldata _recordId) public onlyOwner { 
        bytes32 key = _recordKey(_recordId);
        require(records[key].isRevoked, "Record is not revoked");

        records[key].isRevoked = false;

    }

    function signRecord(string calldata recordId) external {
        _signRecordLogic(recordId, msg.sender);
    }

    // check record if it is fully signed
    function isFullySigned(string calldata recordId) external view returns (bool) {
        bytes32 key = _recordKey(recordId);
        Record storage r = records[key];
        return r.currentSignatures >= requiredSignatureCount[r.credentialTypeId];
    }

    function setRequiredSignatureCount(bytes32 credentialTypeId, uint8 count) public onlyOwner {
        require(count > 0, "Count must be > 0");
        requiredSignatureCount[credentialTypeId] = count;
    }

    // set authorized signer for each credential type
    function setCredentialTypeSigner(bytes32 credentialTypeId, address[] calldata signers, bool allowed) public onlyOwner {
        uint256 length = signers.length;
        require(length > 0, "No signers provided");

        for (uint256 i = 0; i < length; i++) {
            address signer = signers[i];
            require(signer != address(0), "Zero address");
            credentialTypeSigner[credentialTypeId][signer] = allowed;
        }
    }

    // Check if the signer already signed
    function hasSigned(string calldata recordId, address signer) external view returns (bool) {
        bytes32 key = _recordKey(recordId);
        return records[key].signedBy[signer];
    }

    function batchSignRecords(string[] calldata recordIds) external {
        // Optional: Limit batch size to prevent "Out of Gas" errors
        require(recordIds.length <= 50, "Batch too large (max 50)");

        for (uint i = 0; i < recordIds.length; i++) {
            _signRecordLogic(recordIds[i], msg.sender);
        }
    }

    function addNewCredentialType(bytes32 credentialTypeId, address[] calldata signers, uint8 requiredCount) external onlyOwner {
        setCredentialTypeSigner(credentialTypeId, signers, true);
        setRequiredSignatureCount(credentialTypeId, requiredCount);
    }

    // 1. Extract logic to internal function
    function _signRecordLogic(string calldata recordId, address signer) internal {
        bytes32 key = _recordKey(recordId);

        Record storage r = records[key];
        uint8 required = requiredSignatureCount[r.credentialTypeId];


        require(r.dataHash != bytes32(0), "Record does not exist");
        require(!r.isRevoked, "Record revoked");
        require(
            r.expiration == 0 || block.timestamp <= r.expiration,
            "Record expired"
        );
        require(r.currentSignatures < required, "Already fully signed");

        // Optimization: Check mapping directly
        require(credentialTypeSigner[r.credentialTypeId][signer], "Not authorized Signer");
        require(!r.signedBy[signer], "Already signed!");


        r.signedBy[signer] = true;
        r.currentSignatures++;

        emit RecordSigned(recordId, signer, block.timestamp);
    }

    function _recordKey(string calldata recordId) internal pure returns (bytes32) {
        return keccak256(bytes(recordId));
    }
}