import { useState, useMemo } from "react";
import {
  ArrowRight,
  BedDouble,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  ExternalLink,
  HelpCircle,
  MessageCircle,
  PartyPopper,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurant } from "@/data/restaurant";

export interface FaqItem {
  id: string;
  category: "banquet" | "food" | "travel" | "general";
  categoryLabel: string;
  question: string;
  answer: string;
  highlights: string[];
  popular?: boolean;
  actionType?: "banquet" | "menu" | "directions" | "call";
  actionLabel?: string;
}

export const faqData: FaqItem[] = [
  {
    id: "banquet-capacity",
    category: "banquet",
    categoryLabel: "Banquet & Celebrations",
    popular: true,
    question: "What is the capacity of the AC Banquet Hall, and what events can be hosted?",
    answer:
      "Our Grand AC Banquet Hall comfortably accommodates gatherings from 50 up to 300+ guests. We host Marriages, Ring Ceremonies, Sagan, Mehndi/Sangeet nights, Birthday celebrations, Silver Jubilees, Kitties, and Corporate gatherings. We provide full stage setup, floral theme decor, professional sound system, and live tandoori buffet catering.",
    highlights: [
      "50 to 300+ Guest Capacity",
      "Full Floral Stage & Theme Decoration",
      "Live Punjabi Tandoori Buffets",
      "Separate Bride/Groom AC Dressing Rooms",
    ],
    actionType: "banquet",
    actionLabel: "Check Banquet Hall Dates ↗",
  },
  {
    id: "separate-kitchens",
    category: "food",
    categoryLabel: "Food & Kitchens",
    popular: true,
    question: "Are Pure Vegetarian and Non-Vegetarian dishes prepared separately?",
    answer:
      "Yes, 100% strictly! We maintain dedicated cooking sections, separate cookware, utensils, and separate tandoors for our Pure Vegetarian and Non-Vegetarian menus. Families and pilgrim travelers who observe pure vegetarian diets can dine with total confidence and peace of mind.",
    highlights: [
      "Strictly Separate Cooking Sections & Utensils",
      "Dedicated Veg & Non-Veg Tandoors",
      "Farm-Fresh Paneer & Pure Desi Ghee options",
      "Authentic Punjabi Highway Recipes",
    ],
    actionType: "menu",
    actionLabel: "Browse Full Menu & Prices ↓",
  },
  {
    id: "parking-coaches",
    category: "travel",
    categoryLabel: "Highway, Rooms & Parking",
    popular: true,
    question: "Is there safe parking available for family cars, buses, and tourist coaches?",
    answer:
      "Yes! Located directly along the wide Nangal–Chandigarh Highway in Brahmpur, we have expansive open roadside and dedicated premises parking. There is ample, secure space for tourist coaches, buses, and family SUVs with smooth, 24/7 drive-in and drive-out access.",
    highlights: [
      "Ample Space for Tourist Coaches & Buses",
      "Direct Highway Drive-in & Drive-out Access",
      "Secure, Well-Lit Open Grounds",
      "Free Parking for All Guests",
    ],
    actionType: "directions",
    actionLabel: "Get Highway Directions ↗",
  },
  {
    id: "ac-guest-rooms",
    category: "travel",
    categoryLabel: "Highway, Rooms & Parking",
    question: "Do you have AC rooms for outstation wedding guests or overnight road travelers?",
    answer:
      "Yes! We offer comfortable, fully air-conditioned guest rooms right inside the property. They are ideal for wedding families getting ready for functions, outstation relatives needing rest, or tired travelers driving between Chandigarh, Ropar, Anandpur Sahib, and Himachal Pradesh.",
    highlights: [
      "Clean AC Rooms with Attached Bathrooms",
      "Ideal for Outstation Wedding Relatives",
      "Quick Highway Rest Stops & Overnight Stays",
      "24-Hour Room Assistance",
    ],
    actionType: "banquet",
    actionLabel: "Inquire About Rooms & Event Packages ↗",
  },
  {
    id: "timings-breakfast",
    category: "general",
    categoryLabel: "Timings & Services",
    question: "What are your restaurant timings? Do you serve early highway breakfast?",
    answer:
      "We are open every single day from 7:00 AM in the morning to 12:00 Midnight. Early morning breakfast starts sharp at 7:00 AM featuring piping-hot tandoori aloo-pyaaz paranthas, fresh white butter, curd, chhole bhature, and our famous Gurh Wali Chai (fragrant jaggery tea).",
    highlights: [
      "Open All 7 Days: 7:00 AM – 12:00 AM",
      "Early Breakfast Starting at 7:00 AM",
      "Signature Gurh Wali Chai & Hot Paranthas",
      "Late Night Dinner until Midnight",
    ],
    actionType: "menu",
    actionLabel: "View Breakfast & Tea Items ↓",
  },
  {
    id: "catering-customization",
    category: "banquet",
    categoryLabel: "Banquet & Celebrations",
    question: "Can we customize our party menu, stage decoration, and event catering?",
    answer:
      "Absolutely! We tailor multi-course packages to your exact taste and guest size. From welcome mocktails and live chaat/tandoori counters to royal Shahi paneer, butter chicken, dal makhani, and warm gulab jamuns. We also arrange tailored floral stage themes, balloon decor for kids' birthdays, and DJ sound setups.",
    highlights: [
      "Customizable Multi-Course Buffet Packages",
      "Live Snacks & Tandoor Counters",
      "Theme Floral Stage & Lighting Arrangements",
      "Tailored Menus to Suit Every Budget",
    ],
    actionType: "banquet",
    actionLabel: "Plan Your Event Menu ↗",
  },
  {
    id: "highway-takeaway",
    category: "food",
    categoryLabel: "Food & Kitchens",
    question: "Do you offer spill-proof food takeaway for people traveling on the highway?",
    answer:
      "Yes! We specialize in hygienic, heavy-duty highway travel packaging. Whether you are driving up to Naina Devi, Anandpur Sahib, or Manali, we securely pack hot curries, naans, paranthas, and snacks so you can enjoy fresh Punjabi food anytime during your trip.",
    highlights: [
      "Spill-Proof Heat-Retaining Packaging",
      "Quick Highway Takeaway Turnaround",
      "Roadside Snack & Beverage Packs",
      "Freshly Prepared to Order",
    ],
    actionType: "call",
    actionLabel: "Call Ahead for Fast Takeaway ↗",
  },
  {
    id: "payment-methods",
    category: "general",
    categoryLabel: "Timings & Services",
    question: "Which payment options are accepted at Laung Laachi?",
    answer:
      "We accept all major digital and offline payment modes: UPI (Google Pay, PhonePe, Paytm, BHIM), all Debit and Credit Cards (Visa, Mastercard, RuPay), and Cash. Instant digital GST bills and receipts are provided.",
    highlights: [
      "UPI: Google Pay, PhonePe, Paytm",
      "All Major Credit & Debit Cards Accepted",
      "Cash & Net Banking for Event Advances",
      "Instant Invoices & Digital Receipts",
    ],
  },
];

interface FaqSectionProps {
  onOpenBooking?: (eventType?: string) => void;
}

export function FaqSection({ onOpenBooking }: FaqSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<string[]>(["banquet-capacity", "separate-kitchens"]);

  const categories = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "banquet", label: "Banquet & Events", icon: PartyPopper },
    { id: "food", label: "Food & Kitchens", icon: Utensils },
    { id: "travel", label: "Highway, Rooms & Parking", icon: Car },
    { id: "general", label: "Timings & Payments", icon: Clock },
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.highlights.some((h) => h.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleActionClick = (actionType?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (actionType === "banquet" && onOpenBooking) {
      onOpenBooking("General FAQ Inquiry");
    } else if (actionType === "menu") {
      const el = document.getElementById("menu");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (actionType === "directions") {
      window.open(restaurant.directionsUrl, "_blank", "noopener,noreferrer");
    } else if (actionType === "call") {
      window.location.href = restaurant.phoneHref;
    }
  };

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-background py-20 sm:py-28"
      aria-label="Frequently Asked Questions about Laung Laachi Restaurant and Banquet Hall"
    >
      {/* Punjabi Geometric Folk Pattern Ambient Backdrop */}
      <div className="punjabi-pattern absolute inset-0 opacity-30 pointer-events-none" />
      <div className="absolute -left-20 top-20 size-80 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-20 size-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Architectural Header with Punjabi Heritage Arch Motif */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gradient-to-r from-amber-500/15 via-gold/20 to-amber-500/15 px-4 py-1 text-xs font-black uppercase tracking-widest text-secondary-foreground shadow-sm">
            <Sparkles className="size-3.5 text-gold" />
            <span>Answers & Guest Guide · Brahmpur, Punjab</span>
          </div>

          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-balance text-foreground">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our AC banquet hall celebrations, separate veg & non-veg kitchens, highway parking, and travel amenities on Nangal–Chandigarh Road.
          </p>
        </div>

        {/* Dual-Column Interactive Layout */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[340px_1fr] items-start">
          {/* Left Column: Concierge Help Hub & Category Filters */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Search Input Box */}
            <div className="relative rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-gold/80 transition-colors">
              <div className="flex items-center gap-2 px-3 py-1">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., banquet, veg, parking)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
                  aria-label="Search FAQ questions"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills (Unique Architectural Card) */}
            <div className="overflow-hidden rounded-3xl border border-gold/40 bg-card/85 p-5 shadow-lg backdrop-blur-md">
              <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-gold" />
                Browse By Topic
              </p>

              <div className="flex flex-col gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  const count =
                    cat.id === "all"
                      ? faqData.length
                      : faqData.filter((f) => f.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all text-left ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md scale-102"
                          : "text-foreground/80 hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`size-4 ${
                            isActive ? "text-secondary" : "text-primary"
                          }`}
                        />
                        <span>{cat.label}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          isActive
                            ? "bg-black/25 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instant Concierge Card (Unique Scalloped Punjabi Corner Shape) */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-gold/50 bg-gradient-to-br from-card via-secondary/15 to-card p-6 shadow-xl">
              <div className="punjabi-pattern absolute inset-0 opacity-20 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <span className="grid size-9 place-items-center rounded-xl bg-gold/25 text-gold">
                    <ShieldCheck className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-extrabold text-foreground">
                      Have a Custom Request?
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Talk directly to our manager
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-foreground/80">
                  Planning a marriage, ring ceremony, bus group lunch, or customized Punjabi catering? We are always happy to help.
                </p>

                <div className="mt-5 space-y-2.5">
                  <Button
                    type="button"
                    onClick={() => {
                      if (onOpenBooking) onOpenBooking("Direct Inquiry from FAQ");
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-foreground font-extrabold shadow hover:opacity-95 text-xs h-10"
                  >
                    <PartyPopper className="mr-2 size-4" />
                    Book Banquet Hall ↗
                  </Button>

                  <a
                    href={restaurant.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-colors h-10"
                  >
                    <MessageCircle className="size-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>

                  <a
                    href={restaurant.phoneHref}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors h-10"
                  >
                    <Phone className="size-4 text-primary" />
                    <span>Call {restaurant.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Unique Sculpted Animated FAQ Cards */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-12 text-center bg-card/50">
                <HelpCircle className="size-10 text-muted-foreground mx-auto" />
                <p className="mt-3 font-display text-lg font-bold text-foreground">
                  No matching questions found
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search keywords or select &quot;All Questions&quot;.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 border-gold text-xs"
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIds.includes(faq.id);

                return (
                  <article
                    key={faq.id}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen
                        ? "rounded-3xl border-2 border-gold/70 bg-gradient-to-br from-card via-card to-secondary/10 shadow-xl"
                        : "rounded-2xl border border-border bg-card/85 hover:border-gold/50 shadow-sm hover:shadow-md"
                    }`}
                    style={{
                      // Asymmetric architectural corner accents
                      borderRadius: isOpen
                        ? "28px 12px 28px 12px"
                        : "20px 10px 20px 10px",
                    }}
                  >
                    {/* Question Header Button with Smooth Click Action */}
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer group focus:outline-none"
                      aria-expanded={isOpen}
                      aria-controls={`faq-content-${faq.id}`}
                    >
                      <div className="space-y-1.5 flex-1 pr-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-primary tracking-wider">
                            {faq.categoryLabel}
                          </span>
                          {faq.popular && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold/25 border border-gold/40 px-2.5 py-0.5 text-[10px] font-extrabold text-foreground shadow-xs">
                              <Sparkles className="size-2.5 text-gold" />
                              Popular Question
                            </span>
                          )}
                        </div>

                        <h3
                          className={`font-display text-base sm:text-lg font-bold transition-colors ${
                            isOpen
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          <span className="text-muted-foreground/60 mr-2 font-mono text-sm">
                            {String(index + 1).padStart(2, "0")}.
                          </span>
                          {faq.question}
                        </h3>
                      </div>

                      {/* Animated Plus / Minus / Rotational Icon */}
                      <div
                        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-300 ${
                          isOpen
                            ? "bg-gold text-foreground shadow-md rotate-180 scale-110"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary"
                        }`}
                      >
                        <ChevronDown
                          className={`size-5 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expandable Answer Content */}
                    {isOpen && (
                      <div
                        id={`faq-content-${faq.id}`}
                        className="px-5 pb-6 sm:px-6 pt-1 border-t border-border/60 animate-in fade-in-50 slide-in-from-top-2 duration-300"
                      >
                        <p className="text-sm leading-relaxed text-foreground/90 font-normal">
                          {faq.answer}
                        </p>

                        {/* Highlighted Bullets Grid */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-border/40">
                          {faq.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex items-center gap-2 text-xs font-semibold text-foreground/80 bg-background/60 rounded-lg px-3 py-1.5 border border-border/40"
                            >
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>

                        {/* Inline Action Button if Available */}
                        {faq.actionType && (
                          <div className="mt-5 flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
                            <Button
                              type="button"
                              size="sm"
                              onClick={(e) => handleActionClick(faq.actionType, e)}
                              className="bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow-sm h-9"
                            >
                              <span>{faq.actionLabel}</span>
                              <ArrowRight className="ml-1.5 size-3.5" />
                            </Button>

                            <span className="text-[11px] text-muted-foreground">
                              Questions verified by Laung Laachi Management
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
