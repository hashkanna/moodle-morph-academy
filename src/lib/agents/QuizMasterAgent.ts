import { BaseAgent } from './BaseAgent';
import { AIGeneratedQuiz } from '../aiService';

export class QuizMasterAgent extends BaseAgent {
  constructor() {
    super(
      'Quiz Master',
      'You are an expert educational quiz creator specializing in Material Science. You focus on creating thought-provoking multiple-choice questions that test deep understanding, not just memorization. You craft excellent distractors and provide clear explanations.'
    );
  }

  getName(): string {
    return 'Quiz Master Agent';
  }

  getDescription(): string {
    return 'Specialized in creating educational quizzes with pedagogically sound questions and explanations';
  }

  async generateQuiz(
    materialContent: string,
    options: { questionCount: number; difficulty: 'easy' | 'medium' | 'hard' | 'mixed' }
  ): Promise<AIGeneratedQuiz> {
    const prompt = `As Quiz Master, analyze this Material Science content and create ${options.questionCount} multiple-choice questions.

CONTENT:
${materialContent}

REQUIREMENTS:
- Difficulty level: ${options.difficulty}
- Focus on conceptual understanding over memorization
- Create plausible distractors that reveal common misconceptions
- Provide clear, educational explanations
- Cover key concepts from the material

Generate exactly this JSON structure:
{
  "questions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct and why others are wrong",
      "difficulty": "easy|medium|hard"
    }
  ],
  "metadata": {
    "sourceText": "First 100 characters of source...",
    "generatedAt": "${new Date().toISOString()}",
    "totalQuestions": ${options.questionCount}
  }
}`;

    try {
      const response = await this.callClaude(prompt, 3000);
      const quiz = this.parseJSONResponse<AIGeneratedQuiz>(response);
      
      // Validate the quiz structure
      if (!quiz.questions || quiz.questions.length !== options.questionCount) {
        throw new Error('Quiz Master: Invalid question count in generated quiz');
      }

      return quiz;
    } catch (error) {
      console.error('Quiz Master Agent Error:', error);
      throw error;
    }
  }

  async adaptQuestionDifficulty(
    question: string,
    currentDifficulty: string,
    targetDifficulty: string,
    materialContext: string
  ): Promise<string> {
    const prompt = `As Quiz Master, adapt this question from ${currentDifficulty} to ${targetDifficulty} difficulty:

QUESTION: ${question}
CONTEXT: ${materialContext}

Make the question ${targetDifficulty === 'hard' ? 'more challenging by requiring deeper analysis' : 
                   targetDifficulty === 'easy' ? 'more accessible with clearer language' : 
                   'moderately challenging with balanced complexity'}.

Return only the adapted question text.`;

    try {
      const response = await this.callClaude(prompt, 500);
      return response.trim().replace(/^"|"$/g, ''); // Remove quotes if present
    } catch (error) {
      console.error('Quiz Master Adaptation Error:', error);
      return question; // Fallback to original
    }
  }
}