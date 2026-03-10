import { useState, useMemo } from 'react';
import { events, leaderboard, badgeInfo } from '@/lib/mockData';
import { getEventsForDate, getEventDatesForMonth, CalendarEvent } from '@/lib/calendarEvents';
import { VolunteerLeaderboard } from '@/components/VolunteerLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  Trophy,
  Medal,
  ChevronRight,
  Star,
  Lightbulb,
} from 'lucide-react';

export function CalendarLeaders() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [popupDate, setPopupDate] = useState<Date | null>(null);
  const [popupEvents, setPopupEvents] = useState<CalendarEvent[]>([]);

  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  const eventDates = events.map((e) => new Date(e.date));

  // Get awareness day dates for the currently viewed month
  const currentMonth = selectedDate || new Date();
  const awarenessDates = useMemo(
    () => getEventDatesForMonth(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth.getFullYear(), currentMonth.getMonth()]
  );

  // Combine system event dates + awareness dates
  const allHighlightDates = useMemo(() => {
    const combined = [...eventDates];
    for (const ad of awarenessDates) {
      if (!combined.some((d) => d.getDate() === ad.getDate() && d.getMonth() === ad.getMonth())) {
        combined.push(ad);
      }
    }
    return combined;
  }, [eventDates, awarenessDates]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        setPopupDate(date);
        setPopupEvents(dayEvents);
      }
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg';
      case 1:
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800';
      case 2:
        return 'bg-gradient-to-br from-amber-600 to-amber-700 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4" />;
      case 1:
        return <Medal className="h-4 w-4" />;
      case 2:
        return <Medal className="h-4 w-4" />;
      default:
        return <span className="text-xs font-bold">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Event Details Popup */}
      <Dialog open={!!popupDate} onOpenChange={(open) => !open && setPopupDate(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {popupDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </DialogTitle>
            <DialogDescription>
              {popupEvents.length} event{popupEvents.length > 1 ? 's' : ''} on this date
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {popupEvents.map((ev, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 p-4 space-y-2 hover:border-primary/30 transition-colors"
              >
                <h4 className="font-semibold text-base">{ev.name}</h4>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <p>{ev.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Next Event Highlight */}
      {nextEvent && (
        <Card className="overflow-hidden">
          <div className="hero-gradient p-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wide opacity-90">
                Next Event
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display mb-4">{nextEvent.title}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 opacity-80" />
                <span className="text-sm">
                  {new Date(nextEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-80" />
                <span className="text-sm">{nextEvent.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="text-sm">{nextEvent.location}</span>
              </div>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {nextEvent.attendees} / {nextEvent.maxAttendees} registered
                </span>
              </div>
              <Button className="gap-2 shadow-glow">
                Register Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Event Calendar
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Click on highlighted dates to see awareness days & activity ideas
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={{ event: allHighlightDates }}
              modifiersStyles={{
                event: {
                  backgroundColor: 'hsl(var(--primary) / 0.2)',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                },
              }}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Top 5 Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No data yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Leaderboard will update as volunteers participate</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.02] ${
                      index === 0 ? 'bg-primary/5 ring-1 ring-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${getRankStyle(index)}`}
                    >
                      {getRankIcon(index)}
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <span className="text-sm text-muted-foreground">
                        {user.totalHours}h • {user.eventsAttended} events
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {user.badges.slice(0, 3).map((badge) => {
                        const info = badgeInfo[badge];
                        return (
                          <Tooltip key={badge}>
                            <TooltipTrigger asChild>
                              <span className="text-lg cursor-default animate-badge-bounce">
                                {info?.icon}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{info?.name}</p>
                              <p className="text-xs text-muted-foreground">{info?.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming events</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Events will appear here once proposed and approved</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all"
                >
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-xs font-medium text-primary uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize hidden sm:inline-flex">
                    {event.category.replace('_', ' ')}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Volunteer Leaderboard */}
      <VolunteerLeaderboard />
    </div>
  );
}
