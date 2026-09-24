import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  HeartHandshake,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  MessageSquare,
  PartyPopper,
  Phone,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurant, banquetInfo } from "@/data/restaurant";
import { BanquetBookingDialog } from "./banquet-booking-dialog";

// All 6 Authentic original photos of Laung Laachi Restaurant
import exteriorImg from "@/assets/original/laung-laachi-exterior-sign.jpg";
import banquetArchImg from "@/assets/original/laung-laachi-courtyard-4.jpg";
import banquetHallImg from "@/assets/original/laung-laachi-hall-3.jpg";
import loungeImg from "@/assets/original/laung-laachi-ambience-2.jpg";
import diningImg from "@/assets/original/laung-laachi-dining-1.jpg";
import outdoorImg from "@/assets/original/laung-laachi-outdoor-5.jpg";

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "all" | "banquet" | "dining" | "exterior";
  categoryLabel: string;
  description: string;
  src: string;
  alt: string;
  badge: string;
  isBanquet?: boolean;
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "exterior-sign",
    title: "Official Highway Facade & Cultural Entrance",
    category: "exterior",
    categoryLabel: "Highway Facade",
    description:
      "The genuine front view on Nangal–Chandigarh Road in Brahmpur featuring the iconic red brick building, official 'LAUNG LAACHI A.C. ROOMS & HALL' yellow canopy, welcoming Bhangra folk statues, and roadside parking.",
    src: exteriorImg,
    alt: "Authentic photo of Laung Laachi restaurant building exterior with official signboard and Punjabi folk statues",
    badge: "Official Facade",
  },
  {
    id: "banquet-arch",
    title: "Grand Marriage & Celebration Hall",
    category: "banquet",
    categoryLabel: "Banquet & Marriages",
    description:
      "Festive banquet hall arranged with delicate floral archways, draped banquet tables, and stage lighting for weddings, receptions, ring ceremonies, and family celebrations.",
    src: banquetArchImg,
    alt: "Authentic photo of Laung Laachi marriage and celebration banquet hall with floral decor and dining setup",
    badge: "Weddings & Parties",
    isBanquet: true,
  },
  {
    id: "banquet-hall-stage",
    title: "Spacious Event Hall & Stage Setup",
    category: "banquet",
    categoryLabel: "Banquet & Marriages",
    description:
      "Expansive air-conditioned banquet hall accommodating 50 to 300+ guests for ring ceremonies (sagan/roka), birthday bashes, kitty parties, and interstate tour bus dining stops.",
    src: banquetHallImg,
    alt: "Authentic photo of Laung Laachi spacious banquet hall and stage setup for events and gatherings",
    badge: "Capacity: 300+ Guests",
    isBanquet: true,
  },
  {
    id: "family-cloud-lounge",
    title: "Air-Conditioned Family Cloud Lounge",
    category: "dining",
    categoryLabel: "Dining & Cloud Lounge",
    description:
      "The signature indoor family sanctuary featuring plush cream and teal sofa booths, warm ambient pendant globes, and the distinctive illuminated blue sky-and-clouds ceiling.",
    src: loungeImg,
    alt: "Authentic photo of Laung Laachi indoor dining area with illuminated cloud ceiling and sofa seating",
    badge: "AC Cloud Lounge",
  },
  {
    id: "highway-dining-hall",
    title: "AC Highway Restaurant Dining",
    category: "dining",
    categoryLabel: "Dining & Cloud Lounge",
    description:
      "Comfortable air-conditioned family restaurant dining space serving steaming tandoori breads, rich paneer curries, Punjabi thalis, and hot ginger-cardamom tea.",
    src: diningImg,
    alt: "Authentic photo of Laung Laachi air-conditioned family dining room and restaurant tables",
    badge: "Family Dining",
  },
  {
    id: "front-porch-grounds",
    title: "Front Porch & Highway Landscape",
    category: "exterior",
    categoryLabel: "Highway Facade",
    description:
      "Outdoor front perspective and garden pathway along the scenic Nangal to Chandigarh corridor in Brahmpur, welcoming travelers heading towards Anandpur Sahib and Himachal.",
    src: outdoorImg,
    alt: "Authentic photo of Laung Laachi outdoor front porch and roadside landscape",
    badge: "Scenic Location",
  },
];

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("Marriage / Wedding Reception");

  const filteredPhotos =
    selectedCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((photo) => photo.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const currentPhoto = lightboxIndex !== null ? (filteredPhotos[lightboxIndex] ?? null) : null;

  const handleOpenBooking = (eventType = "Marriage / Wedding Reception") => {
    setSelectedEventType(eventType);
    setIsBookingOpen(true);
  };

  return (
    <section
      id="gallery"
      className="relative scroll-mt-16 overflow-hidden bg-background py-16 sm:py-24"
      aria-label="Authentic Photo Gallery of Laung Laachi Restaurant and Banquet Hall"
    >
      {/* Decorative ambient background */}
      <div className="punjabi-pattern absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute left-1/2 top-0 size-96 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-secondary/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-secondary-foreground shadow-sm">
              <ImageIcon className="size-3.5 text-secondary" />
              100% Authentic Photos · Brahmpur, Punjab
            </div>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Authentic Photo Gallery of Laung Laachi
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Explore the genuine restaurant spaces: from our iconic highway facade with folk
              statues to the air-conditioned Family Cloud Lounge and the Grand Celebration Banquet
              Hall.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => handleOpenBooking("Marriage / Wedding Reception")}
              className="bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90 h-11 px-5"
            >
              <PartyPopper className="mr-2 size-4" />
              Book Banquet Hall
            </Button>
            <Button asChild variant="outline" className="h-11">
              <a
                href={restaurant.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <span>Verify on Google Maps</span>
                <ExternalLink className="size-3.5 text-primary" />
              </a>
            </Button>
          </div>
        </div>

        {/* Grand Banquet Hall & Celebration Booking Spotlight Card */}
        <div
          id="banquet"
          className="mt-10 overflow-hidden rounded-3xl border-2 border-gold/50 bg-gradient-to-r from-card via-secondary/15 to-card p-6 shadow-xl sm:p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 text-xs font-black uppercase text-foreground shadow">
                  <Sparkles className="size-3.5" />
                  Marriages · Receptions · Parties · Anniversaries
                </span>
                <span className="rounded-full bg-background border border-border px-3 py-0.5 text-xs font-bold text-foreground">
                  Capacity: 50–300+ Guests
                </span>
                <span className="rounded-full bg-background border border-border px-3 py-0.5 text-xs font-bold text-foreground">
                  AC Rooms Available
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-foreground">
                Hosting a Marriage, Ring Ceremony, or Family Party?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base leading-relaxed">
                Celebrate your most cherished moments in our spacious, air-conditioned banquet hall.
                Equipped with complete stage & floral decor, live Punjabi tandoori buffet catering,
                sound system, and comfortable AC guest rooms for your outstation family.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-foreground/80">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Full Stage & Theme Decoration
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Pure Veg & Non-Veg Kitchens
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Ample Highway Parking
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  AC Rooms for Guests
                </span>
              </div>

              {/* Quick Event Chips for Instant Booking */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-foreground">Instant Booking:</span>
                {[
                  "💍 Marriage / Wedding",
                  "✨ Sagan / Ring Ceremony",
                  "🎂 Birthday Party",
                  "🎉 Kitty Party / Anniversary",
                  "🚌 Tour Bus Meal Halt",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleOpenBooking(chip)}
                    className="rounded-lg border border-gold/40 bg-background/90 px-2.5 py-1 text-xs font-bold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground shadow-xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col shrink-0 gap-3">
              <Button
                type="button"
                size="lg"
                onClick={() => handleOpenBooking("Marriage / Wedding Reception")}
                className="bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90 h-12 px-6"
              >
                <PartyPopper className="mr-2 size-5" />
                Book Banquet Hall Now
              </Button>

              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => {
                  const text = encodeURIComponent(
                    "Hello Laung Laachi! I would like to inquire about banquet hall booking for marriages/parties in Brahmpur.",
                  );
                  window.open(`https://wa.me/919915716739?text=${text}`, "_blank");
                }}
                className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 h-12"
              >
                <MessageSquare className="mr-2 size-5 text-[#25D366]" />
                WhatsApp Inquiry
              </Button>

              <a
                href={restaurant.phoneHref}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground pt-1"
              >
                <Phone className="size-3.5 text-primary" />
                Direct Call: {restaurant.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Photos (6)" },
              { id: "banquet", label: "🎉 Banquet & Marriages (2)" },
              { id: "dining", label: "🍽️ Restaurant & Cloud Lounge (2)" },
              { id: "exterior", label: "🏛️ Highway Facade & Entrance (2)" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  selectedCategory === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            Showing {filteredPhotos.length} of {galleryPhotos.length} authentic pictures
          </span>
        </div>

        {/* 6-Photo Responsive Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPhotos.map((photo, index) => (
            <article
              key={photo.id}
              className="lift-hover group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-md transition-all duration-300 hover:border-gold/60 hover:shadow-xl"
            >
              {/* Photo Area with Enlarge Action */}
              <div
                className="relative aspect-[16/11] w-full overflow-hidden bg-muted cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                aria-label={`Enlarge photo: ${photo.title}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges on Top of Photo */}
                <div className="absolute left-3 top-3 right-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white shadow backdrop-blur border border-white/20">
                    <CheckCircle2 className="size-3 text-emerald-400" />
                    {photo.badge}
                  </span>

                  <span className="grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur border border-white/20 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <Maximize2 className="size-4" />
                  </span>
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gold">
                    {photo.categoryLabel}
                  </p>
                  <h4 className="font-display text-base font-bold text-white drop-shadow line-clamp-1">
                    {photo.title}
                  </h4>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <p className="text-xs text-muted-foreground leading-relaxed">{photo.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <Eye className="size-3.5" />
                    <span>Inspect Photo</span>
                  </button>

                  {photo.isBanquet ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleOpenBooking(photo.title)}
                      className="h-8 bg-secondary text-secondary-foreground text-xs font-bold hover:bg-secondary/90"
                    >
                      <Calendar className="mr-1.5 size-3.5" />
                      Book Hall
                    </Button>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground/80">
                      Brahmpur, Punjab
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-3" />
                  Verified Original Photo
                </span>
                <span className="text-xs text-muted-foreground">
                  Photo {(lightboxIndex ?? 0) + 1} of {filteredPhotos.length}
                </span>
              </div>

              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Close photo preview"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Main Image */}
            <div className="relative flex max-h-[62vh] items-center justify-center overflow-hidden bg-black">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt}
                className="max-h-[62vh] w-auto max-w-full object-contain"
              />

              {/* Prev / Next controls */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightbox();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors backdrop-blur border border-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightbox();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90 transition-colors backdrop-blur border border-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="size-6" />
              </button>
            </div>

            {/* Modal Details & Action Footer */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="max-w-2xl">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    {currentPhoto.categoryLabel}
                  </span>
                  <h4 className="mt-0.5 font-display text-lg sm:text-xl font-bold text-foreground">
                    {currentPhoto.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {currentPhoto.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {currentPhoto.isBanquet && (
                    <Button
                      type="button"
                      onClick={() => {
                        closeLightbox();
                        handleOpenBooking(currentPhoto.title);
                      }}
                      className="bg-primary text-primary-foreground font-bold"
                    >
                      <PartyPopper className="mr-2 size-4" />
                      Book This Banquet Hall
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={restaurant.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Lightbox Mini Thumbnails */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 overflow-x-auto pb-1">
                {filteredPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative size-12 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      lightboxIndex === idx
                        ? "border-primary ring-2 ring-primary/40 scale-105"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Switch to ${p.title}`}
                  >
                    <img src={p.src} alt={p.alt} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Banquet Hall & Party Booking Modal */}
      <BanquetBookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        defaultEventType={selectedEventType}
      />
    </section>
  );
}
