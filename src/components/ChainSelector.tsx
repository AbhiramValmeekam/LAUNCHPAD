import React from 'react';
import { blockchainService } from '../services/blockchainService';

interface ChainSelectorProps {
  onChainSwitch: () => void;
}

export function ChainSelector({ onChainSwitch }: ChainSelectorProps) {
  const [currentChain, setCurrentChain] = React.useState(blockchainService.getCurrentChain());
  const chains = blockchainService.getSupportedChains();

  const handleChainChange = async (chain: string) => {
    try {
      await blockchainService.switchChain(chain);
      setCurrentChain(chain);
      onChainSwitch();
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm text-gray-400">Network:</label>
      <div className="relative">
        <select
          value={currentChain}
          onChange={(e) => handleChainChange(e.target.value)}
          className="bg-background-light text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-cyan-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none appearance-none pr-8"
        >
          {chains.map((chain) => (
            <option key={chain} value={chain} className="bg-background-light">
              {blockchainService.getChainConfig(chain).name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-gray-400">
          Connected to {blockchainService.getChainConfig(currentChain).name}
        </span>
      </div>
    </div>
  );
} 