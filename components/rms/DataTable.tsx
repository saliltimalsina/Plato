"use client";

import { useMemo } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  type Selection, type SortDescriptor,
} from "@heroui/react";
import { Trash2, Search, ChevronDown } from "lucide-react";
import { ORANGE } from "./primitives";
import type { ListState } from "./useListState";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
}

interface Props<T extends { id: number }> {
  state: ListState<T>;
  totalCount: number;
  columns: Column[];
  renderCell: (item: T, key: string) => React.ReactNode;
  renderCard: (item: T) => React.ReactNode;
  onRowOpen?: (item: T) => void;
  selectable?: boolean;
  toolbarLeft?: React.ReactNode; // e.g. status tabs (hidden while selecting)
  emptyTitle?: string;
  emptyHint?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
}

export function DataTable<T extends { id: number }>({
  state, totalCount, columns, renderCell, renderCard, onRowOpen,
  selectable = true, toolbarLeft, emptyTitle = "No items found", emptyHint = "Try adjusting your search or filters.",
  emptyIcon, emptyAction,
}: Props<T>) {
  const selectedKeys: Selection = useMemo(() => new Set(state.selected.map(String)), [state.selected]);
  const onSelectionChange = (keys: Selection) => {
    if (keys === "all") state.setSelected(state.pageItems.map((i) => i.id));
    else state.setSelected([...keys].map((k) => Number(k)));
  };
  const sortDescriptor: SortDescriptor = {
    column: state.sortKey ?? columns.find((c) => c.sortable)?.key ?? "",
    direction: state.sortDir === "asc" ? "ascending" : "descending",
  };

  const empty = (
    <div className="py-[60px] text-center">
      {emptyIcon ?? (
        <div className="w-[52px] h-[52px] rounded-[14px] bg-warm-100 inline-flex items-center justify-center mb-3">
          <Search size={22} color="#C9BCB0" />
        </div>
      )}
      <div className="text-[14.5px] font-bold text-ink">{emptyTitle}</div>
      <div className="text-[13px] text-warm-500 mt-[3px]">{emptyHint}</div>
      {emptyAction && <div className="mt-4 inline-flex">{emptyAction}</div>}
    </div>
  );

  return (
    <>
      {/* ── desktop: table card ── */}
      <div className="hidden lg:flex flex-1 min-h-0 bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden flex-col">
        <div className="h-[52px] flex-shrink-0 flex items-center justify-between px-4 border-b border-warm-200">
          {selectable && state.selected.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-ink">{state.selected.length} selected</span>
              <Button size="sm" variant="flat" className="h-[30px] font-bold text-[12.5px]"
                style={{ color: ORANGE, background: "#FFF1EB", border: "1px solid #F8C9B6" }}
                startContent={<Trash2 size={14} color={ORANGE} />}
                onPress={() => state.setDel({ bulk: true })}>Delete</Button>
              <button onClick={() => state.setSelected([])} className="text-[12.5px] font-semibold text-warm-500">Clear</button>
            </div>
          ) : (
            <div className="min-w-0">{toolbarLeft}</div>
          )}
          <span className="text-[12px] text-warm-500 font-medium whitespace-nowrap">{state.filtered.length} of {totalCount} items</span>
        </div>

        <div className="flex-1 overflow-auto">
          <Table
            aria-label="Data table"
            removeWrapper
            selectionMode={selectable ? "multiple" : "none"}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => state.toggleSort(String(d.column))}
            onRowAction={onRowOpen ? (key) => {
              const it = state.pageItems.find((i) => String(i.id) === String(key));
              if (it) onRowOpen(it);
            } : undefined}
            classNames={{
              th: "bg-cream text-[9.5px] font-bold uppercase text-warm-500 first:rounded-none last:rounded-none px-2 first:w-[44px] first:px-0 first:pl-3 [&:nth-child(2)]:pl-1",
              td: "py-[11px] px-2 text-[13px] first:px-0 first:pl-3 first:w-[44px] [&:nth-child(2)]:pl-1 " +
                "before:!rounded-none before:!bg-transparent group-data-[hover=true]/tr:!bg-[#FBF8F5] group-data-[selected=true]/tr:!bg-[#FFF5EF]",
              tr: "border-b border-warm-200 group/tr",
            }}
          >
            <TableHeader columns={columns}>
              {(col) => (
                <TableColumn key={col.key} align={col.align} allowsSorting={col.sortable}>
                  {col.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={state.pageItems} emptyContent={empty}>
              {(it) => (
                <TableRow key={it.id}>
                  {(colKey) => <TableCell>{renderCell(it, String(colKey))}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-warm-200">
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] text-warm-500">Per page</span>
            <Dropdown placement="top-start">
              <DropdownTrigger>
                <Button size="sm" variant="bordered" radius="sm"
                  className="h-[30px] bg-white border border-[#E6E1DC] text-[12.5px] font-semibold text-warm-600"
                  endContent={<ChevronDown size={12} color="#9A8C80" />}>{state.perPage}</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Per page" onAction={(k) => state.setPerPage(Number(k))}>
                {[5, 10, 25, 50].map((n) => <DropdownItem key={n}>{String(n)}</DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
          </div>
          <Pagination showControls size="sm" page={state.curPage} total={state.totalPages}
            onChange={state.setPage} classNames={{ cursor: "bg-[#F15022] text-white font-bold" }} />
        </div>
      </div>

      {/* ── mobile: card list ── */}
      <div className="flex lg:hidden flex-col gap-3">
        {state.filtered.length === 0 ? empty : state.filtered.map((it) => (
          <div key={it.id}>{renderCard(it)}</div>
        ))}
      </div>
    </>
  );
}
