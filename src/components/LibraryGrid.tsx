"use client";

import { useState, useMemo } from "react";
import { Workout } from "@/types/workout";
import WorkoutCard from "@/components/WorkoutCard";

interface LibraryGridProps {
  workouts: Workout[];
}

export default function LibraryGrid({ workouts = [] }: LibraryGridProps) {
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    workouts.forEach((w) => {
      w.muscleGroups?.forEach((m) => groups.add(m));
    });
    return ["All", ...Array.from(groups)];
  }, [workouts]);

  const sortedWorkouts = useMemo(() => {
    let list = [...workouts];

    if (selectedMuscle !== "All") {
      list = list.filter((w) =>
        w.muscleGroups?.some(
          (m) => m.toLowerCase() === selectedMuscle.toLowerCase()
        )
      );
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
  }, [workouts, sortBy, selectedMuscle]);

  return (
    <section id="library" className="w-full scroll-mt-24 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-oswald text-[#bef264] text-xs font-bold uppercase tracking-widest">
              EXERCISE CATALOG
            </span>
            <span className="badge badge-sm bg-[#1e2a14] text-[#bef264] border border-[#2d421d] font-oswald text-[10px]">
              {sortedWorkouts.length} OF {workouts.length}
            </span>
          </div>
          <h2 className="font-oswald text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            THE LIBRARY
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-normal mt-0.5">
            Compound and isolation lifts covering every major muscle group.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-by-select"
              className="text-xs text-zinc-400 font-medium whitespace-nowrap font-oswald uppercase tracking-wider"
            >
              Sort By:
            </label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-sm bg-[#15171e] text-white border-zinc-700/80 rounded-xl font-oswald text-xs uppercase tracking-wider focus:border-[#bef264] focus:outline-none"
            >
              <option value="default">Default Order</option>
              <option value="duration">Duration (Shortest)</option>
              <option value="calories">Calories (Highest)</option>
              <option value="rating">Rating (Highest)</option>
            </select>
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-oswald font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
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

      {sortedWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="w-full bg-[#15171e] border border-zinc-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <p className="text-zinc-400 text-sm mb-4">
            No workouts found for &quot;{selectedMuscle}&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedMuscle("All");
              setSortBy("default");
            }}
            className="btn btn-sm bg-[#bef264] hover:bg-[#a6d83b] text-black border-none font-oswald font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
