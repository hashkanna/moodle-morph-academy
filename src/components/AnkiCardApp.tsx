
import React, { useState, useEffect } from 'react';
import { BookOpen, RotateCw, CheckCircle, XCircle, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';

interface AnkiCardAppProps {
  isEnabled: boolean;
}

const AnkiCardApp: React.FC<AnkiCardAppProps> = ({ isEnabled }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [useAI, setUseAI] = useState(false);
  const [aiCards, setAiCards] = useState<any[]>([]);
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateFlashcards, flashcardState } = useAIGeneration();

  const materialInfo = getCurrentMaterialInfo();
  const materialId = materialInfo.material?.id || 'default';
  const mockContent = getMockContentForMaterial(materialId);
  const sampleCards = useAI && aiCards.length > 0 ? aiCards : mockContent.ankiCards;

  const handleAIFlashcardGeneration = async () => {
    if (!materialInfo.material) return;

    try {
      const result = await generateFlashcards(materialInfo.material.id, {
        cardCount: 10,
        language: 'de'
      });
      
      if (result) {
        setAiCards(result.cards);
        setCardIndex(0);
        setIsFlipped(false);
      }
    } catch (error) {
      console.error('Failed to generate AI flashcards:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFlipped) {
        setTimeout(() => {
          setIsFlipped(false);
          setCardIndex(prev => (prev + 1) % sampleCards.length);
        }, 1000);
      } else {
        setIsFlipped(true);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [isFlipped, sampleCards.length]);

  const currentCard = sampleCards[cardIndex];

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

          {/* Card Demo or AI Generation Progress */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px]">
            {useAI && flashcardState.isLoading ? (
              <div className="space-y-3 flex flex-col justify-center h-full">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">{flashcardState.stage}</span>
                </div>
                <Progress value={flashcardState.progress} className="h-2" />
                <div className="text-xs text-gray-500 text-center">
                  AI creating German flashcards...
                </div>
              </div>
            ) : useAI && flashcardState.error ? (
              <div className="text-center space-y-2 flex flex-col justify-center h-full">
                <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                <div className="text-sm text-red-600">AI Generation Failed</div>
                <div className="text-xs text-gray-500">{flashcardState.error}</div>
              </div>
            ) : (
              <div 
                className={`relative w-full h-full min-h-[88px] transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front of card */}
                <div className={`absolute inset-0 bg-white border rounded-lg p-4 flex items-center justify-center shadow-md ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">
                      {useAI && aiCards.length > 0 ? 'AI Generated Term' : 'Term'}
                    </div>
                    <div className="text-lg font-semibold text-[#0f6cbf]">{currentCard?.front}</div>
                    <RotateCw className="h-4 w-4 text-gray-400 mx-auto mt-2 animate-spin" />
                  </div>
                </div>
                
                {/* Back of card */}
                <div className={`absolute inset-0 bg-blue-50 border rounded-lg p-4 flex items-center justify-center shadow-md ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Definition</div>
                    <div className="text-sm text-gray-700">{currentCard?.back}</div>
                    <div className="flex justify-center space-x-3 mt-3">
                      <CheckCircle className="h-5 w-5 text-green-500 animate-pulse" />
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-500" />
              <span>{useAI && aiCards.length > 0 ? 'AI generated from' : 'Generated from'} {materialInfo.material?.title || 'your material'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCw className="h-4 w-4 text-purple-500" />
              <span>Spaced repetition algorithm</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <span>{sampleCards.length} cards available</span>
            </div>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                AI Generation
              </span>
            </div>
            <Button
              variant={useAI ? "default" : "outline"}
              size="sm"
              onClick={() => setUseAI(!useAI)}
              className={useAI ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {useAI ? 'AI Mode' : 'Demo Mode'}
            </Button>
          </div>
          
          <Button 
            className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
            disabled={!hasAnyMaterials() || (useAI && flashcardState.isLoading)}
            onClick={useAI ? handleAIFlashcardGeneration : undefined}
          >
            {!hasAnyMaterials() 
              ? 'Select Material to Enable'
              : useAI 
                ? (flashcardState.isLoading ? 'Generating...' : 'Generate AI Cards')
                : 'Study Cards'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnkiCardApp;
