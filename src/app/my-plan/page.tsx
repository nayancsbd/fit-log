"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFitLog } from "@/context/FitLogContext";
import { Workout } from "@/types/workout";

export default function MyPlanPage() {
  const {
    planWorkouts,
    savedWorkouts,
    removeFromPlan,
    removeFromSaved,
    addToPlan,
    markAsDone,
    isDone,
    isInPlan,
    isHydrated,
  } = useFitLog();

  const [activeTab, setActiveTab] = useState<"plan" | "saved">("saved");
  const [sortBy, setSortBy] = useState<string>("duration");

  const totalMinutes = useMemo(() => {
    return planWorkouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  }, [planWorkouts]);

  const totalCalories = useMemo(() => {
    return planWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  }, [planWorkouts]);

  const currentList = activeTab === "plan" ? planWorkouts : savedWorkouts;

  const sortedList = useMemo(() => {
    const list = [...currentList];
    switch (sortBy) {
      case "duration":
        return list.sort((a, b) => a.duration - b.duration);
      case "calories":
        return list.sort((a, b) => b.caloriesBurned - a.caloriesBurned);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [currentList, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="font-oswald text-3xl sm:text-4xl lg:text-[40px] font-bold text-white tracking-tight uppercase">
          MY PLAN
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-1">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </div>

      <div className="bg-[#15171e] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 shadow-xl">
        <div className="flex flex-col sm:pr-8 pb-4 sm:pb-0">
          <span className="text-xs text-zinc-400 font-normal mb-1">Exercises</span>
          <span className="font-oswald text-3xl sm:text-4xl text-[#bef264] font-bold">
            {isHydrated ? planWorkouts.length : 0}
          </span>
        </div>

        <div className="flex flex-col sm:px-8 py-4 sm:py-0">
          <span className="text-xs text-zinc-400 font-normal mb-1">Minutes</span>
          <span className="font-oswald text-3xl sm:text-4xl text-white font-bold">
            {isHydrated ? totalMinutes : 0}
          </span>
        </div>

        <div className="flex flex-col sm:pl-8 pt-4 sm:pt-0">
          <span className="text-xs text-zinc-400 font-normal mb-1">Calories</span>
          <span className="font-oswald text-3xl sm:text-4xl text-white font-bold">
            {isHydrated ? totalCalories : 0}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#14161d] border border-zinc-800/80 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`px-4 py-1.5 rounded-lg text-xs font-oswald font-bold transition-all ${
              activeTab === "plan"
                ? "bg-[#222733] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Today&apos;s Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-lg text-xs font-oswald font-bold transition-all ${
              activeTab === "saved"
                ? "bg-[#222733] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Saved
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-zinc-400 font-oswald font-normal">
            Sort By
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#15171e] border border-zinc-800/80 text-white font-oswald text-xs px-3.5 py-1.5 rounded-xl focus:outline-none focus:border-[#bef264]"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {sortedList.length === 0 ? (
        <div className="w-full border border-dashed border-zinc-800/80 rounded-2xl py-24 px-6 flex flex-col items-center justify-center text-center min-h-[380px]">
          <h3 className="font-oswald text-white font-bold text-xl sm:text-2xl tracking-wide uppercase mb-2">
            NOTHING HERE YET
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal mb-6 max-w-sm">
            Browse the library and add a lift to get today moving.
          </p>
          <Link
            href="/#library"
            className="bg-[#bef264] hover:bg-[#a6d83b] text-black font-oswald font-bold text-xs uppercase tracking-wide px-6 py-2.5 rounded-full transition-all shadow-md"
          >
            Go to workouts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedList.map((workout: Workout) => {
            const completed = isDone(workout.id);
            const inPlan = isInPlan(workout.id);

            return (
              <div
                key={workout.id}
                className="bg-[#15171e] border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:border-zinc-700"
              >
                <Link
                  href={`/workout/${workout.id}`}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 block"
                >
                  <Image
                    src={workout.image}
                    alt={workout.name}
                    width={500}
                    height={320}
                    unoptimized
                    className="h-full w-full object-cover object-center hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15171e] via-transparent to-transparent opacity-60 pointer-events-none" />

                  {completed && (
                    <div className="absolute top-3 left-3 bg-[#bef264] text-black font-oswald text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                      COMPLETED
                    </div>
                  )}
                </Link>

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

                    <Link href={`/workout/${workout.id}`}>
                      <h3 className="font-oswald text-white font-bold text-base tracking-wide leading-snug uppercase hover:text-[#bef264] transition-colors">
                        {workout.name.toUpperCase()}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-400 mt-1 mb-4 font-normal">
                      {workout.equipment}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-auto">
                    <div className="border-t border-zinc-800/80 pt-3 flex items-center justify-between text-xs text-zinc-400 font-medium">
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

                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/40">
                      {activeTab === "plan" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => markAsDone(workout)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase transition-all ${
                              completed
                                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                : "bg-[#24350c] text-[#bef264] hover:bg-[#2f4610]"
                            }`}
                          >
                            {completed ? "Mark Undone" : "Mark as Done"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromPlan(workout.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-oswald font-bold text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-all uppercase"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          {!inPlan ? (
                            <button
                              type="button"
                              onClick={() => addToPlan(workout)}
                              className="flex-1 py-1.5 rounded-lg text-xs font-oswald font-bold uppercase bg-[#bef264] text-black hover:bg-[#a6d83b] transition-all"
                            >
                              Add to Plan
                            </button>
                          ) : (
                            <span className="flex-1 py-1.5 text-center text-xs font-oswald font-bold uppercase text-[#bef264]">
                              In Today&apos;s Plan
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFromSaved(workout.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-oswald font-bold text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/80 transition-all uppercase"
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
