// Centralized Website Online/Offline Status Manager
export interface WebsiteStatusConfig {
  enabled: boolean; // true = Live public website, false = Maintenance/Offline view
  heading: string;
  message: string;
  reopenNotice: string;
  supportPhone: string;
  updatedAt: string;
}

const STORAGE_WEBSITE_STATUS_KEY = "laung_laachi_website_status_v1";
const BROADCAST_STATUS_CHANNEL = "laung_laachi_website_status_bus";
const WINDOW_EVENT_NAME = "laung_laachi_website_status_updated";

const DEFAULT_STATUS: WebsiteStatusConfig = {
  enabled: true,
  heading: "We Are Temporarily Closed Online",
  message:
    "Our online website and digital orders are currently turned off. Our kitchen and banquet team are still available for direct bookings, weddings, and dine-in visits in Brahmpur.",
  reopenNotice: "Reopening soon for regular online orders & inquiries",
  supportPhone: "+91 99882 22211",
  updatedAt: new Date().toISOString(),
};

// Safe broadcast channel getter
let broadcastChannel: BroadcastChannel | null = null;
function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!broadcastChannel && "BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_STATUS_CHANNEL);
    } catch {
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

export const websiteStatusManager = {
  // Read current status
  getStatus(): WebsiteStatusConfig {
    if (typeof window === "undefined") return DEFAULT_STATUS;
    try {
      const stored = localStorage.getItem(STORAGE_WEBSITE_STATUS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_WEBSITE_STATUS_KEY, JSON.stringify(DEFAULT_STATUS));
        return DEFAULT_STATUS;
      }
      return { ...DEFAULT_STATUS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_STATUS;
    }
  },

  // Check if website is enabled
  isEnabled(): boolean {
    return websiteStatusManager.getStatus().enabled;
  },

  // Save new status or partial update
  setStatus(patch: Partial<WebsiteStatusConfig>): WebsiteStatusConfig {
    const current = websiteStatusManager.getStatus();
    const updated: WebsiteStatusConfig = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_WEBSITE_STATUS_KEY, JSON.stringify(updated));

        // Dispatch local window event for same-tab reactive updates
        window.dispatchEvent(
          new CustomEvent(WINDOW_EVENT_NAME, { detail: updated })
        );

        // Broadcast to other open tabs (e.g. customer tabs vs admin tabs)
        const channel = getChannel();
        if (channel) {
          channel.postMessage({ type: "WEBSITE_STATUS_CHANGED", status: updated });
        }
      } catch (err) {
        console.error("Failed to save website status in localStorage", err);
      }
    }

    return updated;
  },

  // Fast toggle ON <-> OFF
  toggle(): WebsiteStatusConfig {
    const current = websiteStatusManager.getStatus();
    return websiteStatusManager.setStatus({ enabled: !current.enabled });
  },

  // Subscribe to changes in real-time across tabs and components
  subscribe(callback: (status: WebsiteStatusConfig) => void): () => void {
    if (typeof window === "undefined") return () => {};

    // 1. BroadcastChannel listener (cross-tab)
    const channel = getChannel();
    const channelHandler = (e: MessageEvent) => {
      if (e.data?.type === "WEBSITE_STATUS_CHANGED" && e.data?.status) {
        callback(e.data.status);
      }
    };
    channel?.addEventListener("message", channelHandler);

    // 2. Custom window event listener (same-tab)
    const windowHandler = (e: Event) => {
      const customEvt = e as CustomEvent<WebsiteStatusConfig>;
      if (customEvt.detail) {
        callback(customEvt.detail);
      }
    };
    window.addEventListener(WINDOW_EVENT_NAME, windowHandler);

    // 3. Storage event listener (fallback cross-window)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_WEBSITE_STATUS_KEY && e.newValue) {
        try {
          callback(JSON.parse(e.newValue));
        } catch {
          callback(websiteStatusManager.getStatus());
        }
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      channel?.removeEventListener("message", channelHandler);
      window.removeEventListener(WINDOW_EVENT_NAME, windowHandler);
      window.removeEventListener("storage", storageHandler);
    };
  },
};
