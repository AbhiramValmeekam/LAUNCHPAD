import { ethers } from 'ethers';
import type { EncryptedData } from '../types';

interface TransactionResult {
  tx_hash: string;
  message: string;
}

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private readonly API_URL = 'http://localhost:8000/api';

  async initialize(): Promise<void> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this feature');
    }
    this.provider = new ethers.BrowserProvider(window.ethereum);
  }

  async requestAccount(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    try {
      this.signer = await this.provider.getSigner();
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Error requesting account:', error);
      throw new Error('Failed to get account');
    }
  }

  async savePassword(encryptedData: EncryptedData): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Please connect your wallet first');
    }

    const address = await this.signer.getAddress();
    const response = await fetch(`${this.API_URL}/passwords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_address: address,
        encrypted_data: JSON.stringify(encryptedData)
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save password to blockchain');
    }

    const result = await response.json();
    return {
      tx_hash: result.tx_hash,
      message: result.message
    };
  }

  async loadPassword(): Promise<EncryptedData | null> {
    if (!this.signer) {
      throw new Error('Please connect your wallet first');
    }

    const address = await this.signer.getAddress();
    const response = await fetch(`${this.API_URL}/passwords/${address}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to load password from blockchain');
    }

    const data = await response.json();
    return JSON.parse(data.encrypted_data);
  }

  async deletePassword(): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Please connect your wallet first');
    }

    const address = await this.signer.getAddress();
    const response = await fetch(`${this.API_URL}/passwords/${address}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete password from blockchain');
    }

    const result = await response.json();
    return {
      tx_hash: result.tx_hash,
      message: result.message
    };
  }
}

export const blockchainService = new BlockchainService(); 