import { useEffect, useState } from 'react';
import { fetchProfiles, dbProfileToUser, getVolunteerStage, NSS_HOURS_GOAL } from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search } from 'lucide-react';

export function AdminVolunteerManagement() {
  const [volunteers, setVolunteers] = useState<ReturnType<typeof dbProfileToUser>[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchProfiles()
      .then(ps => setVolunteers(ps.filter(p => p.role === 'volunteer').map(dbProfileToUser)))
      .catch(() => {});
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = volunteers.filter(v =>
    !q || v.name.toLowerCase().includes(q) || v.rollNumber.toLowerCase().includes(q) ||
    v.branch.toLowerCase().includes(q) || v.section.toLowerCase().includes(q)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" /> Volunteer Management
        </CardTitle>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, roll number, department..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No volunteers found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Sem</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="w-40">NSS Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(v => {
                const stage = getVolunteerStage(v.rewardPoints);
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{v.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{v.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                    <TableCell>{v.branch}-{v.section}</TableCell>
                    <TableCell>{v.semester}</TableCell>
                    <TableCell className="text-right font-medium">{v.totalHours}h</TableCell>
                    <TableCell className="text-right font-bold text-primary">{v.rewardPoints}</TableCell>
                    <TableCell><Badge variant="outline" className="border-primary/30 text-primary">{stage.icon} {stage.name}</Badge></TableCell>
                    <TableCell>
                      <Progress value={Math.min((v.totalHours / NSS_HOURS_GOAL) * 100, 100)} className="h-2" />
                      <span className="text-xs text-muted-foreground">{v.totalHours}/{NSS_HOURS_GOAL}h</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
