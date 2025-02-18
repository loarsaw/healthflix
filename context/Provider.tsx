import { createContext, ReactNode, useEffect, useState } from "react";

export const TimerContext = createContext<any>(null);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
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
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <TimerContext.Provider value={{ timers, addTimer }}>
      {children}
    </TimerContext.Provider>
  );
};
