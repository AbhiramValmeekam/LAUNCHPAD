interface PasswordAnalysis {
  score: number;  // 0-100
  strength: 'very weak' | 'weak' | 'moderate' | 'strong' | 'very strong';
  feedback: string[];
  estimatedCrackTime: string;
}

export class PasswordStrengthAnalyzer {
  private static patterns = {
    numbers: /\d/,
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
    commonWords: [
      'password', '123456', 'qwerty', 'admin', 'letmein',
      'welcome', 'monkey', 'football', 'abc123', 'master'
    ]
  };

  private static calculateEntropy(password: string): number {
    const charset = {
      numbers: password.match(/\d/) ? 10 : 0,
      lowercase: password.match(/[a-z]/) ? 26 : 0,
      uppercase: password.match(/[A-Z]/) ? 26 : 0,
      special: password.match(/[!@#$%^&*(),.?":{}|<>]/) ? 33 : 0
    };

    const poolSize = Object.values(charset).reduce((a, b) => a + b, 0);
    return Math.log2(Math.pow(poolSize, password.length));
  }

  private static estimateCrackTime(entropy: number): string {
    const guessesPerSecond = 1000000000; // Assume 1 billion guesses per second
    const seconds = Math.pow(2, entropy) / guessesPerSecond;

    if (seconds < 60) return 'instantly';
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
  }

  private static analyzePatterns(password: string): string[] {
    const feedback: string[] = [];
    
    // Check length
    if (password.length < 8) {
      feedback.push('Password is too short. Use at least 8 characters.');
    }
    if (password.length < 12) {
      feedback.push('Consider using a longer password for better security.');
    }

    // Check character variety
    if (!this.patterns.numbers.test(password)) {
      feedback.push('Add numbers to make the password stronger.');
    }
    if (!this.patterns.uppercase.test(password)) {
      feedback.push('Include uppercase letters for better security.');
    }
    if (!this.patterns.lowercase.test(password)) {
      feedback.push('Include lowercase letters for better security.');
    }
    if (!this.patterns.special.test(password)) {
      feedback.push('Add special characters to strengthen the password.');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeating characters.');
    }
    if (/^[0-9]+$/.test(password)) {
      feedback.push('Using only numbers makes the password weak.');
    }
    if (this.patterns.commonWords.some(word => 
      password.toLowerCase().includes(word.toLowerCase()))) {
      feedback.push('Avoid using common words or patterns.');
    }

    // Check for keyboard patterns
    const keyboardPatterns = ['qwerty', 'asdfgh', '123456'];
    if (keyboardPatterns.some(pattern => 
      password.toLowerCase().includes(pattern.toLowerCase()))) {
      feedback.push('Avoid using keyboard patterns.');
    }

    return feedback;
  }

  public static analyzePassword(password: string): PasswordAnalysis {
    const entropy = this.calculateEntropy(password);
    const feedback = this.analyzePatterns(password);
    
    // Calculate score (0-100)
    let score = Math.min(100, Math.round((entropy / 128) * 100));
    
    // Adjust score based on feedback
    score -= feedback.length * 5;
    score = Math.max(0, Math.min(100, score));

    // Determine strength category
    let strength: PasswordAnalysis['strength'];
    if (score >= 90) strength = 'very strong';
    else if (score >= 70) strength = 'strong';
    else if (score >= 50) strength = 'moderate';
    else if (score >= 30) strength = 'weak';
    else strength = 'very weak';

    return {
      score,
      strength,
      feedback,
      estimatedCrackTime: this.estimateCrackTime(entropy)
    };
  }
} 