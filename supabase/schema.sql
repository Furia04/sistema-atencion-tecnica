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
  owner_email TEXT,
  subscription_status TEXT DEFAULT 'pending_payment',
  plan_price NUMERIC(10,2) DEFAULT 15000.00,
  active BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASEGURAR COLUMNAS EN CASO DE QUE LA TABLA YA EXISTIERA PREVIAMENTE
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending_payment';
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS plan_price NUMERIC(10,2) DEFAULT 15000.00;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT FALSE;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

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

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS shop_id UUID;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'owner';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS can_view_financials BOOLEAN DEFAULT TRUE;

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

-- POLÍTICAS TOTALES PARA SHOPS Y USERS
DROP POLICY IF EXISTS "Allow All Shops" ON shops;
CREATE POLICY "Allow All Shops" ON shops FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow All Users" ON users;
CREATE POLICY "Allow All Users" ON users FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow All Orders" ON service_orders;
CREATE POLICY "Allow All Orders" ON service_orders FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow All Customers" ON customers;
CREATE POLICY "Allow All Customers" ON customers FOR ALL USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Allow All Devices" ON devices;
CREATE POLICY "Allow All Devices" ON devices FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- =======================================================
-- 11. TRIGGER AUTOMÁTICO AL REGISTRAR UN USUARIO EN AUTH
-- =======================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_shop_name TEXT;
  v_full_name TEXT;
BEGIN
  v_shop_name := COALESCE(NEW.raw_user_meta_data->>'shop_name', 'Taller de ' || COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  
  -- 1. Insertar automáticamente en public.shops
  INSERT INTO public.shops (id, name, owner_email, subscription_status, plan_price, active)
  VALUES (
    NEW.id,
    v_shop_name,
    NEW.email,
    'pending_payment',
    15000.00,
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
    SET name = EXCLUDED.name,
        owner_email = EXCLUDED.owner_email;

  -- 2. Insertar automáticamente en public.users
  INSERT INTO public.users (id, shop_id, email, full_name, role, can_view_financials)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    v_full_name,
    'owner',
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =======================================================
-- 12. SINCRONIZACIÓN DE USUARIOS PREVIOS DE AUTH A SHOPS
-- =======================================================

INSERT INTO public.shops (id, name, owner_email, subscription_status, plan_price, active)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'shop_name', 'Taller de ' || COALESCE(raw_user_meta_data->>'full_name', email)),
  email,
  'pending_payment',
  15000.00,
  FALSE
FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, shop_id, email, full_name, role, can_view_financials)
SELECT 
  id,
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  'owner',
  TRUE
FROM auth.users
ON CONFLICT (id) DO NOTHING;
