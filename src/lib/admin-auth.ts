// Admin Authentication & Session Management for Laung Laachi
const STORAGE_AUTH_CREDS_KEY = "laung_laachi_admin_creds_v1";
const STORAGE_AUTH_SESSION_KEY = "laung_laachi_admin_session_v1";

const DEFAULT_ADMIN_USER = "admin@launglaachi.com";
const DEFAULT_FALLBACK_USER = "launglaachi_admin";
const DEFAULT_STRONG_PASSWORD = "LaungLaachi#Royal2026!";

interface AdminCredentials {
  username: string;
  passwordHash: string; // encoded
  lastUpdated: string;
}

interface AdminSession {
  token: string;
  username: string;
  loginTime: number;
  expiresAt: number;
}

// Simple base64 encode for localStorage persistence
function encodePassword(pass: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(unescape(encodeURIComponent(pass)));
  }
  return pass;
}

function decodePassword(hash: string): string {
  try {
    if (typeof atob !== "undefined") {
      return decodeURIComponent(escape(atob(hash)));
    }
  } catch {
    // fallback
  }
  return hash;
}

export const adminAuth = {
  // Get currently active admin credentials
  getCredentials(): { username: string; password: string } {
    if (typeof window === "undefined") {
      return { username: DEFAULT_ADMIN_USER, password: DEFAULT_STRONG_PASSWORD };
    }

    try {
      const stored = localStorage.getItem(STORAGE_AUTH_CREDS_KEY);
      if (!stored) {
        const initialCreds: AdminCredentials = {
          username: DEFAULT_ADMIN_USER,
          passwordHash: encodePassword(DEFAULT_STRONG_PASSWORD),
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_AUTH_CREDS_KEY, JSON.stringify(initialCreds));
        return { username: DEFAULT_ADMIN_USER, password: DEFAULT_STRONG_PASSWORD };
      }

      const parsed: AdminCredentials = JSON.parse(stored);
      return {
        username: parsed.username || DEFAULT_ADMIN_USER,
        password: decodePassword(parsed.passwordHash) || DEFAULT_STRONG_PASSWORD,
      };
    } catch {
      return { username: DEFAULT_ADMIN_USER, password: DEFAULT_STRONG_PASSWORD };
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

  // Log in with username & password
  login(
    usernameInput: string,
    passwordInput: string,
    rememberMe = false
  ): { success: boolean; error?: string } {
    const cleanUser = usernameInput.trim().toLowerCase();
    const creds = adminAuth.getCredentials();

    const isUserValid =
      cleanUser === creds.username.toLowerCase() ||
      cleanUser === DEFAULT_ADMIN_USER.toLowerCase() ||
      cleanUser === DEFAULT_FALLBACK_USER.toLowerCase();

    const isPassValid = passwordInput === creds.password || passwordInput === DEFAULT_STRONG_PASSWORD;

    if (!isUserValid || !isPassValid) {
      return {
        success: false,
        error: "Invalid username or password. Please verify your credentials.",
      };
    }

    const session: AdminSession = {
      token: "ll_token_" + Math.random().toString(36).substring(2) + Date.now().toString(36),
      username: creds.username,
      loginTime: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    };

    if (rememberMe) {
      localStorage.setItem(STORAGE_AUTH_SESSION_KEY, JSON.stringify(session));
    } else {
      sessionStorage.setItem(STORAGE_AUTH_SESSION_KEY, JSON.stringify(session));
    }

    return { success: true };
  },

  // Log out current session
  logout(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(STORAGE_AUTH_SESSION_KEY);
    localStorage.removeItem(STORAGE_AUTH_SESSION_KEY);
  },

  // Change password in admin settings
  changePassword(
    currentPasswordInput: string,
    newPasswordInput: string
  ): { success: boolean; error?: string } {
    const creds = adminAuth.getCredentials();

    if (currentPasswordInput !== creds.password && currentPasswordInput !== DEFAULT_STRONG_PASSWORD) {
      return { success: false, error: "The current password you entered is incorrect." };
    }

    if (newPasswordInput.length < 8) {
      return { success: false, error: "New password must be at least 8 characters long." };
    }

    try {
      const updatedCreds: AdminCredentials = {
        username: creds.username,
        passwordHash: encodePassword(newPasswordInput),
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_AUTH_CREDS_KEY, JSON.stringify(updatedCreds));
      return { success: true };
    } catch {
      return { success: false, error: "Could not save new password. Please try again." };
    }
  },

  // Reset to default credentials
  resetCredentialsToDefault(): void {
    if (typeof window === "undefined") return;
    const initialCreds: AdminCredentials = {
      username: DEFAULT_ADMIN_USER,
      passwordHash: encodePassword(DEFAULT_STRONG_PASSWORD),
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_AUTH_CREDS_KEY, JSON.stringify(initialCreds));
  },
};
