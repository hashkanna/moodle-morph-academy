// Google Calendar integration service
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  colorId?: string;
}

export interface StudyEvent {
  date: string;
  title: string;
  type: 'quiz' | 'exam' | 'flashcards' | 'study';
  completed: boolean;
  description?: string;
}

class GoogleCalendarService {
  private gapi: any = null;
  private isSignedIn = false;
  private calendar: any = null;

  // Initialize Google API
  async initialize(): Promise<boolean> {
    try {
      // Check if API keys are available
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      console.log('🔧 Google Calendar API Keys Check:', {
        hasApiKey: !!apiKey,
        hasClientId: !!clientId,
        apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'missing',
        clientIdPreview: clientId ? `${clientId.substring(0, 10)}...` : 'missing',
        currentOrigin: window.location.origin,
        currentPort: window.location.port,
        currentHost: window.location.hostname,
        fullUrl: window.location.href
      });
      
      // Skip initialization if keys are placeholder values or missing
      if (!apiKey || !clientId || 
          apiKey === 'your_google_api_key_here' || 
          clientId === 'your_google_client_id_here' ||
          apiKey === 'disabled' || 
          clientId === 'disabled') {
        console.warn('⚠️ Google Calendar API keys not configured - skipping initialization');
        return false;
      }

      // Temporary: Skip if we detect Android client ID (ends with .apps.googleusercontent.com but has Android restrictions)
      if (clientId.includes('apps.googleusercontent.com')) {
        console.warn('⚠️ Detected potential Android client ID - OAuth may fail');
        console.warn('💡 Create a new "Web application" OAuth client in Google Cloud Console');
        // Continue anyway to show the error for debugging
      }

      // Load Google API script if not already loaded
      if (!window.gapi) {
        console.log('📥 Loading Google API script...');
        await this.loadGoogleAPIScript();
        console.log('✅ Google API script loaded');
      } else {
        console.log('✅ Google API script already available');
      }

      // Load the required Google API libraries with shorter timeout
      console.log('🔧 Loading Google API libraries...');
      await Promise.race([
        new Promise<void>((resolve, reject) => {
          try {
            // Load only client library first, skip deprecated auth2
            window.gapi.load('client', () => {
              console.log('📦 Google API client library loaded successfully');
              resolve();
            });
          } catch (error) {
            reject(error);
          }
        }),
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout loading Google API libraries after 8 seconds')), 8000);
        })
      ]);

      // Initialize the Google API client with simplified approach
      console.log('🔧 Initializing Google API client...');
      await Promise.race([
        new Promise<void>((resolve, reject) => {
          window.gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest']
          }).then(() => {
            console.log('🎉 Google API client init completed (API key only)');
            resolve();
          }).catch((error: any) => {
            console.error('🚫 Google API client init failed:', error);
            console.error('Error details:', {
              message: error.details || error.message || 'Unknown error',
              status: error.status,
              code: error.code,
              fullError: error
            });
            reject(error);
          });
        }),
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout initializing Google API client after 8 seconds')), 8000);
        })
      ]);

      this.gapi = window.gapi;
      this.calendar = this.gapi.client.calendar;
      
      // For now, skip OAuth initialization to avoid deprecated warnings
      // We'll implement modern OAuth when needed
      this.isSignedIn = false;
      console.log('✅ Google Calendar API initialized (read-only mode)');
      
      console.log('✅ Google Calendar API initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar API:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  }

  private loadGoogleAPIScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi && window.google) {
        resolve();
        return;
      }

      // Add timeout for script loading
      const timeout = setTimeout(() => {
        reject(new Error('Timeout loading Google API script'));
      }, 15000);

      let scriptsLoaded = 0;
      const scriptsNeeded = 2;

      const checkComplete = () => {
        scriptsLoaded++;
        if (scriptsLoaded === scriptsNeeded) {
          clearTimeout(timeout);
          resolve();
        }
      };

      const handleError = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Google API script - network error'));
      };

      // Load Google API Client Library
      if (!window.gapi) {
        const gapiScript = document.createElement('script');
        gapiScript.src = 'https://apis.google.com/js/api.js';
        gapiScript.onload = checkComplete;
        gapiScript.onerror = handleError;
        document.head.appendChild(gapiScript);
      } else {
        checkComplete();
      }

      // Load Google Identity Services Library (newer auth library)
      if (!window.google) {
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.onload = checkComplete;
        gisScript.onerror = handleError;
        document.head.appendChild(gisScript);
      } else {
        checkComplete();
      }
    });
  }

  // Sign in to Google
  async signIn(): Promise<boolean> {
    try {
      if (!this.gapi) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = authInstance.isSignedIn.get();
      
      console.log('✅ Successfully signed in to Google Calendar');
      return this.isSignedIn;
    } catch (error) {
      console.error('❌ Failed to sign in to Google Calendar:', error);
      return false;
    }
  }

  // Sign out from Google
  async signOut(): Promise<void> {
    try {
      if (this.gapi && this.isSignedIn) {
        await this.gapi.auth2.getAuthInstance().signOut();
        this.isSignedIn = false;
        console.log('✅ Signed out from Google Calendar');
      }
    } catch (error) {
      console.error('❌ Failed to sign out from Google Calendar:', error);
    }
  }

  // Check if user is signed in
  getSignInStatus(): boolean {
    return this.isSignedIn && this.gapi?.auth2?.getAuthInstance()?.isSignedIn?.get();
  }

  // Get user's calendar list
  async getCalendars(): Promise<any[]> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const response = await this.calendar.calendarList.list();
      return response.result.items || [];
    } catch (error) {
      console.error('❌ Failed to get calendars:', error);
      return [];
    }
  }

  // Export study events to Google Calendar
  async exportStudyEvents(events: StudyEvent[], calendarId: string = 'primary'): Promise<boolean> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      console.log(`📤 Exporting ${events.length} study events to Google Calendar...`);

      const promises = events.map(event => this.createGoogleCalendarEvent(event, calendarId));
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      console.log(`✅ Export completed: ${successful} successful, ${failed} failed`);
      return failed === 0;
    } catch (error) {
      console.error('❌ Failed to export study events:', error);
      return false;
    }
  }

  // Create a single event in Google Calendar
  private async createGoogleCalendarEvent(event: StudyEvent, calendarId: string): Promise<any> {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration

    const googleEvent = {
      summary: `📚 ${event.title}`,
      description: `Material Science Study Session\n\nType: ${event.type}\nStatus: ${event.completed ? 'Completed' : 'Pending'}\n\n${event.description || 'Generated by DOOD? - Material Science Learning Platform'}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      colorId: this.getEventColorId(event.type),
      source: {
        title: 'DOOD? - Material Science Platform',
        url: window.location.origin
      }
    };

    return await this.calendar.events.insert({
      calendarId: calendarId,
      resource: googleEvent
    });
  }

  // Import events from Google Calendar
  async importCalendarEvents(calendarId: string = 'primary', daysAhead: number = 30): Promise<GoogleCalendarEvent[]> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + (daysAhead * 24 * 60 * 60 * 1000)).toISOString();

      const response = await this.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        q: 'study OR quiz OR exam OR material science' // Filter for study-related events
      });

      const events = response.result.items || [];
      console.log(`📥 Imported ${events.length} study-related events from Google Calendar`);

      return events.map((event: any) => ({
        id: event.id,
        summary: event.summary || 'Untitled Event',
        description: event.description,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        location: event.location,
        colorId: event.colorId
      }));
    } catch (error) {
      console.error('❌ Failed to import calendar events:', error);
      return [];
    }
  }

  // Get color ID based on event type
  private getEventColorId(type: string): string {
    const colorMap: { [key: string]: string } = {
      'quiz': '9',      // Blue
      'exam': '11',     // Red  
      'flashcards': '5', // Yellow
      'study': '2'      // Green
    };
    return colorMap[type] || '1'; // Default lavender
  }

  // Create a study calendar in Google Calendar
  async createStudyCalendar(name: string = 'Material Science Study Schedule'): Promise<string | null> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const calendar = {
        summary: name,
        description: 'Study schedule created by DOOD? - Material Science Learning Platform',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      const response = await this.calendar.calendars.insert({
        resource: calendar
      });

      console.log(`✅ Created study calendar: ${response.result.id}`);
      return response.result.id;
    } catch (error) {
      console.error('❌ Failed to create study calendar:', error);
      return null;
    }
  }

  // Sync local study events with Google Calendar
  async syncStudySchedule(localEvents: StudyEvent[]): Promise<{ exported: number; imported: GoogleCalendarEvent[] }> {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      // Export local events to Google Calendar
      const exportSuccess = await this.exportStudyEvents(localEvents);
      const exportedCount = exportSuccess ? localEvents.length : 0;

      // Import study-related events from Google Calendar
      const importedEvents = await this.importCalendarEvents();

      console.log(`🔄 Sync completed: ${exportedCount} exported, ${importedEvents.length} imported`);

      return {
        exported: exportedCount,
        imported: importedEvents
      };
    } catch (error) {
      console.error('❌ Failed to sync study schedule:', error);
      return { exported: 0, imported: [] };
    }
  }
}

// Create singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Extend window interface for TypeScript
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}