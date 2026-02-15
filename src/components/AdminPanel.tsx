import { useState } from 'react';
import { users, events, User, ACTIVITY_GOAL, attendanceRecords, AttendanceRecord, eventProposals } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Shield, Trophy, Users as UsersIcon, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const volunteers = users.filter((u) => u.role === 'volunteer');
  // Approved proposals become available events for roll call
  const approvedEvents = eventProposals.filter((p) => p.status === 'approved');

  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  
  const [warnings, setWarnings] = useState<Record<string, number>>({});
  const [expelled, setExpelled] = useState<Record<string, boolean>>({});

  const toggleAttendance = (userId: string) => {
    setAttendance((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const issueWarning = (userId: string, userName: string) => {
    setWarnings((prev) => {
      const current = prev[userId] || 0;
      const next = current + 1;
      if (next >= 2) {
        setExpelled((ep) => ({ ...ep, [userId]: true }));
        toast.error(`${userName} has been expelled from NSS after 2 warnings.`);
      } else {
        toast.warning(`Warning ${next}/2 issued to ${userName}. One more and they will be expelled.`);
      }
      return { ...prev, [userId]: next };
    });
  };

  const handleSaveAttendance = () => {
    const attendedCount = Object.values(attendance).filter(Boolean).length;
    if (!selectedEvent) {
      toast.error('Please select an event first.');
      return;
    }
    const event = approvedEvents.find((e) => e.id === selectedEvent);
    if (event) {
      const presentIds = Object.entries(attendance)
        .filter(([, present]) => present)
        .map(([id]) => id);
      attendanceRecords.push({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.proposedDate,
        markedAt: new Date().toISOString(),
        presentVolunteerIds: presentIds,
        claimedBy: {},
      });
    }
    toast.success(`Roll call saved: ${attendedCount} volunteer(s) marked present. They can now claim this event within 24 hours.`);
    setAttendance({});
    setSelectedEvent('');
  };

  // Sort volunteers by activities completed (descending) for the 180-activity race
  const sortedByActivities = [...volunteers].sort(
    (a, b) => b.activitiesCompleted - a.activitiesCompleted
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">YuvaSeva Admin Panel</h3>
            <p className="text-sm text-muted-foreground">
              Track activity race to {ACTIVITY_GOAL}, manage attendance, and handle expulsions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 180 Activity Race Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Activity Race — First to {ACTIVITY_GOAL} Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedByActivities.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">No volunteers yet.</p>
          ) : (
            <div className="space-y-4">
              {sortedByActivities.map((v, idx) => {
                const progress = Math.min((v.activitiesCompleted / ACTIVITY_GOAL) * 100, 100);
                const isCompleted = v.activitiesCompleted >= ACTIVITY_GOAL;
                return (
                  <div key={v.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">#{idx + 1}</span>
                        <span className="font-medium">{v.name}</span>
                        <span className="text-muted-foreground">({v.rollNumber})</span>
                        {isCompleted && (
                          <Badge className="bg-primary/20 text-primary border-0 text-xs">
                            🏆 Goal Reached!
                          </Badge>
                        )}
                        {expelled[v.id] && (
                          <Badge variant="destructive" className="text-xs">Expelled</Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        {v.activitiesCompleted} / {ACTIVITY_GOAL}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expulsion Management — 2-Chance System */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Inactivity & Expulsion (2-Chance System)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Volunteers who don't attend or organize an event within 1 week get a warning. After 2 warnings they are expelled.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => {
                const w = warnings[v.id] || 0;
                const isExpelled = expelled[v.id] || false;
                return (
                  <TableRow key={v.id} className={isExpelled ? 'bg-destructive/5 opacity-60' : w > 0 ? 'bg-warning/5' : ''}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {[0, 1].map((i) => (
                          <div
                            key={i}
                            className={`h-3 w-3 rounded-full ${i < w ? 'bg-destructive' : 'bg-muted'}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isExpelled ? (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Expelled
                        </Badge>
                      ) : w > 0 ? (
                        <Badge className="bg-warning/20 text-warning border-0">
                          Warning {w}/2
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-primary border-primary/30">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isExpelled}
                        onClick={() => issueWarning(v.id, v.name)}
                      >
                        {isExpelled ? 'Expelled' : `Issue Warning (${w}/2)`}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mark Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
            Roll Call — Mark Attendance
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select an event and mark volunteers present. Marked volunteers can add events to their record.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {approvedEvents.length === 0 ? (
                <SelectItem value="none" disabled>No approved events available</SelectItem>
              ) : (
                approvedEvents.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.title} — {new Date(e.proposedDate).toLocaleDateString()}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Always show volunteer list */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Present</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id} className={attendance[v.id] ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={!!attendance[v.id]}
                      onCheckedChange={() => toggleAttendance(v.id)}
                      disabled={!selectedEvent}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                  <TableCell>
                    {attendance[v.id] ? (
                      <Badge className="bg-primary/20 text-primary border-0">Present</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Absent</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!selectedEvent && (
            <p className="text-sm text-muted-foreground text-center">Select an event above to mark attendance.</p>
          )}

          {selectedEvent && (
            <Button onClick={handleSaveAttendance} className="shadow-glow">
              Save Attendance ({Object.values(attendance).filter(Boolean).length} present)
            </Button>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
