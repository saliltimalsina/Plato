import {
  LayoutDashboard, ShoppingBag, Grid2X2, Zap, Bell, UtensilsCrossed,
  Package, Users, UserCheck, Wallet, Globe, Settings, LucideIcon,
} from "lucide-react";

export interface NavChild {
  label: string;
  href: string;
}
export interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavChild[];
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Orders", icon: ShoppingBag, href: "/orders" },
      { label: "Tables", icon: Grid2X2, href: "/tables" },
      { label: "Services", icon: Zap, href: "/services" },
      { label: "Notification", icon: Bell, href: "/notification" },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Menu",
        icon: UtensilsCrossed,
        children: [
          { label: "Dishes",          href: "/menu/dishes" },
          { label: "Category",        href: "/menu/category" },
          { label: "Add-Ons & Extras", href: "/menu/addons" },
          { label: "Menu Set",        href: "/menu/menu-sets" },
          { label: "Sub Menu",        href: "/menu/sub-menus" },
          { label: "Combo Offer",     href: "/menu/combo-offers" },
        ],
      },
      {
        label: "Inventory",
        icon: Package,
        children: [
          { label: "Stock Item", href: "/inventory/stock-items" },
          { label: "Consumption", href: "/inventory/consumption" },
          { label: "Suppliers", href: "/inventory/suppliers" },
          { label: "Measuring Unit", href: "/inventory/measuring-units" },
          { label: "Stock Group", href: "/inventory/stock-groups" },
          { label: "Stock History", href: "/inventory/stock-history" },
        ],
      },
      { label: "Customer", icon: Users, href: "/customer" },
      { label: "Staff", icon: UserCheck, href: "/staff" },
    ],
  },
  {
    title: "Business & System",
    items: [
      { label: "Finance", icon: Wallet, href: "/finance" },
      { label: "Website", icon: Globe, href: "/website" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

// Mobile bottom tab bar
export const MOBILE_TABS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Orders", icon: ShoppingBag, href: "/orders" },
  { label: "Inventory", icon: Package, href: "/inventory/stock-items" },
  { label: "Staff", icon: UserCheck, href: "/staff" },
  { label: "More", icon: Settings, href: "/settings" },
];
