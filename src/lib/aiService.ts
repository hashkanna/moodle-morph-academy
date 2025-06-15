// AI Service for generating educational content from course materials
// This service integrates with AI providers to generate quizzes, flashcards, and exams

export interface AIGeneratedQuiz {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  metadata: {
    sourceText: string;
    generatedAt: string;
    totalQuestions: number;
  };
}

export interface AIGeneratedFlashcards {
  cards: Array<{
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  metadata: {
    sourceText: string;
    generatedAt: string;
    totalCards: number;
  };
}

export interface AIGeneratedExam {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
    type: 'multiple_choice' | 'essay' | 'calculation';
    explanation: string;
  }>;
  metadata: {
    sourceText: string;
    generatedAt: string;
    totalQuestions: number;
    totalPoints: number;
    estimatedDuration: number; // minutes
  };
}

class AIService {
  private apiKey: string | null = null;
  private baseUrl: string = 'https://api.openai.com/v1';
  
  constructor() {
    // In a real app, this would come from environment variables
    // For now, we'll simulate AI responses or use a fallback
    this.apiKey = process.env.REACT_APP_OPENAI_API_KEY || null;
  }

  private async callAI(prompt: string, maxTokens: number = 2000): Promise<string> {
    if (!this.apiKey) {
      // Fallback to mock responses for demo purposes
      return this.mockAIResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational content creator specializing in Material Science. Generate high-quality, accurate educational content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.warn('AI API call failed, using fallback:', error);
      return this.mockAIResponse(prompt);
    }
  }

  private mockAIResponse(prompt: string): string {
    // Intelligent mock responses based on prompt content
    if (prompt.includes('quiz') || prompt.includes('questions')) {
      return JSON.stringify({
        questions: [
          {
            question: "What is the primary mechanism of plastic deformation in metals?",
            options: ["Vacancy diffusion", "Dislocation motion", "Grain boundary sliding", "Phase transformation"],
            correctAnswer: 1,
            explanation: "Plastic deformation in metals occurs primarily through dislocation motion along slip planes.",
            difficulty: "medium"
          },
          {
            question: "Which crystal structure has the highest packing efficiency?",
            options: ["Simple cubic", "Body-centered cubic", "Face-centered cubic", "Hexagonal"],
            correctAnswer: 2,
            explanation: "FCC and HCP both have packing efficiencies of 74%, which is the highest possible.",
            difficulty: "hard"
          }
        ]
      });
    }
    
    if (prompt.includes('flashcard') || prompt.includes('anki')) {
      return JSON.stringify({
        cards: [
          { front: "Elastizitätsmodul", back: "Maß für die Steifigkeit eines Materials - Verhältnis von Spannung zu Dehnung im elastischen Bereich", category: "mechanical_properties", difficulty: "medium" },
          { front: "Versetzung", back: "Liniendefekt im Kristallgitter, der die plastische Verformung in Metallen ermöglicht", category: "crystal_defects", difficulty: "medium" },
          { front: "Korngrenze", back: "Grenzfläche zwischen zwei Kristallkörnern mit unterschiedlicher Orientierung", category: "microstructure", difficulty: "easy" }
        ]
      });
    }
    
    if (prompt.includes('exam')) {
      return JSON.stringify({
        questions: [
          {
            question: "Derive the relationship between stress and strain for a linear elastic material and explain the physical meaning of Young's modulus.",
            options: ["Essay question - detailed derivation required"],
            correctAnswer: 0,
            points: 20,
            type: "essay",
            explanation: "This requires understanding of Hooke's law and material stiffness concepts."
          },
          {
            question: "Calculate the critical resolved shear stress for slip in a single crystal if the applied stress is 100 MPa and the slip plane makes a 45° angle with the loading direction.",
            options: ["35.4 MPa", "50.0 MPa", "70.7 MPa", "100 MPa"],
            correctAnswer: 2,
            points: 15,
            type: "calculation",
            explanation: "τ = σ × cos(φ) × cos(λ) where φ and λ are angles with slip plane and direction."
          }
        ]
      });
    }

    return "Unable to generate content for this prompt.";
  }

  async generateQuiz(sourceText: string, options: {
    questionCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    language?: 'en' | 'de';
  } = {}): Promise<AIGeneratedQuiz> {
    const { questionCount = 5, difficulty = 'mixed', language = 'en' } = options;
    
    const prompt = `
Generate ${questionCount} multiple-choice quiz questions based on the following Material Science content.

Content: "${sourceText}"

Requirements:
- Difficulty level: ${difficulty}
- Language: ${language}
- Format: Multiple choice with 4 options each
- Include detailed explanations
- Focus on key concepts, formulas, and applications
- Questions should test understanding, not just memorization

Return as JSON with this structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
`;

    const response = await this.callAI(prompt, 3000);
    
    try {
      const parsed = JSON.parse(response);
      return {
        questions: parsed.questions || [],
        metadata: {
          sourceText: sourceText.substring(0, 200) + '...',
          generatedAt: new Date().toISOString(),
          totalQuestions: parsed.questions?.length || 0
        }
      };
    } catch (error) {
      throw new Error('Failed to parse AI response for quiz generation');
    }
  }

  async generateFlashcards(sourceText: string, options: {
    cardCount?: number;
    language?: 'en' | 'de';
    includeFormulas?: boolean;
  } = {}): Promise<AIGeneratedFlashcards> {
    const { cardCount = 10, language = 'de', includeFormulas = true } = options;
    
    const prompt = `
Generate ${cardCount} flashcards for Anki based on the following Material Science content.

Content: "${sourceText}"

Requirements:
- Language: ${language} (German terms preferred for technical vocabulary)
- Include key terms, definitions, concepts, and ${includeFormulas ? 'formulas' : 'no formulas'}
- Front: Term or concept
- Back: Clear, concise definition or explanation
- Mix difficulty levels
- Focus on terminology that students need to memorize

Return as JSON with this structure:
{
  "cards": [
    {
      "front": "string",
      "back": "string", 
      "category": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
`;

    const response = await this.callAI(prompt, 3000);
    
    try {
      const parsed = JSON.parse(response);
      return {
        cards: parsed.cards || [],
        metadata: {
          sourceText: sourceText.substring(0, 200) + '...',
          generatedAt: new Date().toISOString(),
          totalCards: parsed.cards?.length || 0
        }
      };
    } catch (error) {
      throw new Error('Failed to parse AI response for flashcard generation');
    }
  }

  async generateExam(sourceText: string, options: {
    questionCount?: number;
    duration?: number; // minutes
    includeEssay?: boolean;
    includeCalculations?: boolean;
    language?: 'en' | 'de';
  } = {}): Promise<AIGeneratedExam> {
    const { questionCount = 8, duration = 90, includeEssay = true, includeCalculations = true, language = 'en' } = options;
    
    const prompt = `
Generate a comprehensive exam with ${questionCount} questions based on the following Material Science content.

Content: "${sourceText}"

Requirements:
- Duration: ${duration} minutes
- Include multiple choice, ${includeEssay ? 'essay questions,' : ''} ${includeCalculations ? 'and calculation problems' : ''}
- Language: ${language}
- Point values should reflect question difficulty and length
- Include detailed explanations for correct answers
- Cover breadth and depth of the material
- Mix question types and difficulty levels

Return as JSON with this structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "points": 10,
      "type": "multiple_choice|essay|calculation",
      "explanation": "string"
    }
  ]
}
`;

    const response = await this.callAI(prompt, 4000);
    
    try {
      const parsed = JSON.parse(response);
      const questions = parsed.questions || [];
      return {
        questions,
        metadata: {
          sourceText: sourceText.substring(0, 200) + '...',
          generatedAt: new Date().toISOString(),
          totalQuestions: questions.length,
          totalPoints: questions.reduce((sum: number, q: any) => sum + (q.points || 10), 0),
          estimatedDuration: duration
        }
      };
    } catch (error) {
      throw new Error('Failed to parse AI response for exam generation');
    }
  }

  // Utility method to validate content before AI generation
  validateContent(text: string): { isValid: boolean; reason?: string } {
    if (!text || text.trim().length < 100) {
      return { isValid: false, reason: 'Content too short for meaningful generation' };
    }
    
    if (text.length > 10000) {
      return { isValid: false, reason: 'Content too long - please provide a focused excerpt' };
    }
    
    return { isValid: true };
  }

  // Method to extract key topics from content
  async extractTopics(sourceText: string): Promise<string[]> {
    const prompt = `
Extract the 5-8 main topics/concepts from this Material Science content:

"${sourceText}"

Return as a simple JSON array of strings: ["topic1", "topic2", ...]
`;

    const response = await this.callAI(prompt, 500);
    
    try {
      return JSON.parse(response);
    } catch {
      return ['Material Properties', 'Crystal Structure', 'Mechanical Behavior'];
    }
  }
}

export const aiService = new AIService();
export default aiService;