import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CalculationStep {
  label: string;
  formula: string;
  value: number;
  explanation: string;
}

interface CalculationTooltipProps {
  title: string;
  result: number;
  unit?: string;
  steps: CalculationStep[];
  className?: string;
}

export const CalculationTooltip = ({
  title,
  result,
  unit = "",
  steps,
  className = ""
}: CalculationTooltipProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-primary/10"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Calculator className="h-3 w-3 text-primary" />
      </Button>

      {/* Calculation Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Card className="shadow-strong border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-primary" />
                    How We Calculate: {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Final Result */}
                  <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="text-3xl font-bold text-primary">
                      {result.toFixed(result % 1 === 0 ? 0 : 2)}{unit}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Final Result</p>
                  </div>

                  {/* Calculation Steps */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-secondary" />
                      <span className="font-medium text-sm">Calculation Breakdown</span>
                    </div>
                    
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{step.label}</span>
                          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                            Step {index + 1}
                          </Badge>
                        </div>
                        
                        <div className="bg-muted/50 rounded p-2 font-mono text-sm">
                          {step.formula}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Result:</span>
                          <span className="font-semibold text-primary">
                            {step.value.toFixed(step.value % 1 === 0 ? 0 : 2)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground italic">
                          {step.explanation}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Transparency Notice */}
                  <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Transparency Commitment</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All calculations are based on industry-standard formulas and current market data. 
                      We believe in complete transparency in our analysis methodology.
                    </p>
                  </div>

                  {/* Close Button */}
                  <Button 
                    onClick={() => setShowDetails(false)}
                    className="w-full"
                    variant="outline"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};