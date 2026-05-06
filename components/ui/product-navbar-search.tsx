"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GooeyInput } from "@/components/ui/gooey-input";

type ProductNavbarSearchProps = {
  mobile?: boolean;
};

export default function ProductNavbarSearch({
  mobile = false,
}: ProductNavbarSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get initial query from URL
  const initialQuery = searchParams.get("q") ?? "";
  const [inputValue, setInputValue] = useState(initialQuery);

  // Sync input value with URL only when the URL changes externally (e.g., back button)
  // and we're not currently typing or waiting for a transition.
  useEffect(() => {
    const currentQuery = searchParams.get("q") ?? "";
    if (currentQuery !== inputValue && !timerRef.current && !isPending) {
      setInputValue(currentQuery);
    }
  }, [searchParams, inputValue, isPending]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleValueChange = useCallback(
    (nextValue: string) => {
      setInputValue(nextValue);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmedValue = nextValue.trim();

        if (trimmedValue) {
          params.set("q", trimmedValue);
        } else {
          params.delete("q");
        }

        const nextQuery = params.toString();
        const currentQueryString = searchParams.toString();

        if (nextQuery === currentQueryString) {
          timerRef.current = null;
          return;
        }

        const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

        startTransition(() => {
          router.replace(nextUrl, { scroll: false });
          timerRef.current = null;
        });
      }, 500); // 500ms debounce as requested
    },
    [pathname, router, searchParams],
  );
  return (
    <div
      className={
        mobile ? "relative block w-full lg:hidden" : "relative hidden lg:block"
      }
    >
      <GooeyInput
        placeholder="Cari produk..."
        value={inputValue}
        onValueChange={handleValueChange}
        collapsedWidth={mobile ? 132 : 120}
        expandedWidth={mobile ? 176 : 240}
        expandedOffset={mobile ? 40 : 54}
        gooeyBlur={4}
        className={mobile ? "w-full" : undefined}
        classNames={{
          trigger:
            "bg-white text-slate-900 ring-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
          input: "text-slate-900 placeholder:text-slate-400",
          bubbleSurface:
            "bg-white text-slate-900 ring-slate-200/80 shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
        }}
      />
      {isPending && (
        <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-[10px] font-medium text-slate-400">
          <div className="size-1.5 animate-pulse rounded-full bg-slate-300" />
          <span>Mencari...</span>
        </div>
      )}
    </div>
  );
}
