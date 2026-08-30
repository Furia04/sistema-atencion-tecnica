import { supabase } from './client';
import { Customer, DeviceCategoryTemplate, InventoryItem, ServiceOrder } from '@/types';

// =======================================================
// SERVICIOS DE ÓRDENES DE SERVICIO
// =======================================================

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  try {
    const { data, error } = await supabase
      .from('service_orders')
      .select(`
        *,
        customers ( full_name, phone, document_id ),
        devices ( type, brand, model, serial_number )
      `)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((ord: any) => ({
      id: ord.id,
      shop_id: ord.shop_id,
      tracking_code: ord.tracking_code,
      device_id: ord.device_id,
      customer_id: ord.customer_id,
      technician_id: ord.technician_id,
      status: ord.status,
      reported_fault: ord.reported_fault,
      technical_diagnosis: ord.technical_diagnosis,
      internal_notes: ord.internal_notes,
      estimated_completion: ord.estimated_completion,
      estimated_cost: ord.estimated_cost,
      final_price: ord.final_price,
      created_at: ord.created_at,
      customer_name: ord.customers?.full_name,
      customer_phone: ord.customers?.phone,
      customer_document_id: ord.customers?.document_id,
      device_info: `${ord.devices?.type || 'Equipo'} · ${ord.devices?.brand || ''} ${ord.devices?.model || ''}`.trim(),
    }));
  } catch (err) {
    console.warn('Fallback a datos locales mientras se conecta Supabase:', err);
    return [];
  }
}

export async function updateServiceOrderStatus(
  orderId: string,
  status: string,
  technicalDiagnosis?: string,
  finalPrice?: number
) {
  const { data, error } = await supabase
    .from('service_orders')
    .update({
      status,
      technical_diagnosis: technicalDiagnosis,
      final_price: finalPrice,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select();

  if (error) throw error;
  return data;
}

// =======================================================
// SERVICIOS DE CLIENTES
// =======================================================

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function createCustomer(customer: Partial<Customer>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =======================================================
// SERVICIOS DE INVENTARIO
// =======================================================

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
}

// =======================================================
// SERVICIO PÚBLICO DE SEGUIMIENTO (B2C)
// =======================================================

export async function fetchPublicOrderByTrackingCode(trackingCode: string) {
  const code = trackingCode.startsWith('#') ? trackingCode : `#${trackingCode}`;
  
  const { data, error } = await supabase
    .from('service_orders')
    .select(`
      *,
      shops ( name, settings ),
      devices ( type, brand, model, serial_number, custom_attributes )
    `)
    .eq('tracking_code', code)
    .maybeSingle();

  if (error) throw error;
  return data;
}
