import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopId, email, shopName, planPrice } = body;

    if (!shopId) {
      return NextResponse.json(
        { error: 'El parámetro shopId es requerido.' },
        { status: 400 }
      );
    }

    const mpAccessToken = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

    // Determinar la URL base pública para redirecciones y webhooks
    const urlObj = new URL(request.url);
    const hostHeader = request.headers.get('x-forwarded-host') || request.headers.get('host') || urlObj.host;
    const protoHeader = request.headers.get('x-forwarded-proto') || urlObj.protocol.replace(':', '') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || `${protoHeader}://${hostHeader}`;

    if (!mpAccessToken) {
      console.warn('MP_ACCESS_TOKEN no configurado. Operando en modo simulación de checkout.');
      return NextResponse.json({
        id: `sim-pref-${Date.now()}`,
        init_point: `${baseUrl}/checkout?status=success&shop_id=${encodeURIComponent(shopId)}&simulated=true`,
        sandbox_init_point: `${baseUrl}/checkout?status=success&shop_id=${encodeURIComponent(shopId)}&simulated=true`,
        simulated: true,
      });
    }

    // Inicializar cliente oficial de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: mpAccessToken,
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    const price = Number(planPrice) > 0 ? Number(planPrice) : 15000;
    const cleanShopName = shopName?.trim() || 'Taller de Servicio Técnico';

    const preferenceData = {
      items: [
        {
          id: 'plan-taller-pro',
          title: `Membresía JaTech — Plan Taller Pro (${cleanShopName})`,
          description: 'Acceso mensual completo al sistema de gestión y órdenes de servicio técnico',
          quantity: 1,
          unit_price: price,
          currency_id: 'ARS',
        },
      ],
      payer: email
        ? {
            email: email.trim().toLowerCase(),
          }
        : undefined,
      external_reference: shopId,
      back_urls: {
        success: `${baseUrl}/checkout?status=success&shop_id=${encodeURIComponent(shopId)}`,
        failure: `${baseUrl}/checkout?status=failure&shop_id=${encodeURIComponent(shopId)}`,
        pending: `${baseUrl}/checkout?status=pending&shop_id=${encodeURIComponent(shopId)}`,
      },
      auto_return: 'approved' as const,
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'JATECH PRO',
    };

    const result = await preference.create({ body: preferenceData });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error: any) {
    console.error('Error al generar preferencia en Mercado Pago:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Error al conectar con la pasarela de Mercado Pago.',
      },
      { status: 500 }
    );
  }
}
