import { PasswordEntry } from '../types';
import { encryptData, decryptData } from '../utils/crypto';

class AnonymousStorageService {
  private readonly STORAGE_KEY_PREFIX = 'anon_passwords_';

  // Save passwords for an anonymous user
  async savePasswords(userId: string, passwords: PasswordEntry[], masterKey: CryptoKey): Promise<void> {
    try {
      // Encrypt the passwords array before storing
      const encryptedData = await encryptData(JSON.stringify(passwords), masterKey);
      localStorage.setItem(this.STORAGE_KEY_PREFIX + userId, JSON.stringify(encryptedData));
    } catch (error) {
      console.error('Failed to save passwords:', error);
      throw new Error('Failed to save passwords to local storage');
    }
  }

  // Load passwords for an anonymous user
  async loadPasswords(userId: string, masterKey: CryptoKey): Promise<PasswordEntry[]> {
    try {
      const encryptedData = localStorage.getItem(this.STORAGE_KEY_PREFIX + userId);
      if (!encryptedData) {
        return [];
      }

      // Decrypt the stored data
      const decryptedData = await decryptData(JSON.parse(encryptedData), masterKey);
      return JSON.parse(decryptedData) as PasswordEntry[];
    } catch (error) {
      console.error('Failed to load passwords:', error);
      throw new Error('Failed to load passwords from local storage');
    }
  }

  // Delete all passwords for an anonymous user
  deletePasswords(userId: string): void {
    localStorage.removeItem(this.STORAGE_KEY_PREFIX + userId);
  }

  // Check if user has stored passwords
  hasStoredPasswords(userId: string): boolean {
    return localStorage.getItem(this.STORAGE_KEY_PREFIX + userId) !== null;
  }

  // Get storage stats
  getStorageStats(userId: string): { count: number; lastModified: number } | null {
    const encryptedData = localStorage.getItem(this.STORAGE_KEY_PREFIX + userId);
    if (!encryptedData) {
      return null;
    }

    return {
      count: 1, // We store all passwords in one encrypted blob
      lastModified: Date.now() // You might want to store this separately
    };
  }
}

export const anonymousStorageService = new AnonymousStorageService(); 