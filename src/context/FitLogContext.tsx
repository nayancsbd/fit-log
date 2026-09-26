"use client";

import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  useMemo,
} from "react";
import { Workout } from "@/types/workout";
import { toast } from "sonner";

class StorageStore<T> {
  private key: string;
  private fallback: T;
  private listeners = new Set<() => void>();
  private cachedRaw: string | null = "EMPTY_INIT";
  private cachedData: T;

  constructor(key: string, fallback: T) {
    this.key = key;
    this.fallback = fallback;
    this.cachedData = fallback;
  }

  getSnapshot = (): T => {
    if (typeof window === "undefined") return this.fallback;
    try {
      const raw = localStorage.getItem(this.key);
      if (raw === this.cachedRaw) {
        return this.cachedData;
      }
      this.cachedRaw = raw;
      this.cachedData = raw ? JSON.parse(raw) : this.fallback;
      return this.cachedData;
    } catch {
      return this.cachedData;
    }
  };

  getServerSnapshot = (): T => this.fallback;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === this.key || e.key === null) {
        this.cachedRaw = "FORCE_UPDATE";
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      this.listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  setValue = (updater: T | ((prev: T) => T)) => {
    const current = this.getSnapshot();
    const nextVal =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(current)
        : updater;
    const raw = JSON.stringify(nextVal);
    this.cachedRaw = raw;
    this.cachedData = nextVal;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(this.key, raw);
      }
    } catch (e) {
      console.error(`Error saving ${this.key}:`, e);
    }
    this.listeners.forEach((l) => l());
  };
}

const planStore = new StorageStore<Workout[]>("fitlog_plan", []);
const savedStore = new StorageStore<Workout[]>("fitlog_saved", []);
const doneStore = new StorageStore<Workout[]>("fitlog_done", []);

interface FitLogContextType {
  planWorkouts: Workout[];
  savedWorkouts: Workout[];
  doneWorkouts: Workout[];
  isHydrated: boolean;
  addToPlan: (workout: Workout) => boolean;
  removeFromPlan: (workoutId: number | string) => void;
  addToSaved: (workout: Workout) => void;
  removeFromSaved: (workoutId: number | string) => void;
  markAsDone: (workoutOrId: Workout | number | string) => void;
  isInPlan: (workoutId: number | string) => boolean;
  isSaved: (workoutId: number | string) => boolean;
  isDone: (workoutId: number | string) => boolean;
  clearPlan: () => void;
}

const FitLogContext = createContext<FitLogContextType | undefined>(undefined);

export function FitLogProvider({ children }: { children: React.ReactNode }) {
  const planWorkouts = useSyncExternalStore(
    planStore.subscribe,
    planStore.getSnapshot,
    planStore.getServerSnapshot
  );

  const savedWorkouts = useSyncExternalStore(
    savedStore.subscribe,
    savedStore.getSnapshot,
    savedStore.getServerSnapshot
  );

  const doneWorkouts = useSyncExternalStore(
    doneStore.subscribe,
    doneStore.getSnapshot,
    doneStore.getServerSnapshot
  );

  const isHydrated = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  const isInPlan = useMemo(
    () => (workoutId: number | string): boolean => {
      const numId = Number(workoutId);
      return planWorkouts.some((item) => Number(item.id) === numId);
    },
    [planWorkouts]
  );

  const isSaved = useMemo(
    () => (workoutId: number | string): boolean => {
      const numId = Number(workoutId);
      return savedWorkouts.some((item) => Number(item.id) === numId);
    },
    [savedWorkouts]
  );

  const isDone = useMemo(
    () => (workoutId: number | string): boolean => {
      const numId = Number(workoutId);
      return doneWorkouts.some((item) => Number(item.id) === numId);
    },
    [doneWorkouts]
  );

  const addToPlan = (workout: Workout): boolean => {
    if (isInPlan(workout.id)) {
      toast.info(`"${workout.name}" is already in your daily plan.`, {
        id: `plan-${workout.id}`,
      });
      return false;
    }

    if (planWorkouts.length >= 5) {
      toast.error(
        "Plan limit reached! Maximum 5 workouts allowed in your daily plan.",
        { id: "plan-limit" }
      );
      return false;
    }

    planStore.setValue((prev) => [...prev, workout]);
    toast.success(`"${workout.name}" added to today's plan!`, {
      id: `plan-${workout.id}`,
    });
    return true;
  };

  const removeFromPlan = (workoutId: number | string) => {
    const numId = Number(workoutId);
    const itemToRemove = planWorkouts.find((w) => Number(w.id) === numId);
    planStore.setValue((prev) => prev.filter((item) => Number(item.id) !== numId));
    if (itemToRemove) {
      toast.info(`"${itemToRemove.name}" removed from plan.`, {
        id: `plan-${numId}`,
      });
    }
  };

  const addToSaved = (workout: Workout) => {
    if (isSaved(workout.id)) {
      toast.info(`"${workout.name}" is already saved in your favorites.`, {
        id: `saved-${workout.id}`,
      });
      return;
    }

    savedStore.setValue((prev) => [...prev, workout]);
    toast.success(`"${workout.name}" saved to favorites!`, {
      id: `saved-${workout.id}`,
    });
  };

  const removeFromSaved = (workoutId: number | string) => {
    const numId = Number(workoutId);
    const itemToRemove = savedWorkouts.find((w) => Number(w.id) === numId);
    savedStore.setValue((prev) => prev.filter((item) => Number(item.id) !== numId));
    if (itemToRemove) {
      toast.info(`"${itemToRemove.name}" removed from saved.`, {
        id: `saved-${numId}`,
      });
    }
  };

  const markAsDone = (workoutOrId: Workout | number | string) => {
    const id =
      typeof workoutOrId === "object"
        ? workoutOrId.id
        : Number(workoutOrId);
    const isCurrentlyDone = isDone(id);

    if (isCurrentlyDone) {
      doneStore.setValue((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      toast.info("Workout unmarked as completed.", { id: `done-${id}` });
      return;
    }

    let targetWorkout: Workout | undefined;
    if (typeof workoutOrId === "object") {
      targetWorkout = workoutOrId;
    } else {
      targetWorkout =
        planWorkouts.find((w) => Number(w.id) === Number(id)) ||
        savedWorkouts.find((w) => Number(w.id) === Number(id));
    }

    if (targetWorkout) {
      doneStore.setValue((prev) => [...prev, targetWorkout!]);
      toast.success(`"${targetWorkout.name}" completed! Great job! 💪`, {
        id: `done-${id}`,
      });
    } else {
      const placeholder: Workout = {
        id: Number(id),
        name: `Workout #${id}`,
        image: "",
        muscleGroups: [],
        equipment: "",
        difficulty: "",
        duration: 0,
        caloriesBurned: 0,
        sets: 0,
        reps: "",
        rating: 5,
        description: "",
        instructions: [],
      };
      doneStore.setValue((prev) => [...prev, placeholder]);
      toast.success("Workout completed! Great job! 💪", { id: `done-${id}` });
    }
  };

  const clearPlan = () => {
    planStore.setValue([]);
    toast.info("Daily plan cleared.", { id: "clear-plan" });
  };

  return (
    <FitLogContext.Provider
      value={{
        planWorkouts,
        savedWorkouts,
        doneWorkouts,
        isHydrated,
        addToPlan,
        removeFromPlan,
        addToSaved,
        removeFromSaved,
        markAsDone,
        isInPlan,
        isSaved,
        isDone,
        clearPlan,
      }}
    >
      {children}
    </FitLogContext.Provider>
  );
}

export function useFitLog(): FitLogContextType {
  const context = useContext(FitLogContext);
  if (!context) {
    throw new Error("useFitLog must be used within a FitLogProvider");
  }
  return context;
}

