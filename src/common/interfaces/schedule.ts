export type JobInfo = {
  start: { cronExpression: string; jobKey: string };
  end: { cronExpression: string; jobKey: string };
} | null;
