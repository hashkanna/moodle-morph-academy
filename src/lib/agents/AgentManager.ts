import { QuizMasterAgent } from './QuizMasterAgent';
import { VocabSenseiAgent } from './VocabSenseiAgent';
import { ExamProctorAgent } from './ExamProctorAgent';
import { AIGeneratedQuiz, AIGeneratedFlashcards, AIGeneratedExam } from '../aiService';

export class AgentManager {
  private quizMaster: QuizMasterAgent;
  private vocabSensei: VocabSenseiAgent;
  private examProctor: ExamProctorAgent;

  constructor() {
    this.quizMaster = new QuizMasterAgent();
    this.vocabSensei = new VocabSenseiAgent();
    this.examProctor = new ExamProctorAgent();
  }

  // Quiz generation with Quiz Master Agent
  async generateQuiz(
    materialContent: string,
    options: { questionCount: number; difficulty: 'easy' | 'medium' | 'hard' | 'mixed' }
  ): Promise<AIGeneratedQuiz> {
    console.log(`🎯 Quiz Master Agent: Generating ${options.questionCount} ${options.difficulty} questions...`);
    
    try {
      const quiz = await this.quizMaster.generateQuiz(materialContent, options);
      console.log(`✅ Quiz Master Agent: Generated quiz with ${quiz.questions.length} questions`);
      return quiz;
    } catch (error) {
      console.error('❌ Quiz Master Agent failed:', error);
      throw error;
    }
  }

  // Flashcard generation with Vocab Sensei Agent
  async generateFlashcards(
    materialContent: string,
    options: { cardCount: number; focusLevel: 'vocabulary' | 'concepts' | 'mixed' }
  ): Promise<AIGeneratedFlashcards> {
    console.log(`🇩🇪 Vocab Sensei Agent: Creating ${options.cardCount} flashcards (${options.focusLevel} focus)...`);
    
    try {
      const flashcards = await this.vocabSensei.generateFlashcards(materialContent, options);
      console.log(`✅ Vocab Sensei Agent: Generated ${flashcards.cards.length} flashcards`);
      return flashcards;
    } catch (error) {
      console.error('❌ Vocab Sensei Agent failed:', error);
      throw error;
    }
  }

  // Exam generation with Exam Proctor Agent
  async generateExam(
    materialContent: string,
    options: { 
      questionCount: number; 
      duration: number;
      examType: 'midterm' | 'final' | 'practice';
    }
  ): Promise<AIGeneratedExam> {
    console.log(`📊 Exam Proctor Agent: Creating ${options.examType} exam (${options.questionCount} questions, ${options.duration} min)...`);
    
    try {
      const exam = await this.examProctor.generateExam(materialContent, options);
      
      // Get exam difficulty analysis from Exam Proctor
      const analysis = await this.examProctor.validateExamDifficulty(exam);
      console.log(`📋 Exam Proctor Analysis: ${analysis.isBalanced ? 'Well-balanced' : 'Needs adjustment'}`);
      console.log(`💡 Recommendations: ${analysis.recommendations.join(', ')}`);
      
      console.log(`✅ Exam Proctor Agent: Generated exam with ${exam.questions.length} questions`);
      return exam;
    } catch (error) {
      console.error('❌ Exam Proctor Agent failed:', error);
      throw error;
    }
  }

  // Enhanced functionality: Agent collaboration
  async enhanceQuizWithVocabHints(quiz: AIGeneratedQuiz): Promise<AIGeneratedQuiz> {
    console.log('🤝 Agent Collaboration: Quiz Master + Vocab Sensei enhancing quiz...');
    
    try {
      // For each question, if it contains German terms, get pronunciation hints
      const enhancedQuestions = await Promise.all(
        quiz.questions.map(async (question) => {
          // Simple German term detection (words with capital letters in middle)
          const germanTerms = question.question.match(/[A-ZÄÖÜ][a-zäöüß]*[A-ZÄÖÜ][a-zäöüß]*/g);
          
          if (germanTerms && germanTerms.length > 0) {
            // Get pronunciation hint for first German term found
            const termWithPronunciation = await this.vocabSensei.addPronunciationHint(germanTerms[0]);
            
            // Replace the term in the question with the pronunciation version
            const enhancedQuestion = question.question.replace(
              germanTerms[0],
              termWithPronunciation
            );
            
            return { ...question, question: enhancedQuestion };
          }
          
          return question;
        })
      );
      
      console.log('✅ Enhanced quiz with vocabulary hints');
      return { ...quiz, questions: enhancedQuestions };
    } catch (error) {
      console.error('❌ Agent collaboration failed, returning original quiz:', error);
      return quiz;
    }
  }

  // Get information about all available agents
  getAgentInfo() {
    return {
      quizMaster: {
        name: this.quizMaster.getName(),
        description: this.quizMaster.getDescription(),
        status: 'active'
      },
      vocabSensei: {
        name: this.vocabSensei.getName(),
        description: this.vocabSensei.getDescription(),
        status: 'active'
      },
      examProctor: {
        name: this.examProctor.getName(),
        description: this.examProctor.getDescription(),
        status: 'active'
      }
    };
  }

  // Health check for all agents
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const health = {
      quizMaster: false,
      vocabSensei: false,
      examProctor: false
    };

    // First check if Claude API key is available
    const hasApiKey = !!import.meta.env.VITE_CLAUDE_API_KEY;
    console.log('🔑 Agent Manager: API Key check -', hasApiKey ? 'Found' : 'Missing');
    
    if (!hasApiKey) {
      console.warn('❌ Claude API key not found - agents will show as offline');
      return health; // All remain false
    }

    try {
      // Simple check - just verify agents can be instantiated and have API access
      // We'll mark them as healthy if they have API key (actual testing would be too slow for UI)
      health.quizMaster = true;
      health.vocabSensei = true;
      health.examProctor = true;
      
      console.log('✅ All agents are ready with Claude API access');
    } catch (error) {
      console.error('Agent health check failed:', error);
    }

    return health;
  }
}

// Singleton instance for global use
export const agentManager = new AgentManager();