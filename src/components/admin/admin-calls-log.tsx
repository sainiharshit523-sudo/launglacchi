import { useState } from "react";
import { Clock, Phone, Search, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type ActivityEvent } from "@/lib/activity-tracker";

interface AdminCallsLogProps {
  events: ActivityEvent[];
}

export function AdminCallsLog({ events }: AdminCallsLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const callEvents = events.filter((e) => e.type === "call_click");

  const filtered = callEvents.filter((e) => {
    return (
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.metadata?.dishName && e.metadata.dishName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
            <Phone className="size-6 text-red-500" />
            <span>Customer Phone Calls & Dish Order Clicks</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Logs of every customer who tapped "Call Order" on a dish card or clicked the restaurant
            phone hotline.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by dish or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs h-10 rounded-xl"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 bg-muted/50 text-[11px] font-black uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action / Dish Name</th>
                  <th className="px-6 py-4">Category / Price</th>
                  <th className="px-6 py-4">Device & Browser</th>
                  <th className="px-6 py-4 text-right">Destination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((item) => {
                  const dateFormatted = new Date(item.timestamp).toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });

                  return (
                    <tr key={item.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="size-3 text-muted-foreground" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-red-500/10 text-red-600">
                            {item.metadata?.dishName ? (
                              <Utensils className="size-3.5" />
                            ) : (
                              <Phone className="size-3.5" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">
                              {item.metadata?.dishName || item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.metadata?.dishPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              ₹{item.metadata.dishPrice}
                            </span>
                            {item.metadata.dishCategory && (
                              <span className="text-[10px] text-muted-foreground font-semibold">
                                {item.metadata.dishCategory}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">General Hotline</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        <p className="font-semibold text-foreground">
                          {item.metadata?.device || "Desktop PC"}
                        </p>
                        <p className="text-[10px]">{item.metadata?.browser || "Web Browser"}</p>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="border-red-500/30 text-red-700 dark:text-red-300 font-mono text-[10px]"
                        >
                          +91 99157 16739
                        </Badge>
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
          <Phone className="mx-auto size-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">
            No call events recorded yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Whenever a customer clicks to call or order a dish, the record will show up here
            instantly.
          </p>
        </div>
      )}
    </div>
  );
}
