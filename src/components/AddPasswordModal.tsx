import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { PasswordField } from './PasswordField';
import type { PasswordEntry } from '../types';
import PasswordAnalyzer from './PasswordAnalyzer';

interface AddPasswordModalProps {
  onClose: () => void;
  onSave: (password: PasswordEntry) => Promise<void>;
  existingPasswords?: PasswordEntry[];
}

export const AddPasswordModal: React.FC<AddPasswordModalProps> = ({
  onClose,
  onSave,
  existingPasswords = []
}) => {
  const [website, setWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent, forceOverwrite: boolean = false) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!website || !username || !password) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      // Check for duplicate entries
      const existingEntry = existingPasswords.find(
        p => p.website.toLowerCase() === website.toLowerCase() &&
             p.username.toLowerCase() === username.toLowerCase()
      );

      if (existingEntry && !forceOverwrite) {
        setShowOverwriteConfirm(true);
        setIsLoading(false);
        return;
      }

      await onSave({
        website,
        username,
        password,
        createdAt: existingEntry ? existingEntry.createdAt : Date.now(),
        updatedAt: Date.now()
      });
      onClose();
    } catch (error) {
      console.error('Failed to save password:', error);
      setError('Failed to save password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
      <div className="bg-background w-full max-w-md rounded-lg border border-gray-700 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200">Add Password</h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isLoading) onClose();
              }}
              className="text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">
                Website
              </label>
              <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-gray-900/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                placeholder="example.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200"
                placeholder="johndoe@example.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all duration-200 pr-10"
                  placeholder="Enter password"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && <PasswordAnalyzer password={password} />}
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            {showOverwriteConfirm && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mt-4">
                <p className="text-yellow-200 text-sm">
                  A password for this website and username already exists. Do you want to overwrite it?
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowOverwriteConfirm(false)}
                    className="px-3 py-1 text-sm text-gray-300 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setShowOverwriteConfirm(false);
                      handleSubmit(e, true);
                    }}
                    className="px-3 py-1 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-400"
                  >
                    Overwrite
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLoading) onClose();
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 