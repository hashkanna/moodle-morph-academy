import { useState, useCallback } from 'react';
import { aiService, AIGeneratedQuiz, AIGeneratedFlashcards, AIGeneratedExam } from '@/lib/aiService';
import { pdfExtractor } from '@/lib/pdfExtractor';
import { getMaterialById } from '@/lib/courseData';

export interface AIGenerationState {
  isLoading: boolean;
  error: string | null;
  progress: number; // 0-100
  stage: string; // Current generation stage
}

export interface UseAIGenerationReturn {
  // Quiz generation
  generateQuiz: (materialId: string, options?: { questionCount?: number; difficulty?: 'easy' | 'medium' | 'hard' | 'mixed' }) => Promise<AIGeneratedQuiz | null>;
  quizState: AIGenerationState;
  
  // Flashcard generation
  generateFlashcards: (materialId: string, options?: { cardCount?: number; language?: 'en' | 'de' }) => Promise<AIGeneratedFlashcards | null>;
  flashcardState: AIGenerationState;
  
  // Exam generation
  generateExam: (materialId: string, options?: { questionCount?: number; duration?: number }) => Promise<AIGeneratedExam | null>;
  examState: AIGenerationState;
  
  // Clear states
  clearStates: () => void;
}

const initialState: AIGenerationState = {
  isLoading: false,
  error: null,
  progress: 0,
  stage: ''
};

export const useAIGeneration = (): UseAIGenerationReturn => {
  const [quizState, setQuizState] = useState<AIGenerationState>(initialState);
  const [flashcardState, setFlashcardState] = useState<AIGenerationState>(initialState);
  const [examState, setExamState] = useState<AIGenerationState>(initialState);

  const updateState = useCallback((
    setState: React.Dispatch<React.SetStateAction<AIGenerationState>>,
    updates: Partial<AIGenerationState>
  ) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const generateQuiz = useCallback(async (
    materialId: string,
    options: { questionCount?: number; difficulty?: 'easy' | 'medium' | 'hard' | 'mixed' } = {}
  ): Promise<AIGeneratedQuiz | null> => {
    try {
      setQuizState(initialState);
      updateState(setQuizState, { isLoading: true, stage: 'Extracting content from material...' });

      // Step 1: Extract content from material
      const material = getMaterialById(materialId);
      if (!material) {
        throw new Error('Material not found');
      }

      updateState(setQuizState, { progress: 20 });

      // Step 2: Get text content
      let sourceText: string;
      
      if (materialId.startsWith('uploaded-')) {
        // Handle uploaded files (would need file reference)
        sourceText = 'Uploaded material content would be extracted here';
      } else {
        // Use cached content for course materials
        sourceText = pdfExtractor.getCachedContent(materialId) || '';
        if (!sourceText) {
          // Simulate extraction from file path
          const extracted = await pdfExtractor.extractFromPath(material.filePath);
          sourceText = extracted.text;
        }
      }

      updateState(setQuizState, { 
        progress: 50, 
        stage: 'Analyzing content and generating questions...' 
      });

      // Step 3: Validate content
      const validation = aiService.validateContent(sourceText);
      if (!validation.isValid) {
        throw new Error(validation.reason || 'Invalid content for quiz generation');
      }

      updateState(setQuizState, { progress: 70, stage: 'AI processing...' });

      // Step 4: Generate quiz using AI
      const quiz = await aiService.generateQuiz(sourceText, {
        questionCount: options.questionCount || 5,
        difficulty: options.difficulty || 'mixed',
        language: material.language || 'en'
      });

      updateState(setQuizState, { 
        progress: 100, 
        stage: 'Quiz generated successfully!',
        isLoading: false 
      });

      return quiz;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate quiz';
      updateState(setQuizState, { 
        isLoading: false, 
        error: errorMessage,
        stage: 'Generation failed'
      });
      return null;
    }
  }, [updateState]);

  const generateFlashcards = useCallback(async (
    materialId: string,
    options: { cardCount?: number; language?: 'en' | 'de' } = {}
  ): Promise<AIGeneratedFlashcards | null> => {
    try {
      setFlashcardState(initialState);
      updateState(setFlashcardState, { isLoading: true, stage: 'Extracting content from material...' });

      // Step 1: Extract content
      const material = getMaterialById(materialId);
      if (!material) {
        throw new Error('Material not found');
      }

      updateState(setFlashcardState, { progress: 20 });

      // Step 2: Get text content
      let sourceText: string;
      
      if (materialId.startsWith('uploaded-')) {
        sourceText = 'Uploaded material content would be extracted here';
      } else {
        sourceText = pdfExtractor.getCachedContent(materialId) || '';
        if (!sourceText) {
          const extracted = await pdfExtractor.extractFromPath(material.filePath);
          sourceText = extracted.text;
        }
      }

      updateState(setFlashcardState, { 
        progress: 50, 
        stage: 'Identifying key terms and concepts...' 
      });

      // Step 3: Validate content
      const validation = aiService.validateContent(sourceText);
      if (!validation.isValid) {
        throw new Error(validation.reason || 'Invalid content for flashcard generation');
      }

      updateState(setFlashcardState, { progress: 70, stage: 'Generating flashcards...' });

      // Step 4: Generate flashcards
      const flashcards = await aiService.generateFlashcards(sourceText, {
        cardCount: options.cardCount || 10,
        language: options.language || material.language || 'de'
      });

      updateState(setFlashcardState, { 
        progress: 100, 
        stage: 'Flashcards generated successfully!',
        isLoading: false 
      });

      return flashcards;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate flashcards';
      updateState(setFlashcardState, { 
        isLoading: false, 
        error: errorMessage,
        stage: 'Generation failed'
      });
      return null;
    }
  }, [updateState]);

  const generateExam = useCallback(async (
    materialId: string,
    options: { questionCount?: number; duration?: number } = {}
  ): Promise<AIGeneratedExam | null> => {
    try {
      setExamState(initialState);
      updateState(setExamState, { isLoading: true, stage: 'Preparing exam content...' });

      // Step 1: Extract content
      const material = getMaterialById(materialId);
      if (!material) {
        throw new Error('Material not found');
      }

      updateState(setExamState, { progress: 15 });

      // Step 2: Get text content
      let sourceText: string;
      
      if (materialId.startsWith('uploaded-')) {
        sourceText = 'Uploaded material content would be extracted here';
      } else {
        sourceText = pdfExtractor.getCachedContent(materialId) || '';
        if (!sourceText) {
          const extracted = await pdfExtractor.extractFromPath(material.filePath);
          sourceText = extracted.text;
        }
      }

      updateState(setExamState, { 
        progress: 35, 
        stage: 'Analyzing content complexity...' 
      });

      // Step 3: Validate content
      const validation = aiService.validateContent(sourceText);
      if (!validation.isValid) {
        throw new Error(validation.reason || 'Invalid content for exam generation');
      }

      updateState(setExamState, { 
        progress: 55, 
        stage: 'Designing exam structure...' 
      });

      // Step 4: Extract topics for comprehensive coverage
      const topics = await aiService.extractTopics(sourceText);
      
      updateState(setExamState, { 
        progress: 75, 
        stage: 'Generating exam questions...' 
      });

      // Step 5: Generate exam
      const exam = await aiService.generateExam(sourceText, {
        questionCount: options.questionCount || 8,
        duration: options.duration || 90,
        includeEssay: true,
        includeCalculations: true,
        language: material.language || 'en'
      });

      updateState(setExamState, { 
        progress: 100, 
        stage: 'Exam generated successfully!',
        isLoading: false 
      });

      return exam;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate exam';
      updateState(setExamState, { 
        isLoading: false, 
        error: errorMessage,
        stage: 'Generation failed'
      });
      return null;
    }
  }, [updateState]);

  const clearStates = useCallback(() => {
    setQuizState(initialState);
    setFlashcardState(initialState);
    setExamState(initialState);
  }, []);

  return {
    generateQuiz,
    quizState,
    generateFlashcards,
    flashcardState,
    generateExam,
    examState,
    clearStates
  };
};