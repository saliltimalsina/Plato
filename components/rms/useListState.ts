"use client";

import { useEffect, useMemo, useState } from "react";
import { addToast } from "@heroui/react";

export type ToastColor = "success" | "warning" | "danger" | "primary" | "secondary";

export interface ListConfig<T> {
  initial: T[];
  searchableText: (t: T) => string;
  sortAccessors?: Record<string, (t: T) => string | number>;
  filterPredicate?: (t: T) => boolean;
}

export function useListState<T extends { id: number }>(cfg: ListConfig<T>) {
  const [items, setItems] = useState<T[]>(() => cfg.initial);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<number[]>([]);

  const [editing, setEditing] = useState<T | null | undefined>(undefined); // undefined=closed, null=new, T=edit
  const [detail, setDetail] = useState<T | null>(null);
  const [del, setDel] = useState<{ bulk: true } | { item: T } | null>(null);

  const toast = (title: string, color: ToastColor = "success") =>
    addToast({ title, color, timeout: 2800 });

  const filterPredicate = cfg.filterPredicate;
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let r = items.filter((it) => {
      const ms = !q || cfg.searchableText(it).toLowerCase().includes(q);
      const mp = !filterPredicate || filterPredicate(it);
      return ms && mp;
    });
    if (sortKey && cfg.sortAccessors?.[sortKey]) {
      const acc = cfg.sortAccessors[sortKey];
      r = [...r].sort((a, b) => {
        const av = acc(a), bv = acc(b);
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, sortKey, sortDir, filterPredicate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const curPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((curPage - 1) * perPage, curPage * perPage);
  useEffect(() => { setPage(1); }, [search, perPage, filterPredicate]);

  const toggleSort = (key: string | null) => {
    if (key === null) { setSortKey(null); return; }
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const pageIds = pageItems.map((i) => i.id);
  const allSel = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const toggleAll = () =>
    setSelected(allSel ? selected.filter((id) => !pageIds.includes(id)) : [...new Set([...selected, ...pageIds])]);
  const toggleOne = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = (it: T, label?: string) => {
    if (it.id) {
      setItems((p) => p.map((x) => (x.id === it.id ? it : x)));
      toast(label ?? `"${(it as { name?: string }).name ?? "Item"}" updated`);
    } else {
      const nid = Math.max(0, ...items.map((x) => x.id)) + 1;
      setItems((p) => [{ ...it, id: nid }, ...p]);
      toast(label ?? `"${(it as { name?: string }).name ?? "Item"}" added`);
    }
    setEditing(undefined);
  };

  const doDelete = (labelFor?: (t: T) => string) => {
    if (del && "bulk" in del) {
      setItems((p) => p.filter((x) => !selected.includes(x.id)));
      toast(`${selected.length} items moved to trash`, "danger");
      setSelected([]);
    } else if (del) {
      const it = del.item;
      setItems((p) => p.filter((x) => x.id !== it.id));
      toast(`${labelFor ? labelFor(it) : "Item"} moved to trash`, "danger");
    }
    setDel(null);
    setDetail(null);
  };

  return {
    items, setItems, filtered, pageItems, totalPages, curPage, setPage, perPage, setPerPage,
    search, setSearch, sortKey, sortDir, toggleSort, setSortKey,
    selected, setSelected, allSel, toggleAll, toggleOne, pageIds,
    editing, setEditing, detail, setDetail, del, setDel,
    save, doDelete, toast,
  };
}

export type ListState<T extends { id: number }> = ReturnType<typeof useListState<T>>;
