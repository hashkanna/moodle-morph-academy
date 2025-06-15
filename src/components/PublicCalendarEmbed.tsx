import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Users,
  Clock
} from 'lucide-react';

interface PublicCalendarEmbedProps {
  calendarSrc?: string;
  timezone?: string;
  title?: string;
  description?: string;
}

const PublicCalendarEmbed: React.FC<PublicCalendarEmbedProps> = ({ 
  calendarSrc = "b00807289%40essec.edu",
  timezone = "Europe%2FParis",
  title = "Material Science Course Calendar",
  description = "Official course schedule, deadlines, and study sessions"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use the exact URL provided by the user with modifications for embedding
  const baseUrl = "https://calendar.google.com/calendar/embed?src=b00807289%40essec.edu&ctz=Europe%2FParis";
  const embedUrl = `${baseUrl}&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=WEEK&height=${isExpanded ? 600 : 400}`;
  const fullPageUrl = baseUrl;

  const handleCalendarLoad = () => {
    console.log('📅 Public calendar loaded successfully');
    setIsLoading(false);
  };

  const handleCalendarError = () => {
    console.error('❌ Failed to load public calendar');
    setIsLoading(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Force iframe reload by changing the src
    const iframe = document.getElementById('public-calendar-iframe') as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 100);
    }
  };

  const openInNewTab = () => {
    window.open(fullPageUrl, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#0f6cbf]">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {title}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Users className="h-3 w-3 mr-1" />
              Public
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{description}</span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="outline"
              size="sm"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
              <div className="flex flex-col items-center space-y-2">
                <RefreshCw className="h-6 w-6 animate-spin text-[#0f6cbf]" />
                <span className="text-sm text-gray-600">Loading calendar...</span>
              </div>
            </div>
          )}
          
          {/* Google Calendar Embed */}
          <div className={`relative overflow-hidden rounded-lg border ${isExpanded ? 'h-[600px]' : 'h-[400px]'} transition-all duration-300`}>
            <iframe
              id="public-calendar-iframe"
              src={embedUrl}
              style={{ 
                border: 'none',
                width: '100%',
                height: '100%',
                borderRadius: '8px'
              }}
              frameBorder="0"
              scrolling="no"
              onLoad={handleCalendarLoad}
              title="Material Science Course Calendar"
            />
          </div>
        </div>

        {/* Calendar Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Calendar Features</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Live updates from course instructors</li>
            <li>• Assignment deadlines and exam dates</li>
            <li>• Study session reminders</li>
            <li>• Office hours and review sessions</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={openInNewTab}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Full Calendar
          </Button>
          <Button
            onClick={() => {
              const googleCalUrl = `https://calendar.google.com/calendar/u/0?cid=${calendarSrc.replace('%40', '@')}`;
              window.open(googleCalUrl, '_blank');
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Users className="h-3 w-3 mr-1" />
            Subscribe
          </Button>
          <Button
            onClick={() => {
              const icsUrl = `https://calendar.google.com/calendar/ical/${calendarSrc}/public/basic.ics`;
              window.open(icsUrl, '_blank');
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            📅 Download ICS
          </Button>
        </div>

        {/* Timezone Info */}
        <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
          <span>Timezone: {decodeURIComponent(timezone).replace('%2F', '/')}</span>
          <span>Updates automatically</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicCalendarEmbed;