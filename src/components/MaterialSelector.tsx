import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, HelpCircle, CheckCircle } from 'lucide-react';
import { CourseMaterial, courseWeeks, getAllMaterials } from '@/lib/courseData';

interface MaterialSelectorProps {
  selectedMaterial?: string;
  onMaterialSelect: (materialId: string) => void;
  materialType?: 'all' | 'chapter' | 'exercise' | 'control-questions';
  includeUploaded?: boolean;
  uploadedFiles?: File[];
  placeholder?: string;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  selectedMaterial,
  onMaterialSelect,
  materialType = 'all',
  includeUploaded = true,
  uploadedFiles = [],
  placeholder = "Select course material..."
}) => {
  const getIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'chapter':
        return <BookOpen className="h-4 w-4" />;
      case 'exercise':
        return <FileText className="h-4 w-4" />;
      case 'control-questions':
        return <HelpCircle className="h-4 w-4" />;
      case 'solution':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'chapter':
        return 'bg-blue-100 text-blue-800';
      case 'exercise':
        return 'bg-green-100 text-green-800';
      case 'control-questions':
        return 'bg-orange-100 text-orange-800';
      case 'solution':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredMaterials = () => {
    let materials = getAllMaterials();
    
    if (materialType !== 'all') {
      materials = materials.filter(material => material.type === materialType);
    }
    
    return materials;
  };

  const filteredMaterials = getFilteredMaterials();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Course Materials
        </label>
        <Select value={selectedMaterial} onValueChange={onMaterialSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-96">
            {/* Pre-loaded course materials organized by week */}
            {courseWeeks.map((week) => {
              const weekMaterials = week.materials.filter(material => 
                materialType === 'all' || material.type === materialType
              );
              
              if (weekMaterials.length === 0) return null;
              
              return (
                <div key={week.weekId}>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                    {week.weekName} ({week.dateRange})
                  </div>
                  {weekMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      <div className="flex items-center space-x-2 w-full">
                        {getIcon(material.type)}
                        <span className="flex-1 truncate">{material.title}</span>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTypeColor(material.type)}`}
                        >
                          {material.type}
                        </Badge>
                        {material.language === 'en' && (
                          <Badge variant="outline" className="text-xs">
                            EN
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              );
            })}
            
            {/* Uploaded materials section */}
            {includeUploaded && uploadedFiles && uploadedFiles.length > 0 && (
              <>
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-50">
                  Uploaded Materials
                </div>
                {uploadedFiles.map((file, index) => (
                  <SelectItem key={`uploaded-${index}`} value={`uploaded-${index}`}>
                    <div className="flex items-center space-x-2 w-full">
                      <FileText className="h-4 w-4" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800">
                        uploaded
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Material info display */}
      {selectedMaterial && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            {(() => {
              if (selectedMaterial.startsWith('uploaded-')) {
                const index = parseInt(selectedMaterial.replace('uploaded-', ''));
                const file = uploadedFiles[index];
                return (
                  <>
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      {file?.name || 'Uploaded File'}
                    </span>
                    <Badge className="bg-indigo-100 text-indigo-800">uploaded</Badge>
                  </>
                );
              } else {
                const material = filteredMaterials.find(m => m.id === selectedMaterial);
                if (material) {
                  const week = courseWeeks.find(w => w.weekId === material.week);
                  return (
                    <>
                      {getIcon(material.type)}
                      <span className="text-sm font-medium text-blue-800">
                        {material.title}
                      </span>
                      <Badge className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                      {material.language === 'en' && (
                        <Badge variant="outline">EN</Badge>
                      )}
                      {week && (
                        <span className="text-xs text-blue-600">
                          {week.weekName}
                        </span>
                      )}
                    </>
                  );
                }
              }
              return null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;