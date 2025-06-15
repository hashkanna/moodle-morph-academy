import React, { useState } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import FileUploadZone from '@/components/FileUploadZone';
import MaterialSelector from '@/components/MaterialSelector';
import { courseWeeks } from '@/lib/courseData';
import { useMaterials } from '@/contexts/MaterialContext';

const Upload = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const { 
    uploadedFiles, 
    addUploadedFiles, 
    removeUploadedFile, 
    addMaterial, 
    setCurrentMaterial 
  } = useMaterials();

  const handleFileUpload = (files: File[]) => {
    addUploadedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    removeUploadedFile(index);
  };

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
    addMaterial(materialId);
    setCurrentMaterial(materialId);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {/* Header */}
      <header className="bg-[#0f6cbf] text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-12 w-12 flex items-center justify-center overflow-hidden">
                <img 
                  src="/lovable-uploads/b1e02ec5-6a97-4c44-912c-358925786899.png" 
                  alt="DOOD? Logo" 
                  className="h-12 w-12 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">DOOD?</h1>
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
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f6cbf] mb-2">Course Materials</h2>
          <p className="text-gray-600 mb-8">Access pre-loaded course materials or upload your own PDFs</p>
          
          <Tabs defaultValue="preloaded" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preloaded" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Course Materials</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Upload Files</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preloaded" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Material Science Course</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courseWeeks.map((week) => (
                      <Card key={week.weekId} className="border-2 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[#0f6cbf] mb-2">{week.weekName}</h3>
                          <p className="text-sm text-gray-600 mb-3">{week.dateRange}</p>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">
                              {week.materials.filter(m => m.type === 'chapter').length} Chapters
                            </div>
                            <div className="text-xs text-gray-500">
                              {week.materials.filter(m => m.type === 'exercise').length} Exercises
                            </div>
                            <div className="text-xs text-gray-500">
                              {week.materials.filter(m => m.type === 'control-questions').length} Control Questions
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8">
                    <MaterialSelector
                      selectedMaterial={selectedMaterial}
                      onMaterialSelect={handleMaterialSelect}
                      placeholder="Browse all course materials..."
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Link to="/">
                  <Button className="bg-[#0f6cbf] hover:bg-[#0d5aa7] text-lg px-8 py-3">
                    Use Course Materials in Learning Apps
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Additional Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUploadZone 
                    onFileUpload={handleFileUpload} 
                    uploadedFiles={uploadedFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                </CardContent>
              </Card>

              {uploadedFiles.length > 0 && (
                <div className="text-center">
                  <Link to="/">
                    <Button className="bg-[#0f6cbf] hover:bg-[#0d5aa7] text-lg px-8 py-3">
                      Continue to Learning Apps
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Upload;
