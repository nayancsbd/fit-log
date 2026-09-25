import Image from "next/image";
import Link from "next/link";
import { Workout } from "@/types/workout";

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group block h-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#bef264] rounded-2xl"
    >
      <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 group-hover:border-zinc-700">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
          <Image
            src={workout.image}
            alt={workout.name}
            width={500}
            height={320}
            unoptimized
            className="h-full w-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15171e] via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-2.5">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="bg-[#bef264] text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                >
                  {group}
                </span>
              ))}
            </div>

            <h3 className="font-oswald text-white font-bold text-base tracking-wide leading-snug uppercase">
              {workout.name.toUpperCase()}
            </h3>

            <p className="text-xs text-zinc-400 mt-1 mb-4 font-normal">
              {workout.equipment}
            </p>
          </div>

          <div className="border-t border-zinc-800/80 pt-3 mt-auto flex items-center justify-between text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              <span>{workout.duration} min</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-zinc-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.474 1.05-.504 1.543-.03.498.056.96.223 1.348-.337-.17-.68-.292-1.01-.365-.33-.072-.656-.098-.97-.076a4.982 4.982 0 00-2.316.942C4.54 7.234 4 8.56 4 10c0 3.314 2.686 6 6 6 1.838 0 3.483-.826 4.593-2.13A5.98 5.98 0 0016 10c0-1.636-.653-3.12-1.713-4.208a7.994 7.994 0 00-1.892-3.239z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{workout.caloriesBurned} kcal</span>
            </div>

            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{workout.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
