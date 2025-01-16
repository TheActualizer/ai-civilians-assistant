import { useState, useEffect } from 'react';
import { Trophy, Star, Award, Bug, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  completed: boolean;
}

export function GamifiedMetrics() {
  const [debugScore, setDebugScore] = useState(0);
  const [systemComplexity, setSystemComplexity] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      console.log('Fetching debug metrics...');
      
      // Fetch debug analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('debug_analytics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (analyticsError) {
        console.error('Error fetching debug analytics:', analyticsError);
        return;
      }

      // Calculate score based on analytics
      const score = analyticsData?.reduce((acc, curr) => {
        return acc + (curr.value || 0);
      }, 0) || 0;

      setDebugScore(Math.round(score));

      // Calculate system complexity
      const complexity = analyticsData?.length || 0;
      setSystemComplexity(complexity * 10);

      // Set mock achievements for now
      setAchievements([
        {
          id: '1',
          name: 'Bug Hunter',
          description: 'Found and fixed 5 critical issues',
          progress: 80,
          completed: false
        },
        {
          id: '2',
          name: 'System Architect',
          description: 'Designed complex system integration',
          progress: 100,
          completed: true
        },
        {
          id: '3',
          name: 'Debug Master',
          description: 'Achieved 95% system stability',
          progress: 65,
          completed: false
        }
      ]);
    };

    fetchMetrics();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('debug-metrics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'debug_analytics'
        },
        (payload) => {
          console.log('Debug metrics update:', payload);
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-sm">Debug Score</CardTitle>
            </div>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
              Level {Math.floor(debugScore / 100) + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Experience</span>
              <span className="text-gray-200">{debugScore} XP</span>
            </div>
            <Progress 
              value={(debugScore % 100)} 
              className="h-2 bg-gray-700"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-sm">System Complexity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress 
              value={systemComplexity} 
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Complexity Score</span>
              <span className="text-gray-200">{systemComplexity}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-sm">Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {achievement.completed ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Bug className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-200">
                      {achievement.name}
                    </span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={achievement.completed ? 
                      "bg-green-500/10 text-green-400" : 
                      "bg-gray-500/10 text-gray-400"}
                  >
                    {achievement.progress}%
                  </Badge>
                </div>
                <Progress 
                  value={achievement.progress} 
                  className="h-1 bg-gray-700"
                />
                <p className="text-xs text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}