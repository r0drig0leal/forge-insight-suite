import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyAnalytics } from "@/lib/mockData";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  earned: boolean;
  progress?: number;
  color: string;
}

interface GamificationBadgeProps {
  analytics: PropertyAnalytics;
  userLevel?: number;
  analysisCount?: number;
}

export const GamificationBadge = ({ 
  analytics, 
  userLevel = 1, 
  analysisCount = Math.floor(Math.random() * 10) + 1 
}: GamificationBadgeProps) => {
  
  const generateAchievements = (): Achievement[] => {
    const riskScore = analytics.overallRiskScore;
    const roi = analytics.potentialROI;
    
    return [
      {
        id: "risk-master",
        title: "Risk Master",
        description: "Analyzed a low-risk property",
        icon: Shield,
        earned: riskScore < 30,
        color: "secondary"
      },
      {
        id: "high-yield-hunter",
        title: "High Yield Hunter",
        description: "Found property with >8% ROI",
        icon: Target,
        earned: roi > 8,
        color: "accent"
      },
      {
        id: "market-analyst",
        title: "Market Analyst",
        description: "Complete 5 property analyses",
        icon: TrendingUp,
        earned: analysisCount >= 5,
        progress: Math.min(100, (analysisCount / 5) * 100),
        color: "primary"
      },
      {
        id: "property-scout",
        title: "Property Scout",
        description: "First property analysis",
        icon: Star,
        earned: analysisCount >= 1,
        color: "secondary"
      },
      {
        id: "deal-finder",
        title: "Deal Finder",
        description: "Found below-market property",
        icon: Zap,
        earned: analytics.neighborBenchmark < -5,
        color: "accent"
      },
      {
        id: "investment-expert",
        title: "Investment Expert",
        description: "Reach level 5",
        icon: Trophy,
        earned: userLevel >= 5,
        progress: Math.min(100, (userLevel / 5) * 100),
        color: "primary"
      }
    ];
  };

  const achievements = generateAchievements();
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalXP = earnedCount * 100 + analysisCount * 25;

  return (
    <div className="space-y-4">
      {/* User Level & XP */}
      <Card className="shadow-soft">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <span className="font-semibold">Level {userLevel}</span>
            </div>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              {totalXP} XP
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-accent h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP % 500) / 5}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {500 - (totalXP % 500)} XP to next level
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((achievement, index) => {
          const IconComponent = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Card className={`shadow-soft transition-all duration-300 ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-background to-muted/30 border-2' 
                  : 'opacity-60 grayscale'
              }`}>
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <IconComponent 
                      className={`h-8 w-8 mx-auto ${
                        achievement.earned 
                          ? `text-${achievement.color}` 
                          : 'text-muted-foreground'
                      }`} 
                    />
                    {achievement.earned && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-background"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      />
                    )}
                  </div>
                  
                  <h4 className="font-medium text-xs mb-1">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {achievement.description}
                  </p>
                  
                  {achievement.progress !== undefined && !achievement.earned && (
                    <div className="w-full bg-muted rounded-full h-1 mt-2">
                      <motion.div
                        className={`bg-${achievement.color} h-1 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {achievement.earned && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, delay: 0.5 }}
                  style={{
                    background: `linear-gradient(45deg, hsl(var(--${achievement.color})) 0%, transparent 100%)`,
                    pointerEvents: 'none'
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="shadow-soft">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Achievement Progress</span>
            <Badge variant="outline">
              {earnedCount}/{achievements.length} Unlocked
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / achievements.length) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};