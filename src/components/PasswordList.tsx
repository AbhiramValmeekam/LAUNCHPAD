import React from 'react';
import { Lock, Key, Globe, Clock, Trash2 } from 'lucide-react';
import type { PasswordEntry } from '../types';

interface PasswordListProps {
  passwords: PasswordEntry[];
  onSelect: (password: PasswordEntry) => void;
  onDelete: (password: PasswordEntry) => void;
}

export function PasswordList({ passwords, onSelect, onDelete }: PasswordListProps) {
  return (
    <div className="space-y-4">
      {passwords.map((password) => (
        <div
          key={password.id}
          className="bg-background-light p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 flex-grow cursor-pointer"
              onClick={() => onSelect(password)}
            >
              <div className="p-2 bg-cyan-900/30 rounded-full">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-100">{password.title}</h3>
                <p className="text-sm text-gray-400">{password.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-500">
                {password.url && <Globe className="w-4 h-4" />}
                <Key className="w-4 h-4" />
                <Clock className="w-4 h-4" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this password?')) {
                    onDelete(password);
                  }
                }}
                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                title="Delete password"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}