import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Globe,
  Info,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  PartyPopper,
  Phone,
  Power,
  PowerOff,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BrandMark } from "@/components/restaurant/brand-mark";
import { adminAuth } from "@/lib/admin-auth";
import {
  activityTracker,
  playNotificationChime,
  type ActivityEvent,
  type BanquetBookingLead,
} from "@/lib/activity-tracker";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminBanquetBookings } from "@/components/admin/admin-banquet-bookings";
import { AdminCallsLog } from "@/components/admin/admin-calls-log";
import { AdminWhatsAppLog } from "@/components/admin/admin-whatsapp-log";
import { AdminVisitorsLog } from "@/components/admin/admin-visitors-log";
import { AdminSettings } from "@/components/admin/admin-settings";
import { websiteStatusManager, type WebsiteStatusConfig } from "@/lib/website-status";

export const Route = createFileRoute("/launglaachi-portal")({
  head: () => ({
    meta: [
      { title: "Staff Operations Portal | Laung Laachi Restaurant & Banquet Hall" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Login form state
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Real-time data state
  const [bookings, setBookings] = useState<BanquetBookingLead[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState<boolean>(false);
  const [siteStatus, setSiteStatus] = useState<WebsiteStatusConfig>(
    websiteStatusManager.getStatus(),
  );

  // Initialize auth & data
  useEffect(() => {
    const isAuth = adminAuth.isAuthenticated();
    setAuthenticated(isAuth);
    if (isAuth) {
      loadData();
    }
    setChimeEnabled(activityTracker.isChimeEnabled());

    const unsubStatus = websiteStatusManager.subscribe((newStatus) => {
      setSiteStatus(newStatus);
    });

    const unsubAuth = adminAuth.subscribe((auth) => {
      setAuthenticated(auth);
      if (auth) {
        loadData();
      }
    });

    return () => {
      unsubStatus();
      unsubAuth();
    };
  }, []);

  // Subscribe to real-time events across tabs
  useEffect(() => {
    if (!authenticated) return;

    const unsubscribe = activityTracker.subscribe((msg) => {
      // Re-fetch data
      loadData();

      if (msg.type === "NEW_BANQUET_BOOKING") {
        playNotificationChime();
        const lead = msg["booking"] as BanquetBookingLead;
        setLatestAlert(`🎉 New Banquet Booking from ${lead.name} (${lead.eventType})!`);
      } else if (msg.type === "NEW_ACTIVITY_EVENT") {
        playNotificationChime();
        const evt = msg["event"] as ActivityEvent;
        setLatestAlert(`🔔 Customer Activity: ${evt.title}`);
      } else if (msg.type === "ALL_DATA_CLEARED") {
        setLatestAlert("🧹 All inquiries, bookings, and customer entries have been cleared.");
      }

      setTimeout(() => {
        setLatestAlert(null);
      }, 6000);
    });

    return () => {
      unsubscribe();
    };
  }, [authenticated]);

  const loadData = () => {
    setBookings(activityTracker.getBookings());
    setEvents(activityTracker.getEvents());
  };

  const handleToggleWebsite = () => {
    const updated = websiteStatusManager.toggle();
    setSiteStatus(updated);
    setLatestAlert(
      updated.enabled
        ? "🟢 Public Website is now ONLINE & accepting customer orders and banquet bookings!"
        : "🔴 Public Website is now OFFLINE. Visitors see the closed / maintenance screen.",
    );
    setTimeout(() => {
      setLatestAlert(null);
    }, 6000);
  };

  const handleClearAllData = () => {
    activityTracker.clearAllData();
    loadData();
    setIsClearDialogOpen(false);
    setLatestAlert(
      "🧹 All inquiries, bookings, calls, and customer entries have been cleared successfully.",
    );
    setTimeout(() => {
      setLatestAlert(null);
    }, 6000);
  };

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await adminAuth.login(username, password, rememberMe);
      if (res.success) {
        setAuthenticated(true);
        loadData();
      } else {
        setLoginError(res.error || "Invalid username or password.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    setAuthenticated(false);
  };

  const handleExportData = () => {
    const dataStr = activityTracker.exportData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laung-laachi-admin-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (Unauthenticated)
  // -------------------------------------------------------------
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-8">
        {/* Top bar return to customer site link */}
        <div className="mx-auto w-full max-w-md flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-gold transition-colors group"
            title="Return to public customer website"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Customer Website</span>
          </a>
          <Badge
            variant="outline"
            className="border-gold/40 text-gold text-[10px] font-black uppercase"
          >
            Private Staff Link
          </Badge>
        </div>

        {/* Login Card */}
        <div className="mx-auto w-full max-w-md my-auto">
          <div className="overflow-hidden rounded-3xl border border-gold/40 bg-card p-8 shadow-2xl shadow-primary/10">
            {/* Header Brand */}
            <div className="text-center">
              <div className="flex justify-center">
                <BrandMark size="lg" />
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                <ShieldCheck className="size-3.5 text-gold" />
                <span>Executive Operations Command</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Sign in to view real-time customer visits, banquet bookings & call orders.
              </p>

              {/* Public customer notice */}
              <div className="mt-3.5 rounded-xl border border-border/80 bg-muted/30 p-2.5 text-[11px] text-muted-foreground text-left flex items-start gap-2">
                <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Customer Notice:</strong> For food menu, table bookings & banquet
                  inquiries, please visit the{" "}
                  <a href="/" className="text-primary font-bold hover:underline">
                    Customer Website
                  </a>
                  . This screen is restricted to operations staff.
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    required
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="h-11 rounded-xl text-xs font-medium pl-3 pr-4"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                    <span>{showPassword ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secret password"
                    className="h-11 rounded-xl text-xs font-medium pl-3 pr-10"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Lock className="size-4" />
                  </div>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Keep me logged in</span>
                </label>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 animate-shake">
                  <ShieldAlert className="size-4 shrink-0 text-red-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-sm shadow-md mt-2"
              >
                <ShieldCheck className="mr-2 size-4" />
                <span>{isLoggingIn ? "Verifying..." : "Secure Sign In"}</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="mx-auto text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Laung Laachi Restaurant & Banquet Hall. All rights
            reserved.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand & System Status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className="text-left focus:outline-none cursor-pointer"
              title="Laung Laachi Admin Command Center"
            >
              <BrandMark size="sm" showSubtitle={false} />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-border/80">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Operations Center
              </span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio chime toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const nextState = !chimeEnabled;
                setChimeEnabled(nextState);
                activityTracker.setChimeEnabled(nextState);
                if (nextState) playNotificationChime();
              }}
              className="h-9 px-2.5 sm:px-3 text-xs font-bold border-border"
              title={chimeEnabled ? "Notification sound active" : "Notification sound muted"}
            >
              {chimeEnabled ? (
                <>
                  <Volume2 className="size-4 text-emerald-600 dark:text-emerald-400 sm:mr-1.5" />
                  <span className="hidden sm:inline">Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="size-4 text-muted-foreground sm:mr-1.5" />
                  <span className="hidden sm:inline">Muted</span>
                </>
              )}
            </Button>

            {/* Website ON/OFF Master Switch Button */}
            <Button
              size="sm"
              variant={siteStatus.enabled ? "outline" : "destructive"}
              onClick={handleToggleWebsite}
              className={`h-9 px-2.5 sm:px-3 text-xs font-black shadow-xs transition-all ${
                siteStatus.enabled
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20"
                  : "bg-red-600 hover:bg-red-700 text-white animate-in fade-in"
              }`}
              title={
                siteStatus.enabled
                  ? "Public website is online. Click to turn website OFF."
                  : "Public website is paused. Click to turn website ON."
              }
            >
              {siteStatus.enabled ? (
                <>
                  <Power className="mr-1.5 size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden sm:inline">Website:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-black">ONLINE</span>
                </>
              ) : (
                <>
                  <PowerOff className="mr-1.5 size-3.5" />
                  <span className="hidden sm:inline">Website:</span>
                  <span className="font-black">OFFLINE</span>
                </>
              )}
            </Button>

            {/* View Live Customer Website in a separate new tab to prevent disrupting real-time monitoring */}
            <Button
              asChild
              size="sm"
              variant="outline"
              className="h-9 px-2.5 sm:px-3 text-xs font-bold border-gold/40 hover:border-gold hover:text-gold hover:bg-gold/5"
              title="Open public customer website in a separate browser tab"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-1.5 size-3.5 text-gold" />
                <span className="hidden sm:inline">View Customer Website</span>
                <span className="sm:hidden">Live Site</span>
                <ExternalLink className="ml-1.5 size-3 opacity-60" />
              </a>
            </Button>

            {/* Clear All Data Button & Modal */}
            <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-2.5 sm:px-3 text-xs font-bold border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
                  title="Clear all customer enquiries, bookings, calls, and visitor activity"
                >
                  <Trash2 className="size-4 sm:mr-1.5 text-red-500" />
                  <span className="hidden sm:inline">Clear All Data</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md rounded-3xl border border-red-500/30 p-6">
                <AlertDialogHeader>
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-500/15 text-red-600 mb-2">
                    <Trash2 className="size-6" />
                  </div>
                  <AlertDialogTitle className="text-center font-display text-xl text-foreground">
                    Clear All Enquiries & Entries?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-xs text-muted-foreground">
                    Are you sure you want to delete all banquet hall bookings, WhatsApp clicks,
                    phone call logs, and customer entries? This will clear all data across your
                    admin dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 sm:justify-center gap-2">
                  <AlertDialogCancel className="rounded-xl text-xs font-bold">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold"
                  >
                    Yes, Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Logout button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              className="h-9 text-xs font-bold text-muted-foreground hover:text-red-600"
              title="Sign out of admin portal"
            >
              <LogOut className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Real-time Alert Toast Banner (if triggered) */}
        {latestAlert && (
          <div className="bg-gradient-to-r from-amber-500 via-primary to-orange-500 text-white px-4 py-2 text-center text-xs font-extrabold shadow-md flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="size-4" />
            <span>{latestAlert}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="border-t border-border/60 bg-muted/40 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
              {
                id: "bookings",
                label: "Banquet Bookings",
                icon: PartyPopper,
                badge: bookings.filter((b) => b.status === "new").length || undefined,
              },
              { id: "calls", label: "Phone Calls Log", icon: Phone },
              { id: "whatsapp", label: "WhatsApp Chats", icon: MessageCircle },
              { id: "visitors", label: "Visitor Traffic", icon: Users },
              { id: "settings", label: "Security & Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/75 hover:bg-card hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="rounded-full bg-red-600 text-white px-1.5 py-0.2 text-[10px] font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {activeTab === "overview" && (
          <AdminOverview
            bookings={bookings}
            events={events}
            onNavigateTab={setActiveTab}
            onExport={handleExportData}
            onRefresh={loadData}
            onClearAll={() => setIsClearDialogOpen(true)}
          />
        )}

        {activeTab === "bookings" && (
          <AdminBanquetBookings
            bookings={bookings}
            onRefresh={loadData}
            onClearAll={() => setIsClearDialogOpen(true)}
          />
        )}

        {activeTab === "calls" && <AdminCallsLog events={events} />}

        {activeTab === "whatsapp" && <AdminWhatsAppLog events={events} />}

        {activeTab === "visitors" && <AdminVisitorsLog />}

        {activeTab === "settings" && (
          <AdminSettings onRefresh={loadData} onClearAll={() => setIsClearDialogOpen(true)} />
        )}
      </main>
    </div>
  );
}
