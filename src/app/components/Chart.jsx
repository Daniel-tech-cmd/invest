"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

export default function SparklineChart() {
  const data = useMemo(() => {
    let base =
      Math.floor(Math.random() * 100) + 50; // Start from a random base like 150–200
    return Array.from({ length: 12 }, (_, i) => {
      // Add a positive or negative random delta
      const delta = Math.floor(
        Math.random() * 40 - 20
      ); // -20 to +20
      base += delta;
      return { value: base };
    });
  }, []);

  return (
    <div className="h-20 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart data={data}>
          <Line
            type="basis" // smooth curve
            dataKey="value"
            stroke="#00d09c"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
