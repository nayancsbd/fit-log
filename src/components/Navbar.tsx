"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFitLog } from "@/context/FitLogContext";

export default function Navbar() {
  const pathname = usePathname();
  const { planWorkouts, savedWorkouts, isHydrated } = useFitLog();

  const isWorkouts = pathname === "/" || pathname.startsWith("/workout");
  const isMyPlan = pathname === "/my-plan";

  const planCount = isHydrated ? planWorkouts.length : 0;
  const savedCount = isHydrated ? savedWorkouts.length : 0;

  return (
    <header className="w-full bg-[#0c0d10] border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-oswald text-white font-bold text-xl sm:text-2xl tracking-wider uppercase focus:outline-none"
        >
          FITLOG
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className={`font-oswald tracking-wide px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              isWorkouts
                ? "bg-[#24350c] text-[#bef264]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Workouts
          </Link>
          <Link
            href="/my-plan"
            className={`font-oswald tracking-wide px-3 py-1.5 text-xs font-bold transition-all ${
              isMyPlan
                ? "bg-[#24350c] text-[#bef264] rounded-full"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
          <Link
            href="/my-plan?tab=plan"
            title="View Today's Plan"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141720] border border-zinc-800 hover:border-[#bef264]/40 hover:bg-[#1a202c] active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-oswald tracking-wider uppercase text-zinc-300 group-hover:text-white transition-colors">
              Plan
            </span>
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#bef264] text-black font-oswald font-bold text-[11px] flex items-center justify-center leading-none shadow-sm shadow-[#bef264]/20">
              {planCount}
            </span>
          </Link>

          <Link
            href="/my-plan?tab=saved"
            title="View Saved Favorites"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141720] border border-zinc-800 hover:border-zinc-600 hover:bg-[#1a202c] active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-oswald tracking-wider uppercase text-zinc-300 group-hover:text-white transition-colors">
              Saved
            </span>
            <span className="min-w-5 h-5 px-1.5 rounded-full border border-zinc-700 bg-zinc-800/90 text-zinc-300 font-oswald font-medium text-[11px] flex items-center justify-center leading-none">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
