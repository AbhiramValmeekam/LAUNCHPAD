// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PasswordVault {
    struct EncryptedData {
        string data;
        string iv;
        uint256 timestamp;
    }

    mapping(address => EncryptedData) private vaults;
    
    event VaultUpdated(address indexed owner, uint256 timestamp);

    function updateVault(string memory encryptedData, string memory iv) public {
        vaults[msg.sender] = EncryptedData({
            data: encryptedData,
            iv: iv,
            timestamp: block.timestamp
        });
        
        emit VaultUpdated(msg.sender, block.timestamp);
    }

    function getVault() public view returns (string memory data, string memory iv, uint256 timestamp) {
        EncryptedData memory vault = vaults[msg.sender];
        return (vault.data, vault.iv, vault.timestamp);
    }
} 