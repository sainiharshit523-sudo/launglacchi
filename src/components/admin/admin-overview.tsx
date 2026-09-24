import { useState, useEffect } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Globe,
  MessageCircle,
  PartyPopper,
  Phone,
  Power,
  PowerOff,
  RefreshCw,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type ActivityEvent,
  type BanquetBookingLead,
  playNotificationChime,
} from "@/lib/activity-tracker";
import { websiteStatusManager, type WebsiteStatusConfig } from "@/lib/website-status";

interface AdminOverviewProps {
  bookings: BanquetBookingLead[];
  events: ActivityEvent[];
  onNavigateTab: (tab: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  onClearAll?: () => void;
}

export function AdminOverview({
  bookings,
  events,
  onNavigateTab,
  onExport,
  onRefresh,
  onClearAll,
}: AdminOverviewProps) {
  const [siteStatus, setSiteStatus] = useState<WebsiteStatusConfig>(
    websiteStatusManager.getStatus(),
  );

  useEffect(() => {
    const unsub = websiteStatusManager.subscribe((updated) => {
      setSiteStatus(updated);
    });
    return unsub;
  }, []);

  const handleToggleWebsite = () => {
    const updated = websiteStatusManager.toggle();
    setSiteStatus(updated);
  };

  // Compute analytics
  const newBookingsCount = bookings.filter((b) => b.status === "new").length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === "confirmed").length;

  const callsEvents = events.filter((e) => e.type === "call_click");
  const whatsappEvents = events.filter((e) => e.type === "whatsapp_click");
  const visitsEvents = events.filter((e) => e.type === "page_visit");

  const todayIso = new Date().toISOString().split("T")[0] || "";
  const visitsToday =
    visitsEvents.filter((e) => e.timestamp.startsWith(todayIso)).length || visitsEvents.length;

  return (
    <div className="space-y-8 animate-pop-in">
      {/* Top Banner Alert Bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-gold/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-primary/15 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25">
            <Sparkles className="size-6" />
            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Laung Laachi Real-Time Live Activity Monitor
              </h2>
              <Badge className="bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                Live Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instant alerts whenever customers visit, tap WhatsApp, call to order food, or submit
              banquet hall inquiries.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              playNotificationChime();
            }}
            className="border-gold/40 hover:bg-gold/15 text-foreground text-xs font-bold"
          >
            <Bell className="mr-1.5 size-3.5 text-gold" />
            Test Alert Chime
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onExport}
            className="border-border text-foreground text-xs font-bold"
          >
            <Download className="mr-1.5 size-3.5" />
            Export Data
          </Button>
          <Button
            size="sm"
            onClick={onRefresh}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-xs"
          >
            <RefreshCw className="mr-1.5 size-3.5" />
            Sync Now
          </Button>
          {onClearAll && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClearAll}
              className="border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold"
              title="Clear all enquiries and entries"
            >
              <Trash2 className="mr-1.5 size-3.5 text-red-500" />
              Clear All Data
            </Button>
          )}
        </div>
      </div>

      {/* Website Availability & Master ON/OFF Switch Card */}
      <div
        className={`flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 shadow-sm transition-all sm:flex-row sm:items-center sm:justify-between ${
          siteStatus.enabled
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-card to-card"
            : "border-red-500/40 bg-gradient-to-r from-red-500/15 via-card to-card"
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm text-white ${
              siteStatus.enabled
                ? "bg-emerald-600 shadow-emerald-500/30"
                : "bg-red-600 shadow-red-500/30"
            }`}
          >
            {siteStatus.enabled ? <Power className="size-6" /> : <PowerOff className="size-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                Website Public Access:{" "}
                <span
                  className={
                    siteStatus.enabled
                      ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                      : "text-red-600 dark:text-red-400 font-extrabold"
                  }
                >
                  {siteStatus.enabled ? "ONLINE (Active)" : "OFFLINE (Closed / Paused)"}
                </span>
              </h3>
              <Badge
                className={`text-[10px] font-black uppercase tracking-wider ${
                  siteStatus.enabled
                    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40"
                    : "bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/40"
                }`}
              >
                {siteStatus.enabled ? "Public Active" : "Public Paused"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
              {siteStatus.enabled
                ? "Visitors can explore the restaurant menu, place phone orders, and submit banquet inquiries in real-time."
                : "The public website is currently offline. Visitors see a luxury closed notice with direct phone hotlines. Management can still access the admin portal."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={handleToggleWebsite}
            className={`h-10 px-4 text-xs font-extrabold shadow-sm ${
              siteStatus.enabled
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {siteStatus.enabled ? (
              <>
                <PowerOff className="mr-1.5 size-4" />
                <span>Turn Website OFF</span>
              </>
            ) : (
              <>
                <Power className="mr-1.5 size-4" />
                <span>Turn Website ON</span>
              </>
            )}
          </Button>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-10 text-xs font-bold border-border hover:border-foreground"
          >
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Globe className="mr-1.5 size-3.5 text-primary" />
              <span>Preview Website</span>
            </a>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Banquet Bookings */}
        <div
          onClick={() => onNavigateTab("bookings")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/10"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-amber-500/20 p-2.5 text-amber-800 dark:text-amber-300">
              <PartyPopper className="size-5" />
            </span>
            {newBookingsCount > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateTab("bookings");
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 hover:bg-red-700 text-white shadow-xs border border-red-400/30 transition-colors select-none"
                title="Click to view new pending banquet inquiries"
              >
                <span className="size-1.5 rounded-full bg-white shrink-0" />
                <span>
                  {newBookingsCount} {newBookingsCount === 1 ? "New Inquiry" : "New Inquiries"}
                </span>
              </button>
            )}
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Banquet Leads
            </p>
            <h3 className="mt-1 font-display text-3xl font-black text-foreground">
              {bookings.length}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {confirmedBookingsCount} confirmed
              </span>
              <span>•</span>
              <span className="text-amber-800 dark:text-amber-300 font-bold">
                {newBookingsCount} pending review
              </span>
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300 group-hover:underline">
            <span>Manage bookings</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>

        {/* Card 2: Phone Calls & Orders */}
        <div
          onClick={() => onNavigateTab("calls")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-card to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/10"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 to-rose-500" />
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-red-500/20 p-2.5 text-red-800 dark:text-red-300">
              <Phone className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-red-800 dark:text-red-300 bg-red-500/15 px-2 py-0.5 rounded-md">
              Order Hotline
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Phone Call Orders
            </p>
            <h3 className="mt-1 font-display text-3xl font-black text-foreground">
              {callsEvents.length}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct taps on menu dishes & phone hotline
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-red-800 dark:text-red-300 group-hover:underline">
            <span>View call logs</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>

        {/* Card 3: WhatsApp Button Taps */}
        <div
          onClick={() => onNavigateTab("whatsapp")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-500" />
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-800 dark:text-emerald-300">
              <MessageCircle className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-md">
              WhatsApp
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              WhatsApp Inquiries
            </p>
            <h3 className="mt-1 font-display text-3xl font-black text-foreground">
              {whatsappEvents.length}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">Direct chats initiated by visitors</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 group-hover:underline">
            <span>View WhatsApp chats</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>

        {/* Card 4: Web Visitors */}
        <div
          onClick={() => onNavigateTab("visitors")}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 to-violet-500" />
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-purple-500/20 p-2.5 text-purple-800 dark:text-purple-300">
              <Users className="size-5" />
            </span>
            <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded-md">
              Traffic
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
              Live Visitors
            </p>
            <h3 className="mt-1 font-display text-3xl font-black text-foreground">{visitsToday}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Customer sessions recorded on site</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-800 dark:text-purple-300 group-hover:underline">
            <span>Inspect visitor logs</span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </div>

      {/* Two-Column Section: Urgent Banquet Leads & Live Activity Feed */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        {/* Left: Recent Banquet Inquiries Requiring Action */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <PartyPopper className="size-5 text-amber-500" />
                <span>Recent Banquet Bookings</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Inquiries submitted for marriages, ring ceremonies & celebrations
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("bookings")}
              className="text-xs font-bold"
            >
              View All ({bookings.length})
            </Button>
          </div>

          <div className="mt-4 space-y-3.5">
            {bookings.slice(0, 4).map((booking) => {
              const isNew = booking.status === "new";
              return (
                <div
                  key={booking.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                    isNew
                      ? "border-amber-500/50 bg-amber-500/5 dark:bg-amber-950/20"
                      : "border-border/70 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {booking.refCode}
                      </span>
                      <h4 className="font-bold text-foreground text-sm">{booking.name}</h4>
                      {isNew && (
                        <Badge className="bg-red-600 text-white text-[9px] font-black uppercase">
                          New Lead
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground/80">{booking.eventType}</span>
                      <span>•</span>
                      <span>{booking.eventDate ? `Date: ${booking.eventDate}` : "Date TBD"}</span>
                      <span>•</span>
                      <span>{booking.guestCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold"
                    >
                      <a
                        href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${booking.name}! We received your banquet booking request (${booking.refCode}) at Laung Laachi Brahmpur.`,
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="size-3 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold"
                    >
                      <a href={`tel:${booking.phone}`}>
                        <Phone className="size-3 mr-1" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Chronological Activity Feed */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                <span>Live Activity Stream</span>
              </h3>
              <p className="text-xs text-muted-foreground">Real-time actions taken by visitors</p>
            </div>
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {events.slice(0, 10).map((evt) => {
              let icon = <Activity className="size-3.5 text-primary" />;
              let badgeColor = "border-border bg-muted/50 text-foreground";

              if (evt.type === "banquet_booking") {
                icon = <PartyPopper className="size-3.5 text-amber-500" />;
                badgeColor =
                  "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200";
              } else if (evt.type === "call_click") {
                icon = <Phone className="size-3.5 text-red-500" />;
                badgeColor = "border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200";
              } else if (evt.type === "whatsapp_click") {
                icon = <MessageCircle className="size-3.5 text-emerald-500" />;
                badgeColor =
                  "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200";
              } else if (evt.type === "page_visit") {
                icon = <Users className="size-3.5 text-purple-500" />;
                badgeColor =
                  "border-purple-500/40 bg-purple-500/10 text-purple-800 dark:text-purple-200";
              }

              const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/50 p-3 text-xs transition-colors hover:bg-muted/40"
                >
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg border border-border bg-card">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-foreground truncate">{evt.title}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {timeStr}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 mt-0.5">{evt.description}</p>
                    {evt.metadata?.device && (
                      <span className="inline-block mt-1 text-[9px] text-muted-foreground/80">
                        {evt.metadata.device} • {evt.metadata.browser || "Browser"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
