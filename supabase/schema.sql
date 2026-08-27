-- =======================================================
-- PROREPAIR OPS - ESQUEMA COMPLETO DE BASE DE DATOS Y RLS
-- =======================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Definición de ENUMs
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'technician');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('received', 'in_progress', 'waiting_parts', 'ready', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabla de Talleres (Tenants / Inquilinos)
CREATE TABLE IF NOT EXISTS shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    owner_id UUID,
    settings JSONB NOT NULL DEFAULT '{
        "branding": {"logo_url": null, "primary_color": "#7c3aed"},
        "ticket": {"width_mm": 80, "terms": "No nos responsabilizamos por pérdida de datos. Garantía 30 días."},
        "whatsapp_phone": ""
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Usuarios y Roles (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'technician',
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    can_view_financials BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clave foránea owner_id en shops
ALTER TABLE shops DROP CONSTRAINT IF EXISTS fk_shops_owner;
ALTER TABLE shops ADD CONSTRAINT fk_shops_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

-- 5. Tabla de Clientes
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Dispositivos (Campos Dinámicos con JSONB)
CREATE TABLE IF NOT EXISTS devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    custom_attributes JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de Órdenes de Servicio
CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    tracking_code VARCHAR(20) NOT NULL UNIQUE,
    device_id UUID NOT NULL REFERENCES devices(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    technician_id UUID REFERENCES users(id),
    status order_status NOT NULL DEFAULT 'received',
    reported_fault TEXT NOT NULL,
    technical_diagnosis TEXT,
    internal_notes TEXT,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    estimated_cost DECIMAL(12,2) DEFAULT 0.00,
    final_price DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla de Inventario de Repuestos
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 5,
    cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =======================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Helper para obtener el shop_id del usuario autenticado
CREATE OR REPLACE FUNCTION get_current_shop_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() -> 'app_metadata' ->> 'shop_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Políticas de aislamiento por taller
DROP POLICY IF EXISTS "Shop Isolation Shops" ON shops;
CREATE POLICY "Shop Isolation Shops" ON shops FOR ALL USING (id = get_current_shop_id());

DROP POLICY IF EXISTS "Shop Isolation Users" ON users;
CREATE POLICY "Shop Isolation Users" ON users FOR ALL USING (shop_id = get_current_shop_id());

DROP POLICY IF EXISTS "Shop Isolation Customers" ON customers;
CREATE POLICY "Shop Isolation Customers" ON customers FOR ALL USING (shop_id = get_current_shop_id());

DROP POLICY IF EXISTS "Shop Isolation Devices" ON devices;
CREATE POLICY "Shop Isolation Devices" ON devices FOR ALL USING (shop_id = get_current_shop_id());

DROP POLICY IF EXISTS "Shop Isolation Orders" ON service_orders;
CREATE POLICY "Shop Isolation Orders" ON service_orders FOR ALL USING (shop_id = get_current_shop_id());

DROP POLICY IF EXISTS "Shop Isolation Inventory" ON inventory;
CREATE POLICY "Shop Isolation Inventory" ON inventory FOR ALL USING (shop_id = get_current_shop_id());

-- Políticas Públicas para el Portal de Seguimiento B2C (/track/[tracking_code])
DROP POLICY IF EXISTS "Public B2C Order Tracking" ON service_orders;
CREATE POLICY "Public B2C Order Tracking" ON service_orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public B2C Devices View" ON devices;
CREATE POLICY "Public B2C Devices View" ON devices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public B2C Shops View" ON shops;
CREATE POLICY "Public B2C Shops View" ON shops FOR SELECT USING (true);
