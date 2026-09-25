import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Workout } from "@/types/workout";
import ActionButtons from "@/components/ActionButtons";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getWorkout(id: string): Promise<Workout | null> {
  try {
    const res = await fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`, {
      next: { revalidate: 3600 },
    });

    if (res.status === 404 || !res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`Error fetching workout ${id}:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const workout = await getWorkout(id);

  if (!workout) {
    return {
      title: "Workout Not Found — FITLOG",
    };
  }

  return {
    title: `${workout.name.toUpperCase()} — FITLOG`,
    description: workout.description,
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.abcz.workers.dev/api/fitlog");
    if (!res.ok) return [];
    const workouts: Workout[] = await res.json();
    return workouts.map((w) => ({ id: String(w.id) }));
  } catch {
    return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
  }
}

export default async function WorkoutDetailPage({ params }: PageProps) {
  const { id } = await params;
  const workout = await getWorkout(id);

  if (!workout) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <Link
          href="/#library"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-oswald font-bold uppercase tracking-wider text-zinc-400 hover:text-[#bef264] transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>BACK TO LIBRARY</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-oswald uppercase text-zinc-500 tracking-wider">
            EXERCISE ID
          </span>
          <span className="badge badge-sm bg-[#1e2a14] text-[#bef264] border border-[#2d421d] font-oswald font-bold">
            #{workout.id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="relative aspect-[16/12] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/80">
            <Image
              src={workout.image}
              alt={workout.name}
              width={740}
              height={550}
              unoptimized
              priority
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 rounded-xl text-xs font-oswald font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#bef264] border border-[#bef264]/30 shadow-lg">
                {workout.difficulty} LEVEL
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-md">
              <span className="text-[11px] font-oswald uppercase tracking-wider text-zinc-500 mb-1">
                DURATION
              </span>
              <span className="font-oswald text-white font-bold text-xl sm:text-2xl">
                {workout.duration} <span className="text-xs font-normal text-zinc-400">MIN</span>
              </span>
            </div>

            <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-md">
              <span className="text-[11px] font-oswald uppercase tracking-wider text-zinc-500 mb-1">
                ENERGY BURN
              </span>
              <span className="font-oswald text-orange-400 font-bold text-xl sm:text-2xl">
                {workout.caloriesBurned} <span className="text-xs font-normal text-zinc-400">KCAL</span>
              </span>
            </div>

            <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-md">
              <span className="text-[11px] font-oswald uppercase tracking-wider text-zinc-500 mb-1">
                COMMUNITY
              </span>
              <span className="font-oswald text-amber-400 font-bold text-xl sm:text-2xl flex items-center gap-1">
                <span>{workout.rating}</span>
                <span className="text-sm">★</span>
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {workout.muscleGroups.map((group, index) => {
                const isAccent =
                  index % 2 === 1 ||
                  group.toLowerCase() === "arms" ||
                  group.toLowerCase() === "core";
                return (
                  <span
                    key={group}
                    className={`badge badge-sm font-extrabold text-[11px] uppercase px-3 py-1 rounded-full tracking-wider border-none ${
                      isAccent
                        ? "bg-[#bef264] text-black"
                        : "bg-[#1e2a14] text-[#bef264] border border-[#2d421d]"
                    }`}
                  >
                    {group}
                  </span>
                );
              })}
            </div>

            <h1 className="font-oswald text-white font-bold text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-tight">
              {workout.name}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base mt-4 leading-relaxed font-normal">
              {workout.description}
            </p>
          </div>

          <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 shadow-lg">
            <span className="font-oswald text-xs uppercase tracking-wider text-zinc-400 block mb-2 font-bold">
              LOG OR PLAN THIS WORKOUT
            </span>
            <ActionButtons workout={workout} />
          </div>

          <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-5 py-3.5 bg-zinc-900/60 border-b border-zinc-800/80 flex items-center justify-between">
              <h2 className="font-oswald text-white font-bold text-sm uppercase tracking-wider">
                EXERCISE SPECIFICATIONS
              </h2>
              <span className="text-[10px] font-oswald text-[#bef264] uppercase font-bold tracking-widest">
                VERIFIED PROTOCOL
              </span>
            </div>

            <div className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Equipment Required</span>
                <span className="text-white font-semibold text-right">{workout.equipment}</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Target Sets &amp; Reps</span>
                <span className="text-[#bef264] font-oswald font-bold text-sm tracking-wide">
                  {workout.sets} SETS &times; {workout.reps} REPS
                </span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Estimated Duration</span>
                <span className="text-white font-semibold">{workout.duration} Minutes</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Estimated Caloric Burn</span>
                <span className="text-white font-semibold">{workout.caloriesBurned} kcal</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Difficulty Level</span>
                <span className="text-white font-semibold">{workout.difficulty}</span>
              </div>
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Community Rating</span>
                <span className="text-amber-400 font-bold">{workout.rating} / 5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/80">
              <span className="w-2 h-2 rounded-full bg-[#bef264]" />
              <h2 className="font-oswald text-white font-bold text-base sm:text-lg uppercase tracking-wider">
                STEP-BY-STEP INSTRUCTIONS
              </h2>
            </div>

            <ol className="space-y-4">
              {workout.instructions.map((step, index) => {
                const stepNumber = String(index + 1).padStart(2, "0");
                return (
                  <li key={index} className="flex items-start gap-4 group">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#1e2a14] border border-[#2d421d] text-[#bef264] font-oswald font-bold text-xs flex items-center justify-center transition-colors group-hover:bg-[#bef264] group-hover:text-black">
                      {stepNumber}
                    </span>
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed pt-1.5 flex-1 font-normal">
                      {step}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
