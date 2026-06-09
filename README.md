# Plato — Stock Items

Restaurant inventory management screen for **Mantra Restro**, rebuilt as a
Next.js app using **HeroUI** components. Desktop + mobile responsive from one
shared state hook.

## Stack
- Next.js 15 (App Router) + React 18 + TypeScript
- HeroUI v2 (component library) on Tailwind CSS v3
- lucide-react icons
- Custom "Warm Operations" theme (orange `#F15022`, cream `#FBF8F5`)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
app/
  layout.tsx          fonts, providers, global styles
  providers.tsx       HeroUIProvider + ToastProvider
  page.tsx            renders <StockApp/>
components/stock/
  data.ts             items, status logic, colors, formatters
  useStockState.ts    single source of truth (search/filter/sort/page/select/CRUD)
  kpis.ts             KPI card config builder
  shared.tsx          KpiCard, Spark, StatusChip, GroupChip, Meter
  Sidebar.tsx         collapsible desktop nav
  StockDesktop.tsx    KPIs + HeroUI Table (sort/select/pagination)
  StockMobile.tsx     KPI carousel, cards, FAB, bottom tabs, filter sheet
  AddEditModal.tsx    add / edit item (Modal)
  DetailDrawer.tsx    item detail (right Drawer)
  DeleteModal.tsx     delete confirm
  StockApp.tsx        responsive switch + mounts modals
```

Responsive is CSS-driven: `hidden lg:flex` (desktop ≥1024px) vs `flex lg:hidden`
(mobile), both fed by the same `useStockState()` instance — SSR-safe, no layout
flash.
# Plato
