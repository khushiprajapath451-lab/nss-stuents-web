import { eventProposals } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeEvents() {
  // Show approved + pending proposals
  const visibleEvents = eventProposals.filter((p) => p.status !== 'rejected');

  if (visibleEvents.length === 0) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground">Community events & activities</p>
          </div>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <h3 className="font-semibold text-lg text-muted-foreground">No events yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
              Login and propose events for the community!
            </p>
            <Link to="/auth" className="mt-4">
              <Button variant="outline" size="sm">Login to Propose</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Upcoming Events</h2>
            <p className="text-sm text-muted-foreground">{visibleEvents.length} event(s) available</p>
          </div>
        </div>
        <Link to="/auth">
          <Button variant="outline" size="sm" className="gap-1">
            <Sparkles className="h-3 w-3" /> Propose Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleEvents.map((event) => (
          <Card
            key={event.id}
            className={`group transition-all duration-300 hover:shadow-elevated overflow-hidden ${
              event.status === 'approved' ? 'border-success/30' : 'border-border'
            }`}
          >
            <div className={`h-1.5 w-full ${event.status === 'approved' ? 'bg-success' : 'bg-primary/40'}`} />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
                <Badge className={event.status === 'approved' ? 'bg-success text-success-foreground' : 'bg-primary/20 text-primary border-0'}>
                  {event.status === 'approved' ? '✓ Approved' : '⏳ Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(event.proposedDate).toLocaleDateString('en-IN', {
                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  {event.proposedBy}
                </div>
              </div>
              <div className="pt-2 border-t border-border/50">
                <Link to="/auth">
                  <Button size="sm" className="w-full gap-1 shadow-glow">
                    Login to Participate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
