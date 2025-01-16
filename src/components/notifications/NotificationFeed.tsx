import { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export function NotificationFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Subscribe to debug logs for critical events only
    const channel = supabase
      .channel('connection-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_logs'
        },
        (payload) => {
          if (payload.new) {
            const log = payload.new as any;
            // Only show critical notifications
            if (log.level === 'error' || 
                (log.level === 'warning' && log.message.includes('critical')) ||
                (log.level === 'info' && log.message.includes('initialized'))) {
              setNotifications(prev => [{
                id: log.id,
                type: log.level as 'success' | 'error' | 'warning' | 'info',
                message: log.message,
                timestamp: new Date(log.timestamp)
              }, ...prev].slice(0, 10)); // Keep only last 10 notifications
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="w-full max-w-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">System Notifications</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center">No critical notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-2 rounded-md bg-muted/50"
              >
                {getIcon(notification.type)}
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.timestamp.toLocaleTimeString()}
                    </Badge>
                    <Badge variant={notification.type} className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}