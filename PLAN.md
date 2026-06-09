# Plato RMS — Build Plan

Goal: grow the current single Stock Items screen into the **full Plato RMS** in
the existing Next.js + HeroUI app. The **Stock Items UI we built is the design
base** — every other page reuses its visual language (warm theme, KPI cards,
toolbar, HeroUI Table, detail view, create/edit modal, delete confirm, toasts,
mobile cards + bottom sheets + tab bar + FAB).

RMS 2 (the Vite export) is used **only to source scope** — entities, columns,
fields, modals, detail layouts. **We do not copy its UI.** All visuals follow the
Plato base.

---

## 1. Architecture changes (foundation)

- **Multi-route App Router** under one shared shell.
  - `app/(rms)/layout.tsx` → renders `AppShell` (Sidebar + Topbar) once; pages
    render inside. Client-only mount (keep the `ssr:false` pattern that fixed
    React-Aria hydration).
  - Routes:
    `/inventory/stock-items`, `/inventory/consumption`, `/inventory/suppliers`,
    `/inventory/suppliers/[id]` (own detail page), `/inventory/measuring-units`,
    `/inventory/stock-groups`, `/inventory/stock-history`, `/staff`,
    plus stubs (below). `/` redirects to `/inventory/stock-items`.
- **AppShell**: promote current `Sidebar` to full nav (real routing via
  `next/link` + active state from `usePathname`) + add a **Topbar** (global
  search, notifications, profile). Mobile: bottom tab bar + the existing
  responsive switch.

## 2. Shared primitives to extract (from Stock Items → reusable)

Refactor the one-off Stock Items pieces into `components/rms/` so all pages share them:
- `ListPage` scaffold: page header (title + subtitle + actions), `KpiRow`,
  toolbar (search, Filter popover, status Tabs, Sort, More menu, primary Add btn).
- `DataTable`: thin wrapper over HeroUI Table preset with our fixes baked in
  (warm flat selection, compact padding, sort, checkbox-only select via
  `onRowAction`, pagination, empty state).
- `KpiCard`, `Spark`, `StatusChip`, `GroupChip` (already exist — move/generalize).
- `DetailDrawer` shell + `DetailPage` shell (tabbed, for rich entities).
- `CreateEditModal` shell (compact fields, rounded, clipped corners — the fixes
  we just made) + `DeleteModal`.
- `MobileCard` + `BottomSheet` patterns.
- Generalize `useStockState` → `useListState<T>` (search/filter/sort/page/select/CRUD/toasts).

## 3. Pages (list + detail + modals)

Detail style per entity: **drawer** for light entities, **full page with tabs**
for rich ones ("some have own view").

| Page | List columns / KPIs | Detail | Create/Edit | Other modals |
|---|---|---|---|---|
| **Stock Items** *(base — exists)* | KPIs: Items / Value / Restocked / Low · cols SN, Item, Group, Rate, Opening, Closing, Value, Status, Supplier | **Drawer**, upgrade to tabs: Overview / Stock Ledger / Consumption (dish + add-on tables) | Add/Edit (done) | Delete (done), Reset stock |
| **Consumption** | KPIs: Total Consumptions, Total Cost · cols SN, Finished Good, Sales Price, Type, Cost, Item Used | **Drawer**: stocks-used breakdown | Create Consumption (finished good, type, sales price, cost, items-used rows) | Delete |
| **Suppliers** | KPIs: To Receive / To Pay / Net · cols SN, Supplier, Phone, DOB, Due Amount, Email | **Own full page** `/suppliers/[id]`: summary cards (Total Purchase / Purchase Return / Payment In / Payment Out), tabs **Transaction / Activity / Credit List**, actions Contact / Send Invoice / Statement | Create Supplier (name, phone, dob, email, address, legal name, tax no.) | **Payment In, Payment Out, Add Purchase Bill, Add Debit Note**, Delete |
| **Staff** | status tabs Active / Pending · cols SN, Name, Role, Position, Phone, Email (role chips: Kitchen/Billing/Server/Admin) | Drawer | Create/Edit Staff | Delete |
| **Measuring Unit** | simple list (Name, Symbol, base ratio) | inline | Create/Edit | Delete |
| **Stock Group** | simple list (Name, color, # items) | inline | Create/Edit | Delete |
| **Stock History** | read-only ledger (Date, Item, Type In/Out, Qty, Balance) | row drawer | — | — |

## 4. Stub pages (nav works, "coming soon" empty state)
Dashboard, Orders, Tables, Services, Notification, Menu, Customer, Finance,
Website, Settings. Routed + styled placeholder so the shell is complete; fill later.

## 5. Data layer
- `components/rms/data/` one module per entity (typed mock data sourced from RMS 2
  values — Salil/Priya/Ramesh suppliers, the 9 stock items, 5 consumptions, staff).
- In-memory CRUD via `useListState` hook per page (no backend yet; swap to API later).

## 6. Mobile
Every list → card list + FAB + filter/sort bottom sheet + row-action sheet.
Bottom tab bar (Home / Orders / Inventory / Staff / More). Detail → bottom sheet
(or full screen for Supplier).

## 7. QA
Extend the Playwright harness (`qa-shots.mjs`) to screenshot **every page** at
desktop + mobile, plus each modal/detail, and assert no console errors. Self-review
each before handing back (computed-style checks for the tricky bits).

---

## Build order (phased)
1. **Foundation** — routing, AppShell (sidebar routing + topbar), extract shared primitives, generalize `useListState`. Migrate Stock Items onto them (no visual change).
2. **Suppliers** — list + KPIs + **full detail page (tabs)** + Create + the 4 finance modals. (Biggest; proves the "own view" pattern.)
3. **Consumption** — list + detail drawer + create.
4. **Staff** — list + status tabs + detail + create.
5. **Stock Item detail upgrade** — add Overview/Ledger/Consumption tabs.
6. **Measuring Unit / Stock Group / Stock History** — simple lists.
7. **Stubs** + nav completeness.
8. **Mobile pass** across all pages.
9. **QA harness** across everything + fix.

## Out of scope (for now)
Real backend/API, auth, the deep feature logic inside Orders/Tables/Menu/Finance
(stubbed). Can follow once the UI shell is complete.
