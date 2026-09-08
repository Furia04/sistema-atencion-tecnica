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
    // 1. Intentar mediante la función RPC de PostgreSQL de forma silenciosa en el servidor
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_public_order_tracking', {
      p_query: cleanQuery,
    });

    if (!rpcError && rpcData && rpcData.length > 0) {
      const orders = rpcData.map((ord: any) => ({
        id: ord.id,
        tracking_code: ord.tracking_code,
        status: ord.status,
        reported_fault: ord.reported_fault,
        technical_diagnosis: ord.technical_diagnosis,
        estimated_completion: ord.estimated_completion,
        final_price: ord.final_price,
        warranty_period: ord.warranty_period,
        warranty_until: ord.warranty_until,
        delivered_at: ord.delivered_at,
        created_at: ord.created_at,
        customer_name: ord.customer_name || 'Cliente',
        customer_phone: ord.customer_phone || '',
        customer_document_id: ord.customer_document_id || '',
        device_info: `${ord.device_type || 'Equipo'} · ${ord.device_brand || ''} ${ord.device_model || ''}`.trim(),
      }));

      return NextResponse.json({ orders });
    }

    // 2. Consulta directa a Supabase en el servidor como fallback transparente
    const { data: customerData } = await supabase
      .from('customers')
      .select('id')
      .eq('document_id', cleanQuery);

    const customerIds = (customerData || []).map((c: any) => c.id);
    const trackingFilters = `tracking_code.eq.${codeWithHash},tracking_code.eq.${codeWithoutHash},tracking_code.ilike.%${codeWithoutHash}%`;

    let supabaseQuery = supabase
      .from('service_orders')
      .select(`
        *,
        customers ( full_name, phone, document_id ),
        devices ( type, brand, model, serial_number )
      `);

    if (customerIds.length > 0) {
      supabaseQuery = supabaseQuery.or(`customer_id.in.(${customerIds.join(',')}),${trackingFilters}`);
    } else {
      supabaseQuery = supabaseQuery.or(trackingFilters);
    }

    const { data: ordersData, error: ordersError } = await supabaseQuery.order('created_at', { ascending: false });

    if (!ordersError && ordersData && ordersData.length > 0) {
      const orders = ordersData.map((ord: any) => ({
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
        customer_name: ord.customers?.full_name || ord.customer_name || 'Cliente',
        customer_phone: ord.customers?.phone || ord.customer_phone || '',
        customer_document_id: ord.customers?.document_id || ord.customer_document_id || '',
        device_info: ord.device_info || `${ord.devices?.type || 'Equipo'} · ${ord.devices?.brand || ''} ${ord.devices?.model || ''}`.trim(),
      }));

      return NextResponse.json({ orders });
    }

    return NextResponse.json({ orders: [] });
  } catch (err) {
    return NextResponse.json({ orders: [] });
  }
}
