# Graph Report - Sistema de Atencion Tecnica  (2026-09-02)

## Corpus Check
- Corpus is ~29,693 words - fits in a single context window. You may not need a graph.

## Summary
- 181 nodes · 319 edges · 15 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- TypeScript Config & Env
- Inventory & Order Models
- App Package Dependencies
- Public & Auth Views
- Order Intake & Device Settings
- Build Tooling & Dev Dependencies
- Dashboard Services & Permissions
- Admin & Order Tracking Services
- Customer Management & Data
- Dashboard Layout & Navigation
- Root App Layout
- Next.js Configuration
- Tailwind Configuration

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `UserProfile` - 13 edges
3. `ServiceOrder` - 13 edges
4. `Logo()` - 11 edges
5. `supabase` - 11 edges
6. `getCurrentUserProfile()` - 10 edges
7. `Shop` - 8 edges
8. `InventoryItem` - 8 edges
9. `OrderStatus` - 7 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `loadDashboardData()` --calls--> `getCurrentUserProfile()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/page.tsx → src/lib/supabase/services.ts
- `DashboardLayout()` --calls--> `getCurrentUserProfile()`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/supabase/services.ts
- `loadTemplates()` --calls--> `getCurrentUserProfile()`  [EXTRACTED]
  src/app/(dashboard)/orders/new/page.tsx → src/lib/supabase/services.ts
- `loadShopData()` --calls--> `getCurrentUserProfile()`  [EXTRACTED]
  src/app/(dashboard)/settings/page.tsx → src/lib/supabase/services.ts
- `HeaderProps` --references--> `UserProfile`  [EXTRACTED]
  src/components/dashboard/header.tsx → src/types/index.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "TypeScript Config & Env"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 1 - "Inventory & Order Models"
Cohesion: 0.14
Nodes (17): INITIAL_INVENTORY, DEMO_USER, INITIAL_DEMO_INVENTORY, INITIAL_DEMO_ORDERS, TrackPageProps, BudgetCalculator(), BudgetCalculatorProps, BudgetItem (+9 more)

### Community 2 - "App Package Dependencies"
Cohesion: 0.08
Nodes (23): clsx, lucide-react, dependencies, clsx, lucide-react, next, react, react-dom (+15 more)

### Community 3 - "Public & Auth Views"
Cohesion: 0.16
Nodes (3): Logo(), LogoProps, supabase

### Community 4 - "Order Intake & Device Settings"
Cohesion: 0.16
Nodes (16): DashboardLayout(), DEFAULT_TEMPLATES, NewOrderIntakePage(), loadTemplates(), DEFAULT_TEMPLATES, ErgonomicSettingsPage(), loadShopData(), CustomFieldsRenderer() (+8 more)

### Community 5 - "Build Tooling & Dev Dependencies"
Cohesion: 0.13
Nodes (15): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom (+7 more)

### Community 6 - "Dashboard Services & Permissions"
Cohesion: 0.27
Nodes (10): DashboardPage(), loadDashboardData(), ServiceOrdersPage(), loadData(), hasFinancialAccess(), sanitizeInventoryItem(), sanitizeServiceOrder(), fetchInventory() (+2 more)

### Community 7 - "Admin & Order Tracking Services"
Cohesion: 0.33
Nodes (6): SuperAdminDashboardPage(), MOCK_DEMO_ORDERS, TrackByDniPage(), fetchAllShopsForAdmin(), fetchPublicOrdersByDocumentIdOrCode(), updateShopSubscriptionStatus()

### Community 8 - "Customer Management & Data"
Cohesion: 0.29
Nodes (6): ExtendedCustomer, MOCK_CUSTOMERS, MOCK_DEVICES, MOCK_ORDERS, Customer, Device

### Community 9 - "Dashboard Layout & Navigation"
Cohesion: 0.46
Nodes (5): Header(), HeaderProps, Sidebar(), SidebarProps, UserProfile

## Knowledge Gaps
- **62 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 80 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Logo()` connect `Public & Auth Views` to `Dashboard Layout & Navigation`, `Admin & Order Tracking Services`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Build Tooling & Dev Dependencies` to `App Package Dependencies`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config & Env` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Inventory & Order Models` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `App Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Build Tooling & Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._