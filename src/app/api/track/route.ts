import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json({ orders: [] });
  }

  const cleanQuery = query.trim().toUpperCase();
  const codeWithHash = cleanQuery.startsWith('#') ? cleanQuery : `#${cleanQuery}`;
  const codeWithoutHash = cleanQuery.replace(/^#/, '');

  try {
    // 1. Buscar clientes que coincidan con el DNI / Documento ingresado
    const { data: customerData } = await supabase
      .from('customers')
      .select('id')
      .eq('document_id', cleanQuery);

    const customerIds = (customerData || []).map((c: any) => c.id);
    const trackingFilters = `tracking_code.eq.${codeWithHash},tracking_code.eq.${codeWithoutHash},tracking_code.ilike.%${codeWithoutHash}%`;

    // 2. Consultar directamente service_orders sin llamadas RPC
    let rawQuery = supabase.from('service_orders').select('*');
    if (customerIds.length > 0) {
      rawQuery = rawQuery.or(`customer_id.in.(${customerIds.join(',')}),${trackingFilters}`);
    } else {
      rawQuery = rawQuery.or(trackingFilters);
    }

    const { data: dbOrders, error: ordersError } = await rawQuery.order('created_at', { ascending: false });

    if (ordersError || !dbOrders || dbOrders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    // 3. Poblar relaciones de clientes, dispositivos y talleres de forma desacoplada
    const customerIdList = Array.from(new Set(dbOrders.map((o: any) => o.customer_id).filter(Boolean)));
    const deviceIdList = Array.from(new Set(dbOrders.map((o: any) => o.device_id).filter(Boolean)));
    const shopIdList = Array.from(new Set(dbOrders.map((o: any) => o.shop_id).filter(Boolean)));

    const [custRes, devRes, shopRes] = await Promise.all([
      customerIdList.length > 0 ? supabase.from('customers').select('*').in('id', customerIdList) : { data: [] },
      deviceIdList.length > 0 ? supabase.from('devices').select('*').in('id', deviceIdList) : { data: [] },
      shopIdList.length > 0 ? supabase.from('shops').select('*').in('id', shopIdList) : { data: [] },
    ]);

    const custMap = new Map((custRes.data || []).map((c: any) => [c.id, c]));
    const devMap = new Map((devRes.data || []).map((d: any) => [d.id, d]));
    const shopMap = new Map((shopRes.data || []).map((s: any) => [s.id, s]));

    const formattedOrders = dbOrders.map((ord: any) => {
      const cust = custMap.get(ord.customer_id);
      const dev = devMap.get(ord.device_id);
      const shp = shopMap.get(ord.shop_id);

      return {
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
        warranty_period: ord.warranty_period,
        warranty_until: ord.warranty_until,
        delivered_at: ord.delivered_at,
        created_at: ord.created_at,
        customer_name: cust?.full_name || 'Cliente',
        customer_phone: cust?.phone || '',
        customer_document_id: cust?.document_id || '',
        device_info: dev ? `${dev.type || 'Equipo'} · ${dev.brand || ''} ${dev.model || ''}`.trim() : 'Equipo',
        shop_name: shp?.name || 'Taller de Servicio Técnico',
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (err) {
    return NextResponse.json({ orders: [] });
  }
}
