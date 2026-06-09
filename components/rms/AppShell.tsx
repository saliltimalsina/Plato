"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input, Tooltip } from "@heroui/react";
import {
  ChevronDown, ChevronRight, Search, PanelLeft, Bell, Star, Settings,
} from "lucide-react";
import { NAV, MOBILE_TABS, NavItem } from "./nav";
import { ORANGE } from "./primitives";

function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(href + "/");
}
function groupActive(pathname: string, it: NavItem) {
  return it.children?.some((c) => isActive(pathname, c.href)) ?? false;
}

/* ── desktop sidebar ── */
function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex-shrink-0 h-full bg-warm-50 border-r border-[#EFEAE6] flex flex-col transition-[width] duration-200"
      style={{ width: collapsed ? 76 : 248 }}
    >
      {/* header */}
      <div className={collapsed ? "pt-4 pb-[14px] border-b border-[#F1ECE8] flex flex-col items-center gap-[10px]" : "px-4 pt-4 pb-[14px] border-b border-[#F1ECE8]"}>
        {collapsed ? (
          <>
            <PlatoMark />
            <IconBtn onClick={() => setCollapsed(false)} title="Expand"><PanelLeft size={17} color="#6B5F55" /></IconBtn>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatoMark size={26} />
                <span className="text-[19px] font-extrabold tracking-[-0.04em] text-ink lowercase">plato</span>
              </div>
              <IconBtn onClick={() => setCollapsed(true)} title="Collapse"><PanelLeft size={17} color="#6B5F55" /></IconBtn>
            </div>
            <div className="flex items-center gap-2 mt-[13px]">
              <Input size="sm" radius="md" placeholder="Search…" startContent={<Search size={15} color="#B0A69E" />}
                classNames={{ inputWrapper: "bg-warm-100 border border-[#EFEAE6] h-9 shadow-none" }} />
              <IconBtn dot title="Notifications"><Bell size={17} color="#6B5F55" /></IconBtn>
            </div>
          </>
        )}
      </div>

      {/* restaurant switcher */}
      {!collapsed && (
        <div className="px-4 pt-[14px] pb-2">
          <div className="flex items-center gap-[10px] p-[10px] rounded-[12px] cursor-pointer" style={{ background: "#FFF6F2", border: "1px solid #FBE3D9" }}>
            <div className="w-[34px] h-[34px] rounded-[9px] flex-shrink-0 text-white flex items-center justify-center text-[12px] font-bold" style={{ background: "linear-gradient(155deg,#F15022,#FF8A5B)" }}>MR</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-ink leading-tight">Mantra Restro</div>
              <div className="flex items-center gap-1 mt-[3px]">
                <span className="text-[10.5px] font-bold flex items-center gap-[2px]" style={{ color: "#E4A000" }}><Star size={10} fill="#E4A000" color="#E4A000" /> Premium</span>
                <span className="text-[10.5px] text-[#A8907E]">· 7 days left</span>
              </div>
            </div>
            <ChevronRight size={15} color="#C2A593" />
          </div>
        </div>
      )}

      {/* nav */}
      <nav className="flex-1 overflow-y-auto no-sb" style={{ padding: collapsed ? "6px 0" : "6px 12px" }}>
        {NAV.map((sec) => (
          <div key={sec.title} style={{ marginBottom: collapsed ? 8 : 14 }}>
            {collapsed ? <div className="h-px bg-warm-200 mx-4 my-2" />
              : <div className="text-[10.5px] font-bold tracking-[0.07em] uppercase text-[#B7A99E] px-2 py-[6px]">{sec.title}</div>}
            <div className="flex flex-col" style={{ gap: collapsed ? 3 : 0, alignItems: collapsed ? "center" : undefined }}>
              {sec.items.map((it) => collapsed
                ? <RailIcon key={it.label} it={it} pathname={pathname} />
                : <NavRow key={it.label} it={it} pathname={pathname} />)}
            </div>
          </div>
        ))}
      </nav>

      {/* footer */}
      {collapsed ? (
        <div className="py-3 border-t border-[#F1ECE8] flex justify-center"><Initials /></div>
      ) : (
        <div className="p-[14px] border-t border-[#F1ECE8] flex items-center gap-[10px]">
          <Initials />
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-bold text-ink">Salil Timalsina</div>
            <div className="text-[11px] text-warm-500">Admin</div>
          </div>
          <Settings size={16} color="#A89B8F" />
        </div>
      )}
    </aside>
  );
}

function NavRow({ it, pathname }: { it: NavItem; pathname: string }) {
  const Icon = it.icon;
  const gActive = groupActive(pathname, it);
  const [open, setOpen] = useState(gActive);
  const active = isActive(pathname, it.href);
  const hot = active || gActive;

  const row = (
    <div className="flex items-center gap-[9px] px-[9px] py-2 rounded-[9px] cursor-pointer mb-px transition-colors hover:bg-warm-100"
      style={{ background: hot && !it.children ? "#F4EFEB" : undefined }}>
      <Icon size={17} color={hot ? "#11181C" : "#8A7D72"} strokeWidth={1.9} />
      <span className="flex-1 text-[13.5px] whitespace-nowrap" style={{ fontWeight: hot ? 600 : 500, color: hot ? "#11181C" : "#6B5F55" }}>{it.label}</span>
      {it.children && <ChevronDown size={14} color="#A89B8F" style={{ transform: open ? "none" : "rotate(-90deg)" }} />}
    </div>
  );

  if (!it.children) {
    return it.href ? <Link href={it.href}>{row}</Link> : row;
  }
  return (
    <div>
      <div onClick={() => setOpen((o) => !o)}>{row}</div>
      {open && (
        <div className="pl-[18px] mb-1">
          {it.children.map((c) => {
            const on = isActive(pathname, c.href);
            return (
              <Link key={c.href} href={c.href} className="flex items-center gap-[9px] pl-3 pr-[10px] py-[2px] ml-1" style={{ borderLeft: "1.5px solid #ECE3DC" }}>
                <div className="rounded-[7px] px-[9px] py-[5px] flex-1" style={{ background: on ? "#FFF1EB" : "transparent" }}>
                  <span className="text-[12.5px] whitespace-nowrap" style={{ fontWeight: on ? 700 : 500, color: on ? ORANGE : "#7A6E63" }}>{c.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RailIcon({ it, pathname }: { it: NavItem; pathname: string }) {
  const Icon = it.icon;
  const active = isActive(pathname, it.href) || groupActive(pathname, it);
  const href = it.href || it.children?.[0]?.href || "#";
  return (
    <Tooltip content={it.label} placement="right" delay={0} closeDelay={0}
      classNames={{ content: "bg-[#2A231E] text-white text-[11.5px] font-semibold" }}>
      <Link href={href} className="w-[44px] h-[40px] rounded-[11px] flex items-center justify-center transition-colors hover:bg-warm-200"
        style={{ background: active ? "#FFF1EB" : "transparent" }}>
        <Icon size={19} color={active ? ORANGE : "#8A7D72"} strokeWidth={1.9} />
      </Link>
    </Tooltip>
  );
}

function IconBtn({ children, dot, onClick, title }: { children: React.ReactNode; dot?: boolean; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title} className="relative w-9 h-9 rounded-[10px] border border-[#EFEAE6] bg-white flex items-center justify-center flex-shrink-0 hover:bg-warm-100 transition-colors">
      {children}
      {dot && <span className="absolute top-[7px] right-2 w-[7px] h-[7px] rounded-full border-[1.5px] border-white" style={{ background: ORANGE }} />}
    </button>
  );
}
function Initials() {
  return <div className="w-8 h-8 rounded-full bg-[#E8DFD8] text-[#7A6E63] flex items-center justify-center text-[12px] font-bold">ST</div>;
}
function PlatoMark({ size = 28 }: { size?: number }) {
  return (
    <div className="rounded-[8px] flex items-center justify-center" style={{ width: size, height: size, background: ORANGE }}>
      <span className="text-white font-extrabold leading-none" style={{ fontSize: size * 0.5 }}>p</span>
    </div>
  );
}

/* ── mobile app bar + tab bar ── */
function MobileBar() {
  return (
    <header className="flex lg:hidden flex-shrink-0 items-center justify-between px-4 py-3 bg-warm-50 border-b border-[#EFEAE6]">
      <div className="flex items-center gap-2">
        <PlatoMark size={26} />
        <span className="text-[18px] font-extrabold tracking-[-0.04em] lowercase">plato</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-[38px] h-[38px] rounded-[11px] border border-[#EFEAE6] bg-white flex items-center justify-center">
          <Bell size={18} color="#6B5F55" />
          <span className="absolute top-2 right-[9px] w-[7px] h-[7px] rounded-full border-[1.5px] border-white" style={{ background: ORANGE }} />
        </button>
        <div className="w-[34px] h-[34px] rounded-full bg-[#E8DFD8] text-[#7A6E63] flex items-center justify-center text-[12px] font-bold">ST</div>
      </div>
    </header>
  );
}

function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="flex lg:hidden flex-shrink-0 bg-white border-t border-[#EFEAE6]">
      {MOBILE_TABS.map((t) => {
        const Icon = t.icon;
        const on = isActive(pathname, t.href);
        return (
          <Link key={t.label} href={t.href} className="flex-1 flex flex-col items-center gap-[3px] pt-[9px] pb-[10px]">
            <Icon size={21} color={on ? ORANGE : "#A89B8C"} strokeWidth={on ? 2.2 : 1.9} />
            <span className="text-[10.5px]" style={{ fontWeight: on ? 700 : 500, color: on ? ORANGE : "#A89B8C" }}>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-hidden flex text-ink bg-cream">
      <div className="hidden lg:flex h-full"><Sidebar /></div>
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <MobileBar />
        <main className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-7 py-4 lg:py-6 flex flex-col gap-[18px]">
          {children}
        </main>
        <MobileTabBar />
      </div>
    </div>
  );
}
