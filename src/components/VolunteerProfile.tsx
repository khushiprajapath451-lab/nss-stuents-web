import { useEffect, useState } from 'react';
import { User, badgeInfo, certificates as globalCerts } from '@/lib/mockData';
import { fetchCertificates, DbCertificate } from '@/lib/supabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ErpProfileSync } from '@/components/ErpProfileSync';
import { MyBharatTracking } from '@/components/MyBharatTracking';
import { SocialInternship } from '@/components/SocialInternship';
import { PreviousEvents } from '@/components/PreviousEvents';
import { PostService } from '@/components/PostService';
import {
  User as UserIcon, BookOpen, Clock, Calendar, Award, Trophy, GraduationCap, Hash,
} from 'lucide-react';

interface VolunteerProfileProps {
  user: User;
}

export function VolunteerProfile({ user }: VolunteerProfileProps) {
  const userCerts = user.certificates ?? globalCerts;

  const stats = [
    { label: 'Total NSS Hours', value: user.totalHours, icon: Clock, color: 'text-primary' },
    { label: 'Events Participated', value: user.eventsAttended, icon: Calendar, color: 'text-primary' },
    { label: 'Reward Points', value: user.rewardPoints, icon: Trophy, color: 'text-primary' },
    { label: 'Certificates', value: userCerts.length, icon: Award, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ERP Profile Sync */}
      <ErpProfileSync user={user} />

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold font-display">{user.name}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  {user.rollNumber}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {user.branch} - {user.section}
                </span>
                {user.semester && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Semester {user.semester}
                  </span>
                )}
              </div>
            </div>
            <Badge className="bg-primary/20 text-primary border-0">
              <UserIcon className="h-3 w-3 mr-1" />
              {user.role === 'head' ? 'NSS Head' : 'Volunteer'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="group hover:shadow-soft transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold font-display text-primary">{stat.value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Badges Achieved
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.badges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.badges.map((badge) => {
                const info = badgeInfo[badge];
                return (
                  <Tooltip key={badge}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
                        <span className="text-xl">{info?.icon}</span>
                        <span className="font-medium text-sm">{info?.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{info?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No badges earned yet. Participate in events to earn badges!</p>
          )}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Certificates Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userCerts.length > 0 ? (
            <div className="space-y-3">
              {userCerts.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium">{cert.eventName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cert.date).toLocaleDateString()} • {cert.hours}h
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">{cert.type}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No certificates earned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
