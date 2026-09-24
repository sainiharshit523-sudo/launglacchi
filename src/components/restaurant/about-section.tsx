import { useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Eye,
  Flame,
  HeartHandshake,
  History,
  Landmark,
  MapPin,
  Maximize2,
  Sparkles,
  Sun,
  Trees,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { restaurant } from "@/data/restaurant";

// Authentic original photos of Laung Laachi Restaurant (Google Maps listing, Brahmpur, Punjab)
import exteriorImg from "@/assets/original/laung-laachi-exterior-sign.jpg";
import loungeImg from "@/assets/original/laung-laachi-ambience-2.jpg";
import banquetHallImg from "@/assets/original/laung-laachi-courtyard-4.jpg";
import diningImg from "@/assets/original/laung-laachi-dining-1.jpg";

interface AuthenticPhoto {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  src: string;
  alt: string;
  badge: string;
  tag: string;
}

const authenticPhotos: AuthenticPhoto[] = [
  {
    id: "exterior",
    title: "Official Highway Facade & Cultural Welcome",
    subtitle: "Authentic Red Brick Architecture & Folk Statues",
    description:
      "The genuine front view of Laung Laachi on Nangal–Chandigarh Road in Brahmpur. Features the official 'Laung Laachi A.C Rooms & Hall' canopy, traditional Punjabi Bhangra statues welcoming guests, and wide roadside vehicle parking.",
    src: exteriorImg,
    alt: "Original photo of Laung Laachi restaurant building exterior with official Laung Laachi signage and Punjabi statues in Brahmpur, Punjab",
    badge: "Official Highway Facade",
    tag: "Exterior & Signboard",
  },
  {
    id: "cloud-lounge",
    title: "Air-Conditioned Family Cloud Lounge",
    subtitle: "Illuminated Sky Ceiling & Comfortable Sofa Booths",
    description:
      "The authentic air-conditioned interior of Laung Laachi with plush cream and teal dining sofas, ambient globe pendant lanterns, and the signature illuminated cloud-and-sky false ceiling design for a soothing road trip pause.",
    src: loungeImg,
    alt: "Original photo of Laung Laachi restaurant interior with family sofa dining booths, pendant lights, and glowing blue cloud ceiling",
    badge: "AC Cloud Lounge",
    tag: "Interior Ambiance",
  },
  {
    id: "banquet-hall",
    title: "Celebration & Banquet Hall",
    subtitle: "Floral Canopies & Event Dining Space",
    description:
      "The genuine event and marriage hall at Laung Laachi, arranged with festive floral archways, draped banquet tables, and stage lighting for family celebrations, birthdays, wedding halts, and large tour gatherings.",
    src: banquetHallImg,
    alt: "Original photo of Laung Laachi celebration banquet hall with floral decor and banquet dining tables",
    badge: "Banquet & Events",
    tag: "Celebration Hall",
  },
  {
    id: "dining-hall",
    title: "AC Highway Dining Hall",
    subtitle: "Comfortable Dining for Travelers & Families",
    description:
      "Authentic dining space designed for travelers seeking a refreshing meal of hot tandoori breads, rich gravies, and comforting tea before continuing along the Shivalik corridor.",
    src: diningImg,
    alt: "Original photo of Laung Laachi air-conditioned dining area with dining tables and chairs",
    badge: "Dining Hall",
    tag: "Family Seating",
  },
];

const heroPhoto = authenticPhotos[0]!;
const loungePhoto = authenticPhotos[1]!;
const banquetPhoto = authenticPhotos[2]!;

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % authenticPhotos.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + authenticPhotos.length) % authenticPhotos.length);
    }
  };

  const selectedSpotlight =
    activeTab !== "all" ? (authenticPhotos.find((p) => p.id === activeTab) ?? heroPhoto) : null;

  const currentLightboxPhoto =
    lightboxIndex !== null ? (authenticPhotos[lightboxIndex] ?? null) : null;

  return (
    <section
      id="about"
      className="relative scroll-mt-16 overflow-hidden bg-background py-20 sm:py-28 lg:py-32"
      aria-label="About Laung Laachi Restaurant, Authentic Photos, History, Beauty and Location"
    >
      {/* Decorative ambient background accents */}
      <div className="punjabi-pattern absolute inset-0 opacity-40 pointer-events-none" />
      <div className="absolute -left-40 top-1/4 size-96 rounded-full bg-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-40 bottom-1/4 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-secondary/20 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-secondary-foreground shadow-sm">
            <History className="size-3.5 text-secondary" />
            Our Heritage & Story · Brahmpur, Punjab
          </div>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Where Highway Journeys Meet Timeless Punjabi Warmth
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Rooted in the fertile soils of Rupnagar and inspired by centuries of Punjabi
            hospitality, <strong className="font-bold text-foreground">Laung Laachi</strong> is more
            than a highway restaurant—it is a sanctuary of comfort, authentic flavor, and memories
            along the historic Nangal to Chandigarh road.
          </p>
        </div>

        {/* Authentic Photos Showcase Header Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Original Restaurant Photos
            </span>
            <span className="text-xs text-muted-foreground">
              Authentic pictures from our Google Maps listing · Brahmpur, Punjab
            </span>
          </div>

          <a
            href={restaurant.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Verify on Google Maps</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-border/70 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground shadow"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All 3 Original Photos (Collage)
          </button>
          {authenticPhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveTab(photo.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                activeTab === photo.id
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {photo.tag}
            </button>
          ))}
        </div>

        {/* Authentic Multi-Photo Display */}
        {activeTab === "all" ? (
          /* Bento 3-Photo Showcase Grid */
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Primary Hero Card: Authentic Exterior & Signboard (7 cols) */}
            <div
              className="group relative col-span-12 overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-all duration-300 hover:shadow-xl lg:col-span-7"
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(0)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(0);
                }
              }}
              aria-label="Click to enlarge authentic photo of restaurant exterior"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-[16/11]">
                <img
                  src={heroPhoto.src}
                  alt={heroPhoto.alt}
                  className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Top Badges */}
                <div className="absolute left-4 top-4 right-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur">
                    <CheckCircle2 className="size-3.5" />
                    Authentic Exterior
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur border border-white/20">
                    <Eye className="size-3.5" />
                    Click to enlarge
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold">
                    <MapPin className="size-3.5" />
                    Nangal–Chandigarh Road, Brahmpur
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl drop-shadow-md">
                    {heroPhoto.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-white/90 line-clamp-2 drop-shadow">
                    {heroPhoto.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 2 Companion Authentic Photos (5 cols) */}
            <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {/* Photo 2: Authentic AC Family Cloud Lounge */}
              <div
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-xl"
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(1);
                  }
                }}
                aria-label="Click to enlarge authentic photo of AC Cloud Lounge"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-[16/9] lg:aspect-[16/8.8]">
                  <img
                    src={loungePhoto.src}
                    alt={loungePhoto.alt}
                    className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground shadow">
                      <Sparkles className="size-3" />
                      Family AC Lounge
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur border border-white/20">
                      <Maximize2 className="size-3.5" />
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-display text-base sm:text-lg font-bold text-white drop-shadow">
                      {loungePhoto.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-1 drop-shadow">
                      Illuminated sky-and-clouds ceiling & comfortable sofa dining
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo 3: Authentic Banquet & Celebration Hall */}
              <div
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-md transition-all duration-300 hover:shadow-xl"
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(2)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(2);
                  }
                }}
                aria-label="Click to enlarge authentic photo of celebration banquet hall"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-[16/9] lg:aspect-[16/8.8]">
                  <img
                    src={banquetPhoto.src}
                    alt={banquetPhoto.alt}
                    className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                  <div className="absolute left-3 top-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/95 px-2.5 py-0.5 text-[11px] font-bold text-foreground shadow">
                      <HeartHandshake className="size-3" />
                      Banquet & Events
                    </span>
                    <span className="grid size-7 place-items-center rounded-full bg-black/60 text-white/90 backdrop-blur border border-white/20">
                      <Maximize2 className="size-3.5" />
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-display text-base sm:text-lg font-bold text-white drop-shadow">
                      {banquetPhoto.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-1 drop-shadow">
                      Decorated floral arches, banquet seating & party venue
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Spotlight Single Photo View */
          selectedSpotlight && (
            <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
              <div className="relative aspect-[16/10] max-h-[520px] w-full overflow-hidden bg-muted sm:aspect-[21/9]">
                <img
                  src={selectedSpotlight.src}
                  alt={selectedSpotlight.alt}
                  className="size-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute left-6 top-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow">
                    <CheckCircle2 className="size-3.5" />
                    {selectedSpotlight.badge}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {selectedSpotlight.subtitle}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-bold sm:text-3xl text-white drop-shadow">
                      {selectedSpotlight.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-white/90 drop-shadow">
                      {selectedSpotlight.description}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={() => {
                      const idx = authenticPhotos.findIndex((p) => p.id === selectedSpotlight.id);
                      if (idx !== -1) openLightbox(idx);
                    }}
                    className="shrink-0 bg-white/20 hover:bg-white/30 text-white backdrop-blur border border-white/30"
                  >
                    <Maximize2 className="mr-2 size-4" />
                    View Fullscreen
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Narrative & Meaning Section */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
            {/* Story of the Name: Laung & Laachi */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="size-4" />
                  The Meaning Behind Our Name
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  The Sacred Spices of Punjabi Welcome:{" "}
                  <span className="text-primary font-extrabold">Laung</span> &{" "}
                  <span className="text-primary font-extrabold">Laachi</span>
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <p>
                    In traditional Punjabi households and across age-old trade routes, two spices
                    have always reigned supreme: <strong className="text-foreground">Laung</strong>{" "}
                    (fragrant clove) and <strong className="text-foreground">Laachi</strong> (sweet
                    green cardamom). Together, they represent the soul of heartfelt North Indian
                    hospitality.
                  </p>
                  <p>
                    Whenever a traveler arrived from a grueling trek across the plains, they were
                    immediately greeted with a steaming cup of tea infused with crushed cardamom to
                    refresh the senses, and clove to soothe fatigue and bring warmth to the chest.
                  </p>
                  <p>
                    We founded <strong className="text-foreground">Laung Laachi</strong> upon this
                    exact tradition: an honest, open-hearted vow that every traveler who steps
                    across our threshold receives genuine hospitality (<em>Mehman-Nawazi</em>),
                    freshly pounded spices, and wholesome food that warms the spirit.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-gold/30 bg-secondary/15 p-5">
                <p className="font-display text-sm font-bold text-foreground sm:text-base italic">
                  “In Punjab, we do not simply serve food; we serve blessings. A pinch of Laachi for
                  sweetness, a clove of Laung for strength, and a heart full of respect.”
                </p>
              </div>
            </div>

            {/* The Scenic Location & Route Significance */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                  <Compass className="size-4" />
                  Strategic Highway Location
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  The Gateway Connecting the Shivalik Foothills & the Punjab Plains
                </h3>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <p>
                    Situated right on the{" "}
                    <strong className="text-foreground">
                      Nangal to Chandigarh Road (Brahmpur, Ropar)
                    </strong>
                    , our restaurant occupies one of northern India’s most historic and scenic
                    highway corridors.
                  </p>
                  <p>
                    To our north lie the majestic Shivalik hill ranges, the sacred gurdwaras of{" "}
                    <strong className="text-foreground">Sri Anandpur Sahib</strong> and{" "}
                    <strong className="text-foreground">Kiratpur Sahib</strong>, the holy shrine of{" "}
                    <strong className="text-foreground">Mata Naina Devi</strong>, and the onward
                    scenic routes to Bhakra Nangal and Himachal Pradesh. To our south flows the
                    historic Sutlej river belt leading towards the modern metropolis of Chandigarh
                    and Mohali.
                  </p>
                  <p>
                    For generations, pilgrims on sacred journeys, families embarking on mountain
                    holidays, and interstate travelers carrying northern commerce have chosen this
                    specific stretch of road for rest, reflection, and nourishment.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a
                    href={restaurant.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="size-4" />
                    <span>View Location on Google Maps</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-border hover:border-primary">
                  <a href="#menu" className="flex items-center gap-2">
                    <UtensilsCrossed className="size-4 text-primary" />
                    <span>Explore Our Food</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Beauty & Ambience */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="section-kicker">Experience the Atmosphere</p>
            <h3 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-foreground">
              What Makes Visiting Laung Laachi Unforgettable
            </h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Designed to soothe travel fatigue with comfortable air conditioning, authentic Punjabi
              cuisine, and unhurried dining.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Pillar 1 */}
            <article className="lift-hover group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-xl">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold/20 text-gold-foreground text-foreground group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Trees className="size-6 text-gold" />
              </span>
              <h4 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Authentic Highway Facade
              </h4>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Greeted by cultural Punjabi folk statues, red brick architecture, and roadside
                parking right on the Nangal–Chandigarh corridor.
              </p>
            </article>

            {/* Pillar 2 */}
            <article className="lift-hover group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-xl">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Sun className="size-6 text-primary" />
              </span>
              <h4 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                AC Cloud Sky Lounge
              </h4>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Relax in cozy cream & teal sofa booths beneath an illuminated cloud ceiling and warm
                ambient pendant globe lights.
              </p>
            </article>

            {/* Pillar 3 */}
            <article className="lift-hover group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-xl">
              <span className="grid size-12 place-items-center rounded-2xl bg-secondary/40 text-secondary-foreground group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Flame className="size-6 text-primary" />
              </span>
              <h4 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                The Live Clay Tandoor
              </h4>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Watch our ustads slap freshly rolled dough against fiery clay walls and slow-roast
                spiced tikkas over charcoal embers.
              </p>
            </article>

            {/* Pillar 4 */}
            <article className="lift-hover group relative rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-gold/60 hover:shadow-xl">
              <span className="grid size-12 place-items-center rounded-2xl bg-leaf/20 text-leaf group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <HeartHandshake className="size-6 text-leaf" />
              </span>
              <h4 className="mt-5 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Banquet & Family Haven
              </h4>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Spacious celebration hall for parties and family functions, clean restrooms, AC
                rooms, and swift Punjabi hospitality.
              </p>
            </article>
          </div>
        </div>

        {/* Scenic Route Landmarks Callout */}
        <div className="mt-14 rounded-2xl border border-border bg-gradient-to-r from-card via-muted/30 to-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Landmark className="size-6" />
              </div>
              <div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Convenient Transit Stop on Major Travel Routes
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  Located precisely between Rupnagar and Nangal, travelers stop here for breakfast
                  before morning darshan at Anandpur Sahib or tea when returning home to Chandigarh.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
              <span className="rounded-lg bg-background border border-border px-3 py-1.5 text-foreground">
                📍 25 mins to Anandpur Sahib
              </span>
              <span className="rounded-lg bg-background border border-border px-3 py-1.5 text-foreground">
                📍 45 mins to Chandigarh
              </span>
              <span className="rounded-lg bg-background border border-border px-3 py-1.5 text-foreground">
                📍 35 mins to Bhakra Nangal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Resolution Inspection */}
      {currentLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="High-resolution authentic photo viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div
            className="relative flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="size-3" />
                  Verified Authentic Photo
                </span>
                <span className="text-xs text-muted-foreground">
                  Photo {(lightboxIndex ?? 0) + 1} of {authenticPhotos.length}
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

            {/* Modal Image Display */}
            <div className="relative flex max-h-[65vh] items-center justify-center overflow-hidden bg-black">
              <img
                src={currentLightboxPhoto.src}
                alt={currentLightboxPhoto.alt}
                className="max-h-[65vh] w-auto max-w-full object-contain"
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

            {/* Modal Caption & Details */}
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">
                    {currentLightboxPhoto.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {currentLightboxPhoto.description}
                  </p>
                </div>

                <Button asChild size="sm" className="shrink-0">
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

              {/* Mini thumbnails inside lightbox */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                {authenticPhotos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative size-12 overflow-hidden rounded-lg border transition-all ${
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
    </section>
  );
}
