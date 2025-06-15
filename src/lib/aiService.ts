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
  private openaiKey: string | null = null;
  private claudeKey: string | null = null;
  private provider: 'openai' | 'claude' | 'mock' = 'mock';
  
  constructor() {
    // Check for available API keys
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    this.claudeKey = import.meta.env.VITE_CLAUDE_API_KEY || null;
    
    // Debug logging
    console.log('🔧 Environment variables:', {
      hasOpenAI: !!this.openaiKey,
      hasClaude: !!this.claudeKey,
      claudeKeyPreview: this.claudeKey ? `${this.claudeKey.substring(0, 10)}...` : 'not found',
      allEnvVars: import.meta.env
    });
    
    // Prefer Claude if available, then OpenAI, then mock
    if (this.claudeKey) {
      this.provider = 'claude';
      console.log('🤖 AI Service: Using Claude API');
    } else if (this.openaiKey) {
      this.provider = 'openai';
      console.log('🤖 AI Service: Using OpenAI API');
    } else {
      this.provider = 'mock';
      console.log('🤖 AI Service: Using mock responses (no API key found)');
    }
  }

  private async callAI(prompt: string, maxTokens: number = 2000): Promise<string> {
    if (this.provider === 'mock') {
      return this.mockAIResponse(prompt);
    }

    try {
      if (this.provider === 'claude') {
        return await this.callClaude(prompt, maxTokens);
      } else if (this.provider === 'openai') {
        return await this.callOpenAI(prompt, maxTokens);
      }
    } catch (error) {
      console.warn(`${this.provider} API call failed, using fallback:`, error);
      return this.mockAIResponse(prompt);
    }

    return this.mockAIResponse(prompt);
  }

  private async callClaude(prompt: string, maxTokens: number): Promise<string> {
    console.log('🔵 Calling Claude API with prompt:', prompt.substring(0, 100) + '...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.claudeKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        temperature: 0.7,
        system: 'You are an expert educational content creator specializing in Material Science. Generate high-quality, accurate educational content in the requested format.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    console.log('🔵 Claude API response status:', response.status);
    
    if (!response.ok) {
      console.error('🔴 Claude API error:', data);
      throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    console.log('✅ Claude API success, response length:', data.content[0].text.length);
    return data.content[0].text;
  }

  private async callOpenAI(prompt: string, maxTokens: number): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiKey}`,
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
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }
    return data.choices[0].message.content;
  }

  private mockAIResponse(prompt: string): string {
    console.log('⚠️ Using mock response - AI API not available or failed');
    console.log('🔍 Prompt was:', prompt.substring(0, 200) + '...');
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
          },
          {
            question: "What type of bonding is predominant in ceramic materials?",
            options: ["Metallic bonding", "Ionic and covalent bonding", "Van der Waals forces", "Hydrogen bonding"],
            correctAnswer: 1,
            explanation: "Ceramics are characterized by ionic and/or covalent bonding between atoms, which gives them high hardness and brittleness.",
            difficulty: "medium"
          },
          {
            question: "Which material property is most affected by grain size?",
            options: ["Density", "Melting point", "Yield strength", "Thermal conductivity"],
            correctAnswer: 2,
            explanation: "According to the Hall-Petch relationship, yield strength increases with decreasing grain size.",
            difficulty: "hard"
          },
          {
            question: "What is the main difference between substitutional and interstitial solid solutions?",
            options: ["Crystal structure", "Atomic size difference", "Bonding type", "Phase stability"],
            correctAnswer: 1,
            explanation: "Substitutional solutions have similar-sized atoms replacing host atoms, while interstitial solutions have small atoms fitting between host atoms.",
            difficulty: "medium"
          },
          {
            question: "Which phase transformation occurs in steel during quenching?",
            options: ["Austenite to ferrite", "Austenite to martensite", "Ferrite to cementite", "Pearlite to bainite"],
            correctAnswer: 1,
            explanation: "Rapid cooling (quenching) transforms austenite to martensite, a hard but brittle phase.",
            difficulty: "hard"
          },
          {
            question: "What is the driving force for recrystallization?",
            options: ["Temperature gradient", "Stored strain energy", "Chemical potential", "Surface energy"],
            correctAnswer: 1,
            explanation: "The stored strain energy from cold working provides the driving force for recrystallization.",
            difficulty: "medium"
          },
          {
            question: "Which composite reinforcement provides the highest strength-to-weight ratio?",
            options: ["Glass fibers", "Carbon fibers", "Aramid fibers", "Steel fibers"],
            correctAnswer: 1,
            explanation: "Carbon fibers offer the highest strength-to-weight ratio, making them ideal for aerospace applications.",
            difficulty: "medium"
          },
          {
            question: "What determines the ductile-to-brittle transition temperature in BCC metals?",
            options: ["Grain size", "Strain rate", "Crystal structure", "All of the above"],
            correctAnswer: 3,
            explanation: "The ductile-to-brittle transition is influenced by grain size, strain rate, and the inherent crystal structure properties.",
            difficulty: "hard"
          },
          {
            question: "Which heat treatment process increases toughness while slightly reducing hardness?",
            options: ["Annealing", "Quenching", "Tempering", "Normalizing"],
            correctAnswer: 2,
            explanation: "Tempering reduces brittleness and increases toughness by allowing some martensite to transform to more ductile phases.",
            difficulty: "medium"
          }
        ]
      });
    }
    
    if (prompt.includes('flashcard') || prompt.includes('anki')) {
      return JSON.stringify({
        cards: [
          { front: "Elastizitätsmodul", back: "Maß für die Steifigkeit eines Materials - Verhältnis von Spannung zu Dehnung im elastischen Bereich", category: "mechanical_properties", difficulty: "medium" },
          { front: "Versetzung", back: "Liniendefekt im Kristallgitter, der die plastische Verformung in Metallen ermöglicht", category: "crystal_defects", difficulty: "medium" },
          { front: "Korngrenze", back: "Grenzfläche zwischen zwei Kristallkörnern mit unterschiedlicher Orientierung", category: "microstructure", difficulty: "easy" },
          { front: "Fließgrenze", back: "Spannung, bei der ein Material beginnt sich plastisch zu verformen", category: "mechanical_properties", difficulty: "medium" },
          { front: "Härte", back: "Widerstand eines Materials gegen lokale plastische Verformung", category: "mechanical_properties", difficulty: "easy" },
          { front: "Zähigkeit", back: "Fähigkeit eines Materials, Energie zu absorbieren bevor es bricht", category: "mechanical_properties", difficulty: "hard" },
          { front: "Kristallgitter", back: "Regelmäßige, dreidimensionale Anordnung von Atomen in einem Kristall", category: "crystal_structure", difficulty: "medium" },
          { front: "Phasendiagramm", back: "Grafische Darstellung der Stabilitätsbereiche verschiedener Phasen", category: "phase_diagrams", difficulty: "hard" },
          { front: "Diffusion", back: "Transport von Atomen durch thermische Bewegung im Festkörper", category: "transport_properties", difficulty: "medium" },
          { front: "Rekristallisation", back: "Bildung neuer, spannungsfreier Körner nach Kaltverformung", category: "heat_treatment", difficulty: "hard" },
          { front: "Martensit", back: "Harte, spröde Phase die bei schneller Abkühlung von Stahl entsteht", category: "phase_transformations", difficulty: "hard" },
          { front: "Legierung", back: "Mischung aus zwei oder mehr metallischen Elementen", category: "alloys", difficulty: "easy" },
          { front: "Korngröße", back: "Durchschnittliche Größe der Kristallkörner in einem polykristallinen Material", category: "microstructure", difficulty: "medium" },
          { front: "Spannungsrisskorrosion", back: "Rissbildung unter kombinierter Wirkung von Spannung und korrosiver Umgebung", category: "failure_mechanisms", difficulty: "hard" },
          { front: "Verbundwerkstoff", back: "Material aus zwei oder mehr Komponenten mit unterschiedlichen Eigenschaften", category: "composites", difficulty: "medium" }
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