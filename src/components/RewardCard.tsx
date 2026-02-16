import { User, rewardMilestones } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Star } from 'lucide-react';

interface RewardCardProps {
  user: User;
}

export function RewardCard({ user }: RewardCardProps) {
  const currentMilestone = rewardMilestones.filter((m) => user.rewardPoints >= m.points).pop();
  const nextMilestone = rewardMilestones.find((m) => user.rewardPoints < m.points);
  const progress = nextMilestone
    ? (user.rewardPoints / nextMilestone.points) * 100
    : 100;

  return (
    <Card className="border-warning/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gift className="h-5 w-5 text-warning" />
          Reward Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold font-display text-warning">{user.rewardPoints}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          {currentMilestone && (
            <Badge className="bg-warning/10 text-warning border-0 text-sm gap-1">
              {currentMilestone.icon} {currentMilestone.name}
            </Badge>
          )}
        </div>

        {nextMilestone && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{user.rewardPoints} pts</span>
              <span>{nextMilestone.points} pts — {nextMilestone.name}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-5 gap-1.5">
          {rewardMilestones.map((m) => {
            const reached = user.rewardPoints >= m.points;
            return (
              <div
                key={m.points}
                className={`flex flex-col items-center p-2 rounded-lg text-center transition-colors ${
                  reached ? 'bg-warning/10' : 'bg-muted/50 opacity-50'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className="text-[10px] font-medium mt-0.5 leading-tight">{m.name}</span>
                <span className="text-[9px] text-muted-foreground">{m.points}p</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
