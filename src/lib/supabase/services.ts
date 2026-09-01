import { supabase } from './client';
import { Customer, DeviceCategoryTemplate, InventoryItem, ServiceOrder, Shop, UserProfile } from '@/types';

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
      .maybeSingle();

    if (error || !data) {
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
    return null;
  }
}

// =======================================================
// PANEL DE SUPER ADMINISTRADOR (100% REAL DE SUPABASE)
// =======================================================

export async function fetchAllShopsForAdmin(): Promise<Shop[]> {
  try {
    const { data: dbShops, error: shopsError } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (shopsError) {
      console.error('Error al consultar tabla shops en Supabase:', shopsError);
    }

    const { data: dbUsers, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.warn('Error al consultar tabla users en Supabase:', usersError);
    }

    const { data: ordersData } = await supabase
      .from('service_orders')
      .select('shop_id');

    const ordersCountMap: Record<string, number> = {};
    if (ordersData) {
      ordersData.forEach((ord: any) => {
        if (ord.shop_id) {
          ordersCountMap[ord.shop_id] = (ordersCountMap[ord.shop_id] || 0) + 1;
        }
      });
    }

    const shopMap = new Map<string, Shop>();

    if (dbShops && dbShops.length > 0) {
      dbShops.forEach((s: any) => {
        shopMap.set(s.id, {
          id: s.id,
          name: s.name || 'Taller sin nombre',
          owner_email: s.owner_email || 'Sin correo',
          subscription_status: s.subscription_status || 'pending_payment',
          plan_price: Number(s.plan_price) || 15000,
          active: s.active ?? false,
          created_at: s.created_at || new Date().toISOString(),
          orders_count: ordersCountMap[s.id] || 0,
        });
      });
    }

    if (dbUsers && dbUsers.length > 0) {
      dbUsers.forEach((u: any) => {
        const userEmail = (u.email || '').toLowerCase();
        const targetShopId = u.shop_id || u.id;

        const alreadyExists = shopMap.has(targetShopId) || Array.from(shopMap.values()).some(s => s.owner_email.toLowerCase() === userEmail);

        if (!alreadyExists && userEmail) {
          shopMap.set(targetShopId, {
            id: targetShopId,
            name: u.full_name ? `Taller de ${u.full_name}` : `Taller (${u.email})`,
            owner_email: u.email,
            subscription_status: 'pending_payment',
            plan_price: 15000,
            active: false,
            created_at: u.created_at || new Date().toISOString(),
            orders_count: ordersCountMap[targetShopId] || 0,
          });
        }
      });
    }

    return Array.from(shopMap.values());
  } catch (err) {
    console.error('Error crítico en fetchAllShopsForAdmin:', err);
    return [];
  }
}

export async function updateShopSubscriptionStatus(
  shopId: string,
  status: 'active' | 'pending_payment' | 'past_due' | 'canceled',
  active: boolean
) {
  try {
    const { error } = await supabase
      .from('shops')
      .update({
        subscription_status: status,
        active: active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shopId);

    if (error) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${shopId},shop_id.eq.${shopId}`)
        .maybeSingle();

      if (userProfile) {
        await supabase.from('shops').upsert([{
          id: shopId,
          name: userProfile.full_name ? `Taller de ${userProfile.full_name}` : `Taller (${userProfile.email})`,
          owner_email: userProfile.email,
          subscription_status: status,
          plan_price: 15000,
          active: active,
        }]);
      }
    }

    return true;
  } catch (err) {
    console.error('Error al actualizar estado en Supabase:', err);
    return false;
  }
}

// =======================================================
// DESCUENTO AUTOMÁTICO DE STOCK DE INVENTARIO
// =======================================================

export async function deductInventoryStock(inventoryItemId: string, quantity: number = 1) {
  try {
    const { data: item } = await supabase
      .from('inventory')
      .select('stock')
      .eq('id', inventoryItemId)
      .maybeSingle();

    if (item) {
      const newStock = Math.max(0, (item.stock || 0) - quantity);
      await supabase
        .from('inventory')
        .update({ stock: newStock })
        .eq('id', inventoryItemId);
    }
  } catch (err) {
    console.warn('Error al descontar stock de inventario:', err);
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

// =======================================================
// SEGUIMIENTO B2C PÚBLICO POR DNI O CÓDIGO DE ORDEN
// =======================================================

export async function fetchPublicOrdersByDocumentIdOrCode(query: string): Promise<ServiceOrder[]> {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return [];

  try {
    const { data: customerData } = await supabase
      .from('customers')
      .select('id')
      .eq('document_id', cleanQuery);

    const customerIds = (customerData || []).map((c: any) => c.id);
    const codeQuery = cleanQuery.startsWith('#') ? cleanQuery : `#${cleanQuery}`;

    let supabaseQuery = supabase
      .from('service_orders')
      .select(`
        *,
        customers ( full_name, phone, document_id ),
        devices ( type, brand, model, serial_number )
      `);

    if (customerIds.length > 0) {
      supabaseQuery = supabaseQuery.or(`customer_id.in.(${customerIds.join(',')}),tracking_code.eq.${codeQuery}`);
    } else {
      supabaseQuery = supabaseQuery.eq('tracking_code', codeQuery);
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

    if (error) return [];

    return (data || []).map((ord: any) => ({
      id: ord.id,
      shop_id: ord.shop_id,
      tracking_code: ord.tracking_code,
      device_id: ord.device_id,
      customer_id: ord.customer_id,
      status: ord.status,
      reported_fault: ord.reported_fault,
      technical_diagnosis: ord.technical_diagnosis,
      estimated_completion: ord.estimated_completion,
      final_price: ord.final_price,
      created_at: ord.created_at,
      customer_name: ord.customers?.full_name || 'Cliente',
      customer_phone: ord.customers?.phone || '',
      customer_document_id: ord.customers?.document_id || '',
      device_info: `${ord.devices?.type || 'Equipo'} · ${ord.devices?.brand || ''} ${ord.devices?.model || ''}`.trim(),
    }));
  } catch (err) {
    return [];
  }
}
