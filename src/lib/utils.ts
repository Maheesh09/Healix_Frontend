import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Linear Regression Prediction Function
// Based on: y = mx + c
// m = (n*sum(xy) - sum(x)*sum(y))/(n*sum(x^2) - sum(x)^2)
// c = (sum(y) - m*sum(x))/n
export function predictNextValue(values: number[]): number {
  const n = values.length;
  if (n < 2) return values[n - 1]; // Fallback if not enough data

  const x = Array.from({ length: n }, (_, i) => i);
  const y = values;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, curr, i) => acc + curr * y[i], 0);
  const sumX2 = x.reduce((acc, curr) => acc + curr * curr, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - Math.pow(sumX, 2));
  const c = (sumY - m * sumX) / n;

  // Predict for the next step (index n)
  const nextX = n;
  return m * nextX + c;
}
