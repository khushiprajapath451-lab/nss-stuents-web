import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyRecord } from '@/components/MyRecord';
import { ProposeEvent } from '@/components/ProposeEvent';
import { CalendarLeaders } from '@/components/CalendarLeaders';
import { AdminPanel } from '@/components/AdminPanel';
import { VolunteerProfile } from '@/components/VolunteerProfile';
import { InviteVolunteers } from '@/components/InviteVolunteers';
import { User as UserIcon, Lightbulb, Calendar, Crown, Shield, IdCard, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/App';
import type { DbProfile } from '@/lib/supabaseData';

interface DashboardProps {
  user: User;
  dbProfile: DbProfile;
}

export default function Dashboard({ user, dbProfile }: DashboardProps) {
  const isHead = user.role === 'head';
  const defaultTab = isHead ? 'propose' : 'record';

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display">
                Welcome, {user.name}!
              </h1>
              {isHead && (
                <Badge className="bg-primary/20 text-primary border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  NSS Head
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {isHead
                ? 'Manage volunteers, events, and track performance.'
                : `${user.branch}-${user.section} ${user.semester ? `Sem ${user.semester}` : ''} • Track your volunteer activities and make a difference.`}
            </p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className={`grid w-full h-auto p-1 ${isHead ? 'grid-cols-3' : 'grid-cols-5'}`}>
            {!isHead && (
              <TabsTrigger value="record" className="gap-2 py-3 data-[state=active]:shadow-soft">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">My Record</span>
                <span className="sm:hidden">Record</span>
              </TabsTrigger>
            )}
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
            {!isHead && (
              <TabsTrigger value="invite" className="gap-2 py-3 data-[state=active]:shadow-soft">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Invite</span>
                <span className="sm:hidden">Invite</span>
              </TabsTrigger>
            )}
            {!isHead && (
              <TabsTrigger value="profile" className="gap-2 py-3 data-[state=active]:shadow-soft">
                <IdCard className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
            )}
            {isHead && (
              <TabsTrigger value="admin" className="gap-2 py-3 data-[state=active]:shadow-soft">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Panel</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          {!isHead && (
            <TabsContent value="record" className="mt-6">
              <MyRecord user={user} />
            </TabsContent>
          )}
          <TabsContent value="propose" className="mt-6">
            <ProposeEvent user={user} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-6">
            <CalendarLeaders />
          </TabsContent>
          {!isHead && (
            <TabsContent value="invite" className="mt-6">
              <InviteVolunteers user={user} />
            </TabsContent>
          )}
          {!isHead && (
            <TabsContent value="profile" className="mt-6">
              <VolunteerProfile user={user} />
            </TabsContent>
          )}
          {isHead && (
            <TabsContent value="admin" className="mt-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
