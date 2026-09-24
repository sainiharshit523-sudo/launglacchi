// Secure Admin Authentication & Session Management for Laung Laachi
// Uses Salted SHA-256 Cryptographic Verification & Brute-Force Protection
// Passwords are never stored or exposed in plaintext.

const STORAGE_AUTH_CREDS_KEY = "laung_laachi_admin_creds_v2";
const STORAGE_AUTH_SESSION_KEY = "laung_laachi_admin_session_v2";
const STORAGE_RATE_LIMIT_KEY = "laung_laachi_admin_ratelimit_v1";

// Salt and Initial Cryptographic Hash (SHA-256)
const PASSWORD_SALT = "laung_salt_v2_";
const DEFAULT_ADMIN_USER = "launglaachi_admin";
// Precomputed SHA-256 hash of (PASSWORD_SALT + initial private password)
const INITIAL_PASSWORD_HASH = "94b9ad48b0a64cb29d69b7dc2045d21aab4c1e761f91feac64f96008420e0c11";

// Dedicated Private Secret URL path for Management Operations
export const ADMIN_PORTAL_PATH = "/launglaachi-portal";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface AdminCredentials {
  username: string;
  passwordHash: string; // Salted SHA-256 hex string
  lastUpdated: string;
}

interface AdminSession {
  token: string;
  username: string;
  loginTime: number;
  expiresAt: number;
}

interface RateLimitState {
  attempts: number;
  lockedUntil: number;
}

// Compute Salted SHA-256 hash
export async function computePasswordHash(password: string): Promise<string> {
  const salted = PASSWORD_SALT + password;
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(salted);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Safe synchronous fallback if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "fb_" + Math.abs(hash).toString(16);
}

// Generate cryptographically secure random session token
function generateSecureToken(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "ll_sec_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Clean up any legacy insecure keys
function cleanLegacyKeys(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("laung_laachi_admin_creds_v1");
    sessionStorage.removeItem("laung_laachi_admin_session_v1");
    localStorage.removeItem("laung_laachi_admin_session_v1");
  } catch {
    // Ignore storage errors
  }
}

// Rate limit helper
function checkRateLimit(): { isLocked: boolean; minutesRemaining: number } {
  if (typeof window === "undefined") return { isLocked: false, minutesRemaining: 0 };
  try {
    const raw =
      sessionStorage.getItem(STORAGE_RATE_LIMIT_KEY) ||
      localStorage.getItem(STORAGE_RATE_LIMIT_KEY);
    if (!raw) return { isLocked: false, minutesRemaining: 0 };
    const state: RateLimitState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockedUntil > now) {
      const minutes = Math.ceil((state.lockedUntil - now) / 60000);
      return { isLocked: true, minutesRemaining: minutes };
    }
  } catch {
    // Ignore parsing issues
  }
  return { isLocked: false, minutesRemaining: 0 };
}

function recordFailedAttempt(): void {
  if (typeof window === "undefined") return;
  try {
    const raw =
      sessionStorage.getItem(STORAGE_RATE_LIMIT_KEY) ||
      localStorage.getItem(STORAGE_RATE_LIMIT_KEY);
    const state: RateLimitState = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    state.attempts = (state.attempts || 0) + 1;
    if (state.attempts >= MAX_FAILED_ATTEMPTS) {
      state.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }
    const val = JSON.stringify(state);
    sessionStorage.setItem(STORAGE_RATE_LIMIT_KEY, val);
    localStorage.setItem(STORAGE_RATE_LIMIT_KEY, val);
  } catch {
    // Ignore storage errors
  }
}

function clearRateLimit(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_RATE_LIMIT_KEY);
    localStorage.removeItem(STORAGE_RATE_LIMIT_KEY);
  } catch {
    // Ignore storage errors
  }
}

const AUTH_CHANNEL_NAME = "laung_laachi_admin_auth_sync_v1";

type AuthListener = (isAuthenticated: boolean) => void;
const authListeners: Set<AuthListener> = new Set();

function notifyAuthListeners(isAuth: boolean): void {
  authListeners.forEach((listener) => {
    try {
      listener(isAuth);
    } catch (err) {
      console.error("Auth listener error:", err);
    }
  });
}

function broadcastAuthChange(type: "LOGIN" | "LOGOUT"): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel(AUTH_CHANNEL_NAME);
      bc.postMessage({ type, timestamp: Date.now() });
      bc.close();
    }
  } catch {
    // Ignore broadcast errors
  }
}

// Global broadcast listener for other tabs
if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
  try {
    const rxChannel = new BroadcastChannel(AUTH_CHANNEL_NAME);
    rxChannel.onmessage = (msg) => {
      if (msg.data?.type === "LOGIN") {
        notifyAuthListeners(true);
      } else if (msg.data?.type === "LOGOUT") {
        notifyAuthListeners(false);
      }
    };
  } catch {
    // Ignore channel binding error
  }
}

export const adminAuth = {
  // Subscribe to auth state changes across this window and other tabs
  subscribe(listener: AuthListener): () => void {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  },

  // Get active credentials hash
  getCredentials(): AdminCredentials {
    cleanLegacyKeys();
    if (typeof window === "undefined") {
      return {
        username: DEFAULT_ADMIN_USER,
        passwordHash: INITIAL_PASSWORD_HASH,
        lastUpdated: new Date().toISOString(),
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_AUTH_CREDS_KEY);
      if (!stored) {
        const initialCreds: AdminCredentials = {
          username: DEFAULT_ADMIN_USER,
          passwordHash: INITIAL_PASSWORD_HASH,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_AUTH_CREDS_KEY, JSON.stringify(initialCreds));
        return initialCreds;
      }

      const parsed: AdminCredentials = JSON.parse(stored);
      if (!parsed.passwordHash) {
        parsed.passwordHash = INITIAL_PASSWORD_HASH;
      }
      return parsed;
    } catch {
      return {
        username: DEFAULT_ADMIN_USER,
        passwordHash: INITIAL_PASSWORD_HASH,
        lastUpdated: new Date().toISOString(),
      };
    }
  },

  // Check if admin is currently authenticated with a valid session
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const sessionStr =
        sessionStorage.getItem(STORAGE_AUTH_SESSION_KEY) ||
        localStorage.getItem(STORAGE_AUTH_SESSION_KEY);

      if (!sessionStr) return false;

      const session: AdminSession = JSON.parse(sessionStr);
      // Valid for 24 hours
      if (Date.now() > session.expiresAt) {
        adminAuth.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Get remaining session minutes
  getSessionRemainingMinutes(): number {
    if (typeof window === "undefined") return 0;
    try {
      const sessionStr =
        sessionStorage.getItem(STORAGE_AUTH_SESSION_KEY) ||
        localStorage.getItem(STORAGE_AUTH_SESSION_KEY);
      if (!sessionStr) return 0;
      const session: AdminSession = JSON.parse(sessionStr);
      const remainingMs = session.expiresAt - Date.now();
      return remainingMs > 0 ? Math.ceil(remainingMs / 60000) : 0;
    } catch {
      return 0;
    }
  },

  // Log in with username & password
  async login(
    usernameInput: string,
    passwordInput: string,
    rememberMe = false,
  ): Promise<{ success: boolean; error?: string }> {
    // 1. Check brute-force lockout
    const rateCheck = checkRateLimit();
    if (rateCheck.isLocked) {
      return {
        success: false,
        error: `Portal is temporarily locked due to multiple failed attempts. Please try again in ${rateCheck.minutesRemaining} minute(s).`,
      };
    }

    const cleanUser = usernameInput.trim().toLowerCase();
    const creds = adminAuth.getCredentials();

    const isUserValid =
      cleanUser === creds.username.toLowerCase() ||
      cleanUser === DEFAULT_ADMIN_USER.toLowerCase() ||
      cleanUser === "admin@launglaachi.com";

    // 2. Hash input password and compare with stored cryptographic hash
    const inputHash = await computePasswordHash(passwordInput);
    const isPassValid = inputHash === creds.passwordHash;

    if (!isUserValid || !isPassValid) {
      recordFailedAttempt();
      const updatedCheck = checkRateLimit();
      if (updatedCheck.isLocked) {
        return {
          success: false,
          error: "Too many failed attempts. Admin portal is locked for 15 minutes for security.",
        };
      }
      return {
        success: false,
        error: "Invalid username or password. Access is restricted to authorized personnel.",
      };
    }

    // 3. Clear rate limit on successful authentication
    clearRateLimit();

    const session: AdminSession = {
      token: generateSecureToken(),
      username: creds.username,
      loginTime: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    };

    if (typeof window !== "undefined") {
      try {
        if (rememberMe) {
          localStorage.setItem(STORAGE_AUTH_SESSION_KEY, JSON.stringify(session));
        } else {
          sessionStorage.setItem(STORAGE_AUTH_SESSION_KEY, JSON.stringify(session));
        }
      } catch {
        // Ignore storage write issues
      }
    }

    notifyAuthListeners(true);
    broadcastAuthChange("LOGIN");

    return { success: true };
  },

  // Log out current session
  logout(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(STORAGE_AUTH_SESSION_KEY);
      localStorage.removeItem(STORAGE_AUTH_SESSION_KEY);
    } catch {
      // Ignore
    }
    notifyAuthListeners(false);
    broadcastAuthChange("LOGOUT");
  },

  // Change password in admin settings
  async changePassword(
    currentPasswordInput: string,
    newPasswordInput: string,
  ): Promise<{ success: boolean; error?: string }> {
    const creds = adminAuth.getCredentials();

    const currentHash = await computePasswordHash(currentPasswordInput);
    if (currentHash !== creds.passwordHash) {
      return { success: false, error: "The current password you entered is incorrect." };
    }

    if (newPasswordInput.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    try {
      const newHash = await computePasswordHash(newPasswordInput);
      const updatedCreds: AdminCredentials = {
        username: creds.username,
        passwordHash: newHash,
        lastUpdated: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_AUTH_CREDS_KEY, JSON.stringify(updatedCreds));
      }
      return { success: true };
    } catch {
      return { success: false, error: "Could not save new password. Please try again." };
    }
  },
};
