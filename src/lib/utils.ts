import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Linear Regression Prediction Function
// Based on: y = mx + c
// m = (n*sum(xy) - sum(x)*sum(y))/(n*sum(x^2) - sum(x)^2)
// c = (sum(y) - m*sum(x))/n
// Simple Moving Average / Exponential Smoothing or Linear Regression
// For this MVP, we will use a simple Linear Regression on the indices to project the next value.
export function predictNextValue(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  if (n === 1) return values[0];
  if (n < 3) {
    // Simple average if very few points
    return values.reduce((a, b) => a + b, 0) / n;
  }

  // Linear Regression
  const x = Array.from({ length: n }, (_, i) => i);
  const y = values;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, curr, i) => acc + curr * y[i], 0);
  const sumX2 = x.reduce((acc, curr) => acc + curr * curr, 0);

  const denominator = (n * sumX2 - Math.pow(sumX, 2));
  if (denominator === 0) return values[n - 1];

  const m = (n * sumXY - sumX * sumY) / denominator;
  const c = (sumY - m * sumX) / n;

  // Predict for the next step (index n)
  const nextX = n;
  return m * nextX + c;
}
