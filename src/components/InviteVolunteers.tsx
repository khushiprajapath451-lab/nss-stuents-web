import { useState } from 'react';
import { User, users } from '@/lib/mockData';
import { getUserInviteCode, getInvitesByUser } from '@/lib/inviteData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Copy, Check, Link2, Users as UsersIcon } from 'lucide-react';
import { toast } from 'sonner';

interface InviteVolunteersProps {
  user: User;
}

export function InviteVolunteers({ user }: InviteVolunteersProps) {
  const [copied, setCopied] = useState(false);
  const inviteCode = getUserInviteCode(user.id);
  const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
  const myInvites = getInvitesByUser(user.id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('Invite link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Invite Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Invite Volunteers
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Share your invite link to earn 5 reward points per successful join.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-md border bg-muted text-sm text-muted-foreground truncate">
              {inviteLink}
            </div>
            <Button onClick={handleCopy} variant="outline" className="gap-2 shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold font-display text-primary">{myInvites.length}</p>
                <p className="text-xs text-muted-foreground">Total Invites</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-2xl font-bold font-display text-primary">{myInvites.length * 5}</p>
                <p className="text-xs text-muted-foreground">Points Earned</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Joined Volunteers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            Joined Volunteers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myInvites.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No one has joined through your link yet. Share it to earn points!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Joined At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myInvites.map((invite) => {
                  const invitedUser = users.find((u) => u.id === invite.invitedUserId);
                  return (
                    <TableRow key={invite.inviteCode + invite.invitedUserId}>
                      <TableCell className="font-medium">{invitedUser?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-muted-foreground">{invitedUser?.rollNumber || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {invite.joinedAt ? new Date(invite.joinedAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
