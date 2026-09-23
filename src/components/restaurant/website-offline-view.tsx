import { Phone, MessageCircle, MapPin, Clock, Shield, Lock, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";
import { restaurant } from "@/data/restaurant";
import type { WebsiteStatusConfig } from "@/lib/website-status";

interface WebsiteOfflineViewProps {
  status: WebsiteStatusConfig;
}

export function WebsiteOfflineView({ status }: WebsiteOfflineViewProps) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20">
      {/* Subtle luxury ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 border-b border-border/60 bg-background/80 backdrop-blur-md px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <BrandMark size="sm" showSubtitle={false} />

          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-bold text-amber-900 dark:text-amber-200">
            <span>Special Notice</span>
          </div>
        </div>
      </header>

      {/* Center Hero Notice Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl rounded-3xl border border-gold/40 bg-card/95 p-6 sm:p-10 shadow-2xl shadow-primary/10 backdrop-blur-xl text-center">
          {/* Royal Crest / Brand */}
          <div className="flex justify-center mb-6">
            <BrandMark size="lg" />
          </div>

          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-extrabold text-red-700 dark:text-red-400 mb-5">
            <span className="relative flex size-2.5">
              <span className="size-2.5 rounded-full bg-red-600 shrink-0" />
            </span>
            <span className="uppercase tracking-wider">Website Temporarily Paused</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {status.heading || "We Are Temporarily Closed Online"}
          </h1>

          {/* Custom Message */}
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-xl mx-auto">
            {status.message ||
              "Our online services are currently paused. Our physical kitchen and banquet team are available for weddings, ceremonies, and private catering bookings."}
          </p>

          {/* Reopening banner */}
          {status.reopenNotice && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Clock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{status.reopenNotice}</span>
            </div>
          )}

          {/* Direct Contact Buttons */}
          <div className="mt-8 pt-6 border-t border-border/80">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-4">
              Direct Contact & Urgent Bookings
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                className="h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs sm:text-sm shadow-md rounded-xl px-5"
              >
                <a href={restaurant.phoneHref}>
                  <Phone className="mr-2 size-4 text-gold" />
                  <span>Call {restaurant.phoneDisplay}</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs sm:text-sm rounded-xl px-5"
              >
                <a
                  href={restaurant.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4 text-emerald-600" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-11 border-border hover:border-foreground text-xs sm:text-sm font-bold rounded-xl px-5"
              >
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 size-4 text-primary" />
                  <span>View Location</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Physical Address & Hours details */}
          <div className="mt-8 rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground grid gap-2 sm:grid-cols-2 text-left">
            <div className="flex items-start gap-2.5">
              <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Restaurant & Banquet Address</p>
                <p>{restaurant.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="size-4 text-gold shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-foreground">Operating Schedule</p>
                <p>{restaurant.hours} (Daily Open)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 border-t border-border/60 bg-background/80 px-4 py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-[11px] text-muted-foreground/60 hover:text-foreground inline-flex items-center gap-1 transition-colors"
              title="Staff Portal"
            >
              <Lock className="size-2.5" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
