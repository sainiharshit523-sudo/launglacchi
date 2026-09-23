import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUp,
  Bike,
  Calendar,
  CarFront,
  ChevronRight,
  Clock3,
  Coffee,
  ExternalLink,
  Facebook,
  HeartHandshake,
  Image as ImageIcon,
  Instagram,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PartyPopper,
  Phone,
  Quote,
  Sparkles,
  Star,
  Store,
  Trees,
  Twitter,
  Utensils,
  Power,
  PowerOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/restaurant/brand-mark";
import { restaurant, services, banquetInfo } from "@/data/restaurant";
import { GallerySection } from "@/components/restaurant/gallery-section";
import { BanquetBookingDialog } from "@/components/restaurant/banquet-booking-dialog";
import { FullMenuSection } from "@/components/restaurant/full-menu-section";
import { AboutSection } from "@/components/restaurant/about-section";
import { FaqSection } from "@/components/restaurant/faq-section";
import heroImage from "@/assets/laung-laachi-brand-hero.jpg";
import { activityTracker } from "@/lib/activity-tracker";
import { websiteStatusManager, type WebsiteStatusConfig } from "@/lib/website-status";
import { WebsiteOfflineView } from "@/components/restaurant/website-offline-view";
import { adminAuth } from "@/lib/admin-auth";

const seoDescription =
  "Visit Laung Laachi on Nangal–Chandigarh Road in Brahmpur for authentic Punjabi food, AC Banquet Hall bookings for marriages and parties, tandoori paranthas, and comfortable AC rooms. Dine-in, outdoor seating, and takeaway available.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Laung Laachi Brahmpur | Restaurant & Banquet Hall on Nangal–Chandigarh Road" },
      { name: "description", content: seoDescription },
      { property: "og:title", content: "Laung Laachi — Authentic Restaurant & Banquet Hall in Brahmpur" },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: restaurant.name,
          telephone: restaurant.phoneDisplay,
          priceRange: "₹₹",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Nangal to Chandigarh Road",
            addressLocality: "Brahmpur",
            addressRegion: "Punjab",
            postalCode: "140125",
            addressCountry: "IN",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "07:00",
              closes: "00:00",
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});
interface NavItemConfig {
  label: string;
  href: string;
  icon: typeof Sparkles;
  badge?: string;
  iconColor: string;
  hoverText: string;
  hoverBg: string;
  hoverBorder: string;
  glowShadow: string;
  dotColor: string;
  activeGradient: string;
}

const navItemsConfig: NavItemConfig[] = [
  {
    label: "Home",
    href: "#home",
    icon: Sparkles,
    iconColor: "text-amber-500",
    hoverText: "hover:text-amber-600 dark:hover:text-amber-400",
    hoverBg: "hover:bg-amber-500/10",
    hoverBorder: "hover:border-amber-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(245,158,11,0.2)]",
    dotColor: "bg-amber-500",
    activeGradient: "from-amber-500 to-amber-600",
  },
  {
    label: "Gallery",
    href: "#gallery",
    icon: ImageIcon,
    iconColor: "text-rose-500",
    hoverText: "hover:text-rose-600 dark:hover:text-rose-400",
    hoverBg: "hover:bg-rose-500/10",
    hoverBorder: "hover:border-rose-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(244,63,94,0.2)]",
    dotColor: "bg-rose-500",
    activeGradient: "from-rose-500 to-pink-600",
  },
  {
    label: "Banquet Hall",
    href: "#banquet",
    icon: PartyPopper,
    badge: "AC Hall",
    iconColor: "text-purple-500",
    hoverText: "hover:text-purple-600 dark:hover:text-purple-400",
    hoverBg: "hover:bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(168,85,247,0.2)]",
    dotColor: "bg-purple-500",
    activeGradient: "from-purple-600 to-amber-500",
  },
  {
    label: "Menu",
    href: "#menu",
    icon: Utensils,
    badge: "Hot",
    iconColor: "text-orange-500",
    hoverText: "hover:text-orange-600 dark:hover:text-orange-400",
    hoverBg: "hover:bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(249,115,22,0.2)]",
    dotColor: "bg-orange-500",
    activeGradient: "from-orange-500 to-red-600",
  },
  {
    label: "About",
    href: "#about",
    icon: Store,
    iconColor: "text-emerald-500",
    hoverText: "hover:text-emerald-600 dark:hover:text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(16,185,129,0.2)]",
    dotColor: "bg-emerald-500",
    activeGradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "Experience",
    href: "#experience",
    icon: Coffee,
    iconColor: "text-cyan-500",
    hoverText: "hover:text-cyan-600 dark:hover:text-cyan-400",
    hoverBg: "hover:bg-cyan-500/10",
    hoverBorder: "hover:border-cyan-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(6,182,212,0.2)]",
    dotColor: "bg-cyan-500",
    activeGradient: "from-cyan-500 to-blue-600",
  },
  {
    label: "Reviews",
    href: "#reviews",
    icon: Star,
    badge: "3.9★",
    iconColor: "text-yellow-500",
    hoverText: "hover:text-yellow-600 dark:hover:text-yellow-400",
    hoverBg: "hover:bg-yellow-500/10",
    hoverBorder: "hover:border-yellow-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(234,179,8,0.2)]",
    dotColor: "bg-yellow-500",
    activeGradient: "from-yellow-500 to-amber-600",
  },
  {
    label: "FAQ",
    href: "#faq",
    icon: MessageCircle,
    iconColor: "text-indigo-500",
    hoverText: "hover:text-indigo-600 dark:hover:text-indigo-400",
    hoverBg: "hover:bg-indigo-500/10",
    hoverBorder: "hover:border-indigo-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(99,102,241,0.2)]",
    dotColor: "bg-indigo-500",
    activeGradient: "from-indigo-500 to-purple-600",
  },
  {
    label: "Location",
    href: "#location",
    icon: MapPin,
    iconColor: "text-teal-500",
    hoverText: "hover:text-teal-600 dark:hover:text-teal-400",
    hoverBg: "hover:bg-teal-500/10",
    hoverBorder: "hover:border-teal-500/30",
    glowShadow: "hover:shadow-[0_4px_16px_rgba(20,184,166,0.2)]",
    dotColor: "bg-teal-500",
    activeGradient: "from-teal-500 to-emerald-600",
  },
];

const navItems = navItemsConfig.map((item) => [item.label, item.href] as const);

export function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#home");
  const [siteStatus, setSiteStatus] = useState<WebsiteStatusConfig>(websiteStatusManager.getStatus());
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsAdmin(adminAuth.isAuthenticated());
    setSiteStatus(websiteStatusManager.getStatus());
    activityTracker.trackPageVisit("Homepage");

    const unsub = websiteStatusManager.subscribe((newStatus) => {
      setSiteStatus(newStatus);
    });
    return unsub;
  }, []);

  // When website is turned OFF, public visitors see the luxury offline/maintenance view
  if (isMounted && !siteStatus.enabled && !isAdmin) {
    return <WebsiteOfflineView status={siteStatus} />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-16 md:pb-0">
      {/* Admin Preview Mode Offline Notification Bar */}
      {!siteStatus.enabled && isAdmin && (
        <div className="sticky top-0 z-[100] border-b border-red-500/40 bg-red-600 px-4 py-2.5 text-white shadow-lg">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-white animate-ping" />
              <span className="font-extrabold uppercase tracking-wide">
                Website is currently OFFLINE to public visitors (Admin Preview Active)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => websiteStatusManager.setStatus({ enabled: true })}
                className="h-7 px-3 text-xs font-black bg-white text-red-700 hover:bg-white/90 shadow-xs"
              >
                <Power className="mr-1.5 size-3.5" />
                Turn Website ONLINE Now
              </Button>
              <Link
                to="/admin"
                className="rounded-lg bg-black/25 px-2.5 py-1 text-xs font-bold text-white hover:bg-black/40 transition-colors"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md transition-all shadow-sm">
        <div className="mx-auto flex min-h-[86px] sm:min-h-[96px] max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3.5 lg:px-8">
          <a
            href="#home"
            onClick={() => setActiveHref("#home")}
            className="group rounded-2xl py-1.5 px-2 sm:px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all hover:bg-muted/40"
            title="Laung Laachi Restaurant Brahmpur"
          >
            <BrandMark size="lg" />
          </a>

          {/* Desktop Sculpted Navigation Bar with Distinct Section Colors & Micro-Animations */}
          <nav
            className="hidden items-center rounded-full border border-border/70 bg-card/70 px-2 py-1 shadow-inner backdrop-blur-md lg:flex gap-1"
            aria-label="Main navigation"
          >
            {navItemsConfig.map((item) => {
              const Icon = item.icon;
              const isActive = activeHref === item.href;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveHref(item.href)}
                  className={`group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.activeGradient} text-white shadow-sm`
                      : `text-foreground/75 border border-transparent ${item.hoverBg} ${item.hoverBorder} ${item.hoverText} ${item.glowShadow} hover:-translate-y-0.5`
                  }`}
                >
                  <Icon
                    className={`size-3.5 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 ${
                      isActive ? "text-white" : item.iconColor
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[9px] font-extrabold uppercase transition-colors ${
                        isActive
                          ? "bg-black/20 text-white"
                          : "bg-muted text-muted-foreground group-hover:bg-background"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {/* Active bottom glow pip */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-white shadow-xs" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Booking Button in Header with pulsing ring */}
            <Button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-primary to-amber-600 text-primary-foreground font-bold shadow-md hover:opacity-95 text-xs sm:text-sm h-9 sm:h-10 px-3.5 sm:px-4.5 animate-pulse-ring hover:scale-102 transition-transform"
            >
              <PartyPopper className="mr-1.5 size-4 animate-icon-bounce" />
              <span>Book Banquet</span>
            </Button>

            <Button asChild variant="outline" className="hidden sm:inline-flex h-10 border-border hover:border-primary hover:scale-102 transition-transform">
              <a
                href={restaurant.phoneHref}
                onClick={() => activityTracker.trackCallClick({ source: "Header Call Button" })}
              >
                <Phone className="mr-1.5 size-4 text-primary" />
                <span>Call now</span>
              </a>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer with Thematic Colors and Animated Entry */}
        {mobileOpen && (
          <nav className="border-t border-border bg-card/95 px-4 py-4 lg:hidden backdrop-blur-xl animate-pop-in" aria-label="Mobile navigation">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navItemsConfig.map((item) => {
                const Icon = item.icon;
                const isActive = activeHref === item.href;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setActiveHref(item.href);
                      setMobileOpen(false);
                    }}
                    className={`flex min-h-12 items-center justify-between rounded-xl border p-2.5 font-bold transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.activeGradient} text-white border-transparent shadow-md`
                        : `border-border/60 bg-background/80 text-foreground ${item.hoverBg} ${item.hoverText} hover:border-current`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-8 place-items-center rounded-lg border ${
                          isActive
                            ? "border-white/30 bg-white/20 text-white"
                            : `border-border/60 bg-muted/60 ${item.iconColor}`
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                            isActive
                              ? "bg-black/25 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`size-4 ${isActive ? "text-white/80" : "text-muted-foreground"}`} />
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="pt-4 space-y-2">
              <Button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setBookingOpen(true);
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-primary to-amber-600 text-primary-foreground font-bold h-12 shadow-lg"
              >
                <PartyPopper className="mr-2 size-5" />
                Book Banquet Hall for Marriages & Parties
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-[calc(100svh-5.5rem)] overflow-hidden bg-foreground text-primary-foreground">
          {/* Background Hero Photo with soft parallax depth */}
          <img
            src={heroImage}
            alt="A brass cup of masala tea with cloves and cardamom in a Punjabi-inspired brand setting"
            width={1600}
            height={1000}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/35" />

          {/* Floating Glassmorphic Badges on Desktop */}
          <a
            href="#reviews"
            onClick={(e) => {
              const el = document.getElementById("reviews");
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="absolute right-8 top-28 z-30 hidden lg:flex items-center gap-3 rounded-2xl glass-panel-dark p-3.5 shadow-2xl border border-gold/50 hover:border-gold hover:bg-black/95 transition-colors cursor-pointer group pointer-events-auto"
            title="Click to view 650+ Google reviews and customer testimonials"
            aria-label="View 650+ Google Reviews"
          >
            <div className="grid size-12 place-items-center rounded-xl bg-gold/25 text-gold font-extrabold text-base shadow group-hover:bg-gold group-hover:text-black transition-colors">
              ★ 3.9
            </div>
            <div className="text-left text-xs">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-white text-sm group-hover:text-gold transition-colors">
                  650+ Google Reviews
                </p>
                <ArrowRight className="size-3.5 text-gold group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-white/80">Authentic Punjabi Hospitality</p>
              <span className="text-[10px] text-gold font-semibold group-hover:underline flex items-center gap-1 mt-0.5">
                Click to read verified reviews ↓
              </span>
            </div>
          </a>

          <button
            type="button"
            onClick={() => setBookingOpen(true)}
            className="absolute right-12 bottom-28 z-30 hidden lg:flex items-center gap-3.5 rounded-2xl glass-panel-dark p-4 shadow-2xl border border-white/20 hover:border-gold hover:bg-black/95 transition-colors cursor-pointer group pointer-events-auto text-left"
            aria-label="Book Grand AC Banquet Hall for Marriages and Parties"
          >
            <div className="grid size-12 place-items-center rounded-xl bg-primary/40 text-primary-foreground group-hover:bg-primary transition-colors">
              <PartyPopper className="size-6 text-gold" />
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-white text-sm group-hover:text-gold transition-colors">Grand AC Banquet Hall</p>
              <p className="text-gold font-semibold">Marriages · Parties · 300+ Capacity</p>
              <span className="text-[10px] text-white/70 group-hover:text-white flex items-center gap-1 mt-0.5">
                Click to check dates & book ↗
              </span>
            </div>
          </button>

          {/* Main Hero Content */}
          <div className="relative mx-auto flex min-h-[calc(100svh-5.5rem)] max-w-7xl items-end px-4 pb-14 pt-20 sm:items-center sm:px-6 sm:pb-20 lg:px-8">
            <div className="max-w-3xl">
              {/* Event Booking Announcement Badge */}
              <button
                type="button"
                onClick={() => setBookingOpen(true)}
                className="mb-6 relative z-20 pointer-events-auto inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/50 px-4 py-1.5 text-xs font-extrabold uppercase text-secondary backdrop-blur hover:bg-black/80 hover:border-gold hover:scale-102 transition-all cursor-pointer shadow-lg group text-left"
              >
                <PartyPopper className="size-4 text-gold group-hover:rotate-12 transition-transform" />
                <span>Bookings Open for Marriages, Ring Ceremonies & Parties</span>
                <ChevronRight className="size-3.5 text-gold/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <h1 className="text-balance break-words font-display text-[2.75rem] font-extrabold leading-[1.03] sm:text-6xl lg:text-8xl drop-shadow-md">
                Good food.<br />
                <span className="gold-gradient-text">Warm vibes.</span><br />
                A stop worth remembering.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/90 sm:text-lg drop-shadow">
                Authentic Punjabi dining, air-conditioned banquet celebrations, and comfortable AC rooms along the historic Nangal–Chandigarh Road in Brahmpur.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3.5">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setBookingOpen(true)}
                  className="h-12 bg-gradient-to-r from-amber-500 to-amber-600 px-6 text-foreground font-extrabold shadow-xl hover:opacity-95 transform hover:-translate-y-0.5 transition-all"
                >
                  <PartyPopper className="mr-2 size-5" />
                  Book Banquet Hall
                </Button>

                <Button asChild size="lg" className="h-12 bg-primary px-6 text-primary-foreground font-bold hover:bg-primary/90 shadow-md">
                  <a href="#menu">
                    <Utensils className="mr-2 size-4" />
                    View menu
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground/40 bg-primary-foreground/10 px-6 text-primary-foreground hover:bg-primary-foreground hover:text-foreground backdrop-blur">
                  <a href="#gallery">
                    <ImageIcon className="mr-2 size-4" />
                    View Gallery
                  </a>
                </Button>

                <Button asChild size="lg" variant="ghost" className="h-12 px-5 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground">
                  <a
                    href={restaurant.phoneHref}
                    onClick={() => activityTracker.trackCallClick({ source: "Hero Section Call Button" })}
                  >
                    <Phone className="mr-2 size-4" />
                    Call now
                  </a>
                </Button>
              </div>

              {/* Quick Metrics Bar in Hero */}
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-6 border-t border-white/15 max-w-2xl text-white">
                <a
                  href="#reviews"
                  onClick={(e) => {
                    const el = document.getElementById("reviews");
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="rounded-xl bg-white/5 p-3 backdrop-blur border border-white/10 hover:border-gold/60 hover:bg-white/15 transition-all cursor-pointer group text-left block"
                  title="View Google Reviews & Stories"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold group-hover:scale-105 transition-transform">650+</p>
                    <ArrowRight className="size-3 text-gold/60 group-hover:translate-x-0.5 group-hover:text-gold transition-transform" />
                  </div>
                  <p className="text-[11px] text-white/75 font-semibold uppercase group-hover:text-white transition-colors">Google Reviews</p>
                </a>

                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="rounded-xl bg-white/5 p-3 backdrop-blur border border-white/10 hover:border-gold/60 hover:bg-white/15 transition-all cursor-pointer group text-left w-full"
                  title="Banquet Hall Details & Booking"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold group-hover:scale-105 transition-transform">300+</p>
                    <PartyPopper className="size-3 text-gold/60 group-hover:rotate-12 group-hover:text-gold transition-transform" />
                  </div>
                  <p className="text-[11px] text-white/75 font-semibold uppercase group-hover:text-white transition-colors">Banquet Capacity</p>
                </button>

                <a
                  href="#menu"
                  onClick={(e) => {
                    const el = document.getElementById("menu");
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="rounded-xl bg-white/5 p-3 backdrop-blur border border-white/10 hover:border-gold/60 hover:bg-white/15 transition-all cursor-pointer group text-left block"
                  title="Browse full menu"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold group-hover:scale-105 transition-transform">55+</p>
                    <Utensils className="size-3 text-gold/60 group-hover:rotate-12 group-hover:text-gold transition-transform" />
                  </div>
                  <p className="text-[11px] text-white/75 font-semibold uppercase group-hover:text-white transition-colors">Punjabi Dishes</p>
                </a>

                <a
                  href="#location"
                  onClick={(e) => {
                    const el = document.getElementById("location");
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="rounded-xl bg-white/5 p-3 backdrop-blur border border-white/10 hover:border-gold/60 hover:bg-white/15 transition-all cursor-pointer group text-left block"
                  title="View opening hours and location"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-gold group-hover:scale-105 transition-transform">7AM–12</p>
                    <Clock3 className="size-3 text-gold/60 group-hover:text-gold transition-colors" />
                  </div>
                  <p className="text-[11px] text-white/75 font-semibold uppercase group-hover:text-white transition-colors">Daily Open</p>
                </a>
              </div>
            </div>
          </div>

          <p className="absolute bottom-4 right-5 hidden text-[10px] uppercase text-primary-foreground/75 sm:block">
            Authentic restaurant photos verified · Brahmpur, Punjab
          </p>
        </section>

        {/* Highlights Bar with interactive lift-hover */}
        <section aria-label="Restaurant highlights" className="relative z-10 border-y border-border bg-card shadow-sm">
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {[
              { label: "AC Banquet Hall & Rooms", sub: "For Marriages & Parties", icon: PartyPopper, color: "text-amber-600 dark:text-amber-400" },
              { label: "Dine-in & Cloud Lounge", sub: "Comfortable Sofa Seating", icon: Store, color: "text-primary" },
              { label: "Takeaway & Highway Food", sub: "Freshly Packed for Road", icon: Bike, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "7:00 AM – 12:00 AM", sub: "Open All 7 Days", icon: Clock3, color: "text-primary" },
            ].map(({ label, sub, icon: Icon, color }, index) => (
              <div
                key={label}
                className={`group flex min-h-24 items-center gap-3.5 px-4 py-5 sm:px-6 transition-all duration-300 hover:bg-muted/40 ${
                  index % 2 === 0 ? "border-r" : ""
                } sm:border-r sm:last:border-r-0`}
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted group-hover:scale-110 group-hover:bg-primary/15 transition-all">
                  <Icon className={`size-5 ${color}`} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📸 GALLERY SECTION AT THE TOPMOST OF THE WEBSITE */}
        <GallerySection />

        {/* Full Interactive Menu Section */}
        <FullMenuSection />

        {/* About & Heritage Section */}
        <AboutSection />

        {/* Highway Journey Callout */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="punjabi-pattern absolute inset-0 opacity-60" />
          <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <p className="section-kicker">For the journey</p>
                <h2 className="mt-4 text-balance font-display text-4xl font-bold sm:text-5xl text-foreground">
                  A delicious stop along the highway.
                </h2>
                <p className="mt-6 leading-relaxed text-muted-foreground sm:text-lg">
                  Whether it is breakfast before the day gets going, fragrant chai between stretches of road, a quick bite, or an unforgettable family celebration, Laung Laachi offers a restful, welcoming pause in Brahmpur.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold shadow hover:bg-primary/90">
                  <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer">
                    <CarFront className="mr-2 size-4" />
                    Plan your stop
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setBookingOpen(true)}
                  className="font-bold border-gold hover:border-primary"
                >
                  <PartyPopper className="mr-2 size-4 text-primary" />
                  Book Banquet Hall
                </Button>
              </div>
            </div>

            <div className="grid min-h-80 grid-cols-2 bg-gradient-to-br from-primary via-primary/95 to-primary p-6 sm:p-8 gap-3">
              {[
                { icon: Coffee, label: "Breakfast & tea", desc: "Fresh gud wali chai & paranthas" },
                { icon: Utensils, label: "Family meals", desc: "Comfortable AC sofa dining" },
                { icon: PartyPopper, label: "Banquet & Parties", desc: "Weddings, rings & birthdays" },
                { icon: MapPin, label: "Brahmpur stop", desc: "Right on Nangal-Chandigarh Rd" },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="group flex flex-col justify-between rounded-2xl border border-primary-foreground/20 bg-primary-foreground/5 p-5 text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/15 hover:scale-102"
                >
                  <Icon className="size-7 text-secondary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="mt-6 font-display text-base sm:text-lg font-bold">{label}</p>
                    <p className="text-xs text-primary-foreground/75 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="border-y border-border bg-card px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto">
              <p className="section-kicker">Choose your pause</p>
              <h2 className="mt-3 text-balance font-display text-4xl font-bold sm:text-5xl text-foreground">
                Eat here, celebrate in the hall, or take it along.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Four simple ways to enjoy Laung Laachi while you are traveling through the Shivalik corridor.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => {
                const icons = [Store, Trees, CarFront, Bike];
                const Icon = icons[index] ?? Store;
                return (
                  <article
                    key={service.title}
                    className="lift-hover relative rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:border-gold/60"
                  >
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-bold text-foreground">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verified Reviews & Traveler Stories Section */}
        <section id="reviews" className="relative scroll-mt-20 overflow-hidden bg-secondary/35 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="punjabi-pattern absolute inset-0 opacity-20 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl">
            {/* Reviews Header with Google Rating */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-12 border-b border-border/80">
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-5 group cursor-pointer"
                title="View verified rating and reviews on Google Maps"
              >
                <span className="font-display text-6xl sm:text-7xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {restaurant.rating}
                </span>
                <div>
                  <div className="flex gap-1 text-gold" aria-label="3.9 out of 5 stars">
                    {[1, 2, 3, 4].map((n) => (
                      <Star key={n} className="size-5 fill-current group-hover:scale-110 transition-transform" />
                    ))}
                    <Star className="size-5" />
                  </div>
                  <p className="mt-1.5 font-bold text-foreground text-base sm:text-lg group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>{restaurant.reviewCount} Google Reviews</span>
                    <ExternalLink className="size-4 text-primary" />
                  </p>
                  <p className="text-xs text-muted-foreground group-hover:underline">
                    Verified Google Maps Business Rating · Brahmpur, Punjab ↗
                  </p>
                </div>
              </a>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="outline" className="border-border hover:border-primary">
                  <a href={restaurant.googleMapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <span>Read all reviews on Google Maps</span>
                    <ExternalLink className="size-3.5 text-primary" />
                  </a>
                </Button>
                <Button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow"
                >
                  <PartyPopper className="mr-2 size-4" />
                  Book Banquet Hall
                </Button>
              </div>
            </div>

            {/* 3 Real Customer Experience Testimonials */}
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <article className="lift-hover rounded-3xl border border-border bg-card p-7 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="size-6 text-primary/30" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/85 italic">
                    “The best highway breakfast between Chandigarh and Anandpur Sahib. Piping hot tandoori aloo paranthas with fresh butter, and fragrant gud wali chai refreshed our entire family after the long drive.”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60">
                  <p className="font-display font-bold text-sm text-foreground">Sukhwinder Singh</p>
                  <p className="text-xs text-muted-foreground">Pilgrim Traveler · Via Anandpur Sahib</p>
                </div>
              </article>

              <article className="lift-hover rounded-3xl border border-gold/40 bg-gradient-to-b from-card to-secondary/15 p-7 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="size-6 text-gold/50" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/85 italic">
                    “We booked the banquet hall for our sister’s ring ceremony. The stage floral decoration, sound setup, and live tandoori snacks counter were appreciated by all 150 guests from Mohali and Ropar. Clean AC rooms too!”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60">
                  <p className="font-display font-bold text-sm text-foreground">Manpreet Kaur & Family</p>
                  <p className="text-xs text-muted-foreground">Family Event Organizer · Mohali</p>
                </div>
              </article>

              <article className="lift-hover rounded-3xl border border-border bg-card p-7 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <Quote className="size-6 text-primary/30" />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/85 italic">
                    “Super clean AC cloud lounge and ample roadside parking right on the Nangal highway. The butter chicken with garlic naans and dal makhani was exceptional. Highly recommended road stop!”
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60">
                  <p className="font-display font-bold text-sm text-foreground">Arun Sharma</p>
                  <p className="text-xs text-muted-foreground">Himachal Tour Traveler · Delhi</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Section */}
        <FaqSection onOpenBooking={() => setBookingOpen(true)} />

        {/* Location Section */}
        <section id="location" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12 shadow-2xl">
              <div className="punjabi-pattern absolute inset-0 opacity-30" />
              <div className="relative">
                <p className="text-xs font-extrabold uppercase text-secondary tracking-widest">Find us in Brahmpur</p>
                <h2 className="mt-4 max-w-xl font-display text-4xl font-bold sm:text-5xl text-white">
                  Right on the Nangal–Chandigarh Road.
                </h2>
              </div>
              <div className="relative">
                <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/85">{restaurant.address}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary/90 shadow">
                    <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer">
                      <MapPin className="mr-2 size-4" />
                      Get directions
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => setBookingOpen(true)}
                    className="bg-white/20 text-white hover:bg-white/30 backdrop-blur border border-white/30 font-bold"
                  >
                    <PartyPopper className="mr-2 size-4" />
                    Book Banquet Hall
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                    <a href={restaurant.phoneHref}>
                      <Phone className="mr-2 size-4" />
                      {restaurant.phoneDisplay}
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <article className="lift-hover rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-sm">
                <Clock3 className="size-7 text-primary" />
                <p className="mt-6 section-kicker">Opening hours</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">Monday–Sunday</h3>
                <p className="mt-2 text-lg text-muted-foreground">7:00 AM – 12:00 AM</p>
                <p className="text-xs text-muted-foreground mt-1">Breakfast, Lunch, Evening Tea & Late Dinners</p>
              </article>
              <article className="lift-hover rounded-2xl border border-border bg-card p-7 sm:p-9 shadow-sm">
                <Phone className="size-7 text-primary" />
                <p className="mt-6 section-kicker">Call the restaurant</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{restaurant.phoneDisplay}</h3>
                <div className="mt-3 flex items-center gap-4">
                  <Button asChild variant="link" className="h-auto p-0 text-primary font-bold">
                    <a href={restaurant.phoneHref}>
                      Call now <ArrowRight className="ml-1 size-3.5" />
                    </a>
                  </Button>
                  <button
                    type="button"
                    onClick={() => setBookingOpen(true)}
                    className="text-xs font-bold text-secondary hover:underline"
                  >
                    Banquet Inquiry ↗
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Grand Upgraded Footer */}
      <footer className="relative overflow-hidden bg-foreground px-4 pb-28 pt-16 text-primary-foreground sm:px-6 md:pb-14 lg:px-8 border-t border-gold/30">
        {/* Subtle Punjabi Folk Pattern Ambient Backdrop */}
        <div className="punjabi-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        {/* Top Tier: Highway Traveler & Event Organizer Action Strip */}
        <div className="relative mx-auto mb-14 max-w-7xl overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-card/40 via-gold/15 to-card/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-secondary">
                <PartyPopper className="size-3.5 text-gold" />
                Planning A Stop Or Celebration?
              </span>
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white">
                Visit our highway restaurant or book our AC banquet hall.
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
                Enjoy authentic Punjabi cuisine along Nangal–Chandigarh Road, host up to 300+ guests for weddings and parties, or message our team directly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => setBookingOpen(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-foreground font-extrabold shadow-lg hover:opacity-95"
              >
                <PartyPopper className="mr-2 size-4" />
                Book Banquet Hall ↗
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-500/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 hover:text-white">
                <a href={restaurant.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-emerald-400" />
                  <span>WhatsApp Chat</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all">
                <a href={restaurant.emailHref} className="flex items-center gap-2">
                  <Mail className="size-4" />
                  <span>Email Us</span>
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/15">
                <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold" />
                  <span>Get Directions</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="relative mx-auto grid max-w-7xl gap-10 border-b border-primary-foreground/15 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Google Maps Rating */}
          <div className="space-y-4">
            <BrandMark className="[&_span]:text-primary-foreground" size="md" />
            <p className="text-xs sm:text-sm leading-relaxed text-primary-foreground/75">
              Authentic roadside Punjabi dining, air-conditioned banquet celebrations for marriages and parties, and comfortable AC rooms in Brahmpur along the Nangal–Chandigarh corridor.
            </p>

            {/* Google Maps 3.9★ Verified Card */}
            <a
              href={restaurant.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3.5 rounded-2xl border border-gold/40 bg-white/5 p-3.5 transition-all hover:border-gold hover:bg-white/10 group cursor-pointer"
              title="Read verified Google reviews"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/25 text-gold font-black text-sm group-hover:bg-gold group-hover:text-black transition-colors">
                ★ 3.9
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="size-3 text-gold fill-current" />
                  ))}
                  <Star className="size-3 text-gold" />
                </div>
                <p className="font-display font-bold text-xs text-white group-hover:text-gold transition-colors mt-0.5">
                  650+ Google Reviews
                </p>
                <span className="text-[10px] text-primary-foreground/60 flex items-center gap-1">
                  Verified Highway Listing ↗
                </span>
              </div>
            </a>

            {/* Social & Email Connect Buttons */}
            <div className="pt-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-secondary mb-2.5">
                Connect & Socials
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={restaurant.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow Laung Laachi on Instagram"
                  className="flex size-9.5 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:scale-110 hover:border-pink-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 shadow-sm"
                  title="Instagram"
                >
                  <Instagram className="size-4.5" />
                </a>
                <a
                  href={restaurant.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow Laung Laachi on Facebook"
                  className="flex size-9.5 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:scale-110 hover:border-blue-500 hover:bg-blue-600 shadow-sm"
                  title="Facebook"
                >
                  <Facebook className="size-4.5" />
                </a>
                <a
                  href={restaurant.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Follow Laung Laachi on Twitter / X"
                  className="flex size-9.5 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:scale-110 hover:border-sky-400 hover:bg-sky-500 shadow-sm"
                  title="Twitter / X"
                >
                  <Twitter className="size-4.5" />
                </a>
                <a
                  href={restaurant.emailHref}
                  aria-label="Email Laung Laachi Restaurant"
                  className="flex size-9.5 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition-all hover:scale-110 hover:border-gold hover:bg-gold hover:text-black shadow-sm"
                  title={`Email: ${restaurant.email}`}
                >
                  <Mail className="size-4.5" />
                </a>
              </div>
              <a
                href={restaurant.emailHref}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-primary-foreground/75 hover:text-gold transition-colors"
              >
                <Mail className="size-3.5 text-gold" />
                <span>{restaurant.email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Highway Location & Daily Hours */}
          <div>
            <p className="text-xs font-extrabold uppercase text-secondary tracking-widest flex items-center gap-1.5">
              <MapPin className="size-3.5 text-gold" />
              Highway Stop & Hours
            </p>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-primary-foreground/90 font-medium">
              {restaurant.address}
            </p>

            <div className="mt-4 space-y-2.5 border-t border-primary-foreground/15 pt-3 text-xs text-primary-foreground/80">
              <p className="flex items-center gap-2">
                <Clock3 className="size-4 text-gold shrink-0" />
                <span><strong>Daily:</strong> 7:00 AM – 12:00 Midnight</span>
              </p>
              <p className="flex items-center gap-2">
                <Coffee className="size-4 text-gold shrink-0" />
                <span><strong>Breakfast from 7 AM:</strong> Gurh Chai & Paranthas</span>
              </p>
              <p className="flex items-center gap-2">
                <CarFront className="size-4 text-gold shrink-0" />
                <span><strong>Parking:</strong> Free bus & family car highway parking</span>
              </p>
            </div>

            <div className="mt-4">
              <a
                href={restaurant.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
              >
                <ExternalLink className="size-3.5" />
                <span>Open in Google Maps ↗</span>
              </a>
            </div>
          </div>

          {/* Column 3: Grand AC Banquet Hall & AC Rooms */}
          <div>
            <p className="text-xs font-extrabold uppercase text-secondary tracking-widest flex items-center gap-1.5">
              <PartyPopper className="size-3.5 text-gold" />
              Grand AC Banquet & Rooms
            </p>
            <div className="mt-4 space-y-2 text-xs text-primary-foreground/85">
              <p className="font-bold text-white text-sm">Capacity: 50 to 300+ Guests</p>
              <p className="leading-relaxed text-primary-foreground/75">
                Marriages, Ring Ceremonies, Sagan, Sangeet, Birthdays, Kitties & Highway Coach Stops.
              </p>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-primary-foreground/75 border-t border-primary-foreground/15 pt-3">
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Stage & Theme Floral Decoration
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Live Punjabi Tandoori Catering
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Attached AC Guest Rooms for Families
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => setBookingOpen(true)}
                className="bg-gold text-foreground font-bold hover:bg-gold/90 text-xs h-8"
              >
                <PartyPopper className="mr-1.5 size-3.5" />
                Book Hall ↗
              </Button>
              <Button asChild size="sm" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/15 text-xs h-8">
                <a href={restaurant.phoneHref}>
                  <Phone className="mr-1.5 size-3.5 text-gold" />
                  {restaurant.phoneDisplay}
                </a>
              </Button>
            </div>
          </div>

          {/* Column 4: Quick Navigation & Kitchen Standards */}
          <div>
            <p className="text-xs font-extrabold uppercase text-secondary tracking-widest">
              Quick Navigation
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {navItemsConfig.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-1.5 text-primary-foreground/75 hover:text-gold transition-colors py-0.5 group"
                  >
                    <Icon className={`size-3 ${item.iconColor} transition-transform group-hover:scale-125`} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-3 text-[11px] space-y-1.5 text-primary-foreground/80">
              <p className="font-bold text-gold">Kitchen Standards:</p>
              <p className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Strictly Separate Pure Veg & Non-Veg
              </p>
              <p className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Fresh Desi Ghee & Farm Dairy
              </p>
              <p className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> Spill-Proof Highway Takeaway
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar with "Back to Top ↑" Button */}
        <div className="relative mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-4 pt-4 text-xs text-primary-foreground/60 sm:flex-row">
          <div>
            <p>© 2026 Laung Laachi Restaurant & AC Banquet Hall, Brahmpur.</p>
            <p className="text-[11px] text-primary-foreground/50 mt-0.5">
              Nangal to Chandigarh Road, Rupnagar District, Punjab · Authentic Punjabi Hospitality
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={restaurant.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1 text-[11px]"
            >
              <Instagram className="size-3 text-gold" />
              <span>Instagram</span>
            </a>
            <span>·</span>
            <a
              href={restaurant.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1 text-[11px]"
            >
              <Facebook className="size-3 text-gold" />
              <span>Facebook</span>
            </a>
            <span>·</span>
            <a
              href={restaurant.social.twitter}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1 text-[11px]"
            >
              <Twitter className="size-3 text-gold" />
              <span>Twitter</span>
            </a>
            <span>·</span>
            <a
              href={restaurant.emailHref}
              className="hover:text-gold transition-colors flex items-center gap-1 text-[11px]"
            >
              <Mail className="size-3 text-gold" />
              <span>Email</span>
            </a>
            <span>·</span>
            <Link
              to="/admin"
              className="hover:text-gold transition-colors flex items-center gap-1 text-[11px] font-semibold text-primary-foreground/60 hover:text-gold"
              title="Restricted Staff & Admin Management Portal"
            >
              <Lock className="size-3 text-gold/80" />
              <span>Admin Portal</span>
            </Link>
            <span>·</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-gold hover:border-gold hover:bg-gold hover:text-black transition-all cursor-pointer shadow-xs"
              aria-label="Scroll to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={restaurant.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => activityTracker.trackWhatsAppClick("Floating WhatsApp Widget")}
        className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6 flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-2xl hover:bg-emerald-500 hover:scale-105 transition-all group pointer-events-auto border border-emerald-400/40"
        title="Chat with Laung Laachi on WhatsApp"
        aria-label="Chat with Laung Laachi on WhatsApp"
      >
        <MessageCircle className="size-5 text-white group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline text-xs font-extrabold tracking-wide">
          WhatsApp Help
        </span>
      </a>

      {/* Mobile Fixed Bottom Quick Actions Bar with Distinct Vibrant Colors & Animations */}
      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 gap-1 border-t border-border/80 bg-background/95 p-1.5 shadow-2xl backdrop-blur-xl md:hidden" aria-label="Quick actions">
        <a
          href="#menu"
          onClick={() => setActiveHref("#menu")}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-orange-500/10 py-1 text-[11px] font-extrabold text-orange-600 dark:text-orange-400 transition-all active:scale-95 border border-orange-500/20"
        >
          <Utensils className="size-4 text-orange-500 transition-transform active:rotate-12" />
          <span>Menu</span>
        </a>
        <a
          href="#gallery"
          onClick={() => setActiveHref("#gallery")}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-rose-500/10 py-1 text-[11px] font-extrabold text-rose-600 dark:text-rose-400 transition-all active:scale-95 border border-rose-500/20"
        >
          <ImageIcon className="size-4 text-rose-500 transition-transform active:rotate-12" />
          <span>Gallery</span>
        </a>
        <button
          type="button"
          onClick={() => setBookingOpen(true)}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-amber-500 py-1 text-[11px] font-extrabold text-white shadow-md shadow-purple-500/25 transition-all active:scale-95"
        >
          <PartyPopper className="size-4 text-yellow-200 animate-icon-bounce" />
          <span>Book Hall</span>
        </button>
        <a
          href={restaurant.phoneHref}
          onClick={() => activityTracker.trackCallClick({ source: "Mobile Bottom Call Button" })}
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl bg-emerald-500/10 py-1 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 transition-all active:scale-95 border border-emerald-500/20"
        >
          <Phone className="size-4 text-emerald-500 transition-transform active:rotate-12" />
          <span>Call</span>
        </a>
      </nav>

      {/* Global Banquet Booking Dialog */}
      <BanquetBookingDialog open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
}
