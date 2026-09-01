-- =======================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS POSTGRESQL / SUPABASE
-- SISTEMA DE ATENCIÓN TÉCNICA MULTIRUBRO & SAAS
-- =======================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TIPOS PERSONALIZADOS (ENUMS)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('owner', 'technician', 'superadmin');
  ELSE
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'superadmin';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM (
      'recibido',
      'en_revision',
      'esperando_repuesto',
      'esperando_cliente',
      'para_entregar',
      'abandonado'
    );
  END IF;
END $$;

-- 3. TABLA DE TALLERES (SHOPS / TENANTS)
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'pending_payment',
  plan_price NUMERIC(10,2) DEFAULT 15000.00,
  active BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE USUARIOS DEL SISTEMA (USERS / PROFILES)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'owner',
  can_view_financials BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE CLIENTES (CUSTOMERS)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  document_id TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA DE DISPOSITIVOS / EQUIPOS (DEVICES)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT,
  custom_attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA DE ÓRDENES DE SERVICIO (SERVICE_ORDERS)
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  tracking_code TEXT UNIQUE NOT NULL,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id),
  status order_status DEFAULT 'recibido',
  reported_fault TEXT NOT NULL,
  technical_diagnosis TEXT,
  internal_notes TEXT,
  estimated_completion TEXT,
  estimated_cost NUMERIC(10,2) DEFAULT 0.00,
  final_price NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA DE INVENTARIO Y REPUESTOS (INVENTORY)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 2,
  cost NUMERIC(10,2) DEFAULT 0.00,
  price NUMERIC(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA DE PLANTILLAS POR CATEGORÍA DE DISPOSITIVO (DEVICE_CATEGORY_TEMPLATES)
CREATE TABLE IF NOT EXISTS device_category_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_category_templates ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACCESO HABILITADAS PARA SHOPS Y USERS
DROP POLICY IF EXISTS "Public Admin Select Shops" ON shops;
CREATE POLICY "Public Admin Select Shops" ON shops FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Insert Shops" ON shops;
CREATE POLICY "Public Insert Shops" ON shops FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public Update Shops" ON shops;
CREATE POLICY "Public Update Shops" ON shops FOR UPDATE USING (TRUE);

DROP POLICY IF EXISTS "Public Select Users" ON users;
CREATE POLICY "Public Select Users" ON users FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Insert Users" ON users;
CREATE POLICY "Public Insert Users" ON users FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public Update Users" ON users;
CREATE POLICY "Public Update Users" ON users FOR UPDATE USING (TRUE);

-- POLÍTICAS RLS PÚBLICAS PARA SEGUIMIENTO
DROP POLICY IF EXISTS "Public Tracking Search" ON service_orders;
CREATE POLICY "Public Tracking Search" ON service_orders FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Customers Tracking" ON customers;
CREATE POLICY "Public Customers Tracking" ON customers FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public Devices Tracking" ON devices;
CREATE POLICY "Public Devices Tracking" ON devices FOR SELECT USING (TRUE);
