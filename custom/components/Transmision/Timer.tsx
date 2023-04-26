import { useState, useEffect } from "react";
import {

  Chip,
} from "@mui/material";

export const Timer = ({ lote, evento }: any) => {
  const [count, setCount] = useState<number>(0);

  const formatTime = (time: number) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: any = null;
    if (lote > 0 && evento == 2) {
      interval = setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    } else {
      setCount(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lote, evento]);

  return (
    <Chip
      label={formatTime(count)}
      sx={{
        position: "absolute",
        top: 0,
        left: 5,
        zIndex: 1,
        borderRadius: 1,
        fontSize: 22,
      }}
    />
  );
};
