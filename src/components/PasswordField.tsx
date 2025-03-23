import React, { useState } from 'react';
import { Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import type { PasswordEntry } from '../types';
import PasswordAnalyzer from './PasswordAnalyzer';

interface PasswordFieldProps {
  password: PasswordEntry;
  onDelete: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ password, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(password.password);
    // You could add a toast notification here
  };

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-200">{password.website}</h3>
          <p className="text-sm text-gray-400">{password.username}</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password.password}
                readOnly
                className="bg-gray-900/50 text-sm text-gray-300 px-3 py-1 rounded border border-gray-700 pr-10"
              />
              <button
                onClick={() => {
                  setShowPassword(!showPassword);
                  if (!showPassword) setShowAnalysis(true);
                }}
                className="absolute right-2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              onClick={handleCopy}
              className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
              title="Copy password"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Delete password"
            >
              <Trash2 size={16} />
            </button>
          </div>
          {showAnalysis && showPassword && (
            <div className="mt-2">
              <PasswordAnalyzer password={password.password} />
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {password.updatedAt && (
            <span>Updated: {new Date(password.updatedAt).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}; 