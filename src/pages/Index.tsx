import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UrgentPosts } from '@/components/UrgentPosts';
import { events, leaderboard, badgeInfo } from '@/lib/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Users,
  Calendar,
  Award,
  Heart,
  Sparkles,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function Index() {
  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  const topVolunteer = leaderboard[0];

  const stats = [
    { label: 'Active Volunteers', value: '150+', icon: Users },
    { label: 'Events This Year', value: '45', icon: Calendar },
    { label: 'Service Hours', value: '2,500+', icon: Clock },
    { label: 'Lives Impacted', value: '5,000+', icon: Heart },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6bTAgLTEwdjZoLTZ2LTZoNnptLTEwIDEwdjZoLTZ2LTZoNnptMCAxMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl space-y-6 animate-fade-in">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              National Service Scheme
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-white leading-tight">
              Make a Difference,
              <br />
              One Step at a Time
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              Join Vardhaman's NSS community. Track your volunteer hours, participate in events,
              and contribute to society while earning recognition.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="group hover:shadow-soft transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Urgent Posts */}
      <div className="container">
        <UrgentPosts />
      </div>

      {/* Upcoming Events + Top Volunteer */}
      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Upcoming Events */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Upcoming Events</h2>
                  <p className="text-sm text-muted-foreground">Don't miss out</p>
                </div>
              </div>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-soft transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="capitalize">
                        {event.category.replace('_', ' ')}
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {new Date(event.date).getDate()}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Register
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Volunteer Spotlight */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">Top Volunteer</h2>
                <p className="text-sm text-muted-foreground">This month's star</p>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="hero-gradient p-6 text-center text-primary-foreground">
                <div className="mx-auto mb-3 relative">
                  <Avatar className="h-20 w-20 border-4 border-white/30 mx-auto">
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                      {topVolunteer?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold">{topVolunteer?.name}</h3>
                <p className="text-sm opacity-80">{topVolunteer?.totalHours} volunteer hours</p>
              </div>
              <CardContent className="pt-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {topVolunteer?.badges.slice(0, 3).map((badge) => {
                    const info = badgeInfo[badge];
                    return (
                      <span key={badge} className="text-2xl" title={info?.name}>
                        {info?.icon}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Events attended</span>
                  <span className="font-semibold">{topVolunteer?.eventsAttended}</span>
                </div>
                <Link to="/dashboard" className="block mt-4">
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="h-4 w-4" />
                    View Leaderboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-16">
        <Card className="overflow-hidden">
          <div className="hero-gradient p-8 sm:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-6">
              Join the Vardhaman NSS family and be part of something bigger than yourself.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                Join NSS Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
