"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  MapPin,
  Plus,
  Phone,
  ChevronDown,
  Eye,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { StoreLocationForm } from "@/components/dashboard/store-location-form";
import { MAX_STORES_PER_OWNER } from "@/lib/stores/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Store as StoreType } from "@/db/schema";

export function StoreSection({
  stores,
}: {
  stores: StoreType[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id ?? "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedStore = stores.find((s) => s.id === selectedStoreId) ?? stores[0];
  const canCreate = stores.length < MAX_STORES_PER_OWNER;

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      {/* Header: Store Profile + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {selectedStore ? selectedStore.name : "Toko Saya"}
            </h2>
            {selectedStore ? (
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {[
                    selectedStore.village,
                    selectedStore.district,
                    selectedStore.regency,
                    selectedStore.province,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {selectedStore.whatsappNumber}
                </span>
                <StatusBadge value={selectedStore.status} />
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Belum ada toko. Buat toko untuk mulai berjualan.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stores.length > 1 ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Pilih Toko <ChevronDown className="h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border bg-white p-2 shadow-lg">
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => {
                        setSelectedStoreId(store.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                        store.id === selectedStoreId ? "bg-slate-50 font-medium" : ""
                      }`}
                    >
                      <Store className="h-4 w-4 text-slate-400" />
                      {store.name}
                    </button>
                  ))}
                  {canCreate && (
                    <>
                      <div className="my-1 border-t" />
                      <button
                        onClick={() => {
                          setModalOpen(true);
                          setDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-primary transition hover:bg-primary/5"
                      >
                        <Plus className="h-4 w-4" /> Buat Toko Baru
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {canCreate ? (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" /> Buat Toko
            </button>
          ) : null}
        </div>
      </div>

      {/* Store Table */}
      <div className="mt-6 overflow-x-auto">
        {stores.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center">
            <Store className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Belum ada toko. Klik &ldquo;Buat Toko&rdquo; untuk mulai.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nama Toko</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id} className="group transition hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    <button
                      onClick={() => setSelectedStoreId(store.id)}
                      className="text-left transition hover:text-primary"
                    >
                      {store.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {[store.regency, store.province].filter(Boolean).join(", ")}
                  </TableCell>
                  <TableCell className="text-slate-500">{store.whatsappNumber}</TableCell>
                  <TableCell>
                    <StatusBadge value={store.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/toko/${store.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                    >
                      <Eye className="h-3.5 w-3.5" /> Lihat
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create Store Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Buat Toko Baru">
        <StoreLocationForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </section>
  );
}

function StatusBadge({ value }: { value: string }) {
  const config: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    active: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    suspended: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    closed: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    removed: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    tersedia: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
    penuh: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  };

  const c = config[value] ?? { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}>
      {value}
    </span>
  );
}
