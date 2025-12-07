"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { sidebarItems, SidebarItem } from "@/app/data/sidebarData";
import { LuArrowLeftFromLine, LuArrowRightToLine } from "react-icons/lu";
import { signOut, useSession } from "@/lib/auth-client";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isActive = (path: string) => pathname === path;

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    } finally {
      router.push("/sign-in");
    }
  };

  // if you don't have groups in data, it becomes one group "MAIN"
  const groupedItems = useMemo(() => {
    const hasGroup = sidebarItems.some((i: any) => i.group);
    if (!hasGroup) return [{ title: "MAIN", items: sidebarItems }];

    const map = new Map<string, SidebarItem[]>();
    sidebarItems.forEach((i: any) => {
      const g = i.group || "MAIN";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(i);
    });

    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      items,
    }));
  }, []);

  return (
    <aside
      className={[
        "relative flex flex-col shrink-0 h-screen",
        "transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]",
        isCollapsed ? "w-[78px]" : "w-[288px]",
        "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950",
        "border-r border-white/5",
        "overflow-x-hidden", // ✅ FIX: prevent horizontal scrollbar on collapse
      ].join(" ")}
    >
      {/* Soft ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute top-52 -right-16 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Top: brand + toggle */}
      <div className="relative px-3 pt-4 pb-2">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/5">
          {/* Logo / Mark */}
          <div className="grid place-items-center h-10 w-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-bold shadow">
            G
          </div>

          {!isCollapsed && (
            <div className="leading-tight">
              <h1 className="text-white font-semibold text-base tracking-wide">
              Gentle Moving 
              </h1>
              <p className="text-xs text-slate-300/80">Admin Console</p>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed((p) => !p)}
            className="ml-auto grid place-items-center h-9 w-9 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <LuArrowRightToLine className="size-5" />
            ) : (
              <LuArrowLeftFromLine className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="
          relative px-2 pb-3 grow 
          overflow-y-auto overflow-x-hidden  /* ✅ FIX */
          scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
        "
      >
        <div className="space-y-4 mt-2">
          {groupedItems.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold tracking-widest text-slate-400/80">
                  {group.title}
                </p>
              )}

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        className={[
                          "group relative flex items-center min-w-0 rounded-xl px-3 py-2.5", // ✅ FIX: min-w-0 stops width leak
                          "transition-all duration-200",
                          isCollapsed ? "justify-center" : "gap-3",
                          active
                            ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                            : "text-white/80 hover:text-white hover:bg-white/5",
                          "hover:-translate-y-[1px]",
                        ].join(" ")}
                      >
                        {/* Active indicator bar */}
                        <span
                          className={[
                            "absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full",
                            active
                              ? "bg-gradient-to-b from-cyan-400 to-indigo-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                              : "bg-transparent",
                          ].join(" ")}
                        />

                        {/* Icon */}
                        <div
                          className={[
                            "text-lg shrink-0",
                            active ? "text-cyan-200" : "text-white/90",
                          ].join(" ")}
                        >
                          {item.icon}
                        </div>

                        {/* Label */}
                        <span
                          className={[
                            "text-sm font-medium whitespace-nowrap",
                            "transition-all duration-300 origin-left",
                            isCollapsed
                              ? "opacity-0 scale-x-0 w-0"
                              : "opacity-100 scale-x-100 w-auto",
                          ].join(" ")}
                        >
                          {item.label}
                        </span>

                        {/* Collapsed tooltip */}
                        {isCollapsed && (
                          <span
                            className={[
                              "pointer-events-none absolute left-full ml-3",
                              "rounded-md bg-slate-950/95 text-white text-xs px-2 py-1",
                              "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
                              "transition-all duration-200 shadow-lg border border-white/5",
                              "whitespace-nowrap",
                            ].join(" ")}
                          >
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom Profile */}
      <div className="relative border-t border-white/5 px-2 py-3">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((p) => !p)}
            className={[
              "w-full flex items-center rounded-xl px-3 py-2.5",
              "bg-white/5 hover:bg-white/10 transition",
              isCollapsed ? "justify-center" : "justify-between gap-3",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative">
                <div className="grid place-items-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-10 w-10 text-white font-semibold shadow-md">
                  {getUserInitials()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>

              {!isCollapsed && (
                <div className="text-left leading-tight">
                  <h3 className="text-sm font-semibold text-white">
                    {session?.user?.name || "User"}
                  </h3>
                  <p className="text-xs text-slate-300 capitalize">
                    {(session?.user as any)?.role?.toLowerCase() || "admin"}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <svg
                className={[
                  "w-4 h-4 text-slate-300 transition-transform",
                  showProfileMenu ? "rotate-180" : "",
                ].join(" ")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div
              className={[
                "absolute bottom-14 z-20 w-60 overflow-hidden rounded-xl",
                "bg-white shadow-2xl ring-1 ring-black/5",
                "animate-in fade-in zoom-in-95 duration-150",
                isCollapsed ? "left-1/2 -translate-x-1/2" : "right-0",
              ].join(" ")}
            >
              <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-white border-b">
                <p className="text-sm font-semibold text-gray-900">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {(session?.user as any)?.email || ""}
                </p>
              </div>

              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  type="button"
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition"
                  type="button"
                >
                  Settings
                </button>
              </div>

              <div className="py-1 border-t bg-gray-50/60">
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                  onClick={handleSignOut}
                  type="button"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
