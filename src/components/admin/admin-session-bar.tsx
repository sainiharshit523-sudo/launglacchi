import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Power,
  PowerOff,
  ExternalLink,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAuth } from "@/lib/admin-auth";
import { websiteStatusManager, type WebsiteStatusConfig } from "@/lib/website-status";

interface AdminSessionBarProps {
  status: WebsiteStatusConfig;
  onStatusChange?: (newStatus: WebsiteStatusConfig) => void;
}

export function AdminSessionBar({ status, onStatusChange }: AdminSessionBarProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(adminAuth.isAuthenticated());

    const unsubAuth = adminAuth.subscribe((isAuth) => {
      setIsAdmin(isAuth);
    });

    return unsubAuth;
  }, []);

  if (!isAdmin) {
    return null;
  }

  const handleToggle = () => {
    const next = websiteStatusManager.toggle();
    if (onStatusChange) {
      onStatusChange(next);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    setIsAdmin(false);
  };

  return (
    <aside
      aria-label="Admin Management Bar"
      className={`sticky top-0 z-[100] border-b px-3 sm:px-4 py-2 transition-colors shadow-md ${
        status.enabled
          ? "border-amber-500/30 bg-neutral-900 text-amber-100"
          : "border-red-500/40 bg-red-950 text-red-100"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5 text-xs">
        {/* Left: Identity & State */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-2 py-0.5 font-bold text-gold text-[11px] border border-amber-500/30">
            <ShieldCheck className="size-3.5 text-gold" />
            <span className="hidden sm:inline">Restaurant Owner / Staff Session</span>
            <span className="sm:hidden">Staff</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${
                status.enabled ? "bg-emerald-400 animate-pulse" : "bg-red-400 animate-ping"
              }`}
            />
            <span className="text-[11px] font-semibold text-neutral-200">
              {status.enabled ? (
                <>
                  <span className="hidden min-[480px]:inline">Public Website: </span>
                  <strong className="text-emerald-400 font-extrabold uppercase">ONLINE</strong>
                </>
              ) : (
                <>
                  <span className="hidden min-[480px]:inline">Public Website: </span>
                  <strong className="text-red-400 font-extrabold uppercase">OFFLINE (Preview Active)</strong>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Quick Toggle Status */}
          <Button
            size="sm"
            type="button"
            onClick={handleToggle}
            variant="outline"
            className={`h-7 px-2.5 text-[11px] font-extrabold transition-all border ${
              status.enabled
                ? "border-red-500/50 bg-red-900/40 text-red-200 hover:bg-red-900/70"
                : "border-emerald-500/50 bg-emerald-500 text-neutral-950 hover:bg-emerald-400"
            }`}
            title={status.enabled ? "Pause public website (show offline view to visitors)" : "Make public website live now"}
          >
            {status.enabled ? (
              <>
                <PowerOff className="mr-1 size-3 text-red-400" />
                <span>Pause Site</span>
              </>
            ) : (
              <>
                <Power className="mr-1 size-3 text-neutral-950" />
                <span>Turn Live</span>
              </>
            )}
          </Button>

          {/* Jump to Admin Dashboard */}
          <Button
            asChild
            size="sm"
            className="h-7 px-2.5 text-[11px] font-bold bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-xs"
          >
            <Link to="/launglaachi-portal" title="Open Operations Command Portal">
              <LayoutDashboard className="mr-1 size-3" />
              <span>Dashboard</span>
              <ExternalLink className="ml-1 size-2.5 opacity-70" />
            </Link>
          </Button>

          {/* Sign Out */}
          <Button
            size="sm"
            type="button"
            onClick={handleLogout}
            variant="ghost"
            className="h-7 px-2 text-[11px] font-medium text-neutral-400 hover:text-white hover:bg-white/10"
            title="Sign out of staff session"
          >
            <LogOut className="size-3 sm:mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
