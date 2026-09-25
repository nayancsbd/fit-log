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

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      <div className="flex-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={handlePlanClick}
          disabled={isPlanFull}
          className={`btn font-oswald font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 h-auto min-h-0 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border-none ${
            inPlan
              ? "bg-[#24350c] text-[#bef264] border border-[#3b5415] hover:bg-[#2e4210]"
              : isPlanFull
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60 border border-zinc-700/50"
              : "bg-[#bef264] hover:bg-[#a6d83b] text-black shadow-[#bef264]/20"
          }`}
        >
          {inPlan ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>IN TODAY&apos;S PLAN (REMOVE)</span>
            </>
          ) : isPlanFull ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <span>PLAN FULL (MAX 5)</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>ADD TO TODAY&apos;S PLAN</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-1">
        <button
          type="button"
          onClick={handleSaveClick}
          className={`btn font-oswald font-bold text-xs sm:text-sm tracking-wider uppercase px-6 py-3.5 h-auto min-h-0 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border ${
            saved
              ? "bg-rose-950/60 text-rose-300 border-rose-800/80 hover:bg-rose-900/80"
              : "bg-zinc-800/90 text-zinc-200 border-zinc-700/80 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={saved ? "0" : "1.75"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            />
          </svg>
          <span>{saved ? "SAVED IN FAVORITES" : "SAVE FOR LATER"}</span>
        </button>
      </div>
    </div>
  );
}
