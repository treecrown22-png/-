'use client';

import type { Toast as ToastType } from './types';

export function Toast({ toast }: { toast: ToastType | null }) {
  if (!toast) return null;
  return (
    <div className="acct-toast">
      <span>{toast.icon}</span>
      <span>{toast.msg}</span>
    </div>
  );
}