import { useState, useEffect } from "react";
import { PropertyInput } from "@/components/PropertyInput";
import { PropertyDashboard } from "@/components/PropertyDashboard";
import { apiClient, type CompletePropertyData } from "@/lib/api";

const Index = () => {
  const [currentParcelId, setCurrentParcelId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('parcelId') || null;
    }
    return null;
  });
  const [propertyData, setPropertyData] = useState<CompletePropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar propertyData automaticamente se parcelId estiver no localStorage
  useEffect(() => {
    if (currentParcelId && !propertyData) {
      handleAnalyze(currentParcelId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async (parcelId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Starting analysis for parcel ID:', parcelId);
      
      // Get all property data from the API
      const response = await apiClient.getPropertyData(parcelId);
      
      if (response.success && response.data) {
        setPropertyData(response.data);
        // DEBUG: Remover após validação do endereço
        console.log('[DEBUG] propertyData:', response.data);
        setCurrentParcelId(parcelId);
        if (typeof window !== 'undefined') {
          localStorage.setItem('parcelId', parcelId);
        }
        console.log('✅ Property data loaded successfully');
      } else {
        setError(response.error || 'Failed to load property data');
        console.error('❌ Failed to load property data:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('❌ Error during analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentParcelId(null);
    setPropertyData(null);
    setError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parcelId');
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Property Data</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard if we have a parcel ID and data
  if (currentParcelId && propertyData) {
    return (
      <PropertyDashboard 
        parcelId={currentParcelId} 
        propertyData={propertyData}
        onBack={handleBack} 
      />
    );
  }

  // Show input screen
  return <PropertyInput onAnalyze={handleAnalyze} isLoading={isLoading} />;
};

export default Index;
