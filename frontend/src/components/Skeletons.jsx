export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-4 rounded bg-slate-200" />
          ))}
          <div className="ml-1 h-3 w-8 rounded bg-slate-200" />
        </div>
        <div className="h-6 w-20 rounded bg-slate-200" />
        <div className="mt-auto h-10 w-full rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl p-6 animate-pulse">
      <div className="h-4 w-48 rounded bg-slate-200" />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full rounded-xl bg-slate-200" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 w-16 rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 rounded bg-slate-200" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-5 w-5 rounded bg-slate-200" />
            ))}
            <div className="ml-2 h-4 w-24 rounded bg-slate-200" />
          </div>
          <div className="h-10 w-32 rounded bg-slate-200" />
          <div className="h-5 w-28 rounded bg-slate-200" />
          <hr className="border-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
          </div>
          <hr className="border-slate-200" />
          <div className="mt-auto flex flex-col gap-3">
            <div className="h-12 w-full rounded-full bg-slate-200" />
            <div className="h-12 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
