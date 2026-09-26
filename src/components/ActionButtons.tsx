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

  const handlePlanClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inPlan) {
      removeFromPlan(workout.id);
    } else {
      addToPlan(workout);
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (saved) {
      removeFromSaved(workout.id);
    } else {
      addToSaved(workout);
    }
  };

  const baseBtn =
    "w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-95 touch-manipulation select-none cursor-pointer";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      <button
        type="button"
        onClick={handlePlanClick}
        disabled={isPlanFull}
        className={`${baseBtn} ${
          inPlan
            ? "bg-[#24350c] text-[#bef264] border border-[#bef264]/40 hover:bg-[#2d4212]"
            : isPlanFull
            ? "bg-zinc-800/80 text-zinc-500 border border-zinc-700/60 cursor-not-allowed opacity-60 pointer-events-none sm:pointer-events-auto"
            : "bg-[#bef264] text-black hover:bg-[#a6d83b] shadow-lg shadow-[#bef264]/10"
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

      <button
        type="button"
        onClick={handleSaveClick}
        className={`${baseBtn} border ${
          saved
            ? "bg-[#181e2c] text-[#bef264] border-[#bef264]/50"
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

