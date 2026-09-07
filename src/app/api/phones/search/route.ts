import { NextRequest, NextResponse } from 'next/server';
import phonesData from '@/data/phones.json';

interface PhoneResult {
  id: string;
  brand: string;
  model: string;
  full_name: string;
}

const LOCAL_PHONE_CATALOG = phonesData as PhoneResult[];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() || '';
  const brandFilter = searchParams.get('brand')?.trim() || '';

  if (!query && !brandFilter) {
    // Si no hay consulta, devolver los más comunes de forma predeterminada
    return NextResponse.json({
      results: LOCAL_PHONE_CATALOG.slice(0, 15),
      source: 'local_database',
    });
  }

  const normalizedQuery = query.toLowerCase();
  const normalizedBrand = brandFilter.toLowerCase();

  // Filtrar en la base de datos local JSON
  const filtered = LOCAL_PHONE_CATALOG.filter((phone) => {
    const matchesBrand = !normalizedBrand || phone.brand.toLowerCase() === normalizedBrand;
    const matchesQuery =
      !normalizedQuery ||
      phone.full_name.toLowerCase().includes(normalizedQuery) ||
      phone.model.toLowerCase().includes(normalizedQuery) ||
      phone.brand.toLowerCase().includes(normalizedQuery);

    return matchesBrand && matchesQuery;
  });

  return NextResponse.json({
    results: filtered.slice(0, 50), // Máximo 50 sugerencias
    source: 'local_database',
  });
}
