import { useState } from "react";
import { Search, TrendingUp, BarChart3, Shield, Brain, Sparkles, Mic, LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VoiceInput } from "@/components/interactive/VoiceInput";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { useNavigate } from "react-router-dom";
import { type AddressSearchResult, apiClient } from "@/lib/api";
interface PropertyInputProps {
  onAnalyze: (parcelId: string) => void;
  isLoading: boolean;
}

export const PropertyInput = ({ onAnalyze, isLoading }: PropertyInputProps) => {
  const [parcelId, setParcelId] = useState("");
  const [actualParcelId, setActualParcelId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressSearchResult | null>(null);
  const [isProcessingParcelId, setIsProcessingParcelId] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<"running" | "completed" | "failed" | "not_found" | null>(null);
  const [currentParcelId, setCurrentParcelId] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [currentScript, setCurrentScript] = useState<string>("");
  const [totalScripts, setTotalScripts] = useState<number>(11);
  const [processingMessage, setProcessingMessage] = useState<string>("");
  const [recentSearches] = useState(["12345", "67890"]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    if (isProcessingParcelId) return;
    if (actualParcelId && actualParcelId !== parcelId) {
      // Only analyze if we have a valid parcelId (not the address string)
      onAnalyze(actualParcelId);
    } else if (actualParcelId && actualParcelId === parcelId) {
      // Fallback: user typed a parcelId directly
      onAnalyze(actualParcelId);
    } else {
      setAddressError("Could not find a valid property for this address. Please try another address.");
    }
  };

  const handleRecentSearch = (id: string) => {
    setParcelId(id);
    onAnalyze(id);
  };

  const handleVoiceResult = (transcript: string) => {
    // Extract potential address from transcript
    const cleanedTranscript = transcript.replace(/[^\w\s]/g, '').trim();
    setParcelId(cleanedTranscript);
    setActualParcelId(null); // Reset actual parcel ID when using voice
  };

  const handleAddressSelect = async (address: AddressSearchResult) => {
    setSelectedAddress(address);
    setIsProcessingParcelId(true);
    setProcessingStatus("running");
    setAddressError(null);
    const fullAddress = address.address_display || address.formattedAddress || address.address || '';
    // Log detalhado para comparação
    console.log('[DEBUG] Endereço selecionado no autocomplete:', fullAddress);
    console.log('[DEBUG] address.address_display:', address.address_display);
    console.log('[DEBUG] address.formattedAddress:', address.formattedAddress);
    console.log('[DEBUG] address.address:', address.address);
    setParcelId(fullAddress);
    try {
      // Log do valor realmente enviado para o backend
      console.log('[DEBUG] Enviando para /api/parcel-id-by-address (valor exato):', fullAddress);
      const parcelResponse = await apiClient.getParcelIdByAddress(fullAddress);
      if (
        parcelResponse.success &&
        parcelResponse.data?.parcel_id &&
        /^[A-Za-z0-9\-_]+$/.test(parcelResponse.data.parcel_id) &&
        parcelResponse.data.parcel_id.length < 50
      ) {
        const parcelId = parcelResponse.data.parcel_id;
        setCurrentParcelId(parcelId);
        setActualParcelId(parcelId);
        // Poll usando o parcelId retornado do backend
        await pollForProcessingCompletion(parcelId);
      } else {
        setProcessingStatus("failed");
        setAddressError("No valid parcel ID found for this address. Please try another address.");
        setActualParcelId(null);
      }
    } catch (error) {
      let errorMsg = "Could not process this property. Please try another address.";
      if (error instanceof Error) errorMsg = error.message;
      setProcessingStatus("failed");
      setAddressError(errorMsg);
      setActualParcelId(null);
    } finally {
      setIsProcessingParcelId(false);
    }
  };

  const pollForProcessingCompletion = async (parcelId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // Max 60 attempts (2 minutes if polling every 2 seconds)
    let pollingTimedOut = false;
    while (attempts < maxAttempts) {
      console.log(`🔄 Polling attempt ${attempts + 1}/${maxAttempts} for parcel ID: ${parcelId}`);
      try {
        const statusResponse = await apiClient.getParcelIdStatus(parcelId);
        if (statusResponse.success && statusResponse.data) {
          const { status, message, progress, current_script, total_scripts, completed_at } = statusResponse.data;
          setProcessingStatus(status);
          if (progress !== undefined) setProcessingProgress(progress);
          if (current_script) setCurrentScript(current_script);
          if (total_scripts) setTotalScripts(total_scripts);
          if (message) setProcessingMessage(message);
          if (status === "completed") {
            setTimeout(() => {
              onAnalyze(parcelId);
            }, 1000);
            return;
          } else if (status === "failed") {
            setProcessingStatus("failed");
            setAddressError("Property data processing failed. Please try again or contact support.");
            return;
          } else if (status === "not_found") {
            setProcessingStatus("not_found");
            setAddressError("No property data found for this address. Please check the address and try again.");
            return;
          }
        } else {
          console.log('⚠️ Status API call failed, retrying...');
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    pollingTimedOut = true;
    setProcessingStatus("failed");
    setAddressError("Property data processing is taking too long. Please try again later or contact support.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Auth Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => navigate("/auth")}
        >
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </div>

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mx-auto space-y-6 rounded-2xl p-6">
            <motion.div 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">PropertyForge AI</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Transform Property Data
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Revolutionary risk and investment reports that turn real estate data into actionable insights
            </motion.p>
          </div>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="shadow-medium border-2 border-primary/10 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Analyze Your Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <AddressAutocomplete
                    value={parcelId}
                    onChange={setParcelId}
                    onSelect={handleAddressSelect}
                    placeholder="Enter the property address you'd like to analyze..."
                    disabled={isLoading || isProcessingParcelId}
                    className="w-full"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-2">
                    {isProcessingParcelId && (
                      <div className="flex items-center gap-1 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs font-medium">
                          {processingStatus === "running" ? "Loading..." :
                           processingStatus === "failed" ? "Failed" :
                           processingStatus === "not_found" ? "Not Found" :
                           "Loading..."}
                        </span>
                      </div>
                    )}
                    <VoiceInput onResult={handleVoiceResult} />
                  </div>
                </div>
                
                {/* Progress Display - Show when processing */}
                {isProcessingParcelId && processingStatus === "running" && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-blue-900">Processing Property Data</span>
                      <span className="text-blue-700">{processingProgress}%</span>
                    </div>
                    
                    <Progress value={processingProgress} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-blue-600">
                      <span>
                        {/* High-level friendly progress message */}
                        {(() => {
                          const scriptMessages: Record<string, string> = {
                            property_location: "Locating the property on the map",
                            property_investment: "Estimating investment potential",
                            property_risk: "Assessing property risks",
                            property_comparatives: "Comparing with similar properties",
                            property_report: "Summarizing your property insights",
                            property_record: "Gathering property details",
                            sell_history: "Reviewing sales history",
                            building_features: "Analyzing building characteristics",
                            building_subareas: "Reviewing building layout",
                            buildings: "Exploring property structures",
                            community: "Exploring the neighborhood",
                            demographics: "Understanding the local community",
                            disasters_risks: "Checking for natural disaster risks",
                            documents: "Collecting legal documents",
                            extra_features: "Identifying special features",
                            flood_risk: "Checking flood risk",
                            images: "Loading property images",
                            land_areas: "Measuring land size",
                            land_features: "Reviewing land attributes",
                            legal_descriptions: "Reviewing legal description",
                            location: "Pinpointing property location",
                            neighbor_sales: "Analyzing nearby sales",
                            non_ad_valorem_tax: "Reviewing special assessments",
                            officials: "Identifying local officials",
                            sales_records: "Reviewing transaction history",
                            schools: "Finding nearby schools",
                            services: "Listing available services",
                            tax_records: "Reviewing property taxes",
                          };
                          if (!currentScript) return "Initializing...";
                          // Normalize script name: lowercase, remove spaces and underscores
                          const normalizedScript = currentScript.toLowerCase().replace(/\s|_/g, "");
                          const key = Object.keys(scriptMessages).find(
                            k => k.toLowerCase().replace(/\s|_/g, "") === normalizedScript
                          );
                          return key ? scriptMessages[key] : "Processing property data...";
                        })()}
                      </span>
                      <span>{Math.ceil((processingProgress / 100) * totalScripts)} / {totalScripts}</span>
                    </div>
                    
                    {processingMessage && !processingMessage.trim().toLowerCase().startsWith("executando:") && (
                      <div className="text-xs text-blue-600 bg-white/50 px-2 py-1 rounded">
                        {processingMessage}
                      </div>
                    )}
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg hero-gradient shadow-glow hover:shadow-strong transition-all duration-300"
                    disabled={isLoading || isProcessingParcelId || !parcelId?.trim()}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        🔄
                      </motion.div>
                    ) : isProcessingParcelId ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5 mr-2" />
                    )}
                    {isLoading ? "Analyzing..." : 
                     isProcessingParcelId ? (
                       processingStatus === "running" ? `Loading Data... ${processingProgress}%` :
                       processingStatus === "failed" ? "Failed to Load" :
                       processingStatus === "not_found" ? "Data Not Found" :
                       "Loading Data..."
                     ) : "Generate AI Report"}
                  </Button>
                </motion.div>
                {addressError && (
                  <div className="text-red-600 text-sm mt-2 text-center">{addressError}</div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Preview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          {[
            {
              icon: Shield,
              title: "Risk Analysis",
              description: "360° risk assessment with predictive insights",
              color: "risk-low"
            },
            {
              icon: BarChart3,
              title: "Investment Insights", 
              description: "ROI calculations and market comparisons",
              color: "secondary"
            },
            {
              icon: Brain,
              title: "AI Predictions",
              description: "Machine learning powered recommendations",
              color: "accent"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={`feature-${feature.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.2, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="shadow-soft hover:shadow-medium transition-all duration-300 border-2 border-transparent hover:border-primary/20">
                  <CardContent className="p-4 text-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className={`h-8 w-8 text-${feature.color} mx-auto mb-2`} />
                    </motion.div>
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};