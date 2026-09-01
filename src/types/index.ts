export type OrderStatus =
  | 'recibido'
  | 'en_revision'
  | 'esperando_repuesto'
  | 'esperando_cliente'
  | 'para_entregar'
  | 'abandonado';

export type UserRole = 'owner' | 'technician' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  shop_id: string;
  can_view_financials: boolean;
}

export type SubscriptionStatus = 'active' | 'pending_payment' | 'past_due' | 'canceled';

export interface Shop {
  id: string;
  name: string;
  owner_email: string;
  subscription_status: SubscriptionStatus;
  plan_price: number;
  active: boolean;
  created_at: string;
  orders_count?: number;
  settings?: {
    receipt_footer?: string;
    thermal_printer_width?: '80mm' | '58mm';
  };
}

export interface Customer {
  id: string;
  shop_id: string;
  full_name: string;
  phone: string;
  document_id?: string;
  email?: string;
  created_at: string;
}

export interface Device {
  id: string;
  shop_id: string;
  customer_id: string;
  type: string;
  brand: string;
  model: string;
  serial_number?: string;
  custom_attributes?: Record<string, any>;
  created_at: string;
}

export interface ServiceOrder {
  id: string;
  shop_id: string;
  tracking_code: string;
  device_id: string;
  customer_id: string;
  technician_id?: string;
  status: OrderStatus;
  reported_fault: string;
  technical_diagnosis?: string;
  internal_notes?: string;
  estimated_completion?: string;
  estimated_cost?: number;
  final_price?: number;
  created_at: string;
  // Joins para frontend
  customer_name?: string;
  customer_phone?: string;
  customer_document_id?: string;
  device_info?: string;
  custom_attributes?: Record<string, any>;
  unlock_pattern?: number[];
}

export interface InventoryItem {
  id: string;
  shop_id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  cost?: number;
  price: number;
  created_at: string;
}

export type FieldType = 'text' | 'number' | 'boolean' | 'checkbox' | 'select' | 'textarea';

export interface CustomFieldDefinition {
  id: string;
  key?: string;
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface DeviceCategoryTemplate {
  id: string;
  shop_id?: string;
  category_name: string;
  fields: CustomFieldDefinition[];
}
