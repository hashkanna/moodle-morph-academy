import { BaseAgent } from './BaseAgent';
import { AIGeneratedExam } from '../aiService';

export class ExamProctorAgent extends BaseAgent {
  constructor() {
    super(
      'Exam Proctor',
      'You are a rigorous but fair exam creator specializing in comprehensive Material Science assessments. You design realistic exam conditions with varied question types, appropriate point distributions, and balanced difficulty progression. You ensure exams test both breadth and depth of knowledge.'
    );
  }

  getName(): string {
    return 'Exam Proctor Agent';
  }

  getDescription(): string {
    return 'Creates comprehensive exams with realistic conditions and balanced assessment';
  }

  async generateExam(
    materialContent: string,
    options: { 
      questionCount: number; 
      duration: number; // minutes
      examType: 'midterm' | 'final' | 'practice';
    }
  ): Promise<AIGeneratedExam> {
    const totalPoints = options.questionCount * 10; // 10 points per question baseline
    
    const prompt = `As Exam Proctor, create a comprehensive ${options.examType} exam with ${options.questionCount} questions from this Material Science content.

CONTENT:
${materialContent}

EXAM SPECIFICATIONS:
- Type: ${options.examType}
- Duration: ${options.duration} minutes
- Total Points: ${totalPoints}
- Question Distribution: Mix of difficulty levels
- Coverage: Comprehensive across all major topics

REQUIREMENTS:
- Start with easier questions, progress to harder ones
- Include conceptual, analytical, and application questions
- Point values should reflect question difficulty
- Provide detailed explanations for learning
- Ensure realistic timing (average ${Math.round(options.duration / options.questionCount)} min per question)

Generate exactly this JSON structure:
{
  "questions": [
    {
      "question": "Complete question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "points": 10,
      "type": "multiple_choice",
      "explanation": "Detailed explanation for learning purposes"
    }
  ],
  "metadata": {
    "sourceText": "First 100 characters of source...",
    "generatedAt": "${new Date().toISOString()}",
    "totalQuestions": ${options.questionCount},
    "totalPoints": ${totalPoints},
    "estimatedDuration": ${options.duration}
  }
}`;

    try {
      const response = await this.callClaude(prompt, 4000);
      const exam = this.parseJSONResponse<AIGeneratedExam>(response);
      
      // Validate the exam structure
      if (!exam.questions || exam.questions.length !== options.questionCount) {
        throw new Error('Exam Proctor: Invalid question count in generated exam');
      }

      // Ensure point distribution is reasonable
      const totalCalculatedPoints = exam.questions.reduce((sum, q) => sum + (q.points || 10), 0);
      if (Math.abs(totalCalculatedPoints - totalPoints) > totalPoints * 0.2) {
        // Adjust points if distribution is off by more than 20%
        exam.questions.forEach(q => q.points = Math.round(totalPoints / options.questionCount));
        exam.metadata.totalPoints = totalPoints;
      }

      return exam;
    } catch (error) {
      console.error('Exam Proctor Agent Error:', error);
      throw error;
    }
  }

  async calculateTimeEstimate(questionCount: number, averageDifficulty: 'easy' | 'medium' | 'hard'): Promise<number> {
    const baseTimePerQuestion = {
      easy: 2,    // 2 minutes per easy question
      medium: 3,  // 3 minutes per medium question  
      hard: 5     // 5 minutes per hard question
    };

    const estimatedTime = questionCount * baseTimePerQuestion[averageDifficulty];
    
    // Add 20% buffer time
    return Math.round(estimatedTime * 1.2);
  }

  async validateExamDifficulty(exam: AIGeneratedExam): Promise<{
    isBalanced: boolean;
    recommendations: string[];
  }> {
    const questions = exam.questions;
    const totalQuestions = questions.length;
    
    // Count difficulty distribution (we'll estimate based on point values)
    const highPointQuestions = questions.filter(q => (q.points || 10) > 12).length;
    const lowPointQuestions = questions.filter(q => (q.points || 10) < 8).length;
    const mediumPointQuestions = totalQuestions - highPointQuestions - lowPointQuestions;
    
    const recommendations: string[] = [];
    let isBalanced = true;
    
    // Check if difficulty progression makes sense
    if (highPointQuestions > totalQuestions * 0.4) {
      recommendations.push('Consider reducing the number of high-difficulty questions');
      isBalanced = false;
    }
    
    if (lowPointQuestions < totalQuestions * 0.2) {
      recommendations.push('Add more foundational questions to help students build confidence');
      isBalanced = false;
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Exam difficulty distribution looks well-balanced');
    }
    
    return { isBalanced, recommendations };
  }
}