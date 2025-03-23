import type { EncryptedData } from '../types';

// Convert ArrayBuffer to Base64 string
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((str, byte) => str + String.fromCharCode(byte), '');
  return window.btoa(binary);
};

// Convert Base64 string to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generate a master key from password
export const generateMasterKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Generate a key from the password
  return await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
};

// Encrypt data using the master key
export const encryptData = async (data: string, masterKey: CryptoKey): Promise<EncryptedData> => {
  try {
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Create encryption key from master key
    const encryptionKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: iv,
        iterations: 100000,
        hash: 'SHA-256'
      },
      masterKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Encrypt the data
    const encoder = new TextEncoder();
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      encryptionKey,
      encoder.encode(data)
    );

    // Return the encrypted data and IV
    return {
      data: bufferToBase64(encryptedData),
      iv: bufferToBase64(iv)
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

// Decrypt data using the master key
export const decryptData = async (encryptedData: EncryptedData, masterKey: CryptoKey): Promise<string> => {
  try {
    const iv = base64ToBuffer(encryptedData.iv);
    
    // Create decryption key from master key
    const decryptionKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new Uint8Array(iv),
        iterations: 100000,
        hash: 'SHA-256'
      },
      masterKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv)
      },
      decryptionKey,
      base64ToBuffer(encryptedData.data)
    );

    // Convert the decrypted data back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. Please check your master password.');
  }
}; 