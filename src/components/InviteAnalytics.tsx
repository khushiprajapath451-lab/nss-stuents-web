import { getTotalInviteStats } from '@/lib/inviteData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Users, TrendingUp, UserCheck } from 'lucide-react';

export function InviteAnalytics() {
  const stats = getTotalInviteStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{stats.totalInvited}</p>
              <p className="text-xs text-muted-foreground">Total Invited Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{stats.activeFromInvites}</p>
              <p className="text-xs text-muted-foreground">Active from Invites</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-foreground">{stats.topInviters.length}</p>
              <p className="text-xs text-muted-foreground">Active Inviters</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Inviters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Inviters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topInviters.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No invite activity yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Invites</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topInviters.map((entry, idx) => (
                  <TableRow key={entry.user!.id}>
                    <TableCell className="font-bold text-primary">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </TableCell>
                    <TableCell className="font-medium">{entry.user!.name}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.user!.rollNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.count} invites</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
