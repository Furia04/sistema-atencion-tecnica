import { supabase } from './client';
import { Customer, DeviceCategoryTemplate, InventoryItem, ServiceOrder, UserProfile } from '@/types';

// =======================================================
// OBTENER PERFIL Y TALLER (TENANT) DEL USUARIO AUTENTICADO
// =======================================================

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // Retornar objeto perfil con id de auth y shop predeterminado
      return {
        id: user.id,
        email: user.email || '',
        role: (user.user_metadata?.role as any) || 'owner',
        shop_id: user.user_metadata?.shop_id || user.id,
        full_name: user.user_metadata?.full_name || user.email,
        can_view_financials: true,
      };
    }

    return data;
  } catch (err) {
    console.warn('Error al obtener perfil de usuario:', err);
    return null;
  }
}

// =======================================================
// ÓRDENES DE SERVICIO (MULTI-TENANT REAL)
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

    if (error) {
      console.error('Error Supabase fetchServiceOrders:', error);
      return [];
    }

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
      customer_name: ord.customers?.full_name || 'Cliente sin nombre',
      customer_phone: ord.customers?.phone || '',
      customer_document_id: ord.customers?.document_id || '',
      device_info: `${ord.devices?.type || 'Equipo'} · ${ord.devices?.brand || ''} ${ord.devices?.model || ''}`.trim(),
    }));
  } catch (err) {
    return [];
  }
}

export async function createServiceOrderWithDevice(orderPayload: {
  customer: { full_name: string; phone: string; document_id?: string; email?: string };
  device: { type: string; brand: string; model: string; serial_number?: string; custom_attributes?: any };
  order: { reported_fault: string; estimated_cost?: number; final_price?: number };
}) {
  const profile = await getCurrentUserProfile();
  const shopId = profile?.shop_id || '00000000-0000-0000-0000-000000000000';

  // 1. Insertar o buscar cliente por DNI / Teléfono
  let customerId = '';
  if (orderPayload.customer.document_id) {
    const { data: existingCust } = await supabase
      .from('customers')
      .select('id')
      .eq('document_id', orderPayload.customer.document_id)
      .maybeSingle();

    if (existingCust) {
      customerId = existingCust.id;
    }
  }

  if (!customerId) {
    const { data: newCust, error: custErr } = await supabase
      .from('customers')
      .insert([{
        shop_id: shopId,
        full_name: orderPayload.customer.full_name,
        phone: orderPayload.customer.phone,
        document_id: orderPayload.customer.document_id,
        email: orderPayload.customer.email,
      }])
      .select()
      .single();

    if (custErr) throw custErr;
    customerId = newCust.id;
  }

  // 2. Insertar dispositivo
  const { data: newDevice, error: devErr } = await supabase
    .from('devices')
    .insert([{
      shop_id: shopId,
      customer_id: customerId,
      type: orderPayload.device.type,
      brand: orderPayload.device.brand,
      model: orderPayload.device.model,
      serial_number: orderPayload.device.serial_number,
      custom_attributes: orderPayload.device.custom_attributes || {},
    }])
    .select()
    .single();

  if (devErr) throw devErr;

  // 3. Insertar orden de servicio
  const randomCode = `#WO-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: newOrder, error: ordErr } = await supabase
    .from('service_orders')
    .insert([{
      shop_id: shopId,
      tracking_code: randomCode,
      device_id: newDevice.id,
      customer_id: customerId,
      status: 'recibido',
      reported_fault: orderPayload.order.reported_fault,
      estimated_cost: orderPayload.order.estimated_cost || 0,
      final_price: orderPayload.order.final_price || 0,
    }])
    .select()
    .single();

  if (ordErr) throw ordErr;

  return newOrder;
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
// CLIENTES (MULTI-TENANT REAL)
// =======================================================

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  } catch (err) {
    return [];
  }
}

// =======================================================
// INVENTARIO (MULTI-TENANT REAL)
// =======================================================

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name', { ascending: true });

    if (error) return [];
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function createInventoryItem(item: Partial<InventoryItem>) {
  const profile = await getCurrentUserProfile();
  const shopId = profile?.shop_id || '00000000-0000-0000-0000-000000000000';

  const { data, error } = await supabase
    .from('inventory')
    .insert([{ ...item, shop_id: shopId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =======================================================
// SEGUIMIENTO B2C PÚBLICO
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
