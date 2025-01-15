export interface ProcessingStatusProps {
  requestId: string;
}

export interface PropertyRequest {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  description?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  status_details: {
    address_validation: string | null;
    geospatial_analysis: string | null;
    zoning_analysis: string | null;
    report_generation: string | null;
  };
  processing_steps: {
    address_validated: boolean;
    coordinates_mapped: boolean;
    zoning_checked: boolean;
    report_generated: boolean;
    completed: boolean;
  };
  coordinates: {
    lat: number | null;
    lng: number | null;
  } | null;
}

export interface LightBoxResponse {
  parcelId?: string;
  address?: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyDetails?: {
    landUse?: string;
    lotSize?: string;
    zoning?: string;
    yearBuilt?: string;
  };
  rawResponse?: any;
  timestamp?: string;
  lightbox_processed?: boolean;
  processed_at?: string;
}

export interface FunctionLog {
  timestamp: string;
  function: string;
  status: 'success' | 'error' | 'info';
  message: string;
}