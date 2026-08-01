import { useEffect, useState } from 'react';
import {
  fetchServicePosts, updateServicePost, fetchProfile, updateProfile, createNotification,
  DbServicePost, POINTS, getVolunteerStage,
} from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function AdminServiceVerification() {
  const [posts, setPosts] = useState<DbServicePost[]>([]);
  const [hours, setHours] = useState<Record<string, string>>({});

  const load = async () => {
    try { setPosts(await fetchServicePosts()); } catch { /* ignore */ }
  };
  useEffect(() => { load(); }, []);

  const pending = posts.filter(p => p.status === 'pending');
  const reviewed = posts.filter(p => p.status !== 'pending');

  const approve = async (post: DbServicePost) => {
    const hrs = Number(hours[post.id] ?? post.hours_requested ?? 0);
    try {
      await updateServicePost(post.id, {
        status: 'approved',
        points_awarded: POINTS.SERVICE_POST_APPROVED,
        hours_requested: hrs,
      });
      const profile = await fetchProfile(post.volunteer_id);
      const newPoints = profile.reward_points + POINTS.SERVICE_POST_APPROVED;
      await updateProfile(post.volunteer_id, {
        reward_points: newPoints,
        total_hours: Number(profile.total_hours) + hrs,
        activities_completed: profile.activities_completed + 1,
      });
      const stage = getVolunteerStage(newPoints);
      await createNotification({
        type: 'service', title: 'Service Verified',
        message: `"${post.title}" approved: +${hrs}h and +${POINTS.SERVICE_POST_APPROVED} points. Level: ${stage.name}.`,
        user_id: post.volunteer_id,
      });
      toast.success(`Approved — ${post.volunteer_name} earned ${hrs}h and ${POINTS.SERVICE_POST_APPROVED} points.`);
      load();
    } catch { toast.error('Could not approve this submission.'); }
  };

  const reject = async (post: DbServicePost) => {
    await updateServicePost(post.id, { status: 'rejected' });
    await createNotification({
      type: 'service', title: 'Service Rejected',
      message: `"${post.title}" was not approved.`, user_id: post.volunteer_id,
    });
    toast.info('Submission rejected.');
    load();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" /> Service Verification
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Approving credits service hours and {POINTS.SERVICE_POST_APPROVED} reward points automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No submissions awaiting verification.</p>
          ) : pending.map(post => (
            <div key={post.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="flex-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {post.volunteer_name} • {new Date(post.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{post.description}</p>
                </div>
                {post.photos?.[0] && (
                  <img src={post.photos[0]} alt={`Proof for ${post.title}`} className="h-24 w-32 rounded-lg object-cover" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Hours</span>
                <Input
                  type="number" min={0} className="w-24 h-9"
                  value={hours[post.id] ?? String(post.hours_requested ?? 0)}
                  onChange={e => setHours(p => ({ ...p, [post.id]: e.target.value }))}
                />
                <Button size="sm" className="gap-1" onClick={() => approve(post)}><Check className="h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={() => reject(post)}><X className="h-4 w-4" /> Reject</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Verification History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {reviewed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No verified submissions yet.</p>
          ) : reviewed.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <div>
                <p className="font-medium text-sm">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.volunteer_name} • {new Date(p.date).toLocaleDateString()}</p>
              </div>
              {p.status === 'approved'
                ? <Badge className="bg-success/15 text-success border-0">+{p.hours_requested ?? 0}h • +{p.points_awarded} pts</Badge>
                : <Badge variant="outline" className="text-destructive border-destructive/40">Rejected</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
