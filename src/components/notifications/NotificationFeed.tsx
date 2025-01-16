import { useEffect, useState, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

export function NotificationFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  // Keep track of recently shown notifications to prevent duplicates
  const recentNotifications = new Set<string>();

  const handleNewNotification = useCallback((log: any) => {
    // Create a unique key for deduplication
    const notificationKey = `${log.level}-${log.message}`;
    
    // Check if this is a duplicate notification within the last 5 seconds
    if (recentNotifications.has(notificationKey)) {
      return;
    }

    // Only show critical notifications
    if (log.level === 'error' || 
        (log.level === 'warning' && log.message.includes('critical')) ||
        (log.level === 'info' && (
          log.message.includes('initialized') || 
          log.message.includes('completed')
        ))) {
      
      // Add to recent notifications and remove after 5 seconds
      recentNotifications.add(notificationKey);
      setTimeout(() => {
        recentNotifications.delete(notificationKey);
      }, 5000);

      // Add new notification
      setNotifications(prev => [{
        id: log.id,
        type: log.level as 'success' | 'error' | 'warning' | 'info',
        message: log.message,
        timestamp: new Date(log.timestamp)
      }, ...prev].slice(0, 10)); // Keep only last 10 notifications

      // Show toast for errors and critical warnings
      if (log.level === 'error' || (log.level === 'warning' && log.message.includes('critical'))) {
        toast({
          variant: log.level === 'error' ? 'destructive' : 'warning',
          title: log.level === 'error' ? 'Error' : 'Warning',
          description: log.message,
        });
      }

      // Log to console for debugging
      console.log(`🔔 New ${log.level} notification:`, log.message);
    }
  }, [toast]);

  useEffect(() => {
    console.log('🎯 Setting up notification feed subscription');
    
    const channel = supabase
      .channel('debug-logs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_logs'
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up notification feed subscription');
      supabase.removeChannel(channel);
    };
  }, [handleNewNotification]);

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
                    <Badge 
                      variant={
                        notification.type === 'error' ? 'destructive' : 
                        notification.type === 'warning' ? 'default' : 
                        notification.type === 'success' ? 'secondary' : 
                        'outline'
                      } 
                      className="text-xs"
                    >
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
