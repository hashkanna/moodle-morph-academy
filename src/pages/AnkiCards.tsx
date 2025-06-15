
import React, { useState } from 'react';
import { ArrowLeft, Brain, RotateCcw, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterials } from '@/contexts/MaterialContext';
import { getMockContentForMaterial } from '@/lib/mockContent';

const AnkiCards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studiedCards, setStudiedCards] = useState<number[]>([]);
  
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const materialInfo = getCurrentMaterialInfo();
  
  // Get flashcards from selected material
  const materialId = materialInfo.material?.id || 'default';
  const mockContent = getMockContentForMaterial(materialId);
  const flashcards = mockContent.ankiCards;

  const handleCardFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStudiedCards(prev => [...prev, currentCard]);
    
    if (difficulty === 'easy') {
      toast.success('Easy! Card mastered! 🎉');
    } else if (difficulty === 'medium') {
      toast.success('Good! Keep practicing! 👍');
    } else {
      toast.success('Challenging! Review again later. 📚');
    }

    if (currentCard < flashcards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setShowAnswer(false);
    } else {
      toast.success('All cards reviewed! Great job! 🎉');
    }
  };

  const resetCards = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setStudiedCards([]);
  };

  const progress = ((currentCard + 1) / flashcards.length) * 100;

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
              <div className="text-6xl">🧠</div>
              <div>
                <div className="text-lg text-gray-600 mb-4">
                  Please select a course material to generate flashcards.
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

  if (currentCard >= flashcards.length) {
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
              <CardTitle className="text-2xl text-[#0f6cbf]">Session Complete!</CardTitle>
              {materialInfo.material && (
                <div className="flex justify-center mt-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {materialInfo.material.title}
                  </Badge>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <p className="text-gray-600">
                You've reviewed all {flashcards.length} cards from {materialInfo.material?.title || 'your material'}. Great job studying!
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={resetCards}
                  className="bg-[#0f6cbf] hover:bg-[#0d5aa7] mr-4"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Study Again
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#0f6cbf] flex items-center">
                <Brain className="h-6 w-6 mr-2" />
                Anki Cards
                {materialInfo.material && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {materialInfo.material.title}
                  </Badge>
                )}
              </h2>
              <span className="text-sm text-gray-600">
                Card {currentCard + 1} of {flashcards.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#0f6cbf] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="mb-6 min-h-[300px] cursor-pointer" onClick={handleCardFlip}>
            <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full">
              <div className="flex items-center justify-center mb-4">
                {showAnswer ? (
                  <EyeOff className="h-6 w-6 text-gray-400 mr-2" />
                ) : (
                  <Eye className="h-6 w-6 text-gray-400 mr-2" />
                )}
                <span className="text-sm text-gray-500">
                  {showAnswer ? 'Answer' : 'Question - Click to reveal answer'}
                </span>
              </div>
              
              <div className="text-lg leading-relaxed">
                {showAnswer ? flashcards[currentCard].back : flashcards[currentCard].front}
              </div>

              {!showAnswer && (
                <div className="mt-6 text-sm text-gray-400">
                  Tap anywhere to flip the card
                </div>
              )}
            </CardContent>
          </Card>

          {showAnswer && (
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600 mb-4">
                How well did you know this answer?
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleNext('hard')}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  Hard
                </Button>
                <Button
                  onClick={() => handleNext('medium')}
                  variant="outline"
                  className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                >
                  Medium
                </Button>
                <Button
                  onClick={() => handleNext('easy')}
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  Easy
                </Button>
              </div>
            </div>
          )}

          {!showAnswer && (
            <div className="text-center">
              <Button
                onClick={handleCardFlip}
                className="bg-[#0f6cbf] hover:bg-[#0d5aa7]"
              >
                Reveal Answer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnkiCards;
