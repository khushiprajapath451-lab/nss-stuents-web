import { useState } from 'react';
import { eventProposals, User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ThumbsUp, Plus, Trophy, Check, Clock, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ProposeEventProps {
  user: User;
}

export function ProposeEvent({ user }: ProposeEventProps) {
  const [proposals, setProposals] = useState(() => [...eventProposals]);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', date: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync local state with shared store on mount/re-render
  const syncProposals = (updated: typeof proposals) => {
    setProposals(updated);
    // Keep the shared array in sync so other components/users see changes
    eventProposals.length = 0;
    updated.forEach((p) => eventProposals.push(p));
  };

  const sortedProposals = [...proposals].sort((a, b) => b.votes - a.votes);
  const topProposal = sortedProposals[0];

  const handleVote = (proposalId: string) => {
    const updated = proposals.map((p) => {
      if (p.id === proposalId) {
        const hasVoted = p.voters.includes(user.id);
        return {
          ...p,
          votes: hasVoted ? p.votes - 1 : p.votes + 1,
          voters: hasVoted
            ? p.voters.filter((v) => v !== user.id)
            : [...p.voters, user.id],
        };
      }
      return p;
    });
    syncProposals(updated);
  };

  const handleSubmitProposal = () => {
    if (!newProposal.title || !newProposal.description || !newProposal.date) {
      toast.error('Please fill in all fields');
      return;
    }

    const proposal = {
      id: String(proposals.length + 1),
      title: newProposal.title,
      description: newProposal.description,
      proposedBy: user.name,
      proposedDate: newProposal.date,
      votes: 1,
      voters: [user.id],
      status: 'pending' as const,
    };

    syncProposals([...proposals, proposal]);
    setNewProposal({ title: '', description: '', date: '' });
    setDialogOpen(false);
    toast.success('Proposal submitted successfully!');
  };

  const handleApprove = (proposalId: string) => {
    syncProposals(proposals.map((p) => (p.id === proposalId ? { ...p, status: 'approved' as const } : p)));
    toast.success('Event approved!');
  };

  const handleReject = (proposalId: string) => {
    syncProposals(proposals.map((p) => (p.id === proposalId ? { ...p, status: 'rejected' as const } : p)));
    toast.info('Event rejected');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success text-success-foreground"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Create Proposal Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">All Proposals</h2>
          <p className="text-sm text-muted-foreground">Vote for events you want to see happen</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-glow">
              <Plus className="h-4 w-4" />
              Propose Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Propose a New Event</DialogTitle>
              <DialogDescription>
                Submit your event idea for the community to vote on.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Blood Donation Camp"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the event and its objectives..."
                  value={newProposal.description}
                  onChange={(e) => setNewProposal((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Proposed Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newProposal.date}
                  onChange={(e) => setNewProposal((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <Button onClick={handleSubmitProposal} className="w-full">
                Submit Proposal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Proposals List */}
      {sortedProposals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg text-muted-foreground">No events proposed yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
              Be the first to propose an event for the community. Click "Propose Event" above to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedProposals.map((proposal, index) => (
            <Card
              key={proposal.id}
              className={`transition-all hover:shadow-soft ${
                proposal.status === 'approved' ? 'border-success/30 bg-success/5' : ''
              } ${proposal.status === 'rejected' ? 'opacity-60' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && proposal.status === 'pending' && (
                      <span className="text-lg">🏆</span>
                    )}
                    <CardTitle className="text-base">{proposal.title}</CardTitle>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
                <CardDescription className="line-clamp-2">{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>By {proposal.proposedBy}</p>
                    <p>{new Date(proposal.proposedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.status === 'pending' && (
                      <Button
                        variant={proposal.voters.includes(user.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleVote(proposal.id)}
                        className="gap-1"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        {proposal.votes}
                      </Button>
                    )}
                    {user.role === 'head' && proposal.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success"
                          onClick={() => handleApprove(proposal.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleReject(proposal.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
