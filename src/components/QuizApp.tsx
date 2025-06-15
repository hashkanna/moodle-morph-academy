
import React, { useState, useEffect } from 'react';
import { FileText, Play, CheckCircle, XCircle, Brain, Loader2, Award, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';
import { useNavigate } from 'react-router-dom';

interface QuizAppProps {
  isEnabled: boolean;
  autoGenerate?: boolean;
}

const QuizApp: React.FC<QuizAppProps> = ({ isEnabled, autoGenerate }) => {
  const navigate = useNavigate();
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateQuiz, quizState } = useAIGeneration();

  // Auto-generate when component is focused from calendar
  useEffect(() => {
    if (autoGenerate && hasAnyMaterials() && !generatedQuiz && !quizState.isLoading) {
      handleAIQuizGeneration();
    }
  }, [autoGenerate, hasAnyMaterials, generatedQuiz, quizState.isLoading]);


  const handleAIQuizGeneration = async () => {
    const materialInfo = getCurrentMaterialInfo();
    
    if (!materialInfo.material) {
      return;
    }

    try {
      const result = await generateQuiz(materialInfo.material.id, {
        questionCount: 10,
        difficulty: 'mixed'
      });
      
      if (result) {
        setGeneratedQuiz(result);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setAnswers(new Array(result.questions.length).fill(null));
        setScore(0);
        setShowResult(false);
        setIsComplete(false);
      }
    } catch (error) {
      console.error('Failed to generate AI quiz:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null && generatedQuiz) {
      setShowResult(true);
      
      if (selectedAnswer === generatedQuiz.questions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
      }

      setTimeout(() => {
        if (currentQuestion < generatedQuiz.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setGeneratedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setShowResult(false);
    setIsComplete(false);
  };

  const getStatusContent = () => {
    const materialInfo = getCurrentMaterialInfo();
    
    // Show AI generation progress
    if (quizState.isLoading) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{quizState.stage}</span>
          </div>
          <Progress value={quizState.progress} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            AI analyzing your course material...
          </div>
        </div>
      );
    }

    if (quizState.error) {
      return (
        <div className="text-center space-y-2">
          <XCircle className="h-8 w-8 text-red-500 mx-auto" />
          <div className="text-sm text-red-600">
            AI Generation Failed
          </div>
          <div className="text-xs text-gray-500">
            {quizState.error}
          </div>
        </div>
      );
    }

    if (quizState.progress === 100) {
      return (
        <div className="text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2 animate-bounce" />
          <span className="text-sm text-green-600 font-medium">
            AI Quiz Generated Successfully!
          </span>
        </div>
      );
    }

    // Default state - ready to generate
    return (
      <div className="text-center space-y-3">
        <Brain className="h-12 w-12 text-blue-600 mx-auto" />
        <div className="text-sm font-medium text-gray-700">
          Ready to generate AI-powered quiz
        </div>
        <div className="text-xs text-gray-500">
          {materialInfo.material ? 
            `From: ${materialInfo.material.title}` : 
            'Select a material to get started'
          }
        </div>
      </div>
    );
  };

  // Show quiz completion screen
  if (isComplete && generatedQuiz) {
    const percentage = Math.round((score / generatedQuiz.questions.length) * 100);
    return (
      <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <Award className="h-6 w-6 mr-2" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-6xl">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
            </div>
            <div>
              <div className="text-3xl font-bold text-[#0f6cbf]">{percentage}%</div>
              <div className="text-gray-600">
                You got {score} out of {generatedQuiz.questions.length} questions correct
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={resetQuiz}
                className="bg-[#0f6cbf] hover:bg-[#0d5aa7] mr-4"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Generate New Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show active quiz
  if (generatedQuiz && generatedQuiz.questions) {
    const currentQ = generatedQuiz.questions[currentQuestion];
    const progress = ((currentQuestion + (showResult ? 1 : 0)) / generatedQuiz.questions.length) * 100;

    return (
      <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <FileText className="h-6 w-6 mr-2" />
            AI Generated Quiz
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {generatedQuiz.questions.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              Exit Quiz
            </Button>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-lg font-medium">
              {currentQ.question}
            </div>
            
            <div className="space-y-2">
              {currentQ.options.map((option: string, index: number) => {
                let buttonClass = "w-full text-left p-4 border rounded-lg transition-all duration-200 ";
                
                if (showResult) {
                  if (index === currentQ.correctAnswer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "border-[#0f6cbf] bg-[#0f6cbf]/10 text-[#0f6cbf]";
                  } else {
                    buttonClass += "border-gray-200 hover:border-[#0f6cbf] hover:bg-[#0f6cbf]/5";
                  }
                }

                return (
                  <button
                    key={index}
                    className={buttonClass}
                    onClick={() => !showResult && handleAnswerSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && currentQ.explanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700">{currentQ.explanation}</p>
              </div>
            )}

            {!showResult && (
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7] mt-6"
              >
                {currentQuestion < generatedQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show quiz generator interface
  return (
    <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-[#0f6cbf]">
          <FileText className="h-6 w-6 mr-2" />
          Quiz Generator
        </CardTitle>
        <CardDescription>
          Generate interactive quizzes from your course materials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Material Display */}
          {(() => {
            const materialInfo = getCurrentMaterialInfo();
            if (materialInfo.material || materialInfo.uploadedFile) {
              return (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Ready: {materialInfo.material?.title || materialInfo.uploadedFile?.name}
                    </span>
                    <Badge className={materialInfo.isUploaded ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"}>
                      {materialInfo.isUploaded ? 'uploaded' : 'course material'}
                    </Badge>
                  </div>
                </div>
              );
            }
            return (
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    No material selected - go to Course Materials to choose content
                  </span>
                </div>
              </div>
            );
          })()}

          {/* AI Status Display */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center">
            {getStatusContent()}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>AI-powered question generation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>10 unique questions per session</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span>Instant feedback & explanations</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
            disabled={!hasAnyMaterials() || quizState.isLoading}
            onClick={handleAIQuizGeneration}
          >
            {!hasAnyMaterials() 
              ? 'Select Material to Enable'
              : quizState.isLoading 
                ? 'Generating AI Quiz...' 
                : 'Generate AI Quiz'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizApp;
