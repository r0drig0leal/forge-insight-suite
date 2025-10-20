import { motion } from "framer-motion";
import { Trophy, Star, Gift, Zap, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PropertyAnalytics } from "@/lib/mockData";

interface GamificationProgressProps {
  analytics: PropertyAnalytics;
  userLevel?: number;
  analysisCount?: number;
}

export const GamificationProgress = ({ 
  analytics, 
  userLevel = 1, 
  analysisCount = 3 
}: GamificationProgressProps) => {
  // Calculate XP and level progression
  const currentXP = analysisCount * 100 + Math.floor(Math.random() * 50); // Mock XP calculation
  const currentLevelXP = userLevel * 250; // XP for current level
  const nextLevelXP = (userLevel + 1) * 250; // XP needed for next level
  const xpProgress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const xpToNext = nextLevelXP - currentXP;

  // Level rewards and benefits
  const levelRewards = {
    2: "Free Advanced Report",
    3: "AI Consultation Session", 
    4: "Premium Market Analysis",
    5: "VIP Investment Insights"
  };

  const nextReward = levelRewards[userLevel + 1 as keyof typeof levelRewards] || "Exclusive Features";

  // Achievements based on analytics
  const achievements = [
    {
      id: "first_analysis",
      title: "First Steps",
      description: "Completed your first property analysis",
      icon: Target,
      earned: analysisCount >= 1,
      xp: 50
    },
    {
      id: "low_risk_finder", 
      title: "Risk Analyst",
      description: "Found a low-risk property (< 30 risk score)",
      icon: Trophy,
      earned: analytics.overallRiskScore < 30,
      xp: 100
    },
    {
      id: "high_roi_spotter",
      title: "ROI Hunter", 
      description: "Discovered high ROI potential (> 8%)",
      icon: Star,
      earned: analytics.potentialROI > 8,
      xp: 150
    },
    {
      id: "market_navigator",
      title: "Market Navigator",
      description: "Analyzed properties in 3+ regions",
      icon: Award,
      earned: analysisCount >= 3,
      xp: 75
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const totalEarnedXP = earnedAchievements.reduce((sum, a) => sum + a.xp, 0);

  const getLevelColor = (level: number) => {
    if (level >= 5) return "text-accent";
    if (level >= 3) return "text-secondary";
    return "text-primary";
  };

  const getLevelBg = (level: number) => {
    if (level >= 5) return "bg-accent/10";
    if (level >= 3) return "bg-secondary/10";
    return "bg-primary/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level and XP Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center p-4 rounded-lg bg-gradient-to-br from-background via-background to-muted/20"
          >
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getLevelColor(userLevel)}`}>
                  <AnimatedCounter 
                    value={userLevel} 
                    duration={1.5}
                    delay={0.9}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Level</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  <AnimatedCounter 
                    value={currentXP} 
                    duration={2}
                    delay={1}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
            </div>
          </motion.div>

          {/* XP Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Level {userLevel + 1} Progress</span>
              <Badge variant="outline" className="text-xs">
                {xpToNext} XP to go
              </Badge>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="origin-left"
            >
              <Progress value={Math.max(0, xpProgress)} className="h-3" />
            </motion.div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {userLevel} ({currentLevelXP} XP)</span>
              <span>Level {userLevel + 1} ({nextLevelXP} XP)</span>
            </div>
          </motion.div>

          {/* Next Level Reward */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/20"
          >
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-sm">Next Level Reward</p>
                <p className="text-xs text-muted-foreground">
                  🎁 Unlock "{nextReward}" at Level {userLevel + 1}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recent Achievements */}  
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Achievements</h4>
            <div className="space-y-2">
              {achievements.slice(0, 3).map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.7 + index * 0.1, duration: 0.3 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      achievement.earned 
                        ? "bg-secondary/10 border border-secondary/20 shadow-sm" 
                        : "bg-muted/30 border border-border/50 opacity-60"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${
                      achievement.earned ? "text-secondary" : "text-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{achievement.title}</span>
                        {achievement.earned && (
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.xp} XP
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.8 + index * 0.1, duration: 0.3 }}
                      >
                        <Badge className="bg-secondary text-secondary-foreground">
                          ✓
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 text-center text-xs"
          >
            <div className="p-2 rounded-lg bg-muted/20">
              <div className="font-bold text-primary">
                <AnimatedCounter value={analysisCount} duration={1} delay={2.3} />
              </div>
              <div className="text-muted-foreground">Properties</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/20">
              <div className="font-bold text-secondary">
                <AnimatedCounter value={earnedAchievements.length} duration={1} delay={2.4} />
              </div>
              <div className="text-muted-foreground">Achievements</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/20">
              <div className="font-bold text-accent">
                <AnimatedCounter value={totalEarnedXP} duration={1} delay={2.5} />
              </div>
              <div className="text-muted-foreground">Bonus XP</div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};