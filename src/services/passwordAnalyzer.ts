interface PasswordAnalysis {
    score: number;
    strength: string;
    feedback: string[];
    suggestions: string[];
}

class PasswordAnalyzerService {
    private readonly API_URL = 'http://localhost:8000/api';

    async analyzePassword(password: string): Promise<PasswordAnalysis> {
        try {
            const response = await fetch(`${this.API_URL}/analyze-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze password');
            }

            return await response.json();
        } catch (error) {
            console.error('Error analyzing password:', error);
            throw error;
        }
    }
}

export const passwordAnalyzer = new PasswordAnalyzerService();
export type { PasswordAnalysis }; 