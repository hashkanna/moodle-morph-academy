import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Target, 
  BookOpen, 
  Clock,
  Brain,
  CheckCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useMaterials } from '@/contexts/MaterialContext';
import { courseWeeks } from '@/lib/courseData';

interface StudyActivity {
  id: string;
  type: 'quiz' | 'exam' | 'flashcards';
  title: string;
  materialId: string;
  materialTitle: string;
  time: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  completedAt?: Date;
}

interface DaySchedule {
  date: Date;
  activities: StudyActivity[];
}

interface StudyCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onProgressUpdate: (progress: number) => void;
  onStudyEventsUpdate?: (events: Array<{
    date: string;
    title: string;
    type: 'quiz' | 'exam' | 'flashcards' | 'study';
    completed: boolean;
    description?: string;
  }>) => void;
}

const StudyCalendar: React.FC<StudyCalendarProps> = ({ 
  currentDate, 
  onDateChange, 
  onProgressUpdate,
  onStudyEventsUpdate 
}) => {
  const navigate = useNavigate();
  const { setCurrentMaterial } = useMaterials();
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);

  // Initialize week schedule with sample data
  useEffect(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    setWeekStart(startOfWeek);


    // Get all available materials from courseData
    const allMaterials = courseWeeks.flatMap(week => week.materials);

    // Generate study schedule for the week using all available materials
    const schedule: DaySchedule[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const activities: StudyActivity[] = [];
      
      // Create activities for each day with available materials
      if (allMaterials.length > 0) {
        const materialIndex = i % allMaterials.length; // Rotate through materials
        const material = allMaterials[materialIndex];
        
        // Define activity schedule for different days
        const dayActivitySchedule = [
          // Sunday (i=0) - Light review
          [
            { type: 'flashcards' as const, time: '10:00', duration: 15, difficulty: 'easy' as const }
          ],
          // Monday (i=1) - Quiz + Flashcards
          [
            { type: 'quiz' as const, time: '09:00', duration: 30, difficulty: 'medium' as const },
            { type: 'flashcards' as const, time: '14:00', duration: 20, difficulty: 'easy' as const }
          ],
          // Tuesday (i=2) - Mock Exam
          [
            { type: 'exam' as const, time: '10:00', duration: 90, difficulty: 'hard' as const }
          ],
          // Wednesday (i=3) - Quiz
          [
            { type: 'quiz' as const, time: '11:00', duration: 25, difficulty: 'medium' as const }
          ],
          // Thursday (i=4) - Flashcards
          [
            { type: 'flashcards' as const, time: '15:00', duration: 25, difficulty: 'medium' as const }
          ],
          // Friday (i=5) - Quiz + Mock Exam
          [
            { type: 'quiz' as const, time: '09:00', duration: 30, difficulty: 'easy' as const },
            { type: 'exam' as const, time: '13:00', duration: 90, difficulty: 'hard' as const }
          ],
          // Saturday (i=6) - Flashcards (weekend review)
          [
            { type: 'flashcards' as const, time: '10:00', duration: 20, difficulty: 'easy' as const }
          ]
        ];
        
        const dailyActivities = dayActivitySchedule[i] || [];
        
        dailyActivities.forEach((activityTemplate, actIndex) => {
          activities.push({
            id: `${material.id}-${activityTemplate.type}-${i}-${actIndex}`,
            type: activityTemplate.type,
            title: `${activityTemplate.type === 'quiz' ? 'Quiz' : activityTemplate.type === 'exam' ? 'Mock Exam' : 'Flashcards'}`,
            materialId: material.id,
            materialTitle: material.title,
            time: activityTemplate.time,
            duration: activityTemplate.duration,
            difficulty: activityTemplate.difficulty,
            completed: false
          });
        });
      }

      schedule.push({ date, activities });
    }
    
    setWeekSchedule(schedule);
  }, [currentDate]);

  // Calculate weekly progress and export study events
  useEffect(() => {
    const allActivities = weekSchedule.flatMap(day => day.activities);
    const completedActivities = allActivities.filter(activity => activity.completed);
    const progress = allActivities.length > 0 ? (completedActivities.length / allActivities.length) * 100 : 0;
    onProgressUpdate(progress);

    // Export study events for Google Calendar sync
    if (onStudyEventsUpdate) {
      const studyEvents = weekSchedule.flatMap(day => 
        day.activities.map(activity => ({
          date: day.date.toISOString(),
          title: `${activity.title} - ${activity.materialTitle}`,
          type: activity.type,
          completed: activity.completed,
          description: `Material Science ${activity.type} session\nMaterial: ${activity.materialTitle}\nDifficulty: ${activity.difficulty}\nDuration: ${activity.duration} minutes`
        }))
      );
      onStudyEventsUpdate(studyEvents);
    }
  }, [weekSchedule, onProgressUpdate, onStudyEventsUpdate]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  const toggleActivityComplete = (dayIndex: number, activityId: string) => {
    setWeekSchedule(prev => {
      const newSchedule = prev.map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            activities: day.activities.map(activity => 
              activity.id === activityId 
                ? { 
                    ...activity, 
                    completed: !activity.completed,
                    completedAt: !activity.completed ? new Date() : undefined
                  }
                : activity
            )
          };
        }
        return day;
      });
      return newSchedule;
    });
  };

  const handleActivityClick = (activity: StudyActivity) => {
    // Set the material for this activity before navigating
    setCurrentMaterial(activity.materialId);
    
    // Navigate to the appropriate dedicated page based on activity type
    switch (activity.type) {
      case 'quiz':
        navigate('/quiz');
        break;
      case 'exam':
        navigate('/mock-exam');
        break;
      case 'flashcards':
        navigate('/anki-cards');
        break;
    }
  };

  const getActivityIcon = (type: StudyActivity['type']) => {
    switch (type) {
      case 'quiz':
        return <FileText className="h-4 w-4" />;
      case 'exam':
        return <Target className="h-4 w-4" />;
      case 'flashcards':
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: StudyActivity['type']) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exam':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'flashcards':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getDifficultyColor = (difficulty: StudyActivity['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
    }
  };

  const formatWeekRange = () => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0f6cbf] to-[#0d5aa7] rounded-xl flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Study Schedule</h2>
              <p className="text-sm text-gray-500">AI-powered learning calendar</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div className="text-center min-w-[200px]">
              <div className="text-lg font-semibold text-gray-900">{formatWeekRange()}</div>
              <div className="text-xs text-gray-500">Week View</div>
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="hidden md:grid grid-cols-7 border-b border-gray-100">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={day} className="px-4 py-3 text-center">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</div>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-0">
        {weekSchedule.map((day, dayIndex) => {
          const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNumber = day.date.getDate();
          const dayActivities = day.activities;
          const completedCount = dayActivities.filter(a => a.completed).length;
          const totalCount = dayActivities.length;
          const dayProgress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
          const today = isToday(day.date);

          return (
            <div
              key={dayIndex}
              className={`min-h-[160px] md:border-r border-gray-100 last:border-r-0 p-3 rounded-lg md:rounded-none ${
                today ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50/50'
              } transition-colors border md:border-0`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${today 
                      ? 'bg-[#0f6cbf] text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}>
                    {dayNumber}
                  </div>
                  <div className="md:hidden text-sm font-medium text-gray-700">
                    {dayName}
                  </div>
                </div>
                {totalCount > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      dayProgress === 100 ? 'bg-green-500' : 
                      dayProgress > 0 ? 'bg-orange-400' : 'bg-gray-300'
                    }`} />
                    <span className="text-xs text-gray-500">{completedCount}/{totalCount}</span>
                  </div>
                )}
              </div>

              {/* Activities */}
              <div className="space-y-2">
                {dayActivities.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-6">
                    No activities
                  </div>
                ) : (
                  dayActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`
                        group relative rounded-lg p-2.5 cursor-pointer transition-all duration-200
                        ${activity.completed 
                          ? 'bg-gray-50 border border-gray-200 opacity-75' 
                          : 'bg-white border border-gray-200 hover:border-[#0f6cbf] hover:shadow-sm'
                        }
                      `}
                      onClick={() => handleActivityClick(activity)}
                    >
                      {/* Activity Type Indicator */}
                      <div className={`
                        absolute left-0 top-0 bottom-0 w-1 rounded-l-lg
                        ${activity.type === 'quiz' ? 'bg-blue-500' : 
                          activity.type === 'exam' ? 'bg-orange-500' : 'bg-purple-500'}
                      `} />
                      
                      <div className="ml-2">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-1">
                            <div className={`
                              w-4 h-4 rounded flex items-center justify-center
                              ${activity.type === 'quiz' ? 'bg-blue-100 text-blue-600' : 
                                activity.type === 'exam' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}
                            `}>
                              <div className="scale-75">{getActivityIcon(activity.type)}</div>
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                              {activity.type === 'quiz' ? 'Quiz' : 
                               activity.type === 'exam' ? 'Exam' : 'Cards'}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActivityComplete(dayIndex, activity.id);
                            }}
                            className={`
                              w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
                              ${activity.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                              }
                            `}
                          >
                            {activity.completed && <CheckCircle className="h-2.5 w-2.5" />}
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-1 line-clamp-1">
                          {activity.materialTitle}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-500">{activity.duration}min</span>
                            <div className={`
                              px-1.5 py-0.5 rounded text-xs font-medium
                              ${activity.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                activity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'}
                            `}>
                              {activity.difficulty}
                            </div>
                          </div>
                        </div>

                        {activity.completed && (
                          <div className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Summary Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0f6cbf] to-[#0d5aa7] rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Weekly Progress</div>
              <div className="text-xs text-gray-500">
                {weekSchedule.flatMap(d => d.activities).filter(a => a.completed).length} of{' '}
                {weekSchedule.flatMap(d => d.activities).length} activities completed
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Quiz</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Exam</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Cards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyCalendar;