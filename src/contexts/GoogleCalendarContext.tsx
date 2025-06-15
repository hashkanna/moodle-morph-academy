import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { googleCalendarService, GoogleCalendarEvent, StudyEvent } from '@/lib/googleCalendar';

interface GoogleCalendarContextType {
  isSignedIn: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  exportEvents: (events: StudyEvent[]) => Promise<boolean>;
  importEvents: () => Promise<GoogleCalendarEvent[]>;
  syncSchedule: (events: StudyEvent[]) => Promise<{ exported: number; imported: GoogleCalendarEvent[] }>;
  lastSyncTime: Date | null;
}

const GoogleCalendarContext = createContext<GoogleCalendarContextType | undefined>(undefined);

interface GoogleCalendarProviderProps {
  children: ReactNode;
}

export const GoogleCalendarProvider: React.FC<GoogleCalendarProviderProps> = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Initialize Google Calendar API on mount
  useEffect(() => {
    const initializeGoogleCalendar = async () => {
      setIsLoading(true);
      try {
        // Add a reasonable timeout for initialization
        const initialized = await Promise.race([
          googleCalendarService.initialize(),
          new Promise<boolean>((resolve) => {
            setTimeout(() => {
              console.warn('⏰ Google Calendar initialization timed out after 10 seconds');
              resolve(false);
            }, 10000); // 10 second timeout
          })
        ]);
        
        setIsInitialized(initialized);
        
        if (initialized) {
          setIsSignedIn(googleCalendarService.getSignInStatus());
          console.log('📅 Google Calendar context initialized successfully');
        } else {
          console.warn('⚠️ Google Calendar initialization failed - integration will be disabled');
        }
      } catch (error) {
        console.error('❌ Failed to initialize Google Calendar context:', error);
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoogleCalendar();
  }, []);

  const signIn = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await googleCalendarService.signIn();
      setIsSignedIn(success);
      return success;
    } catch (error) {
      console.error('❌ Sign-in failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await googleCalendarService.signOut();
      setIsSignedIn(false);
      setLastSyncTime(null);
    } catch (error) {
      console.error('❌ Sign-out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportEvents = async (events: StudyEvent[]): Promise<boolean> => {
    if (!isSignedIn) return false;
    
    setIsLoading(true);
    try {
      const success = await googleCalendarService.exportStudyEvents(events);
      if (success) {
        setLastSyncTime(new Date());
      }
      return success;
    } catch (error) {
      console.error('❌ Export failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const importEvents = async (): Promise<GoogleCalendarEvent[]> => {
    if (!isSignedIn) return [];
    
    setIsLoading(true);
    try {
      const events = await googleCalendarService.importCalendarEvents();
      setLastSyncTime(new Date());
      return events;
    } catch (error) {
      console.error('❌ Import failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const syncSchedule = async (events: StudyEvent[]): Promise<{ exported: number; imported: GoogleCalendarEvent[] }> => {
    if (!isSignedIn) return { exported: 0, imported: [] };
    
    setIsLoading(true);
    try {
      const result = await googleCalendarService.syncStudySchedule(events);
      setLastSyncTime(new Date());
      return result;
    } catch (error) {
      console.error('❌ Sync failed:', error);
      return { exported: 0, imported: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const value: GoogleCalendarContextType = {
    isSignedIn,
    isInitialized,
    isLoading,
    signIn,
    signOut,
    exportEvents,
    importEvents,
    syncSchedule,
    lastSyncTime
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
};

export const useGoogleCalendar = (): GoogleCalendarContextType => {
  const context = useContext(GoogleCalendarContext);
  if (context === undefined) {
    throw new Error('useGoogleCalendar must be used within a GoogleCalendarProvider');
  }
  return context;
};