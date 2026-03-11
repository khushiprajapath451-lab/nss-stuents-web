import { useState } from 'react';
import { User } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareYourWorkProps {
  user: User;
}

export function ShareYourWork({ user }: ShareYourWorkProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [impact, setImpact] = useState('');

  const generateText = () => {
    return `Proud to contribute to community service through Campus Connect Hub NSS by participating in ${eventTitle || 'a volunteer activity'}. ${impact ? impact + ' ' : ''}#NSS #CommunityService #CampusConnectHub`;
  };

  const shareText = generateText();

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://nss-stuents-web.lovable.app')}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    toast.success('Opening LinkedIn...');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    toast.success('Opening Twitter/X...');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(shareText);
    toast.success('Post text copied! Paste it in your Instagram caption.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          Share Your Work
        </CardTitle>
        <p className="text-sm text-muted-foreground">Share your volunteer activities on social media.</p>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Create Shareable Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Work</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Event Title</Label>
                <Input
                  placeholder="e.g., Blood Donation Drive"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Impact / Achievement</Label>
                <Textarea
                  placeholder="e.g., Helped 50+ students get health check-ups."
                  value={impact}
                  onChange={e => setImpact(e.target.value)}
                />
              </div>

              {/* Preview */}
              <div className="p-3 rounded-lg bg-muted/50 border text-sm">
                <p className="font-medium mb-1">Preview:</p>
                <p className="text-muted-foreground">{generateText()}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={shareToLinkedIn} className="text-sm">
                  LinkedIn
                </Button>
                <Button variant="outline" onClick={shareToTwitter} className="text-sm">
                  Twitter / X
                </Button>
                <Button variant="outline" onClick={shareToInstagram} className="text-sm">
                  Instagram
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
