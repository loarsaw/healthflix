import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TimerContext = createContext<any>(null);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [completedTimer, setCompleted] = useState<number | null>(null);
  const [congModal, setCongModal] = useState<boolean>(true);
  const [completedList, setCompletedList] = useState<number[]>([]);
  const [timers, setTimers] = useState<
    {
      name: string;
      duration: number;
      category: string;
      id: number;
      status: string;
      remaining: number;
    }[]
  >([]);

  useEffect(() => {
    const loadTimers = async () => {
      try {
        const storedTimers = await AsyncStorage.getItem("timers");
        if (storedTimers) {
          setTimers(JSON.parse(storedTimers));
        }
      } catch (error) {
        console.error("Error loading timers:", error);
      }
    };

    loadTimers();
  }, []);

  useEffect(() => {
    const saveTimers = async () => {
      try {
        await AsyncStorage.setItem("timers", JSON.stringify(timers));
      } catch (error) {
        console.error("Error saving timers:", error);
      }
    };

    saveTimers();
  }, [timers]);

  const updateTimer = (
    id: number,
    updates: Partial<{ remaining: number; status: string }>
  ) => {
    setTimers((prevTimers) =>
      prevTimers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.status === "Running" && timer.remaining > 0) {
            return { ...timer, remaining: timer.remaining - 1 };
          }
          console.log(completedList.includes(timer.id), "you");
          if (timer.remaining == 0) {
            if (!completedList.includes(timer.id)) {
              setCompleted(timer.id);
              setCongModal(true);
            }
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [completedList, congModal]);

  const resetTimer = (id: number) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? { ...timer, remaining: timer.duration, status: "Running" }
          : timer
      )
    );
  };

  const addTimer = (name: string, duration: number, category: string) => {
    const dur = Number(duration);
    setTimers((prevTimers) => [
      ...prevTimers,
      {
        id: Date.now(),
        name,
        duration: dur,
        category,
        remaining: dur,
        status: "Running",
      },
    ]);
  };
  console.log(completedList, "completedList");

  return (
    <TimerContext.Provider
      value={{
        timers,
        addTimer,
        updateTimer,
        resetTimer,
        setCongModal,
        completedTimer,
        congModal,
        setCompletedList,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
