import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Download, 
  Upload, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { useGoogleCalendar } from '@/contexts/GoogleCalendarContext';
import { StudyEvent } from '@/lib/googleCalendar';

interface GoogleCalendarSyncProps {
  studyEvents: StudyEvent[];
  onEventsImported: (events: any[]) => void;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ 
  studyEvents, 
  onEventsImported 
}) => {
  const {
    isSignedIn,
    isInitialized,
    isLoading,
    signIn,
    signOut,
    exportEvents,
    importEvents,
    syncSchedule,
    lastSyncTime
  } = useGoogleCalendar();

  const [syncStatus, setSyncStatus] = useState<'idle' | 'exporting' | 'importing' | 'syncing'>('idle');
  const [lastAction, setLastAction] = useState<string>('');

  const handleSignIn = async () => {
    const success = await signIn();
    if (success) {
      setLastAction('Successfully signed in to Google Calendar');
    } else {
      setLastAction('Failed to sign in to Google Calendar');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setLastAction('Signed out from Google Calendar');
  };

  const handleExport = async () => {
    setSyncStatus('exporting');
    try {
      const success = await exportEvents(studyEvents);
      setLastAction(success 
        ? `Exported ${studyEvents.length} study events to Google Calendar`
        : 'Failed to export events to Google Calendar'
      );
    } catch (error) {
      setLastAction('Error occurred during export');
    } finally {
      setSyncStatus('idle');
    }
  };

  const handleImport = async () => {
    setSyncStatus('importing');
    try {
      const events = await importEvents();
      onEventsImported(events);
      setLastAction(`Imported ${events.length} study-related events from Google Calendar`);
    } catch (error) {
      setLastAction('Error occurred during import');
    } finally {
      setSyncStatus('idle');
    }
  };

  const handleFullSync = async () => {
    setSyncStatus('syncing');
    try {
      const result = await syncSchedule(studyEvents);
      setLastAction(`Sync completed: ${result.exported} exported, ${result.imported.length} imported`);
      onEventsImported(result.imported);
    } catch (error) {
      setLastAction('Error occurred during sync');
    } finally {
      setSyncStatus('idle');
    }
  };

  if (!isInitialized && isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Initializing Google Calendar API...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-[#0f6cbf]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isInitialized && !isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-[#0f6cbf]">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription>
            Google Calendar integration is temporarily unavailable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <div className="font-medium mb-1">OAuth Integration Disabled</div>
                <p className="mb-2">
                  Personal calendar sync has been temporarily disabled to avoid deprecated authentication library warnings.
                </p>
                <div className="text-xs text-amber-700 space-y-1">
                  <p><strong>Current Status:</strong></p>
                  <p>• ✅ Course Calendar: Working (public calendar embed)</p>
                  <p>• ✅ Study Schedule: Working (AI-generated calendar)</p>
                  <p>• ⏸️ Personal Sync: Disabled (avoiding deprecated Google auth library)</p>
                  <p></p>
                  <p><strong>Note:</strong> Google deprecated some auth libraries. We've disabled OAuth to prevent warnings while keeping all core functionality working.</p>
                </div>
                <div className="mt-2 text-xs text-amber-600">
                  <p>💡 Check browser console for detailed error messages</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-[#0f6cbf]">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Sync your study schedule with Google Calendar to stay organized across all your devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Google Calendar</div>
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    isSignedIn 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isSignedIn ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>
          <div>
            {isSignedIn ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                disabled={isLoading}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                size="sm"
                disabled={isLoading}
                className="bg-[#0f6cbf] hover:bg-[#0d5aa7]"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CalendarIcon className="h-4 w-4 mr-2" />
                )}
                Connect
              </Button>
            )}
          </div>
        </div>

        {/* Sync Actions */}
        {isSignedIn && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export */}
            <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Export</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Send your study schedule to Google Calendar
              </p>
              <Button
                onClick={handleExport}
                size="sm"
                variant="outline"
                disabled={isLoading || syncStatus === 'exporting' || studyEvents.length === 0}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                {syncStatus === 'exporting' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Export ({studyEvents.length} events)
              </Button>
            </div>

            {/* Import */}
            <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100/50">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">Import</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Bring study events from your Google Calendar
              </p>
              <Button
                onClick={handleImport}
                size="sm"
                variant="outline"
                disabled={isLoading || syncStatus === 'importing'}
                className="w-full border-green-300 text-green-700 hover:bg-green-100"
              >
                {syncStatus === 'importing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Import Events
              </Button>
            </div>

            {/* Full Sync */}
            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
              <div className="flex items-center space-x-2 mb-2">
                <RotateCw className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-900">Full Sync</span>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                Two-way synchronization with Google Calendar
              </p>
              <Button
                onClick={handleFullSync}
                size="sm"
                variant="outline"
                disabled={isLoading || syncStatus === 'syncing'}
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RotateCw className="h-4 w-4 mr-2" />
                )}
                Sync All
              </Button>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {(lastAction || lastSyncTime) && (
          <div className="space-y-3">
            {lastAction && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-800">{lastAction}</span>
                </div>
              </div>
            )}
            
            {lastSyncTime && (
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Last sync: {lastSyncTime.toLocaleString()}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Auto-sync enabled
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        {!isSignedIn && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 bg-amber-400 rounded-full flex-shrink-0 mt-0.5"></div>
              <div className="text-sm text-amber-800">
                <div className="font-medium mb-1">Setup Required</div>
                <p>
                  Connect your Google account to sync your study schedule across all devices. 
                  Your data will be securely synced using Google's OAuth 2.0 authentication.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleCalendarSync;