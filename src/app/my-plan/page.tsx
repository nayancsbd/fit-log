"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useFitLog } from "@/context/FitLogContext";
import { Workout } from "@/types/workout";

function MyPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

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

  const activeTab: "plan" | "saved" = tabParam === "saved" ? "saved" : "plan";
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("duration");

  const handleTabChange = (tab: "plan" | "saved") => {
    router.replace(`/my-plan?tab=${tab}`, { scroll: false });
  };

  const totalMinutes = useMemo(() => {
    return planWorkouts.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  }, [planWorkouts]);

  const totalCalories = useMemo(() => {
    return planWorkouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  }, [planWorkouts]);

  const currentList = activeTab === "plan" ? planWorkouts : savedWorkouts;

  const filteredAndSortedList = useMemo(() => {
    let list = [...currentList];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((w) => {
        const nameMatch = w.name?.toLowerCase().includes(query);
        const muscleMatch = w.muscleGroups?.some((m) =>
          m.toLowerCase().includes(query)
        );
        const equipMatch = w.equipment?.toLowerCase().includes(query);
        const descMatch = w.description?.toLowerCase().includes(query);
        return nameMatch || muscleMatch || equipMatch || descMatch;
      });
    }

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
  }, [currentList, searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
        MY PLAN
      </h2>
      <p className="text-zinc-400 text-sm">
        Cap of five lifts for today. Finish them, then load more.
      </p>

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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center bg-[#131722] border border-[#1e2433] p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange("plan")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === "plan"
                ? "bg-[#222838] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            Today&apos;s Plan ({planWorkouts.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("saved")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === "saved"
                ? "bg-[#222838] text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
              }`}
          >
            Saved ({savedWorkouts.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <input
              type="text"
              placeholder={`Search ${activeTab === "plan" ? "plan" : "saved"}...`}
              value={searchQuery === "duration" ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131722] border border-[#1e2433] text-white placeholder-zinc-500 text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-[#bef264] transition-colors"
            />
            <svg
              className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
            </svg>
            {searchQuery && searchQuery !== "duration" && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer p-0.5"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="my-plan-sort-select"
              className="text-xs text-zinc-400 font-oswald uppercase tracking-wider whitespace-nowrap"
            >
              Sort By
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="my-plan-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#131722] border border-[#1e2433] text-white text-xs font-semibold pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-[#bef264] cursor-pointer"
              >
                <option value="duration">Duration</option>
                <option value="calories">Calories</option>
                <option value="rating">Rating</option>
              </select>
              <svg
                className="w-3.5 h-3.5 text-zinc-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedList.length === 0 ? (
        <div className="w-full border border-dashed border-[#1e2433] bg-[#12151e]/60 rounded-2xl py-24 px-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-oswald text-white font-bold text-xl uppercase tracking-wide mb-2">
            {searchQuery
              ? "NO MATCHING WORKOUTS"
              : "NOTHING HERE YET"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6 max-w-sm">
            {searchQuery
              ? `No entries matched "${searchQuery}". Try a different name or muscle tag.`
              : "Browse the library and add a lift to get today moving."}
          </p>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="bg-[#bef264] hover:bg-lime-400 text-black font-bold text-xs uppercase px-6 py-2.5 rounded-full transition shadow-md cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <Link
              href="/#library"
              className="bg-[#bef264] hover:bg-lime-400 text-black font-bold text-xs uppercase px-6 py-2.5 rounded-full transition shadow-md"
            >
              Go to workouts
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAndSortedList.map((workout: Workout) => {
            const completed = isDone(workout.id);

            return (
              <div
                key={workout.id}
                className="w-full bg-[#12151e] border border-[#1e2433] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-zinc-700"
              >
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

                    <div className="flex items-center gap-3 text-xs text-zinc-300 mt-1">
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

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="px-4 py-2.5 rounded-full border border-zinc-700/60 bg-[#161a26] hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" ? (
                    <button
                      type="button"
                      onClick={() => markAsDone(workout)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer ${completed
                          ? "bg-[#182312] text-[#bef264] border border-[#bef264]/40 hover:bg-[#202d18]"
                          : "bg-[#bef264] hover:bg-lime-400 text-black shadow-sm"
                        }`}
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span>{completed ? "Completed" : "Mark as Done"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToPlan(workout)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#bef264] hover:bg-lime-400 text-black transition cursor-pointer shadow-sm"
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span>Add to Plan</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      activeTab === "plan"
                        ? removeFromPlan(workout.id)
                        : removeFromSaved(workout.id)
                    }
                    title={activeTab === "plan" ? "Remove from plan" : "Remove from saved"}
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

export default function MyPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#bef264] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MyPlanContent />
    </Suspense>
  );
}
