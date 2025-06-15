import { BaseAgent } from './BaseAgent';
import { AIGeneratedFlashcards } from '../aiService';

export class VocabSenseiAgent extends BaseAgent {
  constructor() {
    super(
      'Vocab Sensei',
      'You are a German language expert specializing in technical Material Science vocabulary. You create memorable flashcards that help students master German technical terms with clear explanations, pronunciation hints, and memory techniques. You understand the challenges of learning technical German.'
    );
  }

  getName(): string {
    return 'Vocab Sensei Agent';
  }

  getDescription(): string {
    return 'Expert in German technical vocabulary and spaced repetition learning';
  }

  async generateFlashcards(
    materialContent: string,
    options: { cardCount: number; focusLevel: 'vocabulary' | 'concepts' | 'mixed' }
  ): Promise<AIGeneratedFlashcards> {
    const prompt = `As Vocab Sensei, extract ${options.cardCount} German technical terms from this Material Science content and create flashcards.

CONTENT:
${materialContent}

FOCUS: ${options.focusLevel}

REQUIREMENTS:
- Extract German technical terms and concepts
- Front: German term with pronunciation hint
- Back: Clear English explanation with context
- Include memory techniques where helpful
- Categorize by topic area
- Vary difficulty levels

Generate exactly this JSON structure:
{
  "cards": [
    {
      "front": "German Term [pronunciation]",
      "back": "English translation/explanation with context and usage example",
      "category": "Topic area (e.g., 'Crystal Structures', 'Material Properties')",
      "difficulty": "easy|medium|hard"
    }
  ],
  "metadata": {
    "sourceText": "First 100 characters of source...",
    "generatedAt": "${new Date().toISOString()}",
    "totalCards": ${options.cardCount}
  }
}`;

    try {
      const response = await this.callClaude(prompt, 3500);
      const flashcards = this.parseJSONResponse<AIGeneratedFlashcards>(response);
      
      // Validate the flashcards structure
      if (!flashcards.cards || flashcards.cards.length !== options.cardCount) {
        throw new Error('Vocab Sensei: Invalid card count in generated flashcards');
      }

      return flashcards;
    } catch (error) {
      console.error('Vocab Sensei Agent Error:', error);
      throw error;
    }
  }

  async addPronunciationHint(germanTerm: string): Promise<string> {
    const prompt = `As Vocab Sensei, provide a simple pronunciation guide for this German technical term: "${germanTerm}"

Return format: "Term [pronunciation-guide]"
Example: "Kristallstruktur [KRIS-tall-shtrook-toor]"

Return only the term with pronunciation guide.`;

    try {
      const response = await this.callClaude(prompt, 200);
      return response.trim().replace(/^"|"$/g, '');
    } catch (error) {
      console.error('Vocab Sensei Pronunciation Error:', error);
      return `${germanTerm} [pronunciation guide unavailable]`;
    }
  }

  async suggestMemoryTechnique(germanTerm: string, englishMeaning: string): Promise<string> {
    const prompt = `As Vocab Sensei, suggest a memory technique to help remember:
German: ${germanTerm}
English: ${englishMeaning}

Create a short, memorable association or mnemonic. Return only the memory technique.`;

    try {
      const response = await this.callClaude(prompt, 300);
      return response.trim().replace(/^"|"$/g, '');
    } catch (error) {
      console.error('Vocab Sensei Memory Technique Error:', error);
      return 'Try to connect this term with similar words you already know.';
    }
  }
}