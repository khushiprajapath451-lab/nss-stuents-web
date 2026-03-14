import { useState, useEffect } from 'react';
import { User } from '@/lib/mockData';
import { ErpProfile, loadErpProfile, saveErpProfile, syncWithErp, isAttendanceEligible } from '@/lib/erpSync';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Link2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ErpProfileSyncProps {
  user: User;
}

export function ErpProfileSync({ user }: ErpProfileSyncProps) {
  const [erpProfile, setErpProfile] = useState<ErpProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [erpPassword, setErpPassword] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const saved = loadErpProfile(user.id);
    if (saved) {
      setErpProfile(saved);
      applyErpToUser(saved);
    }
  }, [user.id]);

  const applyErpToUser = (profile: ErpProfile) => {
    if (profile.branch && profile.branch !== 'Not available') user.branch = profile.branch;
    if (profile.section && profile.section !== 'Not available') user.section = profile.section;
    if (profile.semester) user.semester = profile.semester;
    if (profile.studentName) user.name = profile.studentName;
  };

  const handleSync = async () => {
    if (!erpPassword) {
      toast.error('Please enter your ERP password');
      return;
    }
    setIsSyncing(true);
    const result = await syncWithErp(user.rollNumber, erpPassword);
    setIsSyncing(false);

    if (result.success && result.data) {
      setErpProfile(result.data);
      saveErpProfile(user.id, result.data);
      applyErpToUser(result.data);
      setDialogOpen(false);
      setErpPassword('');
      if (result.partial) {
        toast.info('Connected to ERP. Some fields may not be available.', { duration: 5000 });
      } else {
        toast.success('ERP synced! Profile updated with live data.');
      }
      window.dispatchEvent(new Event('yuvaseva-stats-updated'));
    } else {
      toast.error(result.error || 'Failed to sync with ERP');
    }
  };

  const attendanceStatus = isAttendanceEligible(erpProfile);
  const syncAge = erpProfile
    ? Math.round((Date.now() - new Date(erpProfile.syncedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            ERP Profile Sync
          </CardTitle>
          {erpProfile ? (
            <Badge className="bg-primary/20 text-primary border-0">
              <CheckCircle className="h-3 w-3 mr-1" />
              ERP Synced
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {erpProfile ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Branch</p>
                <p className="font-medium text-sm">{erpProfile.branch}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Section</p>
                <p className="font-medium text-sm">{erpProfile.section}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Academic Year</p>
                <p className="font-medium text-sm">{erpProfile.academicYear}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Attendance</p>
                <p className={`font-medium text-sm ${
                  erpProfile.attendance !== null
                    ? erpProfile.attendance >= 60 ? 'text-primary' : 'text-destructive'
                    : ''
                }`}>
                  {erpProfile.attendance !== null ? `${erpProfile.attendance}%` : 'N/A'}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-3 rounded-lg border ${
              attendanceStatus.eligible
                ? 'bg-primary/5 border-primary/20'
                : 'bg-destructive/5 border-destructive/20'
            }`}>
              {attendanceStatus.eligible ? (
                <CheckCircle className="h-4 w-4 text-primary shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
              )}
              <span className="text-sm">{attendanceStatus.message}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Last synced: {new Date(erpProfile.syncedAt).toLocaleDateString()}
                {syncAge !== null && syncAge > 7 && ' (outdated)'}
              </span>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <RefreshCw className="h-3 w-3" /> Re-sync
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Re-sync ERP Profile</DialogTitle>
                    <DialogDescription>Enter your Vardhaman ERP password to refresh.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Roll Number</Label>
                      <Input value={user.rollNumber} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>ERP Password</Label>
                      <Input type="password" placeholder="Your ERP password" value={erpPassword} onChange={(e) => setErpPassword(e.target.value)} />
                    </div>
                    <Button onClick={handleSync} disabled={isSyncing} className="w-full">
                      {isSyncing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Syncing...</> : 'Sync Now'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Connect your Vardhaman ERP to auto-fill branch, section, year, and attendance.
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Link2 className="h-4 w-4" /> Connect ERP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Vardhaman ERP</DialogTitle>
                  <DialogDescription>Your password is used only to fetch profile data. It is not stored.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Roll Number</Label>
                    <Input value={user.rollNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>ERP Password</Label>
                    <Input type="password" placeholder="Your ERP password" value={erpPassword} onChange={(e) => setErpPassword(e.target.value)} />
                  </div>
                  <Button onClick={handleSync} disabled={isSyncing} className="w-full">
                    {isSyncing ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Connecting...</> : 'Connect & Sync'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
}
