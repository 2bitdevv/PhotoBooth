import { Button } from "@/components/ui/Button";
import { useBoothStore } from "@/store/useBoothStore";

export function WelcomeScreen() {
  const setAppState = useBoothStore((state) => state.setAppState);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-5xl font-black text-slate-900">Welcome!</h1>
      <p className="max-w-2xl text-slate-700">
        You have <span className="font-bold">3 seconds</span> for each shot, and the app captures a full photo strip in one go.
      </p>
      <p className="mt-2 max-w-2xl text-slate-700">After your session, download your strip or share it instantly.</p>
      <Button
        variant="primary"
        className="mt-8 px-8 py-3 text-lg"
        onClick={() => setAppState("LAYOUT_SELECT")}
      >
        START
      </Button>
    </section>
  );
}
