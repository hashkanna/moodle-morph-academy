import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CourseMaterial, getMaterialById } from '@/lib/courseData';

interface MaterialContextType {
  selectedMaterials: string[];
  uploadedFiles: File[];
  currentMaterial: CourseMaterial | null;
  addMaterial: (materialId: string) => void;
  removeMaterial: (materialId: string) => void;
  setCurrentMaterial: (materialId: string) => void;
  clearMaterials: () => void;
  addUploadedFiles: (files: File[]) => void;
  removeUploadedFile: (index: number) => void;
  hasAnyMaterials: () => boolean;
  getCurrentMaterialInfo: () => {
    material: CourseMaterial | null;
    isUploaded: boolean;
    uploadedFile?: File;
  };
}

const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

export const useMaterials = () => {
  const context = useContext(MaterialContext);
  if (context === undefined) {
    throw new Error('useMaterials must be used within a MaterialProvider');
  }
  return context;
};

interface MaterialProviderProps {
  children: ReactNode;
}

export const MaterialProvider: React.FC<MaterialProviderProps> = ({ children }) => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentMaterial, setCurrentMaterialState] = useState<CourseMaterial | null>(null);

  const addMaterial = (materialId: string) => {
    setSelectedMaterials(prev => {
      if (!prev.includes(materialId)) {
        return [...prev, materialId];
      }
      return prev;
    });
  };

  const removeMaterial = (materialId: string) => {
    setSelectedMaterials(prev => prev.filter(id => id !== materialId));
  };

  const setCurrentMaterial = (materialId: string) => {
    if (materialId.startsWith('uploaded-')) {
      setCurrentMaterialState(null);
    } else {
      const material = getMaterialById(materialId);
      setCurrentMaterialState(material || null);
    }
  };

  const clearMaterials = () => {
    setSelectedMaterials([]);
    setCurrentMaterialState(null);
  };

  const addUploadedFiles = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const hasAnyMaterials = () => {
    return selectedMaterials.length > 0 || uploadedFiles.length > 0;
  };

  const getCurrentMaterialInfo = () => {
    if (selectedMaterials.length === 0 && uploadedFiles.length === 0) {
      return { material: null, isUploaded: false };
    }

    // If we have a current material set, use it
    if (currentMaterial) {
      return { material: currentMaterial, isUploaded: false };
    }

    // Otherwise, use the first available material
    if (selectedMaterials.length > 0) {
      const firstMaterialId = selectedMaterials[0];
      if (firstMaterialId.startsWith('uploaded-')) {
        const index = parseInt(firstMaterialId.replace('uploaded-', ''));
        return {
          material: null,
          isUploaded: true,
          uploadedFile: uploadedFiles[index]
        };
      } else {
        const material = getMaterialById(firstMaterialId);
        return { material, isUploaded: false };
      }
    }

    // If only uploaded files exist
    if (uploadedFiles.length > 0) {
      return {
        material: null,
        isUploaded: true,
        uploadedFile: uploadedFiles[0]
      };
    }

    return { material: null, isUploaded: false };
  };

  const value: MaterialContextType = {
    selectedMaterials,
    uploadedFiles,
    currentMaterial,
    addMaterial,
    removeMaterial,
    setCurrentMaterial,
    clearMaterials,
    addUploadedFiles,
    removeUploadedFile,
    hasAnyMaterials,
    getCurrentMaterialInfo
  };

  return (
    <MaterialContext.Provider value={value}>
      {children}
    </MaterialContext.Provider>
  );
};