
import React, { useState, useEffect } from 'react';
import { BookOpen, RotateCw, CheckCircle, XCircle, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';
import { useNavigate } from 'react-router-dom';

interface AnkiCardAppProps {
  isEnabled: boolean;
  autoGenerate?: boolean;
}

const AnkiCardApp: React.FC<AnkiCardAppProps> = ({ isEnabled, autoGenerate }) => {
  const navigate = useNavigate();
  const [aiCards, setAiCards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateFlashcards, flashcardState } = useAIGeneration();

  // Auto-generate when component is focused from calendar
  React.useEffect(() => {
    if (autoGenerate && hasAnyMaterials() && aiCards.length === 0 && !flashcardState.isLoading) {
      handleAIFlashcardGeneration();
    }
  }, [autoGenerate, hasAnyMaterials, aiCards.length, flashcardState.isLoading]);

  const handleAIFlashcardGeneration = async () => {
    const materialInfo = getCurrentMaterialInfo();
    if (!materialInfo.material) return;

    try {
      const result = await generateFlashcards(materialInfo.material.id, {
        cardCount: 15,
        language: 'de'
      });
      
      if (result) {
        setAiCards(result.cards);
        setCurrentCard(0);
        setShowBack(false);
        setStudyMode(false);
      }
    } catch (error) {
      console.error('Failed to generate AI flashcards:', error);
    }
  };

  const startStudying = () => {
    setStudyMode(true);
    setCurrentCard(0);
    setShowBack(false);
  };

  const nextCard = () => {
    if (currentCard < aiCards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setShowBack(false);
    } else {
      setStudyMode(false);
      setCurrentCard(0);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setShowBack(false);
    }
  };

  const flipCard = () => {
    setShowBack(!showBack);
  };

  const resetCards = () => {
    setAiCards([]);
    setCurrentCard(0);
    setShowBack(false);
    setStudyMode(false);
  };

  // Show study mode
  if (studyMode && aiCards.length > 0) {
    const currentCardData = aiCards[currentCard];
    const progress = ((currentCard + 1) / aiCards.length) * 100;

    return (
      <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <BookOpen className="h-6 w-6 mr-2" />
            Studying Flashcards
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600">
              Card {currentCard + 1} of {aiCards.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              Exit Study
            </Button>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Flashcard */}
            <div 
              className={`min-h-[200px] bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${showBack ? 'transform scale-105' : ''}`}
              onClick={flipCard}
            >
              <div className="text-center space-y-4">
                <div className="text-xs uppercase tracking-wide text-purple-600 font-semibold">
                  {showBack ? 'Back' : 'Front'} • {currentCardData.difficulty}
                </div>
                <div className="text-lg font-medium text-gray-800">
                  {showBack ? currentCardData.back : currentCardData.front}
                </div>
                {!showBack && (
                  <div className="text-xs text-gray-500">
                    Click to reveal answer
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentCard === 0}
                className="flex items-center space-x-2"
              >
                <span>← Previous</span>
              </Button>
              
              <Button
                onClick={flipCard}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                {showBack ? 'Show Front' : 'Flip Card'}
              </Button>
              
              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentCard === aiCards.length - 1}
                className="flex items-center space-x-2"
              >
                <span>{currentCard === aiCards.length - 1 ? 'Finish' : 'Next →'}</span>
              </Button>
            </div>

            {/* Card Info */}
            {showBack && (
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-700">
                  Category: {currentCardData.category} • Difficulty: {currentCardData.difficulty}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show flashcard list/generator interface
  return (
    <Card className={`transition-all duration-300 ${isEnabled ? 'border-[#0f6cbf] shadow-lg' : 'border-gray-200 opacity-60'}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-[#0f6cbf]">
          <BookOpen className="h-6 w-6 mr-2" />
          Anki Cards
        </CardTitle>
        <CardDescription>
          Learn key terms and definitions with spaced repetition
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

          {/* AI Generation Status or Cards List */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center">
            {flashcardState.isLoading ? (
              <div className="space-y-3 text-center">
                <div className="flex items-center space-x-2 text-purple-600 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{flashcardState.stage}</span>
                </div>
                <Progress value={flashcardState.progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  AI creating German flashcards...
                </div>
              </div>
            ) : flashcardState.error ? (
              <div className="text-center space-y-2">
                <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                <div className="text-sm text-red-600">AI Generation Failed</div>
                <div className="text-xs text-gray-500">{flashcardState.error}</div>
              </div>
            ) : aiCards.length > 0 ? (
              <div className="w-full space-y-3">
                <div className="text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                  <div className="text-sm text-green-600 font-medium">
                    {aiCards.length} AI Flashcards Generated!
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {aiCards.slice(0, 3).map((card, index) => (
                    <div key={index} className="text-xs p-2 bg-white rounded border">
                      <div className="font-medium text-purple-700">{card.front}</div>
                      <div className="text-gray-600 truncate">{card.back}</div>
                    </div>
                  ))}
                  {aiCards.length > 3 && (
                    <div className="text-xs text-center text-gray-500">
                      +{aiCards.length - 3} more cards
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <BookOpen className="h-12 w-12 text-purple-600 mx-auto" />
                <div className="text-sm font-medium text-gray-700">
                  Ready to generate AI flashcards
                </div>
                <div className="text-xs text-gray-500">
                  German language flashcards from your material
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>AI-generated German flashcards</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCw className="h-4 w-4 text-purple-500" />
              <span>Spaced repetition algorithm</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>15 cards per generation</span>
            </div>
          </div>
          
          {aiCards.length > 0 ? (
            <div className="space-y-2">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={startStudying}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Studying ({aiCards.length} cards)
              </Button>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={resetCards}
              >
                Generate New Cards
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
              disabled={!hasAnyMaterials() || flashcardState.isLoading}
              onClick={handleAIFlashcardGeneration}
            >
              {!hasAnyMaterials() 
                ? 'Select Material to Enable'
                : flashcardState.isLoading 
                  ? 'Generating AI Cards...' 
                  : 'Generate AI Cards'
              }
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnkiCardApp;
