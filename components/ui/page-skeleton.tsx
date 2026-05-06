import { Skeleton } from "@/components/ui/skeleton";

export function HeroPageSkeleton() {
  return (
    <main className="min-h-screen bg-white px-6 pb-10 pt-24">
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-10">
        <div className="mx-auto w-full max-w-3xl text-center">
          <Skeleton className="mx-auto h-8 w-32 rounded-full" />
          <Skeleton className="mx-auto mt-8 h-14 w-full max-w-2xl" />
          <Skeleton className="mx-auto mt-4 h-14 w-4/5 max-w-xl" />
          <Skeleton className="mx-auto mt-8 h-6 w-full max-w-2xl" />
          <Skeleton className="mx-auto mt-3 h-6 w-3/4 max-w-xl" />
        </div>

        <Skeleton className="h-80 w-full rounded-[3rem] md:h-112" />
      </section>
    </main>
  );
}

export function MarketingPageSkeleton() {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-28">
      <section className="mx-auto max-w-7xl">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="mt-8 h-14 w-full max-w-3xl" />
        <Skeleton className="mt-4 h-14 w-3/4 max-w-2xl" />
        <Skeleton className="mt-8 h-6 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-6 w-4/5 max-w-xl" />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-6 h-6 w-2/3" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function GridPageSkeleton() {
  return (
    <main className="min-h-screen bg-white px-6 pb-16 pt-28">
      <section className="mx-auto max-w-7xl">
        <div className="text-center">
          <Skeleton className="mx-auto h-12 w-64" />
          <Skeleton className="mx-auto mt-4 h-5 w-80 max-w-full" />
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <Skeleton className="h-64 w-full rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function DetailPageSkeleton() {
  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <section className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <Skeleton className="aspect-3/4 w-full rounded-3xl" />

        <div className="space-y-5">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />

          <div className="grid gap-3 pt-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function AuthPageSkeleton() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-28">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="mt-6 h-10 w-2/3" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />

        <div className="mt-8 space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </main>
  );
}

export function DashboardPageSkeleton() {
  return (
    <main className="min-h-screen bg-white px-6 py-28">
      <section className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
          <Skeleton className="h-12 w-28" />
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-6">
                <Skeleton className="h-14 w-full md:col-span-2" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full md:col-span-2" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function DetailProductSkeleton() {
  return (
    
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
    
         {/* ── Back Button Skeleton ── */}
         <div className="mb-6">
           <div className="h-9 w-44 animate-pulse rounded-full bg-gray-200" />
         </div>
    
         {/* ── Card Skeleton ── */}
         <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
           <div className="flex flex-col md:flex-row">
    
             {/* ── Image Skeleton ── */}
             <div className="w-full md:w-[55%]">
               <div className="h-56 w-full animate-pulse bg-gray-200 md:h-full md:min-h-[320px]" />
             </div>
    
             {/* ── Content Skeleton ── */}
             <div className="flex flex-1 flex-col gap-5 p-6 md:p-8">
    
               {/* Badge "Detail produk" */}
               <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
    
               {/* Product Name */}
               <div className="space-y-2">
                 <div className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                 <div className="h-8 w-1/2 animate-pulse rounded-lg bg-gray-200" />
               </div>
    
               {/* Description */}
               <div className="space-y-2">
                 <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                 <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
               </div>
    
               {/* Price */}
               <div className="mt-2 h-10 w-40 animate-pulse rounded-lg bg-gray-200" />
             </div>
    
           </div>
         </div>
    
       </div>
    

  )
}
