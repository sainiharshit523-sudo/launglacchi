import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  HeartHandshake,
  MessageSquare,
  PartyPopper,
  Phone,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { restaurant, banquetInfo } from "@/data/restaurant";
import { activityTracker } from "@/lib/activity-tracker";

interface BanquetBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEventType?: string;
}

// Generate pre-formatted, professional WhatsApp message for restaurant admin
function buildBookingWhatsAppUrl(booking: {
  refCode: string;
  name: string;
  phone: string;
  eventType: string;
  eventDate: string;
  guestCount: string;
  cateringType: string;
  roomsNeeded: string;
  notes?: string;
}): string {
  const lines = [
    `*🎉 NEW BANQUET & EVENT BOOKING INQUIRY*`,
    `*Laung Laachi Restaurant & Banquet Hall*`,
    ``,
    `📋 *Booking Reference:* ${booking.refCode}`,
    `👤 *Guest Name:* ${booking.name}`,
    `📞 *Customer Phone:* ${booking.phone}`,
    `✨ *Event Type:* ${booking.eventType}`,
    `📅 *Preferred Date:* ${booking.eventDate || "To be discussed"}`,
    `👥 *Expected Guests:* ${booking.guestCount}`,
    `🍲 *Catering:* ${booking.cateringType}`,
    `🛏️ *AC Guest Rooms:* ${booking.roomsNeeded}`,
  ];

  if (booking.notes && booking.notes.trim()) {
    lines.push(`📝 *Special Requests:* ${booking.notes.trim()}`);
  }

  lines.push(
    ``,
    `----------------------------------------`,
    `_Hello Admin, I have submitted this booking inquiry on the Laung Laachi website. Please verify date availability and share banquet package quotation._`
  );

  return `https://wa.me/919915716739?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function BanquetBookingDialog({
  open,
  onOpenChange,
  defaultEventType = "Marriage / Wedding Reception",
}: BanquetBookingDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState(defaultEventType);
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("100–200 Guests");
  const [cateringType, setCateringType] = useState("Pure Veg & Non-Veg Buffet");
  const [roomsNeeded, setRoomsNeeded] = useState("Yes, AC Rooms Required");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [whatsAppUrl, setWhatsAppUrl] = useState("");
  const [countdown, setCountdown] = useState(2);
  const [lastSubmittedData, setLastSubmittedData] = useState<{
    refCode: string;
    name: string;
    phone: string;
    eventType: string;
    eventDate: string;
    guestCount: string;
    cateringType: string;
    roomsNeeded: string;
    notes?: string;
  } | null>(null);

  // Smooth countdown after submission
  useEffect(() => {
    if (!isSubmitted || countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isSubmitted, countdown]);

  const handleWhatsAppInquiry = () => {
    activityTracker.trackWhatsAppClick(
      "Banquet Booking Dialog",
      `Inquiry by ${name || "Guest"} for ${eventType}`
    );

    const waUrl = buildBookingWhatsAppUrl({
      refCode: bookingRef || `LL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name || "Guest",
      phone: phone || "Not specified",
      eventType,
      eventDate: eventDate || "To be discussed",
      guestCount,
      cateringType,
      roomsNeeded,
      notes: notes || undefined,
    });
    window.open(waUrl, "_blank");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      return;
    }
    const refCode = `LL-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(refCode);

    const bookingPayload = {
      refCode,
      name: name.trim(),
      phone: phone.trim(),
      eventType,
      eventDate: eventDate || "Date TBD",
      guestCount,
      cateringType,
      roomsNeeded,
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    // 1. Record in real-time activity tracker (triggers audio chime and real-time lead alert in admin portal)
    activityTracker.trackBanquetBooking(bookingPayload);

    // 2. Track WhatsApp auto-redirect event in activity logs
    activityTracker.trackWhatsAppClick(
      "Banquet Booking Auto-Redirect",
      `Auto-redirected to WhatsApp for booking #${refCode} (${name.trim()} - ${eventType})`
    );

    // 3. Build WhatsApp URL
    const waUrl = buildBookingWhatsAppUrl(bookingPayload);
    setWhatsAppUrl(waUrl);
    setLastSubmittedData(bookingPayload);
    setIsSubmitted(true);
    setCountdown(2);

    // 4. Automatically redirect customer to WhatsApp
    try {
      const isMobile =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      if (isMobile) {
        window.location.href = waUrl;
      } else {
        window.open(waUrl, "_blank");
      }
    } catch {
      // Fallback: User can click the prominent WhatsApp button
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName("");
    setPhone("");
    setNotes("");
    setLastSubmittedData(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-secondary/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-secondary-foreground w-fit">
            <Sparkles className="size-3.5 text-secondary" />
            Laung Laachi A.C Rooms & Banquet Hall
          </div>
          <DialogTitle className="mt-2 font-display text-2xl sm:text-3xl font-bold text-foreground">
            Book for Marriages, Parties & Celebrations
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            Plan your special day with our air-conditioned banquet hall, custom Punjabi catering, live tandoor, and comfortable guest rooms in Brahmpur.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="my-4 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/15 via-card to-card p-6 sm:p-8 text-center shadow-lg">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="size-9" />
            </div>

            <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-foreground">
              Booking Inquiry Submitted!
            </h3>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-800 dark:text-emerald-300">
              <span>Reference Code:</span>
              <span className="font-mono">{bookingRef}</span>
            </div>

            {/* WhatsApp Auto-Redirect Banner */}
            <div className="mt-5 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-4 text-xs text-foreground flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 font-bold text-[#1da851] dark:text-[#25D366]">
                <MessageSquare className="size-4 shrink-0" />
                <span>
                  {countdown > 0
                    ? `Connecting you to WhatsApp in ${countdown}s...`
                    : "Connecting to WhatsApp with your booking details..."}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground max-w-md">
                Your booking details have been prepared for the restaurant admin. Tap below to send the message directly to our manager on WhatsApp.
              </p>
            </div>

            {/* Big Green Primary WhatsApp CTA */}
            <div className="mt-5 space-y-3">
              <Button
                asChild
                className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm shadow-md shadow-[#25D366]/25 rounded-2xl"
              >
                <a
                  href={whatsAppUrl || restaurant.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    activityTracker.trackWhatsAppClick(
                      "Booking Confirmation WhatsApp Button",
                      `Customer tapped manual WhatsApp link for #${bookingRef}`
                    );
                  }}
                >
                  <MessageSquare className="mr-2 size-5" />
                  <span>Send Booking to Admin on WhatsApp</span>
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>

              {/* Booking Summary Box */}
              {lastSubmittedData && (
                <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 text-xs text-left grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Guest Name</span>
                    <span className="font-semibold text-foreground">{lastSubmittedData.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Event Type</span>
                    <span className="font-semibold text-foreground">{lastSubmittedData.eventType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Preferred Date</span>
                    <span className="font-semibold text-foreground">{lastSubmittedData.eventDate || "Date TBD"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Guests</span>
                    <span className="font-semibold text-foreground">{lastSubmittedData.guestCount}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <Button asChild variant="outline" className="w-full sm:flex-1 h-10 text-xs font-bold border-border">
                  <a href={restaurant.phoneHref}>
                    <Phone className="mr-2 size-3.5 text-primary" />
                    <span>Direct Call: {restaurant.phoneDisplay}</span>
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  className="w-full sm:w-auto h-10 text-xs text-muted-foreground hover:text-foreground font-semibold"
                >
                  Done & Close
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Event Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  "Marriage / Wedding",
                  "Ring Ceremony / Roka",
                  "Birthday Party",
                  "Anniversary",
                  "Kitty Party",
                  "Tour Group Halt",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setEventType(item)}
                    className={`rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${eventType === item
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card hover:border-border/80 hover:bg-muted/50 text-foreground"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="guest-name" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Your Full Name *
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="guest-phone" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Contact / WhatsApp Number *
                </label>
                <input
                  id="guest-phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Date & Guest Count */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="event-date" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Preferred Event Date
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="event-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guest-count" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Expected Guest Count
                </label>
                <select
                  id="guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="50–100 Guests">50–100 Guests</option>
                  <option value="100–150 Guests">100–150 Guests</option>
                  <option value="150–200 Guests">150–200 Guests</option>
                  <option value="200–300 Guests">200–300 Guests</option>
                  <option value="300+ Guests">300+ Guests (Full Hall)</option>
                </select>
              </div>
            </div>

            {/* Catering & AC Rooms */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="catering-type" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Food & Catering Preference
                </label>
                <select
                  id="catering-type"
                  value={cateringType}
                  onChange={(e) => setCateringType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Pure Veg Royal Buffet">Pure Veg Royal Punjabi Buffet</option>
                  <option value="Pure Veg & Non-Veg Buffet">Veg & Non-Veg Mixed Feast</option>
                  <option value="Custom Tandoori Live Counters">Live Tandoori & Snack Counters</option>
                  <option value="High Tea & Snacks Buffet">High Tea & Snacks Only</option>
                </select>
              </div>

              <div>
                <label htmlFor="rooms-needed" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Need AC Rooms for Guests?
                </label>
                <select
                  id="rooms-needed"
                  value={roomsNeeded}
                  onChange={(e) => setRoomsNeeded(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Yes, AC Rooms Required">Yes, AC Rooms Required</option>
                  <option value="No, Hall Only">No, Hall Only</option>
                  <option value="Not Sure / Will Decide Later">Not Sure / Will Decide Later</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="special-notes" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Special Requests or Decoration Ideas (Optional)
              </label>
              <textarea
                id="special-notes"
                rows={2}
                placeholder="e.g. Stage floral theme, DJ / Sound setup, timing preferences..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Banquet Perks Pill Banner */}
            <div className="rounded-xl border border-gold/30 bg-secondary/15 p-3 text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-gold shrink-0" />
              <span>Includes stage setup, air-conditioned hall, backup generators & private parking.</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <Button
                type="submit"
                className="w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm shadow-md shadow-[#25D366]/20 rounded-xl"
              >
                <MessageSquare className="mr-2 size-5" />
                <span>Submit Booking & Redirect to WhatsApp</span>
              </Button>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                  Saved directly to admin dashboard
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="size-3 text-[#25D366]" />
                  Auto-opens WhatsApp
                </span>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
