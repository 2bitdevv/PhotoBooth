import { BoothFlow } from "@/components/BoothFlow";
import { NavBar } from "@/components/NavBar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white">
      <NavBar />
      <BoothFlow />
    </main>
  );
}
