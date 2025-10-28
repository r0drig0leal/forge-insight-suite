import { API_BASE_URL } from './apiConfig';
import { ApiResponse } from './api';

export interface PropertyValuation {
  parcel_id: string;
  avg_sale_price: number;
  range_low: number;
  range_high: number;
  num_comps: number;
  media_price_per_sqft: number;
  market_value: number;
  calculated_at: string;
}

export async function getPropertyValuation(parcelId: string): Promise<ApiResponse<PropertyValuation>> {
  const endpoint = `/api/property_valuation/${encodeURIComponent(parcelId)}`;
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const raw = await res.json();
    // API retorna objeto direto, não array
    const data: PropertyValuation = {
      parcel_id: raw.parcel_id,
      avg_sale_price: Number(raw.avg_sale_price),
      range_low: Number(raw.range_low),
      range_high: Number(raw.range_high),
      num_comps: Number(raw.num_comps),
      media_price_per_sqft: Number(raw.media_price_per_sqft),
      market_value: Number(raw.market_value),
      calculated_at: raw.calculated_at,
    };
    return { success: true, data };
  } catch (error) {
    return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
