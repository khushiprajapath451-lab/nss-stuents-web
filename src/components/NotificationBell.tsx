import { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsRead, DbNotification } from '@/lib/supabaseData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell, Calendar, Heart, Gift, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<DbNotification[]>([]);

  useEffect(() => {
    fetchNotifications().then(setNotifs).catch(() => {});
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      markNotificationsRead().then(() => {
        setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4 text-primary" />;
      case 'service': return <Heart className="h-4 w-4 text-accent" />;
      case 'reward': return <Gift className="h-4 w-4 text-warning" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-urgent" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-urgent text-urgent-foreground text-xs flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
          ) : (
            notifs.slice(0, 20).map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 border-b border-border/50 hover:bg-muted/50 transition-colors">
                {getIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
