
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import MockExamApp from '@/components/MockExamApp';

const MockExam = () => {
  const [progress, setProgress] = React.useState(65);

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
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
              <h1 className="text-2xl font-bold">DOOD?</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button className="bg-white text-[#0f6cbf] hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-[#0f6cbf] px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-medium">Exam Progress</span>
            <span className="text-lg font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-6 bg-white/20" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0f6cbf] mb-2">AI Mock Exam</h2>
          <p className="text-gray-600">
            Practice with comprehensive timed exams generated from your course materials
          </p>
        </div>

        {/* Mock Exam Component - Full Width */}
        <div className="w-full max-w-4xl mx-auto">
          <MockExamApp isEnabled={true} autoGenerate={true} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f6cbf] text-white shadow-lg mt-auto">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-medium">Learning Progress</span>
            <span className="text-lg font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-6 bg-white/20" />
        </div>
      </footer>
    </div>
  );
};

export default MockExam;
