"use client";

import { useState, useMemo } from "react";
import { Workout } from "@/types/workout";
import WorkoutCard from "@/components/WorkoutCard";

interface LibraryGridProps {
  workouts: Workout[];
}

export default function LibraryGrid({ workouts = [] }: LibraryGridProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("duration");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    workouts.forEach((w) => {
      w.muscleGroups?.forEach((m) => groups.add(m));
    });
    return ["All", ...Array.from(groups)];
  }, [workouts]);

  const filteredWorkouts = useMemo(() => {
    let list = [...workouts];

    if (selectedMuscle !== "All") {
      list = list.filter((w) =>
        w.muscleGroups?.some(
          (m) => m.toLowerCase() === selectedMuscle.toLowerCase()
        )
      );
    }

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
        return list.sort((a, b) => a.duration - b.duration);
    }
  }, [workouts, searchQuery, sortBy, selectedMuscle]);

  return (
    <section id="library" className="w-full scroll-mt-24 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            THE LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-0.5">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search by name, muscle, tag..."
              value={searchQuery}
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
            {searchQuery && (
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
              htmlFor="sort-by-select"
              className="text-xs text-zinc-400 font-medium whitespace-nowrap font-oswald uppercase tracking-wider"
            >
              Sort By:
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#131722] border border-[#1e2433] text-white font-oswald text-xs uppercase tracking-wider pl-3 pr-8 py-2 rounded-xl focus:border-[#bef264] focus:outline-none cursor-pointer"
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

      {muscleGroups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {muscleGroups.map((muscle) => {
            const isActive = selectedMuscle === muscle;
            return (
              <button
                key={muscle}
                type="button"
                onClick={() => setSelectedMuscle(muscle)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-oswald font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#bef264] text-black shadow-md shadow-[#bef264]/20"
                    : "bg-[#15171e] text-zinc-400 border border-zinc-800/80 hover:text-white hover:border-zinc-700"
                }`}
              >
                {muscle}
              </button>
            );
          })}
        </div>
      )}

      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="w-full bg-[#15171e] border border-dashed border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <p className="text-zinc-400 text-sm mb-4">
            No workouts matching your search &quot;{searchQuery || selectedMuscle}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedMuscle("All");
              setSortBy("duration");
            }}
            className="btn btn-sm bg-[#bef264] hover:bg-[#a6d83b] text-black border-none font-oswald font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}

