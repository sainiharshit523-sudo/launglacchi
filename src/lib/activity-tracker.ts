// Client-side Activity Tracker & Real-Time Notification Bus for Laung Laachi Admin
export type ActivityEventType =
  "page_visit" | "banquet_booking" | "whatsapp_click" | "call_click" | "menu_interaction";

export type BookingStatus = "new" | "in_discussion" | "confirmed" | "completed" | "cancelled";

export interface BanquetBookingLead {
  id: string;
  refCode: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  cateringType: string;
  roomsNeeded: string;
  notes?: string | undefined;
  createdAt: string;
  status: BookingStatus;
  estimatedBudget?: string | undefined;
  lastFollowUp?: string | undefined;
}

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    device?: string | undefined;
    browser?: string | undefined;
    referrer?: string | undefined;
    path?: string | undefined;
    section?: string | undefined;
    dishName?: string | undefined;
    dishPrice?: number | undefined;
    dishCategory?: string | undefined;
    phoneClicked?: string | undefined;
    whatsappSource?: string | undefined;
    bookingId?: string | undefined;
  };
}

export interface VisitorSession {
  sessionId: string;
  firstSeen: string;
  lastActive: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
  browser: string;
  sectionsViewed: string[];
  totalActions: number;
}

const STORAGE_EVENTS_KEY = "laung_laachi_activity_events_v1";
const STORAGE_BOOKINGS_KEY = "laung_laachi_banquet_bookings_v1";
const STORAGE_VISITORS_KEY = "laung_laachi_visitors_v1";
const STORAGE_CHIME_PREF_KEY = "laung_laachi_chime_enabled_v1";

const CHANNEL_NAME = "laung_laachi_admin_broadcast";

// Detect user device & browser
function getClientEnvironment(): {
  device: string;
  browser: string;
  deviceType: "Mobile" | "Tablet" | "Desktop";
} {
  if (typeof window === "undefined") {
    return { device: "Desktop", browser: "Chrome", deviceType: "Desktop" };
  }

  const ua = navigator.userAgent;
  let deviceType: "Mobile" | "Tablet" | "Desktop" = "Desktop";
  let device = "Desktop PC";

  if (/Mobi|Android/i.test(ua)) {
    deviceType = "Mobile";
    device = /iPhone/i.test(ua) ? "Apple iPhone" : "Android Smartphone";
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = "Tablet";
    device = "Tablet Device";
  } else if (/Macintosh/i.test(ua)) {
    device = "Apple Mac";
  } else if (/Windows/i.test(ua)) {
    device = "Windows PC";
  }

  let browser = "Web Browser";
  if (/Chrome/i.test(ua) && !/Edg|OPR/i.test(ua)) browser = "Google Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
  else if (/Firefox/i.test(ua)) browser = "Mozilla Firefox";
  else if (/Edg/i.test(ua)) browser = "Microsoft Edge";

  return { device, browser, deviceType };
}

// Generate unique session ID for current tab/window
function getSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sid = sessionStorage.getItem("laung_laachi_session_id");
  if (!sid) {
    sid =
      "sess_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    sessionStorage.setItem("laung_laachi_session_id", sid);
  }
  return sid;
}

// Synthesize pleasant luxury notification chime using Web Audio API
export function playNotificationChime(frequencyMultiplier = 1.0): void {
  if (typeof window === "undefined") return;
  const isChimeEnabled = localStorage.getItem(STORAGE_CHIME_PREF_KEY) !== "false";
  if (!isChimeEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic Chime Chord (E5 + G#5 + B5) for a welcoming royal alert
    const frequencies = [659.25, 830.61, 987.77].map((f) => f * frequencyMultiplier);

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.18 / (index + 1), now + index * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.9);
    });
  } catch {
    // Audio autoplay restrictions or unsupported
  }
}

// Initial Sample Data to make the panel feel alive immediately
const INITIAL_DEMO_BOOKINGS: BanquetBookingLead[] = [
  {
    id: "lead_demo_1",
    refCode: "LL-8421",
    name: "Gurpreet Singh Bajwa",
    phone: "+91 98142 55901",
    eventType: "Marriage / Wedding Reception",
    eventDate: "2026-11-18",
    guestCount: "250–350 Guests",
    cateringType: "Pure Veg & Non-Veg Royal Buffet",
    roomsNeeded: "Yes, 4 AC Rooms Required",
    notes: "Requires brass handi live tandoor and dedicated bridal makeup changing room.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: "new",
  },
  {
    id: "lead_demo_2",
    refCode: "LL-6310",
    name: "Dr. Amanpreet Kaur",
    phone: "+91 98881 22340",
    eventType: "Ring Ceremony / Engagement",
    eventDate: "2026-10-24",
    guestCount: "100–150 Guests",
    cateringType: "Pure Vegetarian Feast + Live Chaat",
    roomsNeeded: "2 AC Rooms Required",
    notes: "Evening reception with floral backdrop lighting and DJ stage setup.",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: "in_discussion",
  },
  {
    id: "lead_demo_3",
    refCode: "LL-5192",
    name: "Harinder Pal Sharma",
    phone: "+91 97790 88123",
    eventType: "1st Birthday & Family Reunion",
    eventDate: "2026-10-05",
    guestCount: "80–100 Guests",
    cateringType: "Custom Non-Veg & Veg Buffet",
    roomsNeeded: "Not required",
    notes:
      "Confirmed booking. Advance token received. Wants Punjabi butter chicken & rabri jalebi.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: "confirmed",
  },
];

const INITIAL_DEMO_EVENTS: ActivityEvent[] = [
  {
    id: "evt_demo_1",
    type: "banquet_booking",
    title: "New Banquet Hall Booking Received",
    description: "Gurpreet Singh Bajwa submitted inquiry for Wedding Reception (250–350 Guests).",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    metadata: {
      bookingId: "lead_demo_1",
      device: "Apple iPhone",
      browser: "Apple Safari",
    },
  },
  {
    id: "evt_demo_2",
    type: "call_click",
    title: "Customer Placed Call Order",
    description: "Tapped 'Call Order' on Punjabi Butter Chicken (Murgh Makhani) ₹280.",
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    metadata: {
      dishName: "Punjabi Butter Chicken (Murgh Makhani)",
      dishPrice: 280,
      dishCategory: "Chicken Gravies",
      phoneClicked: "+919915716739",
      device: "Android Smartphone",
      browser: "Google Chrome",
    },
  },
  {
    id: "evt_demo_3",
    type: "whatsapp_click",
    title: "WhatsApp Button Tapped",
    description: "Customer clicked Floating WhatsApp Help button to chat with restaurant.",
    timestamp: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
    metadata: {
      whatsappSource: "Floating WhatsApp Widget",
      device: "Android Smartphone",
      browser: "Google Chrome",
    },
  },
  {
    id: "evt_demo_4",
    type: "call_click",
    title: "Customer Placed Call Order",
    description: "Tapped 'Call Order' on Classic Tandoori Murgh ₹230.",
    timestamp: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    metadata: {
      dishName: "Classic Tandoori Murgh",
      dishPrice: 230,
      dishCategory: "Tandoori & Kebabs",
      phoneClicked: "+919915716739",
      device: "Windows PC",
      browser: "Google Chrome",
    },
  },
  {
    id: "evt_demo_5",
    type: "page_visit",
    title: "Customer Visited Website",
    description: "New visitor arrived on homepage from Chandigarh highway search.",
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    metadata: {
      device: "Apple iPhone",
      browser: "Apple Safari",
      section: "Full Authentic Menu",
    },
  },
];

// BroadcastChannel instance for real-time cross-tab communication
let broadcastChannel: BroadcastChannel | null = null;
function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!broadcastChannel && "BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    } catch {
      broadcastChannel = null;
    }
  }
  return broadcastChannel;
}

// -------------------------------------------------------------
// Activity Tracker Store & API
// -------------------------------------------------------------
export const activityTracker = {
  // Get all recorded events
  getEvents(): ActivityEvent[] {
    if (typeof window === "undefined") return INITIAL_DEMO_EVENTS;
    try {
      const stored = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_DEMO_EVENTS));
        return INITIAL_DEMO_EVENTS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_EVENTS;
    }
  },

  // Get all banquet booking leads
  getBookings(): BanquetBookingLead[] {
    if (typeof window === "undefined") return INITIAL_DEMO_BOOKINGS;
    try {
      const stored = localStorage.getItem(STORAGE_BOOKINGS_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
        return INITIAL_DEMO_BOOKINGS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEMO_BOOKINGS;
    }
  },

  // Record a new activity event and broadcast immediately
  recordEvent(event: Omit<ActivityEvent, "id" | "timestamp">): ActivityEvent {
    const { device, browser } = getClientEnvironment();
    const newEvent: ActivityEvent = {
      ...event,
      id: "evt_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      metadata: {
        device,
        browser,
        ...event.metadata,
      },
    };

    if (typeof window !== "undefined") {
      try {
        const events = activityTracker.getEvents();
        const updated = [newEvent, ...events].slice(0, 300); // retain last 300
        localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(updated));

        // Update visitor session total actions
        activityTracker.updateSessionAction();

        // Broadcast to admin tabs
        const channel = getBroadcastChannel();
        if (channel) {
          channel.postMessage({ type: "NEW_ACTIVITY_EVENT", event: newEvent });
        }
      } catch (err) {
        console.error("Failed to record event in localStorage", err);
      }
    }

    return newEvent;
  },

  // Record a customer page visit
  trackPageVisit(section = "Homepage"): void {
    const { device, browser, deviceType } = getClientEnvironment();
    const sid = getSessionId();

    // Prevent spamming visit log if already visited this section in last 2 mins
    const lastTrackedKey = `ll_last_visit_${section}`;
    const lastTracked = sessionStorage.getItem(lastTrackedKey);
    const now = Date.now();
    if (lastTracked && now - parseInt(lastTracked, 10) < 120000) {
      return;
    }
    sessionStorage.setItem(lastTrackedKey, now.toString());

    activityTracker.recordEvent({
      type: "page_visit",
      title: "Visitor Browsing",
      description: `Customer viewed ${section} on ${device}.`,
      metadata: {
        section,
        path: window.location.pathname + window.location.hash,
        device,
        browser,
      },
    });

    // Update visitors store
    try {
      const visitorsStr = localStorage.getItem(STORAGE_VISITORS_KEY);
      const visitors: VisitorSession[] = visitorsStr ? JSON.parse(visitorsStr) : [];
      const existingIdx = visitors.findIndex((v) => v.sessionId === sid);
      const existingVisitor = existingIdx >= 0 ? visitors[existingIdx] : undefined;

      if (existingVisitor) {
        existingVisitor.lastActive = new Date().toISOString();
        if (!existingVisitor.sectionsViewed.includes(section)) {
          existingVisitor.sectionsViewed.push(section);
        }
        existingVisitor.totalActions += 1;
      } else {
        visitors.unshift({
          sessionId: sid,
          firstSeen: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          deviceType,
          browser: `${device} (${browser})`,
          sectionsViewed: [section],
          totalActions: 1,
        });
      }
      localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify(visitors.slice(0, 100)));
    } catch {
      // ignore
    }
  },

  // Record a new banquet booking submission
  trackBanquetBooking(
    bookingData: Omit<BanquetBookingLead, "id" | "createdAt" | "status">,
  ): BanquetBookingLead {
    const newBooking: BanquetBookingLead = {
      ...bookingData,
      id: "lead_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      status: "new",
    };

    if (typeof window !== "undefined") {
      try {
        const bookings = activityTracker.getBookings();
        const updated = [newBooking, ...bookings];
        localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));

        // Also log as high-priority event
        activityTracker.recordEvent({
          type: "banquet_booking",
          title: `New Banquet Booking: ${newBooking.name}`,
          description: `${newBooking.name} (${newBooking.phone}) requested ${newBooking.eventType} on ${newBooking.eventDate || "Date TBD"} for ${newBooking.guestCount}.`,
          metadata: {
            bookingId: newBooking.id,
            phoneClicked: newBooking.phone,
          },
        });

        // Broadcast to admin tabs
        const channel = getBroadcastChannel();
        if (channel) {
          channel.postMessage({ type: "NEW_BANQUET_BOOKING", booking: newBooking });
        }
      } catch (err) {
        console.error("Failed to record booking", err);
      }
    }

    return newBooking;
  },

  // Record a Phone Call tap (from menu dish cards or header)
  trackCallClick(details: {
    dishName?: string;
    dishPrice?: number;
    dishCategory?: string;
    source?: string;
  }): void {
    const description = details.dishName
      ? `Tapped 'Call Order' for ${details.dishName}${details.dishPrice ? ` (₹${details.dishPrice})` : ""}.`
      : `Customer clicked Call Now button from ${details.source || "Header Navigation"}.`;

    activityTracker.recordEvent({
      type: "call_click",
      title: details.dishName ? `Call Order: ${details.dishName}` : "Phone Call Placed",
      description,
      metadata: {
        dishName: details.dishName,
        dishPrice: details.dishPrice,
        dishCategory: details.dishCategory,
        phoneClicked: "+919915716739",
      },
    });
  },

  // Record a WhatsApp button tap
  trackWhatsAppClick(source = "Floating Button", contextMessage?: string): void {
    activityTracker.recordEvent({
      type: "whatsapp_click",
      title: "WhatsApp Button Tapped",
      description: `Customer initiated WhatsApp chat via ${source}.${contextMessage ? ` (${contextMessage})` : ""}`,
      metadata: {
        whatsappSource: source,
      },
    });
  },

  // Update status of a booking lead
  updateBookingStatus(bookingId: string, status: BookingStatus, notes?: string): void {
    if (typeof window === "undefined") return;
    try {
      const bookings = activityTracker.getBookings();
      const updated = bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status,
              ...(notes ? { notes: (b.notes ? b.notes + "\n" : "") + notes } : {}),
              lastFollowUp: new Date().toISOString(),
            }
          : b,
      );
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));

      const channel = getBroadcastChannel();
      if (channel) {
        channel.postMessage({ type: "BOOKING_UPDATED", bookingId, status });
      }
    } catch {
      // ignore
    }
  },

  // Delete a booking lead
  deleteBooking(bookingId: string): void {
    if (typeof window === "undefined") return;
    try {
      const bookings = activityTracker.getBookings();
      const updated = bookings.filter((b) => b.id !== bookingId);
      localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(updated));

      const channel = getBroadcastChannel();
      if (channel) {
        channel.postMessage({ type: "BOOKINGS_REFRESHED" });
      }
    } catch {
      // ignore
    }
  },

  // Get visitor sessions
  getVisitors(): VisitorSession[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_VISITORS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Update session total actions
  updateSessionAction(): void {
    if (typeof window === "undefined") return;
    const sid = getSessionId();
    try {
      const visitorsStr = localStorage.getItem(STORAGE_VISITORS_KEY);
      if (!visitorsStr) return;
      const visitors: VisitorSession[] = JSON.parse(visitorsStr);
      const match = visitors.find((v) => v.sessionId === sid);
      if (match) {
        match.totalActions += 1;
        match.lastActive = new Date().toISOString();
        localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify(visitors));
      }
    } catch {
      // ignore
    }
  },

  // Completely wipe all enquiries, bookings, calls, whatsapp taps, and visitor activity
  clearAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify([]));
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify([]));
    localStorage.setItem(STORAGE_VISITORS_KEY, JSON.stringify([]));

    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: "ALL_DATA_CLEARED" });
    }
  },

  // Clear banquet booking inquiries only
  clearBanquetBookings(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify([]));

    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: "BOOKINGS_REFRESHED" });
    }
  },

  // Clear all events & restore fresh demo data
  resetAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_DEMO_EVENTS));
    localStorage.setItem(STORAGE_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS));
    localStorage.removeItem(STORAGE_VISITORS_KEY);

    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ type: "ALL_DATA_RESET" });
    }
  },

  // Export data as JSON
  exportData(): string {
    return JSON.stringify(
      {
        restaurant: "Laung Laachi Brahmpur",
        exportedAt: new Date().toISOString(),
        bookings: activityTracker.getBookings(),
        events: activityTracker.getEvents(),
        visitors: activityTracker.getVisitors(),
      },
      null,
      2,
    );
  },

  // Subscribe to real-time events across browser tabs
  subscribe(callback: (msg: { type: string; [key: string]: unknown }) => void): () => void {
    const channel = getBroadcastChannel();
    if (!channel) return () => {};

    const handler = (e: MessageEvent) => {
      if (e.data) {
        callback(e.data);
      }
    };

    channel.addEventListener("message", handler);

    return () => {
      channel.removeEventListener("message", handler);
    };
  },

  // Audio chime settings
  isChimeEnabled(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_CHIME_PREF_KEY) !== "false";
  },

  setChimeEnabled(enabled: boolean): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_CHIME_PREF_KEY, enabled ? "true" : "false");
  },
};
