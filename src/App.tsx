import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Lock, Key, LogOut } from 'lucide-react';
import { generateMasterKey, encryptData, decryptData } from './utils/crypto';
import { blockchainService } from './services/blockchainService';
import { ChainSelector } from './components/ChainSelector';
import { AddPasswordModal } from './components/AddPasswordModal';
import { WelcomePage } from './components/WelcomePage';
import { PasswordField } from './components/PasswordField';
import { TransactionStatus } from './components/TransactionStatus';
import type { PasswordEntry } from './types';
import { anonymousService } from './services/anonymousService';
import { anonymousStorageService } from './services/anonymousStorageService';
import { AnonymousMode } from './components/AnonymousMode';

interface TransactionState {
  status: 'pending' | 'success' | 'error' | 'warning' | 'info';
  message: string;
  txHash?: string;
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
  const [masterKey, setMasterKey] = useState<CryptoKey | null>(null);
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<TransactionState | null>(null);

  useEffect(() => {
    const initializeBlockchain = async () => {
      try {
        await blockchainService.initialize();
        const address = await blockchainService.requestAccount();
        setWalletAddress(address);
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
      }
    };

    initializeBlockchain();
  }, []);

  useEffect(() => {
    if (transaction?.status === 'success') {
      const timer = setTimeout(() => {
        setTransaction(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [transaction]);

  const handleUnlock = async () => {
    try {
      // Clear existing state
      setPasswords([]);
      setTransaction(null);

      // Generate new master key
      const key = await generateMasterKey(masterPassword);
      setMasterKey(key);

      if (!isAnonymous) {
        // Ask user if they want to connect to blockchain
        const shouldConnectBlockchain = window.confirm(
          'Would you like to connect to the blockchain to access your passwords?\n\n' +
          'This will allow you to:\n' +
          '• Access your passwords from any device\n' +
          '• Restore your passwords if local storage is cleared\n' +
          '• Benefit from blockchain security\n\n' +
          'Note: This requires a Web3 wallet (like MetaMask)'
        );

        if (shouldConnectBlockchain) {
          setTransaction({
            status: 'pending',
            message: 'Connecting to blockchain...'
          });

          try {
            // Reinitialize blockchain connection
            await blockchainService.initialize();
            const address = await blockchainService.requestAccount();
            setWalletAddress(address);

            // Load passwords from blockchain
            const encryptedData = await blockchainService.loadPassword();
            if (encryptedData) {
              try {
                const decryptedData = await decryptData(encryptedData, key);
                const loadedPasswords = JSON.parse(decryptedData);
                setPasswords(loadedPasswords);
                setTransaction({
                  status: 'success',
                  message: 'Passwords loaded successfully from blockchain'
                });
                // Store the current master key hash in local storage
                localStorage.setItem('masterKeyHash', await crypto.subtle.digest('SHA-256', new TextEncoder().encode(masterPassword)).then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')));
                // Update local storage with blockchain data
                localStorage.setItem('passwords', JSON.stringify(loadedPasswords));
              } catch (decryptError) {
                console.error('Failed to decrypt blockchain data:', decryptError);
                setTransaction({
                  status: 'info',
                  message: 'Starting fresh vault with new master key'
                });
                // Clear any existing passwords from local storage
                localStorage.removeItem('passwords');
                setPasswords([]);
              }
            } else {
              setTransaction({
                status: 'info',
                message: 'Starting new password vault'
              });
            }
          } catch (error) {
            console.error('Failed to load from blockchain:', error);
            setTransaction({
              status: 'error',
              message: 'Failed to connect to blockchain. Please try again.'
            });
            return; // Don't proceed if blockchain connection fails
          }
        } else {
          // Load from local storage only
          const localData = localStorage.getItem('passwords');
          if (localData) {
            const localPasswords = JSON.parse(localData);
            setPasswords(localPasswords);
            setTransaction({
              status: 'info',
              message: 'Loaded passwords from local storage'
            });
          } else {
            setTransaction({
              status: 'info',
              message: 'Starting new password vault'
            });
          }
        }
      }
      setShowWelcome(false);
    } catch (error) {
      console.error('Failed to unlock vault:', error);
      setTransaction({
        status: 'error',
        message: 'Failed to unlock vault. Please check your master password.'
      });
    }
  };

  const handleLogout = () => {
    setMasterKey(null);
    setPasswords([]);
    setMasterPassword('');
    setShowWelcome(true);
    setIsAnonymous(false);
    setAnonymousId(null);
  };

  const handleSavePassword = async (entry: PasswordEntry) => {
    try {
      if (!masterKey) {
        setTransaction({
          status: 'error',
          message: 'Please unlock your vault first'
        });
        return;
      }

      const existingIndex = passwords.findIndex(
        p => p.website.toLowerCase() === entry.website.toLowerCase() && 
             p.username.toLowerCase() === entry.username.toLowerCase()
      );

      let updatedPasswords: PasswordEntry[];
      if (existingIndex !== -1) {
        updatedPasswords = [...passwords];
        updatedPasswords[existingIndex] = {
          ...entry,
          updatedAt: Date.now()
        };
      } else {
        updatedPasswords = [...passwords, {
          ...entry,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }];
      }

      // Save to local storage first
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      setPasswords(updatedPasswords);

      // If not in anonymous mode, ask for blockchain connection
      if (!isAnonymous) {
        const shouldSaveToBlockchain = window.confirm(
          'Would you like to save this password to the blockchain for additional security? ' +
          'This will require connecting your wallet if not already connected.'
        );

        if (shouldSaveToBlockchain) {
          setTransaction({
            status: 'pending',
            message: 'Connecting to blockchain...'
          });

          try {
            // Ensure blockchain connection
            await blockchainService.initialize();
            const address = await blockchainService.requestAccount();
            setWalletAddress(address);

            // Save to blockchain
            const encryptedData = await encryptData(JSON.stringify(updatedPasswords), masterKey);
            const result = await blockchainService.savePassword(encryptedData);
            
            setTransaction({
              status: 'success',
              message: 'Password saved to blockchain',
              txHash: result.tx_hash
            });
          } catch (error) {
            console.error('Failed to save to blockchain:', error);
            setTransaction({
              status: 'error',
              message: 'Failed to save to blockchain. Password saved locally only.'
            });
          }
        } else {
          setTransaction({
            status: 'info',
            message: 'Password saved locally only'
          });
        }
      }

      // If in anonymous mode, save to anonymous storage
      if (isAnonymous && anonymousId) {
        try {
          await anonymousStorageService.savePasswords(anonymousId, updatedPasswords, masterKey);
        } catch (error) {
          console.error('Failed to save anonymous passwords:', error);
          setTransaction({
            status: 'error',
            message: 'Saved locally, but failed to save to anonymous storage'
          });
        }
      }

      // Close the modal only after all operations are complete
      setShowAddPassword(false);
    } catch (error) {
      console.error('Failed to save password:', error);
      setTransaction({
        status: 'error',
        message: 'Failed to save password. Please try again.'
      });
      throw error; // Re-throw the error so the modal can handle it
    }
  };

  const handleDeletePassword = async (index: number) => {
    const updatedPasswords = passwords.filter((_, i) => i !== index);
    
    if (!isAnonymous) {
      setTransaction({
        status: 'pending',
        message: 'Deleting password from blockchain...'
      });

      try {
        const encryptedData = await encryptData(JSON.stringify(updatedPasswords), masterKey!);
        const result = await blockchainService.savePassword(encryptedData);
        
        setTransaction({
          status: 'success',
          message: 'Password deleted from blockchain',
          txHash: result.tx_hash
        });
      } catch (error) {
        console.error('Failed to delete from blockchain:', error);
        setTransaction({
          status: 'error',
          message: 'Failed to delete from blockchain, updating locally...'
        });
      }
    }

    setPasswords(updatedPasswords);
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));

    if (isAnonymous && anonymousId && masterKey) {
      try {
        await anonymousStorageService.savePasswords(anonymousId, updatedPasswords, masterKey);
      } catch (error) {
        console.error('Failed to update anonymous passwords after deletion:', error);
        setTransaction({
          status: 'error',
          message: 'Failed to update anonymous storage'
        });
      }
    }
  };

  const handleChainSwitch = async () => {
    if (masterKey) {
      try {
        const encryptedData = await blockchainService.loadPassword();
        if (encryptedData) {
          const decryptedData = await decryptData(encryptedData, masterKey);
          const passwords = JSON.parse(decryptedData);
          setPasswords(passwords);
        }
      } catch (error) {
        console.error('Failed to load passwords after chain switch:', error);
      }
    }
  };

  // Handle anonymous mode selection
  const handleAnonymousMode = async (useAnonymous: boolean) => {
    setIsAnonymous(useAnonymous);
    if (useAnonymous) {
      const account = await anonymousService.getOrCreateAccount();
      setAnonymousId(account.id);
      // Use the anonymous account ID as part of the encryption
      const anonymousKey = await generateMasterKey(account.id);
      setMasterKey(anonymousKey);
      
      // Load passwords from local storage if they exist
      try {
        const storedPasswords = await anonymousStorageService.loadPasswords(account.id, anonymousKey);
        setPasswords(storedPasswords);
      } catch (error) {
        console.error('Failed to load anonymous passwords:', error);
      }
      
      setShowWelcome(false);
    } else {
      setAnonymousId(null);
      setMasterKey(null);
      setPasswords([]);
    }
  };

  if (showWelcome) {
    return <WelcomePage onGetStarted={() => setShowWelcome(false)} />;
  }

  if (!masterKey) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-cyan-500/10 rounded-full mb-4">
              <Lock className="w-12 h-12 text-cyan-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {isAnonymous ? 'Anonymous Access' : 'Unlock Your Vault'}
            </h1>
            <p className="text-gray-400">
              {isAnonymous 
                ? 'Using anonymous mode - no personal information required'
                : 'Enter your master password to access your secure vault'}
            </p>
          </div>

          {!isAnonymous ? (
            <>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <input
                      type="password"
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      placeholder="Enter your master password"
                      className="w-full bg-background px-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200 placeholder:text-gray-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUnlock();
                        }
                      }}
                    />
                    <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                <button
                  onClick={handleUnlock}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background"
                >
                  Unlock Vault
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-gray-500">Or</span>
                </div>
              </div>

              <AnonymousMode onModeSelect={handleAnonymousMode} />
            </>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => handleAnonymousMode(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background"
              >
                Continue Anonymously
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-cyan-500/10 rounded-full">
              <Wallet className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Password Vault
              </h1>
              {!isAnonymous && walletAddress && (
                <p className="text-sm text-gray-400">
                  Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddPassword(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background"
            >
              <Plus className="w-5 h-5" />
              <span>Add Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {passwords.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-cyan-500/10 rounded-full mb-4">
              <Lock className="w-12 h-12 text-cyan-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No passwords yet</h2>
            <p className="text-gray-400">
              Click the "Add Password" button to store your first password securely.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {passwords.map((password, index) => (
              <PasswordField
                key={`${password.website}-${password.username}-${index}`}
                password={password}
                onDelete={() => handleDeletePassword(index)}
              />
            ))}
          </div>
        )}

        {showAddPassword && (
          <AddPasswordModal
            onClose={() => setShowAddPassword(false)}
            onSave={handleSavePassword}
            existingPasswords={passwords}
          />
        )}

        {transaction && (
          <TransactionStatus
            status={transaction.status}
            message={transaction.message}
            txHash={transaction.txHash}
          />
        )}
      </div>
    </div>
  );
}

export default App;