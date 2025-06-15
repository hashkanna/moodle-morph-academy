
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, FileText, AlertCircle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterials } from '@/contexts/MaterialContext';
import { getMockContentForMaterial } from '@/lib/mockContent';

const MockExam = () => {
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const materialInfo = getCurrentMaterialInfo();
  
  // Get exam questions from selected material (combine quiz + exam questions)
  const materialId = materialInfo.material?.id || 'default';
  const mockContent = getMockContentForMaterial(materialId);
  const examQuestions = [
    ...mockContent.quizQuestions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: 10
    })),
    ...mockContent.examQuestions.map((eq, index) => ({
      id: mockContent.quizQuestions.length + index + 1,
      question: eq.question,
      options: eq.options,
      correctAnswer: eq.correctAnswer,
      points: eq.points
    }))
  ];

  useEffect(() => {
    setAnswers(new Array(examQuestions.length).fill(null));
  }, [examQuestions.length]);

  useEffect(() => {
    if (timeLeft > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitExam();
    }
  }, [timeLeft, isComplete]);

  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0 && !showWarning) {
      setShowWarning(true);
      toast.error('⚠️ Only 5 minutes remaining!');
    }
  }, [timeLeft, showWarning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitExam = () => {
    setIsComplete(true);
    toast.success('Exam submitted successfully!');
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    examQuestions.forEach((question, index) => {
      maxScore += question.points;
      if (answers[index] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    
    return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
  };

  const progress = ((currentQuestion + 1) / examQuestions.length) * 100;
  const answeredQuestions = answers.filter(answer => answer !== null).length;

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
              <div className="text-6xl">🎯</div>
              <div>
                <div className="text-lg text-gray-600 mb-4">
                  Please select a course material to generate exam questions.
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
    const { totalScore, maxScore, percentage } = calculateScore();
    
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
              <CardTitle className="text-2xl text-[#0f6cbf]">Exam Complete!</CardTitle>
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
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '😔'}
              </div>
              <div>
                <div className="text-3xl font-bold text-[#0f6cbf]">{percentage}%</div>
                <div className="text-gray-600">
                  {totalScore} out of {maxScore} points
                </div>
                {materialInfo.material && (
                  <div className="text-sm text-gray-500 mt-2">
                    Based on: {materialInfo.material.title}
                  </div>
                )}
              </div>
              
              <div className="space-y-3 text-left">
                <h3 className="font-semibold text-lg">Results Breakdown:</h3>
                {examQuestions.map((question, index) => (
                  <div key={question.id} className="flex justify-between items-center p-3 border rounded">
                    <span className="text-sm">Question {index + 1}</span>
                    <span className={`text-sm font-semibold ${answers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                      {answers[index] === question.correctAnswer ? `+${question.points}` : '0'} pts
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Link to="/">
                  <Button className="bg-[#0f6cbf] hover:bg-[#0d5aa7]">
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
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${timeLeft <= 300 ? 'bg-red-100 text-red-700' : 'bg-white/20'}`}>
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Exam Info */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-[#0f6cbf]">
                  <Target className="h-6 w-6 mr-2" />
                  Mock Exam
                  {materialInfo.material && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800">
                      {materialInfo.material.title}
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="font-semibold">{answeredQuestions}/{examQuestions.length}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total Points: {examQuestions.reduce((sum, q) => sum + q.points, 0)}</span>
                <span>Time Limit: 90 minutes</span>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {examQuestions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentQuestion === index ? "default" : answers[index] !== null ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 ${currentQuestion === index ? 'bg-[#0f6cbf] hover:bg-[#0d5aa7]' : ''}`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestion + 1} ({examQuestions[currentQuestion].points} points)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                {examQuestions[currentQuestion].question}
              </p>
              
              <div className="space-y-3">
                {examQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 border rounded-lg transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? 'border-[#0f6cbf] bg-[#0f6cbf]/10 text-[#0f6cbf]'
                        : 'border-gray-200 hover:border-[#0f6cbf] hover:bg-[#0f6cbf]/5'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                  >
                    <div className="flex items-center">
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-4">
              {currentQuestion < examQuestions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="bg-[#0f6cbf] hover:bg-[#0d5aa7]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitExam}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={answeredQuestions < examQuestions.length}
                >
                  Submit Exam
                </Button>
              )}
            </div>
          </div>

          {answeredQuestions < examQuestions.length && currentQuestion === examQuestions.length - 1 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-yellow-700">
                You have {examQuestions.length - answeredQuestions} unanswered question(s). 
                Please answer all questions before submitting.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockExam;
