
// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract CredentialVerifier {
    address public owner;

   

    mapping(address => bool) public authorizedSigners;
    mapping(string => Record) public records;
    // the required signature count for each credential type id
    mapping(bytes32 => uint8) public requiredSignatureCount;
    // the required signers for each credential type id
    mapping(bytes32 => address[]) public requiredSigners;
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
    
    // 3. Do NOTHING for the mapping. 
    // The 'signedBy' mapping is automatically initialized as empty in storage.
    }

    function revokeRecord(string calldata _recordId) public onlyOwner {
        require(!records[_recordId].isRevoked, "Record is already revoked");

        records[_recordId].isRevoked = true;
    }

    function restoreRecord(string calldata _recordId) public onlyOwner { 
        require(records[_recordId].isRevoked, "Record is not revoked");

        records[_recordId].isRevoked = false;

    }

    // sign record
    function signRecord(string calldata recordId) external {
        Record storage r = records[recordId];

        require(r.dataHash != bytes32(0), "Record does not exist");
        require(!r.isRevoked, "Record revoked");
        require(
            r.expiration == 0 || block.timestamp <= r.expiration,
            "Record expired"
        );

        require(authorizedSigners[msg.sender], "Not authorized");
        require(!r.signedBy[msg.sender], "Already signed");

        

        r.signedBy[msg.sender] = true;
        r.currentSignatures++;
    }

    // check record if it is fully signed
    function isFullySigned(string calldata recordId) external view returns (bool) {
        Record storage r = records[recordId];
        return r.currentSignatures >= requiredSignatureCount[r.credentialTypeId];
    }

    // set authorized signer
    function setAuthorizedSigner(address signer, bool allowed) external onlyOwner {
        authorizedSigners[signer] = allowed;
    }

    // add signer to credential type who should sign
    function setRequiredSigners(bytes32 _credentialTypeId, address[] calldata signers) external onlyOwner {
        require(signers.length > 0, "Empty signer list");

        requiredSigners[_credentialTypeId] = signers;
        requiredSignatureCount[_credentialTypeId] = uint8(signers.length);
    }

    // Check if the signer already signed
    function hasSigned(string calldata recordId, address signer) external view returns (bool) {
        return records[recordId].signedBy[signer];
    }
}