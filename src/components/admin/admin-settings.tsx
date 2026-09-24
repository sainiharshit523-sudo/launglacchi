import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  KeyRound,
  Link as LinkIcon,
  Lock,
  Power,
  PowerOff,
  RefreshCw,
  Save,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminAuth, ADMIN_PORTAL_PATH } from "@/lib/admin-auth";
import { activityTracker, playNotificationChime } from "@/lib/activity-tracker";
import { websiteStatusManager, type WebsiteStatusConfig } from "@/lib/website-status";

interface AdminSettingsProps {
  onRefresh: () => void;
  onClearAll?: () => void;
}

export function AdminSettings({ onRefresh, onClearAll }: AdminSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const [chimeEnabled, setChimeEnabled] = useState(activityTracker.isChimeEnabled());
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const [siteConfig, setSiteConfig] = useState<WebsiteStatusConfig>(websiteStatusManager.getStatus());
  const [siteSaveStatus, setSiteSaveStatus] = useState<string | null>(null);

  const [copiedCustomer, setCopiedCustomer] = useState(false);
  const [copiedPortal, setCopiedPortal] = useState(false);

  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "https://launglaachirestaurant.com";
  const customerLink = `${siteOrigin}/`;
  const portalLink = `${siteOrigin}${ADMIN_PORTAL_PATH}`;

  const copyToClipboard = async (text: string, type: "customer" | "portal") => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      if (type === "customer") {
        setCopiedCustomer(true);
        setTimeout(() => setCopiedCustomer(false), 2500);
      } else {
        setCopiedPortal(true);
        setTimeout(() => setCopiedPortal(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    const unsub = websiteStatusManager.subscribe((updated) => {
      setSiteConfig(updated);
    });
    return unsub;
  }, []);

  const handleToggleWebsite = () => {
    const updated = websiteStatusManager.toggle();
    setSiteConfig(updated);
    setSiteSaveStatus(
      updated.enabled ? "🟢 Public website turned ONLINE!" : "🔴 Public website turned OFFLINE (Maintenance active)!"
    );
    setTimeout(() => setSiteSaveStatus(null), 4000);
  };

  const handleSaveWebsiteConfig = (e: React.FormEvent) => {
    e.preventDefault();
    websiteStatusManager.setStatus(siteConfig);
    setSiteSaveStatus("✅ Website availability settings saved successfully!");
    setTimeout(() => setSiteSaveStatus(null), 4000);
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: "New passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await adminAuth.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordStatus({ success: true, message: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordStatus({ success: false, message: res.error || "Failed to update password." });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleChime = () => {
    const nextState = !chimeEnabled;
    setChimeEnabled(nextState);
    activityTracker.setChimeEnabled(nextState);
    if (nextState) {
      playNotificationChime();
    }
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

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
      return;
    }
    if (
      confirm(
        "Are you sure you want to completely CLEAR ALL DATA? This will permanently delete all banquet enquiries, calls, WhatsApp logs, and visitor entries."
      )
    ) {
      activityTracker.clearAllData();
      setResetStatus("All customer inquiries and activity records have been cleared.");
      onRefresh();
      setTimeout(() => setResetStatus(null), 3000);
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to restore initial demo data? This will load sample bookings and events."
      )
    ) {
      activityTracker.resetAllData();
      setResetStatus("Initial sample data restored.");
      onRefresh();
      setTimeout(() => setResetStatus(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-pop-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
          <ShieldCheck className="size-6 text-primary" />
          <span>Admin Portal Security & Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your credentials, audio notifications, and activity data retention.
        </p>
      </div>

      {/* Link Separation & Portal URL Security Card */}
      <div className="rounded-3xl border border-gold/40 bg-card p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-gold shadow-sm">
              <LinkIcon className="size-6 text-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-foreground text-lg">Customer vs Admin Link Separation</h3>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                  Protected & Isolated
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Public customer website and private operations portal links are separated for security.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-extrabold text-red-700 dark:text-red-300 self-start sm:self-auto">
            <ShieldX className="size-3.5 text-red-500 shrink-0" />
            <span>/admin Access: Permanently Blocked (404)</span>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {/* Card 1: Public Customer Link */}
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-foreground">
                  <Globe className="size-3.5 text-primary" />
                  <span>Public Customer Website</span>
                </span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-extrabold uppercase">
                  Public
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                Give this link to your customers, put on business cards, Instagram bio & Google Maps. Shows food menu, banquet booking enquiry, and calling buttons.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground break-all">
                <span className="truncate">{customerLink}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(customerLink, "customer")}
                  className="h-8 flex-1 text-xs font-bold"
                  variant="outline"
                >
                  {copiedCustomer ? (
                    <>
                      <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3.5" />
                      <span>Copy Customer Link</span>
                    </>
                  )}
                </Button>
                <Button asChild size="sm" variant="ghost" className="h-8 px-2.5 text-xs">
                  <a href={customerLink} target="_blank" rel="noopener noreferrer" title="Open customer website in new tab">
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2: Private Operations Command Link */}
          <div className="rounded-2xl border border-gold/50 bg-gold/5 p-4 flex flex-col justify-between space-y-3 shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 dark:text-gold">
                  <Lock className="size-3.5 text-gold" />
                  <span>Private Management Portal</span>
                </span>
                <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40 text-[10px] font-extrabold uppercase">
                  Confidential
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                Secret link strictly for the restaurant owner & managers. Bookmark this in your personal browser. Standard /admin is blocked with 404 to protect your privacy.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-background px-3 py-2 text-xs font-mono font-bold text-amber-900 dark:text-amber-300 break-all shadow-xs">
                <span className="truncate">{portalLink}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(portalLink, "portal")}
                  className="h-8 flex-1 text-xs font-black bg-gold text-neutral-950 hover:bg-gold/90 shadow-xs cursor-pointer"
                >
                  {copiedPortal ? (
                    <>
                      <CheckCircle2 className="mr-1.5 size-3.5 text-neutral-950" />
                      <span>Copied Private Link!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3.5" />
                      <span>Copy Secret Portal Link</span>
                    </>
                  )}
                </Button>
                <Button asChild size="sm" variant="outline" className="h-8 px-2.5 text-xs border-gold/40 hover:bg-gold/10">
                  <a href={portalLink} target="_blank" rel="noopener noreferrer" title="Open private portal in new tab">
                    <ExternalLink className="size-3.5 text-gold" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Summary Banner */}
        <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2.5">
          <ShieldAlert className="size-4 text-primary shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-foreground">Why this keeps your portal safe:</strong> Automated crawlers and unauthorized people frequently attempt to open <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground">/admin</code>. Because <code className="px-1.5 py-0.5 rounded bg-muted font-mono font-bold text-foreground">/admin</code> now returns a 404 Page Not Found and public pages contain no admin buttons, visitors have no way of knowing your management portal URL.
          </div>
        </div>
      </div>

      {/* Master Website Online/Offline Availability Card */}
      <div
        className={`rounded-3xl border p-6 shadow-sm transition-all ${
          siteConfig.enabled
            ? "border-emerald-500/40 bg-card"
            : "border-red-500/40 bg-card"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`grid size-12 shrink-0 place-items-center rounded-2xl text-white shadow-sm ${
                siteConfig.enabled ? "bg-emerald-600 shadow-emerald-500/20" : "bg-red-600 shadow-red-500/20"
              }`}
            >
              {siteConfig.enabled ? <Power className="size-6" /> : <PowerOff className="size-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-lg">Website Public Availability</h3>
                <Badge
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    siteConfig.enabled
                      ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40"
                      : "bg-red-500/20 text-red-800 dark:text-red-300 border-red-500/40"
                  }`}
                >
                  {siteConfig.enabled ? "Currently Online" : "Currently Offline"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Turn your public restaurant website ON or OFF instantly anytime (for night closure, renovation, or maintenance).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              onClick={handleToggleWebsite}
              className={`h-10 px-4 text-xs font-black shadow-sm ${
                siteConfig.enabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {siteConfig.enabled ? (
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
            <Button asChild size="sm" variant="outline" className="h-10 text-xs font-bold border-border">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-1.5 size-3.5 text-primary" />
                <span>Preview Site</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Customization Form */}
        <form onSubmit={handleSaveWebsiteConfig} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Offline Notice Title
              </label>
              <Input
                type="text"
                value={siteConfig.heading}
                onChange={(e) => setSiteConfig({ ...siteConfig, heading: e.target.value })}
                placeholder="e.g. We Are Temporarily Closed Online"
                className="h-10 text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                The main headline displayed on the closed page
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Reopening Notice / Timing
              </label>
              <Input
                type="text"
                value={siteConfig.reopenNotice}
                onChange={(e) => setSiteConfig({ ...siteConfig, reopenNotice: e.target.value })}
                placeholder="e.g. Reopening today at 11:00 AM"
                className="h-10 text-xs"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Badge letting customers know when you'll be back
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">
              Offline Description & Instructions
            </label>
            <textarea
              rows={2}
              value={siteConfig.message}
              onChange={(e) => setSiteConfig({ ...siteConfig, message: e.target.value })}
              placeholder="Provide a friendly message and direct contact advice for customers"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {siteSaveStatus ? (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {siteSaveStatus}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Changes apply instantly across public visitor browsers.
              </p>
            )}

            <Button type="submit" size="sm" className="h-9 px-4 text-xs font-bold bg-primary text-primary-foreground">
              <Save className="mr-1.5 size-3.5" />
              <span>Save Status Settings</span>
            </Button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Security & Password Management Card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">Change Admin Password</h3>
              <p className="text-xs text-muted-foreground">Keep your dashboard access protected</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Current Password</label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-10 text-xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-foreground">New Strong Password</label>
                {newPassword && (
                  <span
                    className={`text-[10px] font-extrabold uppercase ${
                      newPassword.length < 8
                        ? "text-red-500"
                        : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(newPassword)
                        ? "text-emerald-500"
                        : "text-amber-500"
                    }`}
                  >
                    {newPassword.length < 8
                      ? "Too Short"
                      : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/.test(newPassword)
                      ? "Very Strong"
                      : "Moderate"}
                  </span>
                )}
              </div>
              <Input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters with letters, numbers & symbols"
                className="h-10 text-xs"
              />

              {/* Password strength visual bar */}
              {newPassword && (
                <div className="mt-2 space-y-1.5">
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        newPassword.length >= 8 ? "bg-amber-500" : "bg-red-500"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        newPassword.length >= 8 && /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)
                          ? "bg-amber-500"
                          : "bg-muted"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        newPassword.length >= 8 && /\d/.test(newPassword) ? "bg-emerald-500" : "bg-muted"
                      }`}
                    />
                    <div
                      className={`h-full transition-all ${
                        newPassword.length >= 8 && /[^a-zA-Z0-9]/.test(newPassword)
                          ? "bg-emerald-500"
                          : "bg-muted"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Recommended: minimum 8 characters with mixed case, numbers, and symbols.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Confirm New Password</label>
              <Input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="h-10 text-xs"
              />
            </div>

            {passwordStatus && (
              <div
                className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
                  passwordStatus.success
                    ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-800 dark:text-red-300 border border-red-500/30"
                }`}
              >
                {passwordStatus.success ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <ShieldAlert className="size-4 shrink-0" />
                )}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full h-10 text-xs font-bold bg-primary text-primary-foreground shadow-xs"
            >
              {isChangingPassword ? "Saving..." : "Save New Password"}
            </Button>
          </form>
        </div>

        {/* Audio Alerts & Notification Settings Card */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="grid size-10 place-items-center rounded-xl bg-gold/15 text-gold">
                <Bell className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Sound Notification Chimes</h3>
                <p className="text-xs text-muted-foreground">Alerts whenever a customer takes action</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  {chimeEnabled ? (
                    <Volume2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <VolumeX className="size-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      {chimeEnabled ? "Notification Audio Enabled" : "Notification Audio Muted"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Plays crystal-clear royal chime on incoming customer actions
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={chimeEnabled ? "default" : "outline"}
                  onClick={handleToggleChime}
                  className="text-xs font-bold h-8"
                >
                  {chimeEnabled ? "Disable" : "Enable"}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => playNotificationChime()}
                className="w-full h-10 border-gold/40 text-foreground text-xs font-bold hover:bg-gold/10"
              >
                <Bell className="mr-1.5 size-3.5 text-gold" />
                Play Test Alert Chime
              </Button>
            </div>
          </div>

          {/* Backup & Reset Data Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground text-base border-b border-border pb-3">
              Data Management & Backup
            </h3>

            <div className="mt-4 space-y-3">
              <Button
                variant="outline"
                onClick={handleExportData}
                className="w-full justify-start h-10 text-xs font-bold border-border hover:border-primary"
              >
                <Download className="mr-2 size-4 text-primary" />
                Download Complete Activity & Bookings (JSON)
              </Button>

              <Button
                variant="outline"
                onClick={handleClearAll}
                className="w-full justify-start h-10 text-xs font-bold border-red-500/40 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                title="Wipe all customer inquiries, bookings, calls, and activity logs"
              >
                <Trash2 className="mr-2 size-4 text-red-500" />
                Clear All Inquiries & Customer Entries
              </Button>

              <Button
                variant="outline"
                onClick={handleResetData}
                className="w-full justify-start h-10 text-xs font-bold border-border hover:border-amber-500 text-muted-foreground hover:text-amber-600"
              >
                <RefreshCw className="mr-2 size-4" />
                Restore Initial Demo Data
              </Button>

              {resetStatus && (
                <p className="text-xs font-bold text-emerald-600 text-center">{resetStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
