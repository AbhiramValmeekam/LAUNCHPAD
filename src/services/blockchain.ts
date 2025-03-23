import { ethers } from 'ethers';
import type { EncryptedData } from '../types';

const CONTRACT_ADDRESS = ''; // TODO: Add deployed contract address
const CONTRACT_ABI = [
  "function updateVault(bytes encryptedData, bytes32 dataHash) external",
  "function getVault() external view returns (bytes, uint256, bytes32)",
  "function grantEmergencyAccess(address trustedParty) external",
  "function revokeEmergencyAccess(address trustedParty) external",
  "function emergencyRetrieve(address vaultOwner) external view returns (bytes, uint256, bytes32)",
  "function getBackupAddresses() external view returns (address[])"
];

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connect(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

    return await this.signer.getAddress();
  }

  async saveToBlockchain(encryptedData: EncryptedData): Promise<void> {
    if (!this.contract) {
      throw new Error('Not connected to blockchain');
    }

    try {
      // Convert the encrypted data to bytes and create a hash
      const dataBytes = ethers.toUtf8Bytes(JSON.stringify(encryptedData));
      const dataHash = ethers.keccak256(dataBytes);

      const tx = await this.contract.updateVault(dataBytes, dataHash);
      await tx.wait();
    } catch (error) {
      console.error('Failed to save to blockchain:', error);
      throw error;
    }
  }

  async loadFromBlockchain(): Promise<EncryptedData | null> {
    if (!this.contract) {
      throw new Error('Not connected to blockchain');
    }

    try {
      const [encryptedBytes, timestamp, storedHash] = await this.contract.getVault();
      
      // Verify data integrity
      const calculatedHash = ethers.keccak256(encryptedBytes);
      if (calculatedHash !== storedHash) {
        throw new Error('Data integrity check failed');
      }

      const decryptedJson = ethers.toUtf8String(encryptedBytes);
      return JSON.parse(decryptedJson);
    } catch (error) {
      if ((error as Error).message.includes('No vault found')) {
        return null;
      }
      console.error('Failed to load from blockchain:', error);
      throw error;
    }
  }

  async grantEmergencyAccess(trustedAddress: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Not connected to blockchain');
    }

    try {
      const tx = await this.contract.grantEmergencyAccess(trustedAddress);
      await tx.wait();
    } catch (error) {
      console.error('Failed to grant emergency access:', error);
      throw error;
    }
  }

  async revokeEmergencyAccess(trustedAddress: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Not connected to blockchain');
    }

    try {
      const tx = await this.contract.revokeEmergencyAccess(trustedAddress);
      await tx.wait();
    } catch (error) {
      console.error('Failed to revoke emergency access:', error);
      throw error;
    }
  }

  async getBackupAddresses(): Promise<string[]> {
    if (!this.contract) {
      throw new Error('Not connected to blockchain');
    }

    try {
      return await this.contract.getBackupAddresses();
    } catch (error) {
      console.error('Failed to get backup addresses:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.signer !== null;
  }
} 