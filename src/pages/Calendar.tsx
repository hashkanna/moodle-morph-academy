
import React, { useState } from 'react';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import StudyCalendar from '@/components/StudyCalendar';
import GoogleCalendarSync from '@/components/GoogleCalendarSync';
import PublicCalendarEmbed from '@/components/PublicCalendarEmbed';
import { useProgress } from '@/contexts/ProgressContext';
import { StudyEvent } from '@/lib/googleCalendar';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const { overallProgress, updateProgressFromCalendar } = useProgress();
  const [studyEvents, setStudyEvents] = useState<StudyEvent[]>([]);
  const [importedEvents, setImportedEvents] = useState<any[]>([]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {};
    if (view === 'month') {
      options.month = 'long';
      options.year = 'numeric';
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      options.weekday = 'long';
      options.month = 'long';
      options.day = 'numeric';
      options.year = 'numeric';
    }
    return currentDate.toLocaleDateString('en-US', options);
  };

  const handleProgressUpdate = (newProgress: number) => {
    updateProgressFromCalendar(newProgress);
  };

  const handleEventsImported = (events: any[]) => {
    setImportedEvents(events);
    console.log(`📥 Imported ${events.length} events from Google Calendar:`, events);
  };

  const handleStudyEventsUpdate = (events: StudyEvent[]) => {
    setStudyEvents(events);
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
                  style={{ backgroundColor: 'transparent' }}
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
        
        {/* Progress Bar - Full Width and Higher */}
        <div className="w-full bg-[#0f6cbf] px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-medium">Study Progress</span>
            <span className="text-lg font-bold">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-8 bg-white/20" />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-[#0f6cbf] min-w-[200px] text-center">
                {getDateHeader()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                className="bg-[#0f6cbf] hover:bg-[#0d5aa7]"
              >
                Week View
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Tabs */}
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="course" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Course Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Study Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="sync" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Personal Sync</span>
            </TabsTrigger>
          </TabsList>

          {/* Course Calendar Tab */}
          <TabsContent value="course" className="space-y-6">
            <PublicCalendarEmbed 
              title="ESSEC Material Science Course Calendar"
              description="Official course schedule, assignments, and exam dates"
            />
          </TabsContent>

          {/* Study Schedule Tab */}
          <TabsContent value="study" className="space-y-6">
            <StudyCalendar 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onProgressUpdate={handleProgressUpdate}
              onStudyEventsUpdate={handleStudyEventsUpdate}
            />
          </TabsContent>

          {/* Personal Sync Tab */}
          <TabsContent value="sync" className="space-y-6">
            <GoogleCalendarSync 
              studyEvents={studyEvents}
              onEventsImported={handleEventsImported}
            />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default Calendar;
