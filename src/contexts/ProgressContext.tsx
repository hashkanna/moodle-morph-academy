import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressContextType {
  overallProgress: number;
  setOverallProgress: (progress: number) => void;
  updateProgressFromCalendar: (progress: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [overallProgress, setOverallProgress] = useState(0);

  const updateProgressFromCalendar = (progress: number) => {
    setOverallProgress(progress);
  };

  const value: ProgressContextType = {
    overallProgress,
    setOverallProgress,
    updateProgressFromCalendar
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};