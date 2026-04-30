export default function RouteLoading() {
  return (
    <>
      <div
        className="pointer-events-none fixed top-0 right-0 left-0 z-[300] h-[3px] overflow-hidden bg-slate-200/90"
        aria-hidden
      >
        <div className="photoboot-loader-bar h-full w-[42%] max-w-lg" />
      </div>
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center gap-6 px-4"
      >
        <div
          className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin"
          aria-hidden
        />
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">PhotoBoot</p>
          <p className="mt-2 text-base font-semibold text-slate-800">Loading</p>
          <p className="mt-1 text-sm text-slate-500">Preparing this page…</p>
        </div>
      </div>
    </>
  );
}
