import Image from "next/image";
import WorkoutCard from "@/components/WorkoutCard";
import { Workout } from "@/types/workout";

async function getWorkouts(): Promise<Workout[]> {
  try {
    const res = await fetch("https://api.abcz.workers.dev/api/fitlog", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to load workouts (${res.status})`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching workouts on server:", err);
    return [];
  }
}

export default async function Home() {
  const workouts = await getWorkouts();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
      <section className="w-full bg-[#15171e] border border-zinc-800/80 rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex-1 max-w-2xl">
          <span className="font-oswald text-[#bef264] font-bold uppercase text-xs tracking-widest block mb-4">
            WORKOUT LIBRARY
          </span>

          <h1 className="font-oswald text-white font-bold text-4xl sm:text-5xl lg:text-[54px] tracking-tight leading-[1.05] uppercase">
            TRAIN WITH INTENT. LOG<br />EVERY SET.
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mt-5 leading-relaxed">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <a
            href="#library"
            className="mt-8 px-6 py-3 rounded-lg bg-[#bef264] hover:bg-[#a6d83b] text-black font-oswald font-bold text-xs sm:text-sm tracking-wider uppercase inline-flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <span>BROWSE WORKOUTS</span>
          </a>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center">
          <Image
            src="/banner.png"
            alt="FitLog Workout Library Banner"
            width={380}
            height={380}
            className="max-w-[260px] sm:max-w-[340px] lg:max-w-[400px] h-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </section>

      <section id="library" className="w-full scroll-mt-20">
        <div className="mb-6">
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            THE LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-0.5">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      </section>
    </div>
  );
}
