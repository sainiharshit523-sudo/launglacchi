import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  HeartHandshake,
  MessageCircle,
  PartyPopper,
  Phone,
  Search,
  Sparkles,
  Trash2,
  Users,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  type BanquetBookingLead,
  type BookingStatus,
  activityTracker,
} from "@/lib/activity-tracker";

interface AdminBanquetBookingsProps {
  bookings: BanquetBookingLead[];
  onRefresh: () => void;
  onClearAll?: () => void;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  new: {
    label: "New Lead",
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-500/15",
    border: "border-red-500/40",
  },
  in_discussion: {
    label: "In Discussion",
    color: "text-amber-800 dark:text-amber-300",
    bg: "bg-amber-500/15",
    border: "border-amber-500/40",
  },
  confirmed: {
    label: "Confirmed Booking",
    color: "text-emerald-800 dark:text-emerald-300",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/40",
  },
  completed: {
    label: "Event Completed",
    color: "text-blue-800 dark:text-blue-300",
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
  },
  cancelled: {
    label: "Cancelled / Declined",
    color: "text-stone-700 dark:text-stone-300",
    bg: "bg-stone-500/15",
    border: "border-stone-500/40",
  },
};

export function AdminBanquetBookings({
  bookings,
  onRefresh,
  onClearAll,
}: AdminBanquetBookingsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm) ||
      b.refCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    activityTracker.updateBookingStatus(bookingId, newStatus);
    onRefresh();
  };

  const handleDelete = (bookingId: string, name: string) => {
    if (confirm(`Are you sure you want to remove the booking inquiry for "${name}"?`)) {
      activityTracker.deleteBooking(bookingId);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-pop-in">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
            <PartyPopper className="size-6 text-amber-500" />
            <span>Banquet Bookings & Marriage Hall Inquiries</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Total {bookings.length} customer inquiries received for marriage receptions, ring ceremonies, and family gatherings.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs h-10 rounded-xl"
            />
          </div>

          {onClearAll && bookings.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClearAll}
              className="h-10 text-xs font-bold border-red-500/30 text-red-600 hover:bg-red-500/10 shrink-0"
              title="Clear all banquet booking inquiries"
            >
              <Trash2 className="size-3.5 sm:mr-1.5 text-red-500" />
              <span className="hidden sm:inline">Clear Inquiries</span>
            </Button>
          )}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
        {[
          { id: "all", label: "All Leads", count: bookings.length },
          { id: "new", label: "New Leads", count: bookings.filter((b) => b.status === "new").length },
          { id: "in_discussion", label: "In Discussion", count: bookings.filter((b) => b.status === "in_discussion").length },
          { id: "confirmed", label: "Confirmed", count: bookings.filter((b) => b.status === "confirmed").length },
          { id: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length },
          { id: "cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/70 text-foreground hover:bg-muted"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                statusFilter === tab.id ? "bg-black/20 text-white" : "bg-card text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List Cards */}
      {filtered.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((booking) => {
            const statusInfo = statusConfig[booking.status] || statusConfig.new;
            const submittedDate = new Date(booking.createdAt).toLocaleDateString([], {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={booking.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border ${
                  booking.status === "new"
                    ? "border-amber-500/50 bg-amber-500/[0.04] dark:bg-amber-950/20 shadow-md shadow-amber-500/5"
                    : "border-border/80 bg-card hover:border-gold/40 shadow-sm"
                } p-6 transition-all`}
              >
                {/* Top status bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      {booking.refCode}
                    </span>
                    <Badge className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} text-[10px] font-black uppercase tracking-wider`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    <span>Received: {submittedDate}</span>
                  </span>
                </div>

                {/* Customer Details */}
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-foreground">{booking.name}</h3>
                    <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
                      <Phone className="size-3.5" />
                      <span>{booking.phone}</span>
                    </p>
                  </div>

                  {/* Event Specifics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 rounded-2xl bg-muted/40 p-3.5 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Event Type</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.eventType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Event Date</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.eventDate || "To be confirmed"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Expected Guests</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.guestCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Guest Rooms</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.roomsNeeded}</p>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-border/40">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Catering Preference</p>
                      <p className="font-bold text-foreground mt-0.5">{booking.cateringType}</p>
                    </div>
                  </div>

                  {/* Customer Special Notes */}
                  {booking.notes && (
                    <div className="rounded-xl border border-border/60 bg-background/50 p-3 text-xs text-muted-foreground">
                      <p className="font-bold text-foreground text-[10px] uppercase">Special Requests / Notes:</p>
                      <p className="mt-1 leading-relaxed">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar: Status Updater & Contact Buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                  {/* Status Dropdown / Quick Update */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground">Status:</span>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                      className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="new">New Lead</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="confirmed">Confirmed Booking</option>
                      <option value="completed">Event Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white text-xs font-bold"
                    >
                      <a
                        href={`https://wa.me/${booking.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${booking.name}! Thank you for inquiring about Laung Laachi Banquet Hall & AC Rooms (Ref: ${booking.refCode}). We would be delighted to host your ${booking.eventType}. When is a good time to discuss the menu and package pricing?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="size-3.5 mr-1" />
                        WhatsApp
                      </a>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold"
                    >
                      <a href={`tel:${booking.phone}`}>
                        <Phone className="size-3.5 mr-1" />
                        Call
                      </a>
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(booking.id, booking.name)}
                      className="size-8 text-muted-foreground hover:text-red-600"
                      title="Delete booking lead"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card">
          <PartyPopper className="mx-auto size-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">No banquet inquiries found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {searchTerm
              ? "No booking records match your search filter."
              : "Customer banquet submissions will automatically appear here in real time."}
          </p>
        </div>
      )}
    </div>
  );
}
