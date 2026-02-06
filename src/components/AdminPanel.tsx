import { useState } from 'react';
import { users, events, User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { AlertTriangle, CheckCircle, Clock, Shield, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const volunteers = users.filter((u) => u.role === 'volunteer');
  const upcomingEvents = events.filter((e) => e.status === 'upcoming');

  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [hours, setHours] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const toggleAttendance = (userId: string) => {
    setAttendance((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleHoursChange = (userId: string, value: string) => {
    setHours((prev) => ({ ...prev, [userId]: value }));
  };

  const toggleFlag = (userId: string) => {
    setFlagged((prev) => {
      const newState = { ...prev, [userId]: !prev[userId] };
      if (newState[userId]) {
        toast.warning('Volunteer flagged as inactive. Will be auto-removed after 7 days.');
      } else {
        toast.info('Inactive flag removed.');
      }
      return newState;
    });
  };

  const handleSaveAttendance = () => {
    const attendedCount = Object.values(attendance).filter(Boolean).length;
    if (!selectedEvent) {
      toast.error('Please select an event first.');
      return;
    }
    toast.success(`Attendance saved: ${attendedCount} volunteer(s) marked present.`);
  };

  const handleSaveHours = () => {
    const filled = Object.entries(hours).filter(([, v]) => v && Number(v) > 0);
    toast.success(`Hours updated for ${filled.length} volunteer(s).`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary">NSS Head Admin Panel</h3>
            <p className="text-sm text-muted-foreground">
              Mark attendance, assign hours, and manage volunteer status.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mark Attendance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {upcomingEvents.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.title} — {new Date(e.date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedEvent && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Present</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <Checkbox
                          checked={!!attendance[v.id]}
                          onCheckedChange={() => toggleAttendance(v.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleSaveAttendance} className="shadow-glow">
                Save Attendance
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Assign Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Assign Participation Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Current Hours</TableHead>
                <TableHead className="w-32">Add Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                  <TableCell>{v.totalHours}h</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      placeholder="0"
                      value={hours[v.id] || ''}
                      onChange={(e) => handleHoursChange(v.id, e.target.value)}
                      className="w-20"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleSaveHours} className="mt-4 shadow-glow">
            Save Hours
          </Button>
        </CardContent>
      </Card>

      {/* Flag Inactive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Flag Inactive Volunteers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Flagged volunteers will be auto-removed after 7 days of no activity.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.map((v) => (
                <TableRow key={v.id} className={flagged[v.id] ? 'bg-warning/5' : ''}>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                  <TableCell>{v.eventsAttended}</TableCell>
                  <TableCell>{v.totalHours}h</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={flagged[v.id] ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => toggleFlag(v.id)}
                    >
                      {flagged[v.id] ? (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flagged
                        </>
                      ) : (
                        'Flag Inactive'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
