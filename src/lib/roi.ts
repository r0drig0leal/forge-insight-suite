// API method to fetch ROI potential for a property
// GET /api/property_roi_potential/:parcel_id

import { API_BASE_URL } from './apiConfig';
import { ApiResponse, PropertyRoiPotential } from './api';

export async function getPropertyRoiPotential(parcelId: string): Promise<ApiResponse<PropertyRoiPotential>> {
  const endpoint = `/api/property_roi_potential/${encodeURIComponent(parcelId)}`;
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'x-api-key': '7f2e1c9a-auctions-2025',
      },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const raw = await res.json();
    // Mapear campos do backend para o padrão esperado no dashboard
    const data: PropertyRoiPotential = {
      parcel_id: raw.parcel_id,
      potential_rent_income: Number(raw.potential_rent_income),
      estimated_renovation_cost: Number(raw.estimated_renovation_cost),
      estimated_eviction_cost: Number(raw.estimated_eviction_cost),
      market_value: Number(raw.market_value),
      net_annual_income: Number(raw.net_annual_income),
  roi_potential_percent: raw.roi_potential_percent !== undefined ? Number(raw.roi_potential_percent) : (raw.roi_percent !== undefined ? Number(raw.roi_percent) : undefined),
      range_low: Number(raw.range_low),
      range_high: Number(raw.range_high),
      calculated_at: raw.calculated_at,
      num_comps: Number(raw.num_comps),
    market_position_score: raw.market_position_percent !== undefined ? parseFloat(raw.market_position_percent) : undefined,
    market_position: raw.market_position_category || undefined,
    market_position_vs_neighborhood_percent: raw.market_position_vs_neighborhood_percent !== undefined ? parseFloat(raw.market_position_vs_neighborhood_percent) : undefined,
    market_position_vs_neighborhood_label: raw.market_position_vs_neighborhood_label || undefined,
    };
    return { success: true, data };
  } catch (error) {
    return { success: false, data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
