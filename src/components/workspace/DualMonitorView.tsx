import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, GitBranch, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import type { DualMonitorState, GameState } from '@/types/agent';
import { WorkspaceContainer } from './WorkspaceContainer';

export function DualMonitorView() {
  const { toast } = useToast();
  const [monitorState, setMonitorState] = useState<DualMonitorState>({
    primary: {
      active: true,
      content: 'main',
      theme: 'tech'
    },
    secondary: {
      active: false,
      content: '',
      theme: 'adventure'
    },
    sync_status: 'synced'
  });

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    achievements: [],
    theme: 'adventure',
    avatar: {
      name: 'CodeExplorer',
      type: 'developer',
      level: 1
    }
  });

  useEffect(() => {
    const channel = supabase.channel('dual_monitor')
      .on('presence', { event: 'sync' }, () => {
        console.log('Monitor states synced');
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        toast({
          title: 'Monitor Connected',
          description: 'Secondary monitor is now active',
        });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [toast]);

  const toggleSecondaryMonitor = () => {
    setMonitorState(prev => ({
      ...prev,
      secondary: {
        ...prev.secondary,
        active: !prev.secondary.active
      }
    }));

    toast({
      title: monitorState.secondary.active ? 'Monitor Deactivated' : 'Monitor Activated',
      description: monitorState.secondary.active ? 'Secondary monitor turned off' : 'Secondary monitor is now active',
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Primary Monitor */}
      <WorkspaceContainer title="Primary Monitor">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-6 w-6 text-blue-400" />
                <CardTitle>Main Workspace</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-green-400" />
                <span className="text-sm text-gray-400">main</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="h-2 bg-blue-400/20 rounded-full">
                    <div 
                      className="h-2 bg-blue-400 rounded-full" 
                      style={{ width: `${(gameState.level / 10) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-400">Level {gameState.level}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </WorkspaceContainer>

      {/* Secondary Monitor */}
      {monitorState.secondary.active && (
        <WorkspaceContainer title="Secondary Monitor">
          <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-6 w-6 text-green-400" />
                  <CardTitle>Tri_LioNsquared Explorer</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={toggleSecondaryMonitor}
                >
                  <Zap className="h-4 w-4" />
                  {monitorState.secondary.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold">{gameState.avatar.level}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{gameState.avatar.name}</h3>
                    <p className="text-sm text-gray-400">{gameState.avatar.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400">{gameState.score} points</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </WorkspaceContainer>
      )}
    </div>
  );
}