
import React, { useState, useEffect } from 'react';
import { Clock, FileText, Target, Award, CheckCircle, XCircle, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';
import { useNavigate } from 'react-router-dom';

interface MockExamAppProps {
  isEnabled: boolean;
  autoGenerate?: boolean;
}

const MockExamApp: React.FC<MockExamAppProps> = ({ isEnabled, autoGenerate }) => {
  const navigate = useNavigate();
  const [aiExam, setAiExam] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateExam, examState } = useAIGeneration();

  // Auto-generate when component is focused from calendar
  React.useEffect(() => {
    if (autoGenerate && hasAnyMaterials() && !aiExam && !examState.isLoading) {
      handleAIExamGeneration();
    }
  }, [autoGenerate, hasAnyMaterials, aiExam, examState.isLoading]);

  const handleAIExamGeneration = async () => {
    const materialInfo = getCurrentMaterialInfo();
    if (!materialInfo.material) return;

    try {
      const result = await generateExam(materialInfo.material.id, {
        questionCount: 12,
        duration: 90
      });
      
      if (result) {
        setAiExam(result);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setAnswers(new Array(result.questions.length).fill(null));
        setScore(0);
        setShowResult(false);
        setIsComplete(false);
        setTimeLeft(90 * 60);
      }
    } catch (error) {
      console.error('Failed to generate AI exam:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null && aiExam) {
      setShowResult(true);
      
      if (selectedAnswer === aiExam.questions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
      }

      setTimeout(() => {
        if (currentQuestion < aiExam.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    }
  };

  const resetExam = () => {
    setAiExam(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setShowResult(false);
    setIsComplete(false);
    setTimeLeft(90 * 60);
  };

  // Timer effect
  React.useEffect(() => {
    if (aiExam && !isComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [aiExam, isComplete, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  // Show exam completion screen
  if (isComplete && aiExam) {
    const percentage = Math.round((score / aiExam.questions.length) * 100);
    return (
      <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <Award className="h-6 w-6 mr-2" />
            Exam Complete!
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
                You got {score} out of {aiExam.questions.length} questions correct
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={resetExam}
                className="bg-[#0f6cbf] hover:bg-[#0d5aa7] mr-4"
              >
                Generate New Exam
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show active exam
  if (aiExam && aiExam.questions) {
    const currentQ = aiExam.questions[currentQuestion];
    const progress = ((currentQuestion + (showResult ? 1 : 0)) / aiExam.questions.length) * 100;

    return (
      <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <Target className="h-6 w-6 mr-2" />
            AI Generated Exam
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {aiExam.questions.length}
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
              >
                Exit Exam
              </Button>
            </div>
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
                {currentQuestion < aiExam.questions.length - 1 ? 'Next Question' : 'Finish Exam'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show exam generator interface
  return (
    <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-[#0f6cbf]">
          <Target className="h-6 w-6 mr-2" />
          Mock Exam
        </CardTitle>
        <CardDescription>
          Practice with timed exams based on your courses
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
            {examState.isLoading ? (
              <div className="space-y-3 text-center">
                <div className="flex items-center space-x-2 text-orange-600 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{examState.stage}</span>
                </div>
                <Progress value={examState.progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  AI creating comprehensive exam...
                </div>
              </div>
            ) : examState.error ? (
              <div className="text-center space-y-2">
                <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                <div className="text-sm text-red-600">AI Generation Failed</div>
                <div className="text-xs text-gray-500">{examState.error}</div>
              </div>
            ) : aiExam ? (
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-green-500 mx-auto animate-bounce" />
                <div className="text-sm text-green-600 font-medium">
                  AI Exam Generated Successfully!
                </div>
                <div className="text-xs text-gray-500">
                  {aiExam.questions?.length || 12} questions • 90 minutes
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <Target className="h-12 w-12 text-orange-600 mx-auto" />
                <div className="text-sm font-medium text-gray-700">
                  Ready to generate AI exam
                </div>
                <div className="text-xs text-gray-500">
                  Comprehensive timed examination
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-orange-500" />
              <span>AI-generated comprehensive exam</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>90-minute timed session</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span>12 questions with detailed analysis</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
            disabled={!hasAnyMaterials() || examState.isLoading}
            onClick={handleAIExamGeneration}
          >
            {!hasAnyMaterials() 
              ? 'Select Material to Enable'
              : examState.isLoading 
                ? 'Generating AI Exam...' 
                : 'Generate AI Exam'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockExamApp;
