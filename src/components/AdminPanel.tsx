import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminEventManagement } from '@/components/admin/AdminEventManagement';
import { AdminVolunteerManagement } from '@/components/admin/AdminVolunteerManagement';
import { AdminServiceVerification } from '@/components/admin/AdminServiceVerification';
import { AdminAttendance } from '@/components/admin/AdminAttendance';
import { AdminCertificates } from '@/components/admin/AdminCertificates';
import { AdminAlerts } from '@/components/admin/AdminAlerts';
import { VolunteerLeaderboard } from '@/components/VolunteerLeaderboard';
import { InviteAnalytics } from '@/components/InviteAnalytics';
import { EventExpensePlanner } from '@/components/EventExpensePlanner';
import { MyBharatAdmin } from '@/components/MyBharatAdmin';
import { InternshipApprovals } from '@/components/InternshipApprovals';
import { Card, CardContent } from '@/components/ui/card';
import {
  LayoutDashboard, CalendarDays, Users, ShieldCheck, Trophy, CheckCircle, Award,
  ClipboardList, Globe, Briefcase, Link2, Megaphone, Shield,
} from 'lucide-react';

const tabs = [
  { value: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { value: 'events', label: 'Event Management', icon: CalendarDays },
  { value: 'volunteers', label: 'Volunteer Management', icon: Users },
  { value: 'verification', label: 'Service Verification', icon: ShieldCheck },
  { value: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { value: 'attendance', label: 'Attendance', icon: CheckCircle },
  { value: 'certificates', label: 'Certificates', icon: Award },
  { value: 'expenses', label: 'Expenses', icon: ClipboardList },
  { value: 'mybharat', label: 'MyBharat', icon: Globe },
  { value: 'internships', label: 'Internships', icon: Briefcase },
  { value: 'invites', label: 'Invites', icon: Link2 },
  { value: 'alerts', label: 'Alerts', icon: Megaphone },
];

export function AdminPanel() {
  return (
    <Tabs defaultValue="overview" className="space-y-6 animate-fade-in">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">NSS Admin Dashboard</h3>
            <p className="text-sm text-muted-foreground">Manage events, volunteers, verifications, attendance, and certificates.</p>
          </div>
        </CardContent>
      </Card>

      <TabsList className="flex w-full flex-wrap h-auto gap-1 p-1">
        {tabs.map(t => (
          <TabsTrigger key={t.value} value={t.value} className="gap-2 py-2.5 flex-1 min-w-[130px]">
            <t.icon className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{t.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="overview" className="space-y-6"><AdminOverview /></TabsContent>
      <TabsContent value="events" className="space-y-6"><AdminEventManagement /></TabsContent>
      <TabsContent value="volunteers" className="space-y-6"><AdminVolunteerManagement /></TabsContent>
      <TabsContent value="verification" className="space-y-6"><AdminServiceVerification /></TabsContent>
      <TabsContent value="leaderboard" className="space-y-6"><VolunteerLeaderboard /></TabsContent>
      <TabsContent value="attendance" className="space-y-6"><AdminAttendance /></TabsContent>
      <TabsContent value="certificates" className="space-y-6"><AdminCertificates /></TabsContent>
      <TabsContent value="expenses" className="space-y-6"><EventExpensePlanner /></TabsContent>
      <TabsContent value="mybharat" className="space-y-6"><MyBharatAdmin /></TabsContent>
      <TabsContent value="internships" className="space-y-6"><InternshipApprovals /></TabsContent>
      <TabsContent value="invites" className="space-y-6"><InviteAnalytics /></TabsContent>
      <TabsContent value="alerts" className="space-y-6"><AdminAlerts /></TabsContent>
    </Tabs>
  );
}
