"use client";

import { Workout } from "@/types/workout";
import { useFitLog } from "@/context/FitLogContext";

interface ActionButtonsProps {
  workout: Workout;
}

export default function ActionButtons({ workout }: ActionButtonsProps) {
  const {
    planWorkouts,
    addToPlan,
    removeFromPlan,
    isInPlan,
    addToSaved,
    removeFromSaved,
    isSaved,
  } = useFitLog();

  const inPlan = isInPlan(workout.id);
  const saved = isSaved(workout.id);
  const isPlanFull = planWorkouts.length >= 5 && !inPlan;

  const handlePlanClick = () => {
    if (inPlan) {
      removeFromPlan(workout.id);
    } else {
      addToPlan(workout);
    }
  };

  const handleSaveClick = () => {
    if (saved) {
      removeFromSaved(workout.id);
    } else {
      addToSaved(workout);
    }
  };

  const baseBtn = "px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      {/* Add / In Plan Button */}
      <button
        type="button"
        onClick={handlePlanClick}
        disabled={isPlanFull}
        className={`${baseBtn} ${
          isPlanFull
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
            : "bg-[#bef264] text-black hover:bg-lime-400"
        }`}
      >
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="4" />
          {inPlan && <path d="m9 12 2 2 4-4" />}
        </svg>
        <span>
          {inPlan
            ? "In today's plan"
            : isPlanFull
            ? "Plan full (max 5)"
            : "Add to today's plan"}
        </span>
      </button>

      {/* Save / Favorite Button */}
      <button
        type="button"
        onClick={handleSaveClick}
        className={`${baseBtn} border ${
          saved
            ? "bg-[#181e2c] text-[#bef264] border-[#bef264]/40"
            : "bg-[#131722] text-zinc-200 border-[#222838] hover:bg-zinc-800"
        }`}
      >
        <svg
          className="w-4 h-4 shrink-0"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
        <span>{saved ? "Saved in favorites" : "Save for later"}</span>
      </button>
    </div>
  );
}
