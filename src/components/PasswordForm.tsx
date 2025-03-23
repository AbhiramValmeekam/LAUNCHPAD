import React, { useState, useEffect } from 'react';
import { Save, X, Eye, EyeOff, Shield } from 'lucide-react';
import type { PasswordEntry } from '../types';
import { analyzePassword, getScoreColor, getScoreText } from '../utils/passwordStrength';

interface PasswordFormProps {
  onSave: (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: PasswordEntry;
}

export function PasswordForm({ onSave, onCancel, initialData }: PasswordFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    url: initialData?.url || '',
    notes: initialData?.notes || ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordAnalysis, setPasswordAnalysis] = useState(analyzePassword(formData.password));

  useEffect(() => {
    setPasswordAnalysis(analyzePassword(formData.password));
  }, [formData.password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-cyan-500">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-background-light text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-500">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-background-light text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-500">Password</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="block w-full rounded-md border-gray-600 bg-background-light text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400 hover:text-cyan-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400 hover:text-cyan-500" />
            )}
          </button>
        </div>
        
        <div className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className={`h-4 w-4 ${getScoreColor(passwordAnalysis.score)}`} />
            <span className={`text-sm ${getScoreColor(passwordAnalysis.score)}`}>
              {getScoreText(passwordAnalysis.score)}
            </span>
          </div>
          
          {passwordAnalysis.feedback.warning && (
            <p className="text-sm text-orange-400">{passwordAnalysis.feedback.warning}</p>
          )}
          
          {passwordAnalysis.feedback.suggestions.length > 0 && (
            <ul className="text-sm text-gray-400 list-disc list-inside">
              {passwordAnalysis.feedback.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          )}
          
          <p className="text-sm text-gray-400">
            Time to crack: {passwordAnalysis.crackTimesDisplay.offline_fast_hashing_1e10_per_second}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-500">URL (optional)</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-background-light text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-cyan-500">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-600 bg-background-light text-gray-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-background-light hover:bg-background"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
      </div>
    </form>
  );
}