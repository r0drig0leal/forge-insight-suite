import { TrendingUp } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Analyzing Property</h2>
          <p className="text-muted-foreground">Generating comprehensive risk and investment reports...</p>
        </div>
        
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Property Data</span>
            <span>✓</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Tax Records</span>
            <span>✓</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Market Analysis</span>
            <span className="animate-pulse">...</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Risk Assessment</span>
            <span>⏳</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>AI Insights</span>
            <span>⏳</span>
          </div>
        </div>
      </div>
    </div>
  );
};