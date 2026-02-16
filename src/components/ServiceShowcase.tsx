import { servicePosts } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, User, Image, Sparkles } from 'lucide-react';

export function ServiceShowcase() {
  const approvedPosts = servicePosts.filter((p) => p.status === 'approved');

  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Heart className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Volunteer Showcase</h2>
          <p className="text-sm text-muted-foreground">Inspiring service stories from our volunteers</p>
        </div>
      </div>

      {approvedPosts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg text-muted-foreground">No service posts yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
              Volunteers can share their service stories after logging in. Be the first to inspire!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvedPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:shadow-elevated">
              {post.photos.length > 0 && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {post.photos.length === 0 && (
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Image className="h-12 w-12 text-muted-foreground/30" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <Badge className="bg-success/10 text-success border-0 text-xs">
                    +{post.pointsAwarded} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.volunteerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
