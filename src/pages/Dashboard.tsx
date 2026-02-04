import { User } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyRecord } from '@/components/MyRecord';
import { ProposeEvent } from '@/components/ProposeEvent';
import { CalendarLeaders } from '@/components/CalendarLeaders';
import { User as UserIcon, Lightbulb, Calendar, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display">
                Welcome, {user.name.split(' ')[0]}!
              </h1>
              {user.role === 'head' && (
                <Badge className="bg-primary/20 text-primary border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  NSS Head
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Track your volunteer activities and make a difference.
            </p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="record" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="record" className="gap-2 py-3 data-[state=active]:shadow-soft">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">My Record</span>
              <span className="sm:hidden">Record</span>
            </TabsTrigger>
            <TabsTrigger value="propose" className="gap-2 py-3 data-[state=active]:shadow-soft">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Propose Event</span>
              <span className="sm:hidden">Propose</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2 py-3 data-[state=active]:shadow-soft">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar & Leaders</span>
              <span className="sm:hidden">Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-6">
            <MyRecord user={user} />
          </TabsContent>

          <TabsContent value="propose" className="mt-6">
            <ProposeEvent user={user} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarLeaders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
