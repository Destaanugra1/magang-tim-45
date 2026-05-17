"use client";

import { useEffect, useMemo, useState, useRef, useActionState } from "react";
import { createStore } from "@/actions/stores";
import { FormInput, FormTextarea } from "@/components/ui/form-field";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StoreActionState } from "@/lib/stores/validation";

type Region = {
  id: string;
  name: string;
};

const API_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

async function fetchRegions(path: string) {
  const response = await fetch(`${API_BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data wilayah.");
  }

  return (await response.json()) as Region[];
}

const initialState: StoreActionState = { success: false, message: "" };

export function StoreLocationForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [state, formAction, isPending] = useActionState(createStore, initialState);

  useEffect(() => {
    if (state.success && onSuccess) {
      onSuccess();
    }
  }, [state.success, onSuccess]);
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [regencyId, setRegencyId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetchRegions("provinces.json")
      .then((items) => {
        if (!ignore) {
          setProvinces(items);
        }
      })
      .catch(() => {
        if (!ignore) {
          setFetchError("Data provinsi gagal dimuat. Coba refresh halaman.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!provinceId) {
      return;
    }

    let ignore = false;

    fetchRegions(`regencies/${provinceId}.json`)
      .then((items) => {
        if (!ignore) {
          setRegencies(items);
        }
      })
      .catch(() => {
        if (!ignore) {
          setFetchError("Data kabupaten/kota gagal dimuat.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [provinceId]);

  useEffect(() => {
    if (!regencyId) {
      return;
    }

    let ignore = false;

    fetchRegions(`districts/${regencyId}.json`)
      .then((items) => {
        if (!ignore) {
          setDistricts(items);
        }
      })
      .catch(() => {
        if (!ignore) {
          setFetchError("Data kecamatan gagal dimuat.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [regencyId]);

  useEffect(() => {
    if (!districtId) {
      return;
    }

    let ignore = false;

    fetchRegions(`villages/${districtId}.json`)
      .then((items) => {
        if (!ignore) {
          setVillages(items);
        }
      })
      .catch(() => {
        if (!ignore) {
          setFetchError("Data desa/kelurahan gagal dimuat.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [districtId]);

  const selectedProvince = useMemo(
    () => provinces.find((item) => item.id === provinceId)?.name ?? "",
    [provinceId, provinces],
  );
  const selectedRegency = useMemo(
    () => regencies.find((item) => item.id === regencyId)?.name ?? "",
    [regencyId, regencies],
  );
  const selectedDistrict = useMemo(
    () => districts.find((item) => item.id === districtId)?.name ?? "",
    [districtId, districts],
  );
  const selectedVillage = useMemo(
    () => villages.find((item) => item.id === villageId)?.name ?? "",
    [villageId, villages],
  );

  return (
    <form action={formAction} className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Buat Toko</h2>
      <p className="mt-2 text-sm text-slate-500">
        Pilih wilayah dari API Indonesia, lalu isi alamat detail seperti nama jalan,
        nomor rumah, atau patokan toko.
      </p>

      <input type="hidden" name="province" value={selectedProvince} />
      <input type="hidden" name="regency" value={selectedRegency} />
      <input type="hidden" name="district" value={selectedDistrict} />
      <input type="hidden" name="village" value={selectedVillage} />

      {fetchError ? (
        <p className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
          {fetchError}
        </p>
      ) : null}

      {state.message ? (
        <p className={`mt-4 rounded-2xl p-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <FormInput name="name" label="Nama toko" required errors={state.errors?.name} />
        <FormInput name="whatsappNumber" label="Nomor WhatsApp" placeholder="62812..." required errors={state.errors?.whatsappNumber} />
        <Select
          label="Provinsi"
          value={provinceId}
          onChange={(value) => {
            setProvinceId(value);
            setRegencyId("");
            setDistrictId("");
            setVillageId("");
            setRegencies([]);
            setDistricts([]);
            setVillages([]);
          }}
          options={provinces}
          placeholder="Pilih provinsi"
          required
          errors={state.errors?.province}
        />
        <Select
          label="Kabupaten/kota"
          value={regencyId}
          onChange={(value) => {
            setRegencyId(value);
            setDistrictId("");
            setVillageId("");
            setDistricts([]);
            setVillages([]);
          }}
          options={regencies}
          placeholder="Pilih kabupaten/kota"
          disabled={!provinceId}
          required
          errors={state.errors?.regency}
        />
        <Select
          label="Kecamatan"
          value={districtId}
          onChange={(value) => {
            setDistrictId(value);
            setVillageId("");
            setVillages([]);
          }}
          options={districts}
          placeholder="Pilih kecamatan"
          disabled={!regencyId}
          required
          errors={state.errors?.district}
        />
        <Select
          label="Desa/kelurahan"
          value={villageId}
          onChange={setVillageId}
          options={villages}
          placeholder="Pilih desa/kelurahan"
          disabled={!districtId}
          errors={state.errors?.village}
        />
        <FormTextarea name="address" label="Alamat detail" required errors={state.errors?.address} className="sm:col-span-2" />
        <RichTextEditor name="description" label="Deskripsi toko" required errors={state.errors?.description} className="sm:col-span-2" />
      </div>

      <div className="mt-4">
        <button
          disabled={isPending}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Mengajukan..." : "Ajukan Toko"}
        </button>
      </div>
    </form>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
  errors,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Region[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  errors?: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasValue = value !== "";
  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1" ref={ref}>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={cn(
            "w-full rounded-2xl border bg-slate-50 px-4 pb-2.5 pt-6 text-left text-sm outline-none transition",
            open ? "border-slate-400 bg-white" : "border-slate-200",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            errors?.length && "border-rose-300",
          )}
        >
          <span className={hasValue ? "text-slate-900" : "text-slate-400"}>
            {selected?.name ?? "\u00A0"}
          </span>
        </button>

        <label
          className={cn(
            "pointer-events-none absolute left-4 text-sm text-slate-400 transition-all",
            hasValue || open
              ? "top-3.5 translate-y-0 text-[11px] text-slate-500"
              : "top-1/2 -translate-y-1/2",
          )}
        >
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>

        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />

        {open && (
          <ul
            role="listbox"
            className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1 shadow-lg"
          >
            {options.map((option) => (
              <li
                key={option.id}
                role="option"
                aria-selected={value === option.id}
                onClick={() => { onChange(option.id); setOpen(false); }}
                className={cn(
                  "cursor-pointer px-4 py-2.5 text-sm transition-colors",
                  value === option.id
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errors?.map((err) => (
        <p key={err} className="text-xs text-rose-600">{err}</p>
      ))}
    </div>
  );
}
