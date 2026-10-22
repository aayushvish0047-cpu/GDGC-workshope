"use client";

import { useEffect } from "react";

import { useGame, type Toast } from "@/components/GameProvider";
import { Icon } from "@/components/icons";

interface ToastCardProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4200);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex w-full items-start gap-3.5 rounded-2xl border border-white/10 bg-ink-raised/90 p-4 backdrop-blur-xl animate-toast-in">
      {toast.icon ? (
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-paper">
          <Icon name={toast.icon} className="size-4" strokeWidth={1.5} />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-paper">{toast.title}</p>
        {toast.description ? (
          <p className="mt-1 text-xs leading-relaxed text-white/45">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-1 rounded-full p-1.5 text-white/35 transition-colors hover:text-paper"
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, dismissToast } = useGame();

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-88"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
