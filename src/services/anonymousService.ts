import { generateMasterKey } from '../utils/crypto';

interface AnonymousAccount {
  id: string;
  createdAt: number;
  lastAccessed: number;
}

class AnonymousService {
  private readonly STORAGE_KEY = 'anonymous_account';

  // Generate a random anonymous ID
  private generateAnonymousId(): string {
    return 'anon_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Create a new anonymous account
  async createAnonymousAccount(): Promise<AnonymousAccount> {
    const account: AnonymousAccount = {
      id: this.generateAnonymousId(),
      createdAt: Date.now(),
      lastAccessed: Date.now()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(account));
    return account;
  }

  // Get the current anonymous account or create one
  async getOrCreateAccount(): Promise<AnonymousAccount> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const account = JSON.parse(stored) as AnonymousAccount;
      account.lastAccessed = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(account));
      return account;
    }
    return this.createAnonymousAccount();
  }

  // Check if an anonymous account exists
  hasAnonymousAccount(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  // Delete the anonymous account
  deleteAnonymousAccount(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Get anonymous account stats
  getAccountStats(): { createdAt: number; lastAccessed: number } | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    
    const account = JSON.parse(stored) as AnonymousAccount;
    return {
      createdAt: account.createdAt,
      lastAccessed: account.lastAccessed
    };
  }
}

export const anonymousService = new AnonymousService(); 