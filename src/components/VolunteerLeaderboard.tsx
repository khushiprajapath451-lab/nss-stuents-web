import { users } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';

export function VolunteerLeaderboard() {
  const volunteers = users
    .filter((u) => u.role === 'volunteer')
    .sort((a, b) => {
      if (b.rewardPoints !== a.rewardPoints) return b.rewardPoints - a.rewardPoints;
      return b.totalHours - a.totalHours;
    });

  const getMedal = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return String(rank + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Volunteer Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {volunteers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Trophy className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No volunteers yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="text-right">Service Hours</TableHead>
                <TableHead className="text-right">Reward Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v, i) => (
                <TableRow key={v.id} className={i < 3 ? 'bg-primary/5' : ''}>
                  <TableCell className="text-center text-lg">{getMedal(i)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {v.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{v.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                  <TableCell>{v.branch}-{v.section}</TableCell>
                  <TableCell className="text-right font-medium">{v.totalHours}h</TableCell>
                  <TableCell className="text-right font-bold text-primary">{v.rewardPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
