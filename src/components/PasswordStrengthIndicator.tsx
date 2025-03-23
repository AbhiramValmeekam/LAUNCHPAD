import React, { useEffect, useState } from 'react';
import { PasswordStrengthAnalyzer } from '../services/passwordStrengthAnalyzer';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (password) {
      const result = PasswordStrengthAnalyzer.analyzePassword(password);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [password]);

  if (!analysis) return null;

  const getColorByStrength = (strength: string) => {
    switch (strength) {
      case 'very weak': return '#ff4444';
      case 'weak': return '#ffa700';
      case 'moderate': return '#ffdd00';
      case 'strong': return '#00c851';
      case 'very strong': return '#007e33';
      default: return '#grey';
    }
  };

  return (
    <div className="password-strength-indicator">
      <div className="strength-bar-container" style={{ marginBottom: '10px' }}>
        <div
          className="strength-bar"
          style={{
            height: '4px',
            width: `${analysis.score}%`,
            backgroundColor: getColorByStrength(analysis.strength),
            transition: 'all 0.3s ease',
            borderRadius: '2px'
          }}
        />
      </div>

      <div className="strength-details">
        <div style={{ 
          color: getColorByStrength(analysis.strength),
          fontWeight: 'bold',
          marginBottom: '8px'
        }}>
          Password Strength: {analysis.strength.charAt(0).toUpperCase() + analysis.strength.slice(1)}
        </div>

        <div style={{ fontSize: '0.9em', color: '#666' }}>
          Estimated crack time: {analysis.estimatedCrackTime}
        </div>

        {analysis.feedback.length > 0 && (
          <div className="feedback-list" style={{ marginTop: '10px' }}>
            <ul style={{ 
              margin: 0,
              padding: '0 0 0 20px',
              color: '#666',
              fontSize: '0.9em'
            }}>
              {analysis.feedback.map((feedback: string, index: number) => (
                <li key={index} style={{ marginBottom: '4px' }}>{feedback}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}; 