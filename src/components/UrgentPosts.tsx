import { urgentPosts } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Phone, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

  return (
    <section className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent/10">
          <AlertTriangle className="h-5 w-5 text-urgent" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Urgent Needs</h2>
          <p className="text-sm text-muted-foreground">Immediate help required</p>
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
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <Phone className="h-3 w-3" />
                  Contact
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
