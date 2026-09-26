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
    isHydrated,
  } = useFitLog();

  const [activeTab, setActiveTab] = useState<"plan" | "saved">("plan");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top description */}
      <p className="text-zinc-400 text-sm">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Summary Stats Box */}
      <div className="bg-[#12151e] border border-[#1e2433] rounded-2xl p-6 sm:p-7 grid grid-cols-3 divide-x divide-[#1e2433] shadow-lg">
        <div className="flex flex-col pr-4 sm:pr-6">
          <span className="text-xs text-zinc-400 font-normal mb-2">Exercises</span>
          <span className="font-oswald text-4xl sm:text-5xl font-bold text-[#bef264] leading-none">
            {isHydrated ? planWorkouts.length : 0}
          </span>
        </div>

        <div className="flex flex-col px-4 sm:px-6">
          <span className="text-xs text-zinc-400 font-normal mb-2">Minutes</span>
          <span className="font-oswald text-4xl sm:text-5xl font-bold text-white leading-none">
            {isHydrated ? totalMinutes : 0}
          </span>
        </div>

        <div className="flex flex-col pl-4 sm:pl-6">
          <span className="text-xs text-zinc-400 font-normal mb-2">Calories</span>
          <span className="font-oswald text-4xl sm:text-5xl font-bold text-white leading-none">
            {isHydrated ? totalCalories : 0}
          </span>
        </div>
      </div>

      {/* Controls Bar: Tabs and Sorting */}
      <div className="flex items-center justify-between gap-4">
        {/* Tab Switcher */}
        <div className="flex items-center bg-[#131722] border border-[#1e2433] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "plan"
                ? "bg-[#222838] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Today&apos;s Plan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "saved"
                ? "bg-[#222838] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#131722] border border-[#1e2433] text-white text-xs font-semibold px-4 py-1.5 rounded-xl focus:outline-none focus:border-[#bef264] cursor-pointer"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Workouts List */}
      {sortedList.length === 0 ? (
        <div className="w-full border border-dashed border-[#1e2433] bg-[#12151e]/60 rounded-2xl py-24 px-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-oswald text-white font-bold text-xl uppercase tracking-wide mb-2">
            NOTHING HERE YET
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm">
            Browse the library and add a lift to get today moving.
          </p>
          <Link
            href="/#library"
            className="bg-[#bef264] hover:bg-lime-400 text-black font-bold text-xs uppercase px-6 py-2.5 rounded-full transition shadow-md"
          >
            Go to workouts
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedList.map((workout: Workout) => {
            const completed = isDone(workout.id);

            return (
              <div
                key={workout.id}
                className="w-full bg-[#12151e] border border-[#1e2433] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-zinc-700"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="relative w-28 sm:w-36 aspect-[16/10] rounded-xl overflow-hidden shrink-0 bg-zinc-900 border border-zinc-800"
                  >
                    <Image
                      src={workout.image}
                      alt={workout.name}
                      fill
                      unoptimized
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex flex-col gap-1">
                    <Link href={`/workout/${workout.id}`}>
                      <h3 className="font-oswald text-white font-bold text-base sm:text-lg uppercase tracking-wide hover:text-[#bef264] transition-colors leading-tight">
                        {workout.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-zinc-400">
                      {workout.equipment}
                    </p>

                    {/* Metadata line: Duration, Calories, Rating */}
                    <div className="flex items-center gap-3 text-xs text-zinc-300 mt-1">
                      {/* Duration */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-[#bef264]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                        <span>{workout.duration} min</span>
                      </div>

                      {/* Calories */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-[#bef264]"
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

                      {/* Rating */}
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-[#bef264]"
                          viewBox="0 0 24 24"
                          fill="none"
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

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="px-5 py-2.5 rounded-full border border-zinc-700/60 bg-[#161a26] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" ? (
                    <button
                      type="button"
                      onClick={() => markAsDone(workout)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${
                        completed
                          ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          : "bg-[#bef264] hover:bg-lime-400 text-black shadow-sm"
                      }`}
                    >
                      {completed ? "Completed" : "Mark as Done"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToPlan(workout)}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#bef264] hover:bg-lime-400 text-black transition cursor-pointer shadow-sm"
                    >
                      Add to Plan
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      activeTab === "plan"
                        ? removeFromPlan(workout.id)
                        : removeFromSaved(workout.id)
                    }
                    title="Remove"
                    className="p-2 text-zinc-500 hover:text-rose-400 transition rounded-lg hover:bg-zinc-800/60 cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
