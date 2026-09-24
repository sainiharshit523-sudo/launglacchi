import { useState } from "react";
import { Clock, Globe, Laptop, Smartphone, Tablet, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { activityTracker, type VisitorSession } from "@/lib/activity-tracker";

export function AdminVisitorsLog() {
  const visitors: VisitorSession[] = activityTracker.getVisitors();

  return (
    <div className="space-y-6 animate-pop-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
          <Users className="size-6 text-purple-500" />
          <span>Live Customer Visits & Traffic Stream</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Detailed breakdown of visitors arriving on the website, device platforms, and sections
          explored.
        </p>
      </div>

      {/* Visitor Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase">
            <Smartphone className="size-4 text-primary" />
            <span>Mobile Visitors</span>
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">
            {visitors.filter((v) => v.deviceType === "Mobile").length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase">
            <Laptop className="size-4 text-primary" />
            <span>Desktop Visitors</span>
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">
            {visitors.filter((v) => v.deviceType === "Desktop").length}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase">
            <Tablet className="size-4 text-primary" />
            <span>Tablet Visitors</span>
          </div>
          <p className="mt-2 text-2xl font-black text-foreground">
            {visitors.filter((v) => v.deviceType === "Tablet").length}
          </p>
        </div>
      </div>

      {/* Visitor Sessions Table */}
      {visitors.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/50 text-[11px] font-black uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Visitor Session ID</th>
                  <th className="px-6 py-4">Device & Browser</th>
                  <th className="px-6 py-4">Sections Explored</th>
                  <th className="px-6 py-4">Total Interactions</th>
                  <th className="px-6 py-4 text-right">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visitors.map((v) => {
                  const lastActiveTime = new Date(v.lastActive).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={v.sessionId} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{v.sessionId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {v.deviceType === "Mobile" ? (
                            <Smartphone className="size-4 text-muted-foreground" />
                          ) : (
                            <Laptop className="size-4 text-muted-foreground" />
                          )}
                          <span className="font-semibold text-foreground">{v.browser}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {v.sectionsViewed.map((s, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-[10px] bg-muted text-muted-foreground font-semibold"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-foreground bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs">
                          {v.totalActions} actions
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap text-muted-foreground font-mono">
                        {lastActiveTime}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
          <Users className="mx-auto size-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No visitor sessions recorded yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            As soon as someone loads any page on the website, their telemetry and device details
            will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
