import { useState } from "react";
import { Clock, ExternalLink, MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ActivityEvent } from "@/lib/activity-tracker";

interface AdminWhatsAppLogProps {
  events: ActivityEvent[];
}

export function AdminWhatsAppLog({ events }: AdminWhatsAppLogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const whatsappEvents = events.filter((e) => e.type === "whatsapp_click");

  const filtered = whatsappEvents.filter((e) => {
    return (
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.metadata?.whatsappSource && e.metadata.whatsappSource.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 animate-pop-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
            <MessageCircle className="size-6 text-emerald-500" />
            <span>Customer WhatsApp Button Taps & Chats</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Logs of all visitors who initiated a WhatsApp chat via the floating help button or banquet inquiry buttons.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search WhatsApp taps..."
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
                  <th className="px-6 py-4">Source Button</th>
                  <th className="px-6 py-4">Customer Action Description</th>
                  <th className="px-6 py-4">Device & Browser</th>
                  <th className="px-6 py-4 text-right">Direct Chat</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                          {item.metadata?.whatsappSource || "Floating Button"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground text-sm">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        <p className="font-semibold text-foreground">{item.metadata?.device || "Mobile Device"}</p>
                        <p className="text-[10px]">{item.metadata?.browser || "Web Browser"}</p>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold"
                        >
                          <a href="https://wa.me/919915716739" target="_blank" rel="noreferrer">
                            <MessageCircle className="mr-1 size-3.5" />
                            Open WhatsApp
                          </a>
                        </Button>
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
          <MessageCircle className="mx-auto size-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">No WhatsApp interactions logged</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Customer clicks on any WhatsApp widget or button will be tracked here in real time.
          </p>
        </div>
      )}
    </div>
  );
}
