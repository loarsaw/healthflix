import { createContext, ReactNode, useState } from "react";

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

  const addTimer = (name: string, duration: number, category: string) => {
    setTimers((prevTimers) => [
      ...prevTimers,
      {
        id: Date.now(),
        name,
        duration,
        category,
        remaining: duration,
        status: "Paused",
      },
    ]);
  };


  return (
    <TimerContext.Provider value={{ timers, addTimer}}>
      {children}
    </TimerContext.Provider>
  );
};
