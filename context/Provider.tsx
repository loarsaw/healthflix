import { createContext, ReactNode, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Timer {
  id: number;
  name: string;
  duration: number;
  category: string;
  status: string;
  remaining: number;
}

export interface CompletedTimer {
  id: number;
  completedTime: Date;
  timerName: string;
}

export interface TimerContextType {
  timers: Timer[];
  addTimer: (name: string, duration: string, category: string) => void;
  updateTimer: (
    id: number,
    updates: Partial<{ remaining: number; status: string }>
  ) => void;
  resetTimer: (id: number) => void;
  setCongModal: React.Dispatch<React.SetStateAction<boolean>>;
  completedTimer: number | null;
  congModal: boolean;
  completedList: CompletedTimer[];
  setCompletedList: React.Dispatch<React.SetStateAction<CompletedTimer[]>>;
  completedTimerName: string | null;
  setCompletedTimerName: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [completedTimer, setCompleted] = useState<number | null>(null);
  const [completedTimerName, setCompletedTimerName] = useState<string | null>(
    null
  );
  const [congModal, setCongModal] = useState<boolean>(true);
  const [completedList, setCompletedList] = useState<CompletedTimer[]>([]);
  const [timers, setTimers] = useState<Timer[]>([]);

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

          if (timer.remaining === 0) {
            if (!completedList.find((item) => item.id === timer.id)) {
              setCompleted(timer.id);
              setCompletedTimerName(timer.name);
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

  const addTimer = (name: string, duration: string, category: string) => {
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
        completedList,
        setCompletedList,
        completedTimerName,
        setCompletedTimerName,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
