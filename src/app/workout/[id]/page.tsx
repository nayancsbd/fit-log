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
      title: "Workout Not Found FITLOG",
    };
  }

  return {
    title: `${workout.name.toUpperCase()} FITLOG`,
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

  const specs = [
    { label: "EQUIPMENT", value: workout.equipment },
    { label: "DIFFICULTY", value: workout.difficulty, isCapitalized: true },
    { label: "SETS", value: workout.sets },
    { label: "REPS", value: workout.reps },
    { label: "DURATION", value: `${workout.duration} min` },
    { label: "CALORIES", value: `${workout.caloriesBurned} kcal` },
    { label: "RATING", value: workout.rating },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      <div>
        <Link
          href="/#library"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 hover:text-[#bef264]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Workouts</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            unoptimized
            priority
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-oswald text-4xl sm:text-5xl font-bold uppercase tracking-tight">
              {workout.name}
            </h1>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              {workout.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="bg-[#bef264] text-black text-xs font-bold px-3 py-1 rounded-full capitalize"
              >
                {group}
              </span>
            ))}
          </div>

          <div className="bg-[#131722] border border-[#1e2433] rounded-2xl divide-y divide-[#1e2433]">
            {specs.map((item) => (
              <div key={item.label} className="flex justify-between px-5 py-3 text-xs">
                <span className="text-zinc-400 font-bold">{item.label}</span>
                <span
                  className={`text-zinc-100 font-semibold ${item.isCapitalized ? "capitalize" : ""
                    }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-oswald text-sm font-bold uppercase tracking-wider">
              INSTRUCTIONS
            </h2>
            <ol className="space-y-2 text-sm text-zinc-300">
              {workout.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-zinc-400">{index + 1}.</span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <ActionButtons workout={workout} />
        </div>
      </div>
    </div>
  );
}
