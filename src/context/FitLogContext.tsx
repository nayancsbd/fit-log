"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Workout } from "@/types/workout";
import { toast } from "sonner";

interface FitLogContextType {
  planWorkouts: Workout[];
  savedWorkouts: Workout[];
  doneWorkouts: Workout[];
  isHydrated: boolean;
  addToPlan: (workout: Workout) => boolean;
  removeFromPlan: (workoutId: number) => void;
  addToSaved: (workout: Workout) => void;
  removeFromSaved: (workoutId: number) => void;
  markAsDone: (workoutOrId: Workout | number) => void;
  isInPlan: (workoutId: number) => boolean;
  isSaved: (workoutId: number) => boolean;
  isDone: (workoutId: number) => boolean;
  clearPlan: () => void;
}

const FitLogContext = createContext<FitLogContextType | undefined>(undefined);

export function FitLogProvider({ children }: { children: React.ReactNode }) {
  const [planWorkouts, setPlanWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [doneWorkouts, setDoneWorkouts] = useState<Workout[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog_plan");
      const storedSaved = localStorage.getItem("fitlog_saved");
      const storedDone = localStorage.getItem("fitlog_done");

      queueMicrotask(() => {
        if (storedPlan) setPlanWorkouts(JSON.parse(storedPlan));
        if (storedSaved) setSavedWorkouts(JSON.parse(storedSaved));
        if (storedDone) setDoneWorkouts(JSON.parse(storedDone));
        setIsHydrated(true);
      });
    } catch (err) {
      console.error("Error reading FitLog data from localStorage:", err);
      queueMicrotask(() => {
        setIsHydrated(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("fitlog_plan", JSON.stringify(planWorkouts));
    } catch (err) {
      console.error("Error saving planWorkouts to localStorage:", err);
    }
  }, [planWorkouts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("fitlog_saved", JSON.stringify(savedWorkouts));
    } catch (err) {
      console.error("Error saving savedWorkouts to localStorage:", err);
    }
  }, [savedWorkouts, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("fitlog_done", JSON.stringify(doneWorkouts));
    } catch (err) {
      console.error("Error saving doneWorkouts to localStorage:", err);
    }
  }, [doneWorkouts, isHydrated]);

  const isInPlan = (workoutId: number): boolean => {
    return planWorkouts.some((item) => item.id === workoutId);
  };

  const isSaved = (workoutId: number): boolean => {
    return savedWorkouts.some((item) => item.id === workoutId);
  };

  const isDone = (workoutId: number): boolean => {
    return doneWorkouts.some((item) => item.id === workoutId);
  };

  const addToPlan = (workout: Workout): boolean => {
    if (isInPlan(workout.id)) {
      toast.info(`"${workout.name}" is already in your daily plan.`);
      return false;
    }

    if (planWorkouts.length >= 5) {
      toast.error("Plan limit reached! Maximum 5 workouts allowed in your daily plan.");
      return false;
    }

    setPlanWorkouts((prev) => [...prev, workout]);
    toast.success(`"${workout.name}" added to today's plan!`);
    return true;
  };

  const removeFromPlan = (workoutId: number) => {
    const itemToRemove = planWorkouts.find((w) => w.id === workoutId);
    setPlanWorkouts((prev) => prev.filter((item) => item.id !== workoutId));
    if (itemToRemove) {
      toast.info(`"${itemToRemove.name}" removed from plan.`);
    }
  };

  const addToSaved = (workout: Workout) => {
    if (isSaved(workout.id)) {
      toast.info(`"${workout.name}" is already saved in your favorites.`);
      return;
    }

    setSavedWorkouts((prev) => [...prev, workout]);
    toast.success(`"${workout.name}" saved to favorites!`);
  };

  const removeFromSaved = (workoutId: number) => {
    const itemToRemove = savedWorkouts.find((w) => w.id === workoutId);
    setSavedWorkouts((prev) => prev.filter((item) => item.id !== workoutId));
    if (itemToRemove) {
      toast.info(`"${itemToRemove.name}" removed from saved.`);
    }
  };

  const markAsDone = (workoutOrId: Workout | number) => {
    const id = typeof workoutOrId === "number" ? workoutOrId : workoutOrId.id;
    const isCurrentlyDone = isDone(id);

    if (isCurrentlyDone) {
      setDoneWorkouts((prev) => prev.filter((item) => item.id !== id));
      toast.info("Workout unmarked as completed.");
      return;
    }

    let targetWorkout: Workout | undefined;
    if (typeof workoutOrId === "object") {
      targetWorkout = workoutOrId;
    } else {
      targetWorkout =
        planWorkouts.find((w) => w.id === id) ||
        savedWorkouts.find((w) => w.id === id);
    }

    if (targetWorkout) {
      setDoneWorkouts((prev) => [...prev, targetWorkout!]);
      toast.success(`"${targetWorkout.name}" completed! Great job! 💪`);
    } else {
      const placeholder: Workout = {
        id,
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
      setDoneWorkouts((prev) => [...prev, placeholder]);
      toast.success("Workout completed! Great job! 💪");
    }
  };

  const clearPlan = () => {
    setPlanWorkouts([]);
    toast.info("Daily plan cleared.");
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
