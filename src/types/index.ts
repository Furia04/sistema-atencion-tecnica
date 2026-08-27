export type UserRole = 'owner' | 'technician';

export interface ShopSettings {
  branding: {
    logo_url?: string | null;
    primary_color?: string;
  };
  ticket: {
    width_mm: number;
    terms: string;
  };
  whatsapp_phone: string;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  owner_id?: string;
  settings: ShopSettings;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  shop_id: string;
  full_name?: string;
  can_view_financials: boolean;
}

export interface Customer {
  id: string;
  shop_id: string;
  full_name: string;
  phone: string;
  email?: string;
  created_at: string;
}

export interface Device {
  id: string;
  shop_id: string;
  customer_id: string;
  type: string; // PC, Celular, Auto, Consola, Drone, etc.
  brand: string;
  model: string;
  serial_number?: string;
  custom_attributes: Record<string, any>; // JSONB (IMEI, Kilometraje, etc.)
  created_at: string;
}

export type OrderStatus =
  | 'received'
  | 'in_progress'
  | 'waiting_parts'
  | 'ready'
  | 'delivered'
  | 'cancelled';

export interface ServiceOrder {
  id: string;
  shop_id: string;
  tracking_code: string; // Ej: #WO-8891
  device_id: string;
  customer_id: string;
  technician_id?: string;
  status: OrderStatus;
  reported_fault: string;
  technical_diagnosis?: string;
  internal_notes?: string;
  estimated_completion?: string;
  estimated_cost?: number; // Oculto si can_view_financials es false
  final_price?: number;
  created_at: string;
  
  // Virtual joins for UI
  customer_name?: string;
  customer_phone?: string;
  device_info?: string;
}

export interface InventoryItem {
  id: string;
  shop_id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  cost?: number; // Mascarado si can_view_financials es false
  price: number;
  created_at: string;
}
