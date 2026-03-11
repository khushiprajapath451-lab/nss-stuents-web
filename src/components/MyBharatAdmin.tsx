import { users } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export function MyBharatAdmin() {
  const volunteers = users.filter(u => u.role === 'volunteer');
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  const handleVerify = (userId: string, name: string) => {
    setVerified(prev => ({ ...prev, [userId]: true }));
    toast.success(`${name}'s MyBharat registration verified.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">MyBharat Volunteers List</CardTitle>
        <p className="text-sm text-muted-foreground">Verify volunteer MyBharat registrations.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.name}</TableCell>
                <TableCell className="text-muted-foreground">{v.rollNumber}</TableCell>
                <TableCell>{v.branch}</TableCell>
                <TableCell>{v.section}</TableCell>
                <TableCell>
                  {verified[v.id] ? (
                    <Badge className="bg-success/20 text-success border-0">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      <XCircle className="h-3 w-3 mr-1" /> Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={verified[v.id] ? 'outline' : 'default'}
                    disabled={verified[v.id]}
                    onClick={() => handleVerify(v.id, v.name)}
                  >
                    {verified[v.id] ? 'Verified' : 'Verify'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
