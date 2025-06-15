
import React, { useState, useEffect } from 'react';
import { Clock, FileText, Target, Award, CheckCircle, XCircle, Brain, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMaterials } from '@/contexts/MaterialContext';
import { useAIGeneration } from '@/hooks/useAIGeneration';
import { getMockContentForMaterial } from '@/lib/mockContent';

interface MockExamAppProps {
  isEnabled: boolean;
}

const MockExamApp: React.FC<MockExamAppProps> = ({ isEnabled }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [mockProgress, setMockProgress] = useState(0);
  const [useAI, setUseAI] = useState(false);
  const [aiExam, setAiExam] = useState<any>(null);
  const { getCurrentMaterialInfo, hasAnyMaterials } = useMaterials();
  const { generateExam, examState } = useAIGeneration();

  const handleAIExamGeneration = async () => {
    const materialInfo = getCurrentMaterialInfo();
    if (!materialInfo.material) return;

    try {
      const result = await generateExam(materialInfo.material.id, {
        questionCount: 8,
        duration: 90
      });
      
      if (result) {
        setAiExam(result);
      }
    } catch (error) {
      console.error('Failed to generate AI exam:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
      if (animationStep === 2) {
        setMockProgress(prev => (prev >= 100 ? 0 : prev + 20));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [animationStep]);

  const getAnimationContent = () => {
    const materialInfo = getCurrentMaterialInfo();
    
    // Show AI generation progress if AI is being used
    if (useAI && examState.isLoading) {
      return (
        <div className="space-y-3 flex flex-col justify-center h-full">
          <div className="flex items-center space-x-2 text-orange-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">{examState.stage}</span>
          </div>
          <Progress value={examState.progress} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            AI creating comprehensive exam...
          </div>
        </div>
      );
    }

    if (useAI && examState.error) {
      return (
        <div className="text-center space-y-2 flex flex-col justify-center h-full">
          <XCircle className="h-8 w-8 text-red-500 mx-auto" />
          <div className="text-sm text-red-600">AI Generation Failed</div>
          <div className="text-xs text-gray-500">{examState.error}</div>
        </div>
      );
    }

    if (useAI && examState.progress === 100) {
      return (
        <div className="text-center">
          <Award className="h-8 w-8 text-green-500 mx-auto mb-2 animate-bounce" />
          <div className="text-sm font-medium text-green-600">
            AI Exam Generated Successfully!
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {aiExam?.questions?.length || 8} questions • 90 minutes
          </div>
        </div>
      );
    }

    // Default mock animation
    switch (animationStep) {
      case 0:
        return (
          <div className="text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-medium">Setting up exam environment</div>
            <div className="text-xs text-gray-500 mt-1">90 minutes • Questions from {materialInfo.material?.title || 'selected material'}</div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Question 1/?</span>
              <span className="text-xs text-gray-500">Time: 89:45</span>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-xs mb-2">Multiple Choice</div>
              <div className="text-sm">Material-specific question will appear here...</div>
              <div className="mt-2 space-y-1 text-xs">
                <div className="p-1 bg-blue-100 rounded">A) Option A</div>
                <div className="p-1 hover:bg-gray-100 rounded">B) Option B</div>
                <div className="p-1 hover:bg-gray-100 rounded">C) Option C</div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <div className="text-sm font-medium text-center">Exam in Progress</div>
            <Progress value={mockProgress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Questions: {Math.floor(mockProgress/2)}/?</span>
              <span>Time: {90 - Math.floor(mockProgress/2)}:00</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <Award className="h-8 w-8 text-green-500 mx-auto mb-2 animate-pulse" />
            <div className="text-sm font-medium text-green-600">Exam Complete!</div>
            <div className="text-xs text-gray-500 mt-1">Score: 85% • Grade: B+ • Material-based exam</div>
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

          {/* Animation Demo */}
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center">
            {getAnimationContent()}
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>{useAI ? 'AI-generated timed exam' : 'Timed exam simulation'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span>Real exam conditions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-orange-500" />
              <span>Detailed performance analysis</span>
            </div>
          </div>

          {/* AI Toggle */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                AI Generation
              </span>
            </div>
            <Button
              variant={useAI ? "default" : "outline"}
              size="sm"
              onClick={() => setUseAI(!useAI)}
              className={useAI ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              {useAI ? 'AI Mode' : 'Demo Mode'}
            </Button>
          </div>
          
          <Button 
            className="w-full bg-[#0f6cbf] hover:bg-[#0d5aa7]" 
            disabled={!hasAnyMaterials() || (useAI && examState.isLoading)}
            onClick={useAI ? handleAIExamGeneration : undefined}
          >
            {!hasAnyMaterials() 
              ? 'Select Material to Enable'
              : useAI 
                ? (examState.isLoading ? 'Generating...' : 'Generate AI Exam')
                : 'Start Mock Exam'
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockExamApp;
