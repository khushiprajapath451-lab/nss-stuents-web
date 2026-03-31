import { useState, useEffect } from 'react';
import {
  fetchServicePosts, createServicePost, createNotification,
  DbServicePost,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Heart, Plus, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface PostServiceProps {
  user: { id: string; name: string };
}

export function PostService({ user }: PostServiceProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [myPosts, setMyPosts] = useState<DbServicePost[]>([]);
  const [newPost, setNewPost] = useState({ title: '', description: '', date: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchServicePosts().then(all => {
      setMyPosts(all.filter(s => s.volunteer_id === user.id));
    }).catch(() => {});
  }, [user.id]);

  const handleSubmit = async () => {
    if (!newPost.title || !newPost.description || !newPost.date) {
      toast.error('Please fill in title, description, and date.');
      return;
    }
    try {
      const created = await createServicePost({
        volunteer_id: user.id,
        volunteer_name: user.name,
        title: newPost.title,
        description: newPost.description,
        date: newPost.date,
        photos: photoPreview ? [photoPreview] : [],
        status: 'pending',
        points_awarded: 0,
      });
      await createNotification({
        type: 'service',
        title: 'Service Post Submitted',
        message: `"${newPost.title}" is pending admin approval.`,
        user_id: user.id,
      });
      setMyPosts(prev => [created, ...prev]);
      setNewPost({ title: '', description: '', date: '' });
      setPhotoPreview(null);
      setDialogOpen(false);
      toast.success('Service post submitted! Awaiting admin approval.');
    } catch {
      toast.error('Failed to submit service post.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success/10 text-success border-0"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected': return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
      default: return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              My Service Posts
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Share your volunteer service stories</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-glow">
                <Plus className="h-4 w-4" /> Post Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Service</DialogTitle>
                <DialogDescription>Post about your completed volunteer service. It will appear on the Home Page after admin approval.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label>Service Title</Label>
                  <Input placeholder="e.g., Tree Planting Drive" value={newPost.title} onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what you did..." value={newPost.description} onChange={(e) => setNewPost(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Service</Label>
                  <Input type="date" value={newPost.date} onChange={(e) => setNewPost(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Photo (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPhotoPreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="mt-2 rounded-md max-h-40 object-cover w-full" />
                  )}
                </div>
                <Button onClick={handleSubmit} className="w-full">Submit Service Post</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      {myPosts.length > 0 && (
        <CardContent>
          <div className="space-y-3">
            {myPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {post.points_awarded > 0 && (
                    <Badge className="bg-warning/10 text-warning border-0 text-xs">+{post.points_awarded} pts</Badge>
                  )}
                  {getStatusBadge(post.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
