
// SPDX-License-Identifier: MIT
pragma solidity  0.8.19;

contract CredentialVerifier {
    address public owner;

    enum CredentialType {
        TOR,     
        DIPLOMA, 
        HONORABLE_DISMISSAL,
        GOOD_MORAL,
        CERT_GRADES,
        CERT_OF_ENROLLMENT,
        UNITS_EARNED,
        GWA,
        LIST_OF_GRADES,
        CAV 
    }

    mapping(address => bool) public authorizedSigners;
    mapping(CredentialType => uint8) public requiredSignatureCount;
    mapping(string => Record) public records;
    mapping(CredentialType => address[]) public requiredSigners;
    struct Record {
        bytes32 dataHash;
        uint256 expiration;
        bool isRevoked;
        CredentialType credentialType;
        uint8 currentSignatures;
        mapping(address => bool) signedBy;
        
    }

    constructor() {
        owner = msg.sender;

        requiredSignatureCount[CredentialType.TOR] = 1;
        requiredSignatureCount[CredentialType.DIPLOMA] = 2;
        requiredSignatureCount[CredentialType.GOOD_MORAL] = 1;
        requiredSignatureCount[CredentialType.HONORABLE_DISMISSAL] = 1;
        requiredSignatureCount[CredentialType.UNITS_EARNED] = 1;
        requiredSignatureCount[CredentialType.GWA] = 1;
        requiredSignatureCount[CredentialType.LIST_OF_GRADES] = 1;
        requiredSignatureCount[CredentialType.CERT_GRADES] = 1;
        requiredSignatureCount[CredentialType.CERT_OF_ENROLLMENT] = 2;
        requiredSignatureCount[CredentialType.CAV] = 4;
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

    function addRecord(string calldata _recordId, bytes32 _dataHash, uint256 _expiration, CredentialType _credentialType) public onlyOwner() {
       // 1. Create a pointer to the specific slot in storage
        Record storage newRecord = records[_recordId];
        require(newRecord.dataHash == bytes32(0), "Record already exists");

        // 2. Assign values individually
        newRecord.dataHash = _dataHash;
        newRecord.expiration = _expiration;
        newRecord.isRevoked = false;
        newRecord.credentialType = _credentialType;
        newRecord.currentSignatures = 0;
    
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

        require(
            r.currentSignatures < requiredSignatureCount[r.credentialType],
            "All signatures collected"
        );

        r.signedBy[msg.sender] = true;
        r.currentSignatures++;
    }

    // check record if it is fully signed
    function isFullySigned(string calldata recordId) external view returns (bool) {
        Record storage r = records[recordId];
        return r.currentSignatures >= requiredSignatureCount[r.credentialType];
    }

    // set authorized signer
    function setAuthorizedSigner(address signer, bool allowed) external onlyOwner {
        authorizedSigners[signer] = allowed;
    }

    // add signer to credential type who should sign
    function setRequiredSigners(CredentialType _type, address[] calldata signers) external onlyOwner {
        require(signers.length > 0, "Empty signer list");

        requiredSigners[_type] = signers;
        requiredSignatureCount[_type] = uint8(signers.length);
    }

    // Check if the signer already signed
    function hasSigned(string calldata recordId, address signer) external view returns (bool) {
        return records[recordId].signedBy[signer];
    }
}