import { TrendingUp, DollarSign, Home, BarChart3, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PropertyData, TaxRecord, NeighborSale, Building, PropertyAnalytics } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { motion } from "framer-motion";

interface InvestmentReportProps {
  property: PropertyData;
  taxRecords: TaxRecord[];
  neighborSales: NeighborSale[];
  building: Building | null;
  analytics: PropertyAnalytics;
}

export const InvestmentReport = ({ property, taxRecords, neighborSales, building, analytics }: InvestmentReportProps) => {
  const currentTax = taxRecords[0];
  
  const getROIColor = (roi: number) => {
    if (roi >= 8) return "secondary";
    if (roi >= 5) return "primary"; 
    return "accent";
  };

  const getROILabel = (roi: number) => {
    if (roi >= 8) return "Excellent";
    if (roi >= 5) return "Good";
    return "Fair";
  };

  const avgNeighborPrice = neighborSales.length > 0 ? 
    neighborSales.reduce((sum, sale) => sum + sale.sale_price, 0) / neighborSales.length : 0;

  const investmentMetrics = [
    {
      title: "Rental Yield",
      value: `${analytics.potentialROI.toFixed(2)}%`,
      subtitle: "Annual ROI potential",
      icon: DollarSign,
      color: getROIColor(analytics.potentialROI),
    },
    {
      title: "Price vs Market",
      value: `${Math.abs(analytics.neighborBenchmark).toFixed(1)}%`,
      subtitle: "Compared to neighbors",
      icon: BarChart3,
      color: analytics.neighborBenchmark > 0 ? "secondary" : "destructive",
    },
    {
      title: "Cash Flow",
      value: `$${((analytics.potentialROI / 100) * property.current_market_value / 12).toFixed(0)}`,
      subtitle: "Est. monthly income",
      icon: TrendingUp,
      color: "primary",
    }
  ];

  console.log('[DEBUG - InvestmentReport] analytics.potentialROI:', analytics.potentialROI);
  console.log('[DEBUG - InvestmentReport] Investment Metrics:', {
    potentialROI: analytics.potentialROI,
    numberOfBedrooms: property.beds,
  });

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Investment Overview */}
      <Card className="shadow-medium animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Investment Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROI Score */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2" style={{ color: `hsl(var(--${getROIColor(analytics.potentialROI)}))` }}>
                  <AnimatedCounter 
                    value={parseFloat(analytics.potentialROI.toFixed(2))} 
                    duration={2}
                    delay={0.3}
                    decimals={2}
                  />%
                </div>
                <Badge variant="outline" className={`bg-${getROIColor(analytics.potentialROI)}/10 text-${getROIColor(analytics.potentialROI)} border-${getROIColor(analytics.potentialROI)}/20`}>
                  {getROILabel(analytics.potentialROI)} Investment
                </Badge>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Annual Return on Investment
              </div>
            </div>

            {/* Investment Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold">Investment Potential</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Position</span>
                  <span className="font-medium">
                    <AnimatedCounter 
                      value={parseFloat(Math.abs(analytics.neighborBenchmark).toFixed(1))} 
                      duration={1.5}
                      delay={0.5}
                    />%
                  </span>
                </div>
                <Progress value={Math.min(100, Math.abs(analytics.neighborBenchmark))} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rental Yield</span>
                  <span className="font-medium">
                    <AnimatedCounter 
                      value={parseFloat(analytics.potentialROI.toFixed(1))} 
                      duration={1.5}
                      delay={0.7}
                    />%
                  </span>
                </div>
                <Progress value={Math.min(100, analytics.potentialROI * 10)} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Investment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {investmentMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="shadow-soft animate-fade-in hover-scale transition-smooth" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconComponent className="h-5 w-5" style={{ color: `hsl(var(--${metric.color}))` }} />
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1" style={{ color: `hsl(var(--${metric.color}))` }}>
                  {metric.title.includes('Rental Yield') ? (
                    <><AnimatedCounter value={parseFloat(analytics.potentialROI.toFixed(2))} duration={2} delay={0.5 + index * 0.2} decimals={2} />%</>
                  ) : metric.title.includes('Price vs Market') ? (
                    <><AnimatedCounter value={parseFloat(Math.abs(analytics.neighborBenchmark).toFixed(1))} duration={2} delay={0.5 + index * 0.2} />%</>
                  ) : metric.title.includes('Cash Flow') ? (
                    <>$<AnimatedCounter value={parseInt(((analytics.potentialROI / 100) * property.current_market_value / 12).toFixed(0))} duration={2} delay={0.5 + index * 0.2} /></>
                  ) : (
                    metric.value
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{metric.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Property Details */}
      {building && (
        <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Property Features & Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  <AnimatedCounter value={building.beds} duration={1.5} delay={0.8} />
                </div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  <AnimatedCounter value={building.baths} duration={1.5} delay={1.0} />
                </div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  <AnimatedCounter value={building.living_area} duration={1.5} delay={1.2} />
                </div>
                <p className="text-sm text-muted-foreground">Sq Ft</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  <AnimatedCounter value={new Date().getFullYear() - building.date_built} duration={1.5} delay={1.4} />
                </div>
                <p className="text-sm text-muted-foreground">Years Old</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Comparison */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Property Value</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Market Value</span>
                    <span className="font-medium">$<AnimatedCounter value={property.current_market_value} duration={2} delay={1.0} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Assessed Value</span>
                    <span className="font-medium">$<AnimatedCounter value={property.assessed_value} duration={2} delay={1.2} /></span>
                  </div>
                  {currentTax && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm">Land Value</span>
                        <span className="font-medium">$<AnimatedCounter value={currentTax.land_value} duration={2} delay={1.4} /></span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Building Value</span>
                        <span className="font-medium">$<AnimatedCounter value={currentTax.building_value} duration={2} delay={1.6} /></span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Neighborhood Sales</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Sale Price</span>
                    <span className="font-medium">$<AnimatedCounter value={avgNeighborPrice} duration={2} delay={1.0} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Recent Sales</span>
                    <span className="font-medium"><AnimatedCounter value={neighborSales.length} duration={1.5} delay={1.2} /> properties</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price Difference</span>
                    <span className={`font-medium ${analytics.neighborBenchmark > 0 ? 'text-secondary' : 'text-destructive'}`}>
                      {analytics.neighborBenchmark > 0 ? '' : ''}<AnimatedCounter value={parseFloat(Math.abs(analytics.neighborBenchmark).toFixed(1))} duration={1.5} delay={1.4} />%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sales List */}
            {neighborSales.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Recent Neighbor Sales</h4>
                <div className="space-y-2">
                  {neighborSales.slice(0, 3).map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{sale.property_address}</p>
                        <p className="text-xs text-muted-foreground">
                          {sale.beds} bed, {sale.baths} bath • {sale.heated_area} sq ft
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$<AnimatedCounter value={sale.sale_price} duration={1.5} delay={1.6 + index * 0.2} /></p>
                        <p className="text-xs text-muted-foreground">{new Date(sale.sale_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investment Strategies */}
      <Card className="shadow-soft animate-fade-in hover-scale transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Investment Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.actionableRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20">
                <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="h-3 w-3 text-secondary" />
                </div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <DollarSign className="h-3 w-3 text-primary" />
              </div>
              <p className="text-sm">
                Consider cash flow analysis: Monthly income potential is $<AnimatedCounter value={parseInt(((analytics.potentialROI / 100) * property.current_market_value / 12).toFixed(0))} duration={2} delay={1.8} />, 
                which could provide strong returns for long-term investors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};