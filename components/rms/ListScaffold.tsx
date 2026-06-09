"use client";

import { useState } from "react";
import {
  Input, Button, Tabs, Tab, Popover, PopoverTrigger, PopoverContent,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure,
  type Selection,
} from "@heroui/react";
import { Search, SlidersHorizontal, Plus, MoreHorizontal, LucideIcon } from "lucide-react";
import { ORANGE, KpiRow, KpiData, PageHeader } from "./primitives";
import { DataTable, Column } from "./DataTable";
import type { ListState } from "./useListState";

export interface StatusTab { key: string; label: string; count: number }
export interface MoreAction { key: string; label: string; icon: LucideIcon }

interface Props<T extends { id: number }> {
  state: ListState<T>;
  title: string;
  subtitle?: React.ReactNode;
  kpis?: KpiData[];
  totalCount: number;
  columns: Column[];
  renderCell: (item: T, key: string) => React.ReactNode;
  renderCard: (item: T) => React.ReactNode;
  onRowOpen?: (item: T) => void;
  selectable?: boolean;

  searchPlaceholder?: string;
  statusTabs?: StatusTab[];
  statusKey?: string;
  onStatus?: (k: string) => void;

  /** filter popover/sheet body (render prop). filterCount drives the badge. */
  filterContent?: React.ReactNode;
  filterCount?: number;

  addLabel?: string;
  onAdd?: () => void;
  moreActions?: MoreAction[];
  onMore?: (key: string) => void;
}

export function ListScaffold<T extends { id: number }>(p: Props<T>) {
  const filterSheet = useDisclosure();
  const hasFilter = !!p.filterContent;
  const filterActive = (p.filterCount ?? 0) > 0;

  const statusTabsEl = p.statusTabs && (
    <Tabs
      size="sm" radius="md"
      selectedKey={p.statusKey}
      onSelectionChange={(k) => p.onStatus?.(String(k))}
      classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}
    >
      {p.statusTabs.map((t) => (
        <Tab key={t.key} title={<span className="inline-flex items-center gap-[6px]">{t.label}<span className="text-[11px] text-warm-500">{t.count}</span></span>} />
      ))}
    </Tabs>
  );

  return (
    <>
      {/* header (desktop actions) */}
      <PageHeader
        title={p.title}
        subtitle={p.subtitle}
        actions={
          <div className="hidden lg:flex items-center gap-[9px]">
            <Input size="sm" radius="md" placeholder={p.searchPlaceholder ?? "Search…"}
              value={p.state.search} onValueChange={p.state.setSearch}
              startContent={<Search size={15} color="#B0A69E" />}
              classNames={{ base: "w-[210px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
            {hasFilter && (
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button size="sm" radius="md" variant="bordered" className="h-9 border bg-white"
                    style={{ background: filterActive ? "#FFF1EB" : "#fff", borderColor: filterActive ? "#F8C9B6" : "#E6E1DC", color: filterActive ? ORANGE : "#5F564E" }}
                    startContent={<SlidersHorizontal size={15} color={filterActive ? ORANGE : "#5F564E"} />}>
                    Filter
                    {filterActive && <span className="min-w-[17px] h-[17px] px-1 rounded-full text-white text-[10.5px] font-bold flex items-center justify-center" style={{ background: ORANGE }}>{p.filterCount}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[230px]">{p.filterContent}</PopoverContent>
              </Popover>
            )}
            {p.onAdd && (
              <Button size="sm" radius="md" className="h-9 text-white font-bold"
                style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
                startContent={<Plus size={16} color="#fff" strokeWidth={2.4} />} onPress={p.onAdd}>
                {p.addLabel ?? "Add New"}
              </Button>
            )}
            {p.moreActions && p.moreActions.length > 0 && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly size="sm" radius="md" variant="bordered" className="h-9 w-9 min-w-9 bg-white border border-[#E6E1DC]">
                    <MoreHorizontal size={18} color="#9A8C80" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="More" onAction={(k) => p.onMore?.(String(k))}>
                  {p.moreActions.map((m) => {
                    const Icon = m.icon;
                    return <DropdownItem key={m.key} startContent={<Icon size={15} color="#8A7D72" />}>{m.label}</DropdownItem>;
                  })}
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        }
      />

      {p.kpis && p.kpis.length > 0 && <KpiRow kpis={p.kpis} />}

      {/* mobile: search + filter button */}
      <div className="flex lg:hidden gap-[9px]">
        <Input radius="lg" placeholder={p.searchPlaceholder ?? "Search…"} value={p.state.search} onValueChange={p.state.setSearch}
          startContent={<Search size={16} color="#B0A69E" />}
          classNames={{ base: "flex-1", inputWrapper: "bg-white border border-[#E6E1DC] h-11 shadow-none" }} />
        {hasFilter && (
          <Button isIconOnly radius="lg" className="w-11 h-11 min-w-11 relative"
            style={{ background: filterActive ? "#FFF1EB" : "#fff", border: `1px solid ${filterActive ? "#F8C9B6" : "#E6E1DC"}` }}
            onPress={filterSheet.onOpen}>
            <SlidersHorizontal size={19} color={filterActive ? ORANGE : "#6B5F55"} />
            {filterActive && <span className="absolute -top-[5px] -right-[5px] min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10.5px] font-bold flex items-center justify-center border-2 border-cream" style={{ background: ORANGE }}>{p.filterCount}</span>}
          </Button>
        )}
      </div>

      {/* status tabs: desktop in table toolbar, mobile as chips row */}
      {p.statusTabs && (
        <div className="flex lg:hidden gap-2 overflow-x-auto no-sb -mx-4 px-4">
          {p.statusTabs.map((t) => {
            const on = p.statusKey === t.key;
            return (
              <button key={t.key} onClick={() => p.onStatus?.(t.key)}
                className="inline-flex items-center gap-[6px] h-[34px] px-[14px] rounded-full text-[13px] font-bold whitespace-nowrap flex-shrink-0"
                style={{ border: `1px solid ${on ? ORANGE : "#E6E1DC"}`, background: on ? ORANGE : "#fff", color: on ? "#fff" : "#6B5F55" }}>
                {t.label}<span className="text-[11.5px] font-bold opacity-80">{t.count}</span>
              </button>
            );
          })}
        </div>
      )}

      <DataTable
        state={p.state}
        totalCount={p.totalCount}
        columns={p.columns}
        renderCell={p.renderCell}
        renderCard={p.renderCard}
        onRowOpen={p.onRowOpen}
        selectable={p.selectable}
        toolbarLeft={statusTabsEl}
      />

      {/* mobile FAB */}
      {p.onAdd && (
        <button onClick={p.onAdd}
          className="flex lg:hidden fixed right-[18px] bottom-[84px] w-14 h-14 rounded-[18px] items-center justify-center z-50"
          style={{ background: ORANGE, boxShadow: "0 8px 22px rgba(241,80,34,0.42)" }}>
          <Plus size={26} color="#fff" strokeWidth={2.4} />
        </button>
      )}

      {/* mobile filter sheet */}
      {hasFilter && (
        <Drawer isOpen={filterSheet.isOpen} onClose={filterSheet.onClose} placement="bottom" classNames={{ base: "rounded-t-[22px] max-h-[86%]" }}>
          <DrawerContent>
            <DrawerHeader className="flex-col items-start gap-0">
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em]">Filter</h2>
            </DrawerHeader>
            <DrawerBody className="pb-4">{p.filterContent}</DrawerBody>
            <DrawerFooter>
              <Button radius="lg" className="flex-1 h-[46px] font-bold text-white" style={{ background: ORANGE }} onPress={filterSheet.onClose}>
                Show {p.state.filtered.length}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export type { Selection };
