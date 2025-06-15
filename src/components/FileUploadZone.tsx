
import React, { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
  onRemoveFile?: (index: number) => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFileUpload, uploadedFiles, onRemoveFile }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type === 'application/pdf');
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  const removeFile = (index: number) => {
    if (onRemoveFile) {
      onRemoveFile(index);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-[#0f6cbf] bg-blue-50 hover:bg-blue-100 transition-colors">
        <CardContent className="p-8">
          <div
            className="text-center"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-12 w-12 text-[#0f6cbf] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0f6cbf] mb-2">
              Drop your course PDFs here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse your files
            </p>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild className="bg-[#0f6cbf] hover:bg-[#0d5aa7]">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-[#0f6cbf]">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
