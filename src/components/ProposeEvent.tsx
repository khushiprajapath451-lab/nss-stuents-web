import { useState, useEffect } from 'react';
import {
  fetchEventProposals, createEventProposal, updateEventProposal,
  DbEventProposal,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { ThumbsUp, Plus, Trophy, Check, Clock, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ProposeEventProps {
  user: { id: string; name: string; role: string };
}

export function ProposeEvent({ user }: ProposeEventProps) {
  const [proposals, setProposals] = useState<DbEventProposal[]>([]);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', date: '', location: '', time: '' });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchEventProposals().then(setProposals).catch(() => {});
  }, []);

  const sortedProposals = [...proposals].sort((a, b) => b.votes - a.votes);

  const handleVote = async (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;
    const hasVoted = proposal.voters.includes(user.id);
    const newVoters = hasVoted
      ? proposal.voters.filter(v => v !== user.id)
      : [...proposal.voters, user.id];
    await updateEventProposal(proposalId, {
      votes: newVoters.length,
      voters: newVoters,
    });
    setProposals(prev => prev.map(p =>
      p.id === proposalId ? { ...p, votes: newVoters.length, voters: newVoters } : p
    ));
  };

  const handleSubmitProposal = async () => {
    if (!newProposal.title || !newProposal.description) {
      toast.error('Please fill in title and description');
      return;
    }
    try {
      const created = await createEventProposal({
        title: newProposal.title,
        description: newProposal.description,
        proposed_by: user.name,
        proposed_date: newProposal.date || null,
        location: newProposal.location || null,
        time: newProposal.time || null,
        votes: 1,
        voters: [user.id],
        status: 'pending',
      });
      setProposals(prev => [created, ...prev]);
      setNewProposal({ title: '', description: '', date: '', location: '', time: '' });
      setDialogOpen(false);
      toast.success('Proposal submitted successfully!');
    } catch {
      toast.error('Failed to submit proposal');
    }
  };

  const handleApprove = async (proposalId: string) => {
    await updateEventProposal(proposalId, { status: 'approved' });
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'approved' } : p));
    toast.success('Event approved!');
  };

  const handleReject = async (proposalId: string) => {
    await updateEventProposal(proposalId, { status: 'rejected' });
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected' } : p));
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
              <DialogDescription>Submit your event idea for the community to vote on.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="e.g., Blood Donation Camp" value={newProposal.title} onChange={(e) => setNewProposal(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the event and its objectives..." value={newProposal.description} onChange={(e) => setNewProposal(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Proposed Date</Label>
                <Input id="date" type="date" value={newProposal.date} onChange={(e) => setNewProposal(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={newProposal.time} onChange={(e) => setNewProposal(p => ({ ...p, time: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g., College Auditorium" value={newProposal.location} onChange={(e) => setNewProposal(p => ({ ...p, location: e.target.value }))} />
              </div>
              <Button onClick={handleSubmitProposal} className="w-full">Submit Proposal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                    {index === 0 && proposal.status === 'pending' && <span className="text-lg">🏆</span>}
                    <CardTitle className="text-base">{proposal.title}</CardTitle>
                  </div>
                  {getStatusBadge(proposal.status)}
                </div>
                <CardDescription className="line-clamp-2">{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>By {proposal.proposed_by}</p>
                    {proposal.proposed_date && <p>{new Date(proposal.proposed_date).toLocaleDateString()}</p>}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-success" onClick={() => handleApprove(proposal.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleReject(proposal.id)}>
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
