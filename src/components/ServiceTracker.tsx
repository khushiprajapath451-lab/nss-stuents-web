import { NSS_HOURS_GOAL } from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Target } from 'lucide-react';

interface ServiceTrackerProps {
  user: { totalHours: number };
}

export function ServiceTracker({ user }: ServiceTrackerProps) {
  const progress = Math.min((user.totalHours / NSS_HOURS_GOAL) * 100, 100);
  const isEligible = user.totalHours >= NSS_HOURS_GOAL;

  return (
    <Card className={isEligible ? 'border-success/30 bg-success/5' : ''}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          NSS 240-Hour Service Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {user.totalHours} / {NSS_HOURS_GOAL} Hours Completed
            </span>
          </div>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3" />
        {isEligible ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <CheckCircle className="h-5 w-5 text-success" />
            <span className="text-sm font-semibold text-success">
              🎉 Eligible for University NSS Certificate
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Complete {NSS_HOURS_GOAL - user.totalHours} more hours to become eligible for the University NSS Certificate.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
