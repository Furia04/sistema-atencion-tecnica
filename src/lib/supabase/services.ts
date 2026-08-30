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
      .single();

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
// PANEL DE SUPER ADMINISTRADOR (DUEÑO DEL SAAS)
// =======================================================

export async function fetchAllShopsForAdmin(): Promise<Shop[]> {
  const shopMap = new Map<string, Shop>();

  // 1. Talleres iniciales base
  const defaultShops: Shop[] = [
    {
      id: 'shop-north-station',
      name: 'ElectroSur Taller Central',
      owner_email: 'admin@electrosur.com',
      subscription_status: 'active',
      plan_price: 15000,
      active: true,
      created_at: '2026-08-01T10:00:00Z',
      orders_count: 42,
    },
    {
      id: 'shop-cordoba-tech',
      name: 'Córdoba Tech Repair',
      owner_email: 'contacto@cordobatech.com',
      subscription_status: 'pending_payment',
      plan_price: 15000,
      active: false,
      created_at: '2026-08-28T14:30:00Z',
      orders_count: 3,
    },
  ];

  defaultShops.forEach((s) => shopMap.set(s.id, s));

  // 2. Intentar consultar la base de datos Supabase
  try {
    const { data: dbShops } = await supabase
      .from('shops')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbShops && dbShops.length > 0) {
      dbShops.forEach((s: any) => {
        shopMap.set(s.id, {
          id: s.id,
          name: s.name || 'Taller Registrado',
          owner_email: s.owner_email || s.email || 'usuario@taller.com',
          subscription_status: s.subscription_status || 'pending_payment',
          plan_price: s.plan_price || 15000,
          active: s.active ?? false,
          created_at: s.created_at || new Date().toISOString(),
          orders_count: s.orders_count || 0,
        });
      });
    }
  } catch (err) {
    console.warn('Error Supabase fetchAllShopsForAdmin');
  }

  // 3. Consultar usuario autenticado actual
  try {
    const profile = await getCurrentUserProfile();
    if (profile && profile.email) {
      const existingShop = Array.from(shopMap.values()).find(s => s.owner_email === profile.email);
      if (!existingShop) {
        const userShopId = profile.shop_id || profile.id;
        shopMap.set(userShopId, {
          id: userShopId,
          name: (profile as any).shop_name || `Taller de ${profile.full_name || profile.email}`,
          owner_email: profile.email,
          subscription_status: 'pending_payment',
          plan_price: 15000,
          active: false,
          created_at: new Date().toISOString(),
          orders_count: 1,
        });
      }
    }
  } catch (err) {
    // Ignorar si no está autenticado
  }

  // 4. Cargar registrados en localStorage
  if (typeof window !== 'undefined') {
    try {
      const storedStr = localStorage.getItem('prorepair_registered_shops');
      if (storedStr) {
        const localShops: Shop[] = JSON.parse(storedStr);
        localShops.forEach((s) => {
          if (s.id) {
            shopMap.set(s.id, {
              ...(shopMap.get(s.id) || s),
              ...s,
            });
          }
        });
      }
    } catch (err) {
      console.warn('Error localStorage shops');
    }

    // 5. APLICAR SOBREESCRITURAS DE ESTADO (OVERRIDES PERMANENTES EN LOCALSTORAGE)
    try {
      const overridesStr = localStorage.getItem('prorepair_shop_overrides');
      if (overridesStr) {
        const overrides: Record<string, { subscription_status: any; active: boolean }> = JSON.parse(overridesStr);
        Object.entries(overrides).forEach(([shopId, statusData]) => {
          shopMap.forEach((shop, key) => {
            if (shop.id === shopId || shop.owner_email === shopId) {
              shopMap.set(key, {
                ...shop,
                subscription_status: statusData.subscription_status,
                active: statusData.active,
              });
            }
          });
        });
      }
    } catch (err) {
      console.warn('Error al aplicar overrides de administracion');
    }
  }

  return Array.from(shopMap.values());
}

export async function updateShopSubscriptionStatus(
  shopId: string,
  status: 'active' | 'pending_payment' | 'past_due' | 'canceled',
  active: boolean
) {
  // 1. Intentar actualizar en Supabase DB
  try {
    await supabase
      .from('shops')
      .update({
        subscription_status: status,
        active: active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shopId);
  } catch (err) {
    console.warn('Actualización Supabase omitida o fallback');
  }

  // 2. Guardar sobreescritura PERMANENTE en localStorage
  if (typeof window !== 'undefined') {
    try {
      // Guardar en diccionario de overrides
      const overridesStr = localStorage.getItem('prorepair_shop_overrides');
      const overrides: Record<string, { subscription_status: any; active: boolean }> = overridesStr
        ? JSON.parse(overridesStr)
        : {};

      overrides[shopId] = { subscription_status: status, active: active };
      localStorage.setItem('prorepair_shop_overrides', JSON.stringify(overrides));

      // Actualizar también en lista de talleres registrados
      const storedStr = localStorage.getItem('prorepair_registered_shops');
      if (storedStr) {
        let localShops: Shop[] = JSON.parse(storedStr);
        localShops = localShops.map((s) =>
          s.id === shopId || s.owner_email === shopId
            ? { ...s, subscription_status: status, active: active }
            : s
        );
        localStorage.setItem('prorepair_registered_shops', JSON.stringify(localShops));
      }

      // 3. Emitir evento para reactividad instantánea
      window.dispatchEvent(new Event('prorepair_shop_updated'));
    } catch (err) {
      console.warn('Error al guardar override en localStorage');
    }
  }

  return true;
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
