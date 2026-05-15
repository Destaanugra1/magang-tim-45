"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { markNotificationsRead } from "@/actions/notifications";

export type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: DashboardNotification[];
  unreadCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleMarkRead() {
    startTransition(async () => {
      await markNotificationsRead();
      router.refresh();
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        aria-label="Buka notifikasi"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="font-semibold text-slate-900">Notifikasi</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkRead}
                disabled={isPending}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-900 disabled:opacity-50"
              >
                Tandai dibaca
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Belum ada notifikasi.
              </p>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`rounded-2xl p-3 ${
                    notification.read ? "bg-white" : "bg-emerald-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read ? (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-400">
                        {new Date(notification.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
