import { useState, useEffect } from "react";
import { formatCurrentTime } from "../utils/date";

export function useClock(): string {
  const [currentTime, setCurrentTime] = useState<string>(() => formatCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}
