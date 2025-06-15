
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Check, X, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterials } from '@/contexts/MaterialContext';
import { getMockContentForMaterial, MockQuizQuestion } from '@/lib/mockContent';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const materialInfo = getCurrentMaterialInfo();
  
  // Get questions from selected material
  const materialId = materialInfo.material?.id || 'default';
  const mockContent = getMockContentForMaterial(materialId);
  const questions = mockContent.quizQuestions;

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, [questions.length]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
        toast.success('Correct! 🎉');
      } else {
        toast.error('Incorrect. Check the explanation.');
      }

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
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
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(questions.length).fill(null));
    setIsComplete(false);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  // Show material selection prompt if no material selected
  if (!hasAnyMaterials()) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans">
        <header className="bg-[#0f6cbf] text-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/b1e02ec5-6a97-4c44-912c-358925786899.png" 
                    alt="Dood Logo" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold">Dood</h1>
              </Link>
              <Link to="/">
                <Button className="bg-white text-[#0f6cbf] hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#0f6cbf] flex items-center justify-center">
                <AlertCircle className="h-6 w-6 mr-2" />
                No Material Selected
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl">📚</div>
              <div>
                <div className="text-lg text-gray-600 mb-4">
                  Please select a course material to generate quiz questions.
                </div>
                <div className="text-sm text-gray-500">
                  Go to Course Materials and choose from our Material Science curriculum or upload your own files.
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/upload">
                  <Button className="bg-[#0f6cbf] hover:bg-[#0d5aa7] mr-4">
                    Select Course Material
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#f8f9fa] font-sans">
        <header className="bg-[#0f6cbf] text-white shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/b1e02ec5-6a97-4c44-912c-358925786899.png" 
                    alt="Dood Logo" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold">Dood</h1>
              </Link>
              <Link to="/">
                <Button className="bg-white text-[#0f6cbf] hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#0f6cbf]">Quiz Complete!</CardTitle>
              {materialInfo.material && (
                <div className="flex justify-center mt-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {materialInfo.material.title}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0f6cbf]">{percentage}%</div>
                <div className="text-gray-600">
                  You got {score} out of {questions.length} questions correct
                </div>
                {materialInfo.material && (
                  <div className="text-sm text-gray-500 mt-2">
                    Based on: {materialInfo.material.title}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={resetQuiz}
                  className="bg-[#0f6cbf] hover:bg-[#0d5aa7] mr-4"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Link to="/">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <header className="bg-[#0f6cbf] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/lovable-uploads/b1e02ec5-6a97-4c44-912c-358925786899.png" 
                  alt="Dood Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">Dood</h1>
            </Link>
            <Link to="/">
              <Button className="bg-white text-[#0f6cbf] hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-[#0f6cbf] flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Quiz
                {materialInfo.material && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {materialInfo.material.title}
                  </Badge>
                )}
              </h2>
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {questions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => {
                let buttonClass = "w-full text-left p-4 border rounded-lg transition-all duration-200 ";
                
                if (showResult) {
                  if (index === questions[currentQuestion].correctAnswer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && index !== questions[currentQuestion].correctAnswer) {
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
                      {showResult && index === questions[currentQuestion].correctAnswer && (
                        <Check className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer && (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}

              {showResult && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700">{questions[currentQuestion].explanation}</p>
                </div>
              )}

              {!showResult && (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7] mt-6"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
