import { urgentPosts } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Phone, MapPin, Droplets, ChevronRight, HandHelping } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export function UrgentPosts() {
  const getUrgencyStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-urgent text-urgent-foreground animate-pulse-glow';
      case 'high':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  if (urgentPosts.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/10">
            <AlertTriangle className="h-5 w-5 text-urgent" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Urgent Alerts</h2>
            <p className="text-sm text-muted-foreground">Immediate help required — volunteer now!</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-muted/30">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground font-medium">No urgent alerts yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Alerts posted by admin will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/10">
          <AlertTriangle className="h-5 w-5 text-urgent" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Urgent Alerts</h2>
          <p className="text-sm text-muted-foreground">Immediate help required — volunteer now!</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {urgentPosts.map((post, index) => (
          <Card
            key={post.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-elevated ${
              post.urgencyLevel === 'critical' ? 'ring-2 ring-urgent/50' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {post.urgencyLevel === 'critical' && (
              <div className="absolute inset-0 bg-gradient-to-br from-urgent/5 to-transparent pointer-events-none" />
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge className={getUrgencyStyles(post.urgencyLevel)}>
                  {post.urgencyLevel.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.postedAt), { addSuffix: true })}
                </span>
              </div>
              <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>

              {/* Details */}
              <div className="space-y-1.5 text-sm">
                {post.personInNeed && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HandHelping className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{post.personInNeed}</span>
                  </div>
                )}
                {post.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </div>
                )}
                {post.bloodGroup && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-3.5 w-3.5 shrink-0 text-urgent" />
                    <span>Blood Group: <strong>{post.bloodGroup}</strong></span>
                  </div>
                )}
                {post.helpType && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{post.helpType}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground text-xs">
                    <Phone className="h-3 w-3" />
                    {post.contact}
                  </Button>
                  <Link to="/auth">
                    <Button size="sm" className="gap-1 bg-urgent hover:bg-urgent/90 text-urgent-foreground shadow-sm">
                      <HandHelping className="h-3 w-3" />
                      Volunteer
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
