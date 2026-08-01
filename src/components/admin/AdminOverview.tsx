import { useEffect, useState } from 'react';
import {
  fetchProfiles, fetchEventProposals, fetchServicePosts,
} from '@/lib/supabaseData';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users, UserCheck, Clock, CalendarCheck, ShieldAlert, CalendarClock,
} from 'lucide-react';

export function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0, active: 0, hours: 0, conducted: 0, pending: 0, upcoming: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [profiles, proposals, services] = await Promise.all([
          fetchProfiles(), fetchEventProposals(), fetchServicePosts(),
        ]);
        const vols = profiles.filter(p => p.role === 'volunteer');
        const today = new Date().setHours(0, 0, 0, 0);
        setStats({
          total: vols.length,
          active: vols.filter(v => !v.is_inactive).length,
          hours: vols.reduce((s, v) => s + Number(v.total_hours || 0), 0),
          conducted: proposals.filter(p => p.status === 'completed').length,
          pending: services.filter(s => s.status === 'pending').length,
          upcoming: proposals.filter(p => p.status === 'approved' && p.proposed_date && new Date(p.proposed_date).setHours(0, 0, 0, 0) >= today).length,
        });
      } catch { /* ignore */ }
    })();
  }, []);

  const cards = [
    { label: 'Total Volunteers', value: stats.total, icon: Users, tone: 'text-primary bg-primary/10' },
    { label: 'Active Volunteers', value: stats.active, icon: UserCheck, tone: 'text-success bg-success/10' },
    { label: 'Total Service Hours', value: `${stats.hours}h`, icon: Clock, tone: 'text-primary bg-primary/10' },
    { label: 'Events Conducted', value: stats.conducted, icon: CalendarCheck, tone: 'text-success bg-success/10' },
    { label: 'Pending Verifications', value: stats.pending, icon: ShieldAlert, tone: 'text-warning bg-warning/10' },
    { label: 'Upcoming Events', value: stats.upcoming, icon: CalendarClock, tone: 'text-primary bg-primary/10' },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(c => (
        <Card key={c.label}>
          <CardContent className="flex items-center gap-4 py-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
