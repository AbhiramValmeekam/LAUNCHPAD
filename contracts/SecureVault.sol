// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecureVault is ReentrancyGuard, Ownable {
    struct EncryptedVault {
        bytes encryptedData;
        uint256 lastUpdated;
        bytes32 dataHash;
    }

    // Mapping from user address to their encrypted vault
    mapping(address => EncryptedVault) private vaults;
    
    // Events
    event VaultUpdated(address indexed user, bytes32 dataHash, uint256 timestamp);
    event VaultBackupCreated(address indexed user, address indexed backupAddress);
    event EmergencyAccessGranted(address indexed user, address indexed trustedParty);

    // Emergency access system
    mapping(address => mapping(address => bool)) private emergencyAccess;
    mapping(address => address[]) private backupAddresses;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Updates the user's encrypted vault data
     * @param encryptedData The encrypted vault data
     * @param dataHash Hash of the original data for integrity verification
     */
    function updateVault(bytes calldata encryptedData, bytes32 dataHash) external nonReentrant {
        require(encryptedData.length > 0, "Empty data not allowed");
        
        vaults[msg.sender] = EncryptedVault({
            encryptedData: encryptedData,
            lastUpdated: block.timestamp,
            dataHash: dataHash
        });

        emit VaultUpdated(msg.sender, dataHash, block.timestamp);
    }

    /**
     * @dev Retrieves the user's encrypted vault data
     */
    function getVault() external view returns (bytes memory, uint256, bytes32) {
        EncryptedVault memory vault = vaults[msg.sender];
        require(vault.lastUpdated > 0, "No vault found");
        
        return (vault.encryptedData, vault.lastUpdated, vault.dataHash);
    }

    /**
     * @dev Grants emergency access to a trusted party
     * @param trustedParty Address of the trusted party
     */
    function grantEmergencyAccess(address trustedParty) external {
        require(trustedParty != address(0), "Invalid address");
        require(trustedParty != msg.sender, "Cannot grant access to self");
        
        emergencyAccess[msg.sender][trustedParty] = true;
        backupAddresses[msg.sender].push(trustedParty);
        
        emit EmergencyAccessGranted(msg.sender, trustedParty);
    }

    /**
     * @dev Revokes emergency access from a trusted party
     * @param trustedParty Address of the trusted party
     */
    function revokeEmergencyAccess(address trustedParty) external {
        emergencyAccess[msg.sender][trustedParty] = false;
        
        // Remove from backup addresses
        address[] storage backups = backupAddresses[msg.sender];
        for (uint i = 0; i < backups.length; i++) {
            if (backups[i] == trustedParty) {
                backups[i] = backups[backups.length - 1];
                backups.pop();
                break;
            }
        }
    }

    /**
     * @dev Retrieves vault data using emergency access
     * @param vaultOwner Address of the vault owner
     */
    function emergencyRetrieve(address vaultOwner) external view returns (bytes memory, uint256, bytes32) {
        require(emergencyAccess[vaultOwner][msg.sender], "No emergency access");
        EncryptedVault memory vault = vaults[vaultOwner];
        require(vault.lastUpdated > 0, "No vault found");
        
        return (vault.encryptedData, vault.lastUpdated, vault.dataHash);
    }

    /**
     * @dev Gets the list of backup addresses for a user
     */
    function getBackupAddresses() external view returns (address[] memory) {
        return backupAddresses[msg.sender];
    }
} 