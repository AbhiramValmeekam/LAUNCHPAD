import React, { useState } from 'react';
import { passwordAnalyzer, type PasswordAnalysis } from '../services/passwordAnalyzer';

interface PasswordAnalyzerProps {
    password: string;
}

const PasswordAnalyzer: React.FC<PasswordAnalyzerProps> = ({ password }) => {
    const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzePassword = async () => {
        if (!password) return;
        
        setLoading(true);
        setError(null);
        try {
            const result = await passwordAnalyzer.analyzePassword(password);
            setAnalysis(result);
        } catch (err) {
            setError('Failed to analyze password');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (password) {
            analyzePassword();
        } else {
            setAnalysis(null);
        }
    }, [password]);

    if (!password) return null;
    if (loading) return <div className="text-gray-600">Analyzing password...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!analysis) return null;

    const getStrengthColor = (strength: string) => {
        switch (strength.toLowerCase()) {
            case 'very weak': return 'text-red-600';
            case 'weak': return 'text-orange-500';
            case 'moderate': return 'text-yellow-500';
            case 'strong': return 'text-green-500';
            case 'very strong': return 'text-emerald-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">Strength:</span>
                <span className={getStrengthColor(analysis.strength)}>
                    {analysis.strength}
                </span>
                <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                    <div
                        className={`h-full rounded-full ${getStrengthColor(analysis.strength)}`}
                        style={{ width: `${analysis.score}%` }}
                    />
                </div>
            </div>

            {analysis.feedback.length > 0 && (
                <div className="mt-2">
                    <span className="font-semibold">Feedback:</span>
                    <ul className="list-disc list-inside mt-1">
                        {analysis.feedback.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {analysis.suggestions.length > 0 && (
                <div className="mt-2">
                    <span className="font-semibold">Suggestions:</span>
                    <ul className="list-disc list-inside mt-1">
                        {analysis.suggestions.map((item, index) => (
                            <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordAnalyzer; 