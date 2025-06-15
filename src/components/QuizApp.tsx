
import React, { useState, useEffect } from 'react';
import { FileText, Play, CheckCircle, XCircle, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';

interface QuizAppProps {
  isEnabled: boolean;
}

const QuizApp: React.FC<QuizAppProps> = ({ isEnabled }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [useAI, setUseAI] = useState(false);
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateQuiz, quizState } = useAIGeneration();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAIQuizGeneration = async () => {
    const materialInfo = getCurrentMaterialInfo();
    if (!materialInfo.material) return;

    try {
      await generateQuiz(materialInfo.material.id, {
        questionCount: 5,
        difficulty: 'mixed'
      });
    } catch (error) {
      console.error('Failed to generate AI quiz:', error);
    }
  };

  const getAnimationContent = () => {
    const materialInfo = getCurrentMaterialInfo();
    
    // Show AI generation progress if AI is being used
    if (useAI && quizState.isLoading) {
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

    if (useAI && quizState.error) {
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

    if (useAI && quizState.progress === 100) {
      return (
        <div className="text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2 animate-bounce" />
          <span className="text-sm text-green-600 font-medium">
            AI Quiz Generated Successfully!
          </span>
        </div>
      );
    }

    // Default mock animation
    const materialId = materialInfo.material?.id || 'default';
    const mockContent = getMockContentForMaterial(materialId);
    const sampleQuestion = mockContent.quizQuestions[0];

    switch (animationStep) {
      case 0:
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <FileText className="h-5 w-5 animate-pulse" />
            <span className="text-sm">Analyzing {materialInfo.material?.title || 'material'} content...</span>
          </div>
        );
      case 1:
        return (
          <div className="flex items-center space-x-2 text-orange-600">
            <Brain className="h-5 w-5 animate-spin" />
            <span className="text-sm">Generating questions from material...</span>
          </div>
        );
      case 2:
        return (
          <div className="space-y-2">
            <div className="text-sm font-medium">Sample Question:</div>
            <div className="text-xs bg-gray-100 p-2 rounded">
              "{sampleQuestion.question}"
              <div className="mt-1 space-y-1">
                {sampleQuestion.options.slice(0, 2).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className={`h-3 w-3 ${index === sampleQuestion.correctAnswer ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={index === sampleQuestion.correctAnswer ? 'font-medium' : ''}>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2 animate-bounce" />
            <span className="text-sm text-green-600 font-medium">
              Quiz Ready! {mockContent.quizQuestions.length} questions generated
            </span>
          </div>
        );
      default:
        return null;
    }
  };

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

          {/* Animation Demo */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center">
            {getAnimationContent()}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{useAI ? 'Real AI-powered question generation' : 'Sample questions from course content'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Multiple choice & explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant feedback & scoring</span>
            </div>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                AI Generation
              </span>
            </div>
            <Button
              variant={useAI ? "default" : "outline"}
              size="sm"
              onClick={() => setUseAI(!useAI)}
              className={useAI ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {useAI ? 'AI Mode' : 'Demo Mode'}
            </Button>
          </div>
          
          <Button 
            className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
            disabled={!hasAnyMaterials() || (useAI && quizState.isLoading)}
            onClick={useAI ? handleAIQuizGeneration : undefined}
          >
            {!hasAnyMaterials() 
              ? 'Select Material to Enable'
              : useAI 
                ? (quizState.isLoading ? 'Generating...' : 'Generate AI Quiz')
                : 'Generate Quiz'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizApp;
