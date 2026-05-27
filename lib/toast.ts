"use client";

export type Toast = {
  id: number;
  message: string;
  tone?: "default" | "success";
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let nextId = 0;

function notify() {
  for (const l of listeners) l(toasts);
}

export function toast(
  message: string,
  opts?: { tone?: Toast["tone"]; duration?: number },
): void {
  const id = ++nextId;
  toasts = [...toasts, { id, message, tone: opts?.tone ?? "default" }];
  notify();
  const duration = opts?.duration ?? 2400;
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, duration);
}

export function subscribe(fn: Listener): () => void {
  listeners.push(fn);
  fn(toasts);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}
