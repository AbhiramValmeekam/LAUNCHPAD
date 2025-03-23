export interface PasswordEntry {
  website: string;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export interface EncryptedData {
  iv: string;
  data: string;
}

declare global {
  interface Window {
    ethereum: any;
  }
}