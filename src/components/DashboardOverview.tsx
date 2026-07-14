import { useState, useEffect } from 'react';
import {
  fetchAttendanceRecords, fetchEventProposals, fetchProfile,
  DbAttendanceRecord, DbEventProposal, badgeInfo,
  CLAIM_WINDOW_HOURS, NSS_HOURS_GOAL,
} from '@/lib/supabaseData';
import { EligibleEventsClaim } from '@/components/EligibleEventsClaim';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Clock, Target, Award, Calendar, MapPin, Flame, Trophy, Lock, CheckCircle2,
} from 'lucide-react';

interface DashboardOverviewProps {
  user: any;
}

const stages = [
  { name: 'Starter', points: 0, icon: '🌱' },
  { name: 'Volunteer', points: 50, icon: '🤝' },
  { name: 'Active Volunteer', points: 150, icon: '💪' },
  { name: 'Team Leader', points: 350, icon: '⭐' },
  { name: 'Active Champion', points: 700, icon: '🏆' },
];

const allBadgeKeys = ['blood_hero', 'eco_warrior', 'first_responder', 'community_star', 'mentor', 'leader', 'pioneer'];

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [, refresh] = useState(0);
  const [proposals, setProposals] = useState<DbEventProposal[]>([]);
  const [attendance, setAttendance] = useState<DbAttendanceRecord[]>([]);

  useEffect(() => {
    fetchEventProposals().then(setProposals).catch(() => {});
    fetchAttendanceRecords().then(setAttendance).catch(() => {});
    fetchProfile(user.id).then(profile => {
      user.totalHours = Number(profile.total_hours);
      user.eventsAttended = profile.events_attended;
      user.rewardPoints = profile.reward_points;
      user.badges = profile.badges || [];
      refresh(n => n + 1);
    }).catch(() => {});
  }, [user.id]);

  const hoursProgress = Math.min((user.totalHours / NSS_HOURS_GOAL) * 100, 100);
  const remaining = Math.max(NSS_HOURS_GOAL - user.totalHours, 0);

  // Upcoming events (approved / pending proposals with a future proposed_date)
  const now = Date.now();
  const upcoming = proposals
    .filter(p => p.status !== 'rejected' && p.proposed_date && new Date(p.proposed_date).getTime() >= now - 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(a.proposed_date!).getTime() - new Date(b.proposed_date!).getTime())
    .slice(0, 4);

  // Streak — based on claimed events sorted by event_date
  const claimed = attendance
    .filter(r => (r.claimed_by as Record<string, any>)[user.id])
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  const currentStreak = claimed.length;
  const longestStreak = Math.max(currentStreak, user.eventsAttended || 0);

  // Stage
  const points = user.rewardPoints || 0;
  const currentStageIdx = stages.reduce((acc, s, i) => (points >= s.points ? i : acc), 0);
  const currentStage = stages[currentStageIdx];
  const nextStage = stages[currentStageIdx + 1];
  const stageProgress = nextStage
    ? Math.min(((points - currentStage.points) / (nextStage.points - currentStage.points)) * 100, 100)
    : 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* A. Service Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Service Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user.totalHours} / {NSS_HOURS_GOAL} Hours Completed
              </span>
            </div>
            <span className="text-sm font-bold text-primary">{Math.round(hoursProgress)}%</span>
          </div>
          <Progress value={hoursProgress} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {remaining > 0
              ? `${remaining} more hours to reach the NSS 240-hour goal.`
              : '🎉 Goal reached — eligible for University NSS Certificate!'}
          </p>
        </CardContent>
      </Card>

      {/* F. Volunteer Stage / Level */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Volunteer Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {stages.map((s, i) => {
              const reached = i <= currentStageIdx;
              const isCurrent = i === currentStageIdx;
              return (
                <div key={s.name} className="flex flex-col items-center flex-1 min-w-[60px]">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-lg border-2 ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                        : reached
                          ? 'bg-primary/20 border-primary/40'
                          : 'bg-muted border-muted-foreground/20 opacity-50'
                    }`}
                  >
                    {s.icon}
                  </div>
                  <p className={`text-[10px] mt-1 text-center font-medium ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.name}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {points} pts • {currentStage.name}
              </span>
              {nextStage && (
                <span className="font-medium text-primary">
                  {nextStage.points - points} pts to {nextStage.name}
                </span>
              )}
            </div>
            <Progress value={stageProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* E. Participation Streak */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Participation Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <p className="text-xs text-muted-foreground">🔥 Current Streak</p>
              <p className="text-2xl font-bold font-display text-orange-600">{currentStreak} Events</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-muted-foreground">🏅 Longest Streak</p>
              <p className="text-2xl font-bold font-display text-primary">{longestStreak} Events</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Keep showing up — every event counts!</p>
        </CardContent>
      </Card>

      {/* D. Attendance Claim / Claimed Events */}
      <EligibleEventsClaim user={user} />

      {/* C. Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming events scheduled yet.
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((e) => (
                <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{e.title}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                      {e.proposed_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(e.proposed_date).toLocaleDateString()}
                        </span>
                      )}
                      {e.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{e.time}
                        </span>
                      )}
                      {e.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{e.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* B. Badges Earned */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {allBadgeKeys.map((key) => {
              const info = badgeInfo[key];
              const earned = (user.badges || []).includes(key);
              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                        earned
                          ? 'bg-primary/10 border-primary/30'
                          : 'bg-muted/50 border-muted opacity-50 grayscale'
                      }`}
                    >
                      <span className="text-xl">{earned ? info.icon : <Lock className="h-4 w-4" />}</span>
                      <span className="font-medium text-sm">{info.name}</span>
                      {earned && <CheckCircle2 className="h-3 w-3 text-primary" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{info.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
