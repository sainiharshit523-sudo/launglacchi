import { useMemo, useRef, useState } from "react";
import {
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cookie,
  CupSoda,
  Flame,
  IceCream,
  Info,
  Layers,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Soup,
  Sparkles,
  Star,
  Utensils,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import { fullMenuList, menuCategories, type MenuItem, type DietaryType } from "@/data/menu";
import { restaurant } from "@/data/restaurant";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { activityTracker } from "@/lib/activity-tracker";

import butterChickenImg from "@/assets/butter-chicken-spotlight.jpg";
import maharajaThaliImg from "@/assets/maharaja-thali-spotlight.jpg";

// Map string icon names to Lucide icons
const iconMap: Record<string, typeof Utensils> = {
  Utensils,
  Coffee,
  ChefHat,
  Soup,
  Flame,
  Sparkles,
  Cookie,
  Zap,
  Wheat,
  CupSoda,
  IceCream,
};

interface CategoryThemeConfig {
  gradient: string;
  glow: string;
  idleBorder: string;
  idleBg: string;
  idleText: string;
  iconColor: string;
  activeIconColor: string;
  badgeActive: string;
  badgeIdle: string;
  bannerGradient: string;
  bannerBorder: string;
  accentDot: string;
}

const defaultCategoryTheme: CategoryThemeConfig = {
  gradient:
    "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-md shadow-amber-600/25",
  glow: "glow-amber",
  idleBorder: "border-amber-500/30",
  idleBg: "bg-amber-500/10 hover:bg-amber-500/20",
  idleText: "text-foreground",
  iconColor: "text-amber-600 dark:text-amber-400",
  activeIconColor: "text-yellow-200",
  badgeActive: "bg-black/25 text-amber-100",
  badgeIdle: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
  bannerGradient: "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15",
  bannerBorder: "border-amber-500/30",
  accentDot: "bg-amber-500",
};

const categoryThemeMap: Record<string, CategoryThemeConfig> = {
  all: {
    gradient:
      "bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white shadow-lg shadow-amber-950/40",
    glow: "glow-amber",
    idleBorder: "border-amber-500/35",
    idleBg: "bg-amber-500/10 hover:bg-amber-500/20",
    idleText: "text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
    activeIconColor: "text-yellow-300",
    badgeActive: "bg-white/20 text-amber-200",
    badgeIdle: "bg-amber-500/20 text-amber-900 dark:text-amber-300",
    bannerGradient: "bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20",
    bannerBorder: "border-amber-500/40",
    accentDot: "bg-amber-500",
  },
  "non-veg-chicken": {
    gradient:
      "bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white shadow-lg shadow-red-600/35",
    glow: "glow-red",
    idleBorder: "border-red-500/35",
    idleBg: "bg-red-500/10 hover:bg-red-500/20",
    idleText: "text-red-950 dark:text-red-200",
    iconColor: "text-red-600 dark:text-red-400",
    activeIconColor: "text-red-100",
    badgeActive: "bg-black/25 text-red-100",
    badgeIdle: "bg-red-500/20 text-red-900 dark:text-red-300",
    bannerGradient: "bg-gradient-to-r from-red-500/20 via-rose-500/10 to-orange-500/20",
    bannerBorder: "border-red-500/40",
    accentDot: "bg-red-600",
  },
  "non-veg-tandoori": {
    gradient:
      "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/35",
    glow: "glow-amber",
    idleBorder: "border-orange-500/35",
    idleBg: "bg-orange-500/10 hover:bg-orange-500/20",
    idleText: "text-orange-950 dark:text-orange-200",
    iconColor: "text-orange-600 dark:text-orange-400",
    activeIconColor: "text-orange-100",
    badgeActive: "bg-black/25 text-orange-100",
    badgeIdle: "bg-orange-500/20 text-orange-900 dark:text-orange-300",
    bannerGradient: "bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-red-500/20",
    bannerBorder: "border-orange-500/40",
    accentDot: "bg-orange-600",
  },
  "non-veg-mutton": {
    gradient:
      "bg-gradient-to-r from-rose-900 via-red-900 to-stone-900 text-white shadow-lg shadow-rose-950/40",
    glow: "glow-rose",
    idleBorder: "border-rose-800/35",
    idleBg: "bg-rose-950/10 hover:bg-rose-950/20",
    idleText: "text-rose-950 dark:text-rose-200",
    iconColor: "text-rose-700 dark:text-rose-400",
    activeIconColor: "text-rose-200",
    badgeActive: "bg-black/25 text-rose-100",
    badgeIdle: "bg-rose-900/20 text-rose-900 dark:text-rose-300",
    bannerGradient: "bg-gradient-to-r from-rose-900/20 via-red-900/10 to-stone-900/20",
    bannerBorder: "border-rose-800/40",
    accentDot: "bg-rose-800",
  },
  "non-veg-egg": {
    gradient:
      "bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-yellow-500/35",
    glow: "glow-amber",
    idleBorder: "border-yellow-500/40",
    idleBg: "bg-yellow-500/10 hover:bg-yellow-500/20",
    idleText: "text-yellow-950 dark:text-yellow-200",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    activeIconColor: "text-yellow-950",
    badgeActive: "bg-black/20 text-slate-900",
    badgeIdle: "bg-yellow-500/25 text-yellow-900 dark:text-yellow-300",
    bannerGradient: "bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-orange-500/20",
    bannerBorder: "border-yellow-500/40",
    accentDot: "bg-yellow-500",
  },
  breakfast: {
    gradient:
      "bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-600 text-white shadow-lg shadow-amber-500/35",
    glow: "glow-amber",
    idleBorder: "border-amber-500/35",
    idleBg: "bg-amber-500/10 hover:bg-amber-500/20",
    idleText: "text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
    activeIconColor: "text-amber-100",
    badgeActive: "bg-black/25 text-amber-100",
    badgeIdle: "bg-amber-500/20 text-amber-900 dark:text-amber-300",
    bannerGradient: "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20",
    bannerBorder: "border-amber-500/40",
    accentDot: "bg-amber-500",
  },
  paneer: {
    gradient:
      "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/35",
    glow: "glow-emerald",
    idleBorder: "border-emerald-500/35",
    idleBg: "bg-emerald-500/10 hover:bg-emerald-500/20",
    idleText: "text-emerald-950 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    activeIconColor: "text-emerald-100",
    badgeActive: "bg-black/25 text-emerald-100",
    badgeIdle: "bg-emerald-500/20 text-emerald-900 dark:text-emerald-300",
    bannerGradient: "bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-600/20",
    bannerBorder: "border-emerald-500/40",
    accentDot: "bg-emerald-600",
  },
  "dal-curry": {
    gradient:
      "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white shadow-lg shadow-orange-600/35",
    glow: "glow-amber",
    idleBorder: "border-orange-500/35",
    idleBg: "bg-orange-500/10 hover:bg-orange-500/20",
    idleText: "text-orange-950 dark:text-orange-200",
    iconColor: "text-orange-600 dark:text-orange-400",
    activeIconColor: "text-orange-100",
    badgeActive: "bg-black/25 text-orange-100",
    badgeIdle: "bg-orange-500/20 text-orange-900 dark:text-orange-300",
    bannerGradient: "bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-yellow-600/20",
    bannerBorder: "border-orange-500/40",
    accentDot: "bg-orange-600",
  },
  breads: {
    gradient:
      "bg-gradient-to-r from-amber-700 via-stone-700 to-yellow-800 text-white shadow-lg shadow-amber-700/35",
    glow: "glow-amber",
    idleBorder: "border-amber-700/35",
    idleBg: "bg-stone-500/10 hover:bg-stone-500/20",
    idleText: "text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-700 dark:text-amber-400",
    activeIconColor: "text-amber-100",
    badgeActive: "bg-black/25 text-amber-100",
    badgeIdle: "bg-amber-700/20 text-amber-950 dark:text-amber-300",
    bannerGradient: "bg-gradient-to-r from-amber-700/20 via-stone-600/10 to-yellow-700/20",
    bannerBorder: "border-amber-700/40",
    accentDot: "bg-amber-700",
  },
  thali: {
    gradient:
      "bg-gradient-to-r from-purple-600 via-violet-600 to-amber-600 text-white shadow-lg shadow-purple-600/35",
    glow: "glow-purple",
    idleBorder: "border-purple-500/35",
    idleBg: "bg-purple-500/10 hover:bg-purple-500/20",
    idleText: "text-purple-950 dark:text-purple-200",
    iconColor: "text-purple-600 dark:text-purple-400",
    activeIconColor: "text-purple-100",
    badgeActive: "bg-black/25 text-purple-100",
    badgeIdle: "bg-purple-500/20 text-purple-900 dark:text-purple-300",
    bannerGradient: "bg-gradient-to-r from-purple-500/20 via-violet-500/10 to-amber-500/20",
    bannerBorder: "border-purple-500/40",
    accentDot: "bg-purple-600",
  },
  snacks: {
    gradient:
      "bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 text-white shadow-lg shadow-yellow-600/35",
    glow: "glow-amber",
    idleBorder: "border-yellow-600/35",
    idleBg: "bg-yellow-500/10 hover:bg-yellow-500/20",
    idleText: "text-yellow-950 dark:text-yellow-200",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    activeIconColor: "text-yellow-100",
    badgeActive: "bg-black/25 text-yellow-100",
    badgeIdle: "bg-yellow-500/20 text-yellow-900 dark:text-yellow-300",
    bannerGradient: "bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-orange-500/20",
    bannerBorder: "border-yellow-600/40",
    accentDot: "bg-yellow-600",
  },
  chinese: {
    gradient:
      "bg-gradient-to-r from-rose-600 via-red-600 to-fuchsia-600 text-white shadow-lg shadow-rose-600/35",
    glow: "glow-rose",
    idleBorder: "border-rose-500/35",
    idleBg: "bg-rose-500/10 hover:bg-rose-500/20",
    idleText: "text-rose-950 dark:text-rose-200",
    iconColor: "text-rose-600 dark:text-rose-400",
    activeIconColor: "text-rose-100",
    badgeActive: "bg-black/25 text-rose-100",
    badgeIdle: "bg-rose-500/20 text-rose-900 dark:text-rose-300",
    bannerGradient: "bg-gradient-to-r from-rose-500/20 via-red-500/10 to-fuchsia-500/20",
    bannerBorder: "border-rose-500/40",
    accentDot: "bg-rose-600",
  },
  rice: {
    gradient:
      "bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white shadow-lg shadow-amber-600/35",
    glow: "glow-amber",
    idleBorder: "border-amber-600/35",
    idleBg: "bg-amber-500/10 hover:bg-amber-500/20",
    idleText: "text-amber-950 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
    activeIconColor: "text-amber-100",
    badgeActive: "bg-black/25 text-amber-100",
    badgeIdle: "bg-amber-500/20 text-amber-900 dark:text-amber-300",
    bannerGradient: "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/20",
    bannerBorder: "border-amber-600/40",
    accentDot: "bg-amber-600",
  },
  beverages: {
    gradient:
      "bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 text-white shadow-lg shadow-teal-600/35",
    glow: "glow-cyan",
    idleBorder: "border-teal-500/35",
    idleBg: "bg-teal-500/10 hover:bg-teal-500/20",
    idleText: "text-teal-950 dark:text-teal-200",
    iconColor: "text-teal-600 dark:text-teal-400",
    activeIconColor: "text-teal-100",
    badgeActive: "bg-black/25 text-teal-100",
    badgeIdle: "bg-teal-500/20 text-teal-900 dark:text-teal-300",
    bannerGradient: "bg-gradient-to-r from-teal-500/20 via-cyan-500/10 to-sky-500/20",
    bannerBorder: "border-teal-500/40",
    accentDot: "bg-teal-600",
  },
  desserts: {
    gradient:
      "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white shadow-lg shadow-pink-600/35",
    glow: "glow-rose",
    idleBorder: "border-pink-500/35",
    idleBg: "bg-pink-500/10 hover:bg-pink-500/20",
    idleText: "text-pink-950 dark:text-pink-200",
    iconColor: "text-pink-600 dark:text-pink-400",
    activeIconColor: "text-pink-100",
    badgeActive: "bg-black/25 text-pink-100",
    badgeIdle: "bg-pink-500/20 text-pink-900 dark:text-pink-300",
    bannerGradient: "bg-gradient-to-r from-pink-500/20 via-rose-500/10 to-purple-500/20",
    bannerBorder: "border-pink-500/40",
    accentDot: "bg-pink-600",
  },
};

export function FullMenuSection() {
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false);
  const [onlySignatures, setOnlySignatures] = useState<boolean>(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === "left" ? -260 : 260,
        behavior: "smooth",
      });
    }
  };

  // Available categories based on active dietary filter
  const visibleCategories = useMemo(() => {
    return menuCategories.filter((cat) => {
      if (cat.id === "all") return true;
      if (dietaryFilter === "all") return true;
      if (dietaryFilter === "veg") return cat.dietary === "veg" || cat.dietary === "all";
      if (dietaryFilter === "non-veg") return cat.dietary === "non-veg" || cat.dietary === "all";
      return true;
    });
  }, [dietaryFilter]);

  // Reset category if selected category is not visible under current dietary filter
  const handleDietaryChange = (filter: "all" | "veg" | "non-veg") => {
    setDietaryFilter(filter);
    setSelectedCategory("all");
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return fullMenuList.filter((item) => {
      // Dietary filter (veg vs non-veg)
      if (dietaryFilter !== "all" && item.dietary !== dietaryFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
        return false;
      }
      // Bestseller filter
      if (onlyBestsellers && !item.isBestseller) {
        return false;
      }
      // Signature filter
      if (onlySignatures && !item.isSignature) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesDescription = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDescription) {
          return false;
        }
      }
      return true;
    });
  }, [dietaryFilter, selectedCategory, searchQuery, onlyBestsellers, onlySignatures]);

  // Counts for tabs
  const vegCount = useMemo(() => fullMenuList.filter((i) => i.dietary === "veg").length, []);
  const nonVegCount = useMemo(() => fullMenuList.filter((i) => i.dietary === "non-veg").length, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const relevantItems =
      dietaryFilter === "all"
        ? fullMenuList
        : fullMenuList.filter((i) => i.dietary === dietaryFilter);
    counts["all"] = relevantItems.length;
    relevantItems.forEach((item) => {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    });
    return counts;
  }, [dietaryFilter]);

  const clearFilters = () => {
    setDietaryFilter("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setOnlyBestsellers(false);
    setOnlySignatures(false);
  };

  const activeCategoryObj = menuCategories.find((c) => c.id === selectedCategory);

  return (
    <section
      id="menu"
      className="scroll-mt-16 bg-gradient-to-b from-card via-background to-card py-20 sm:py-28"
      aria-label="Full Restaurant Menu and Price List"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-secondary/25 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-secondary-foreground shadow-sm">
            <Sparkles className="size-3.5 text-secondary" />
            Brahmpur Highway Dining · Authentic Price List
          </div>
          <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Taste the Authentic Highway Kitchen
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From clay oven tandoori paranthas and signature{" "}
            <strong className="text-foreground">Paneer Lababdar</strong> to richly spiced{" "}
            <strong className="text-foreground">Punjabi Butter Chicken</strong> and hot{" "}
            <strong className="text-foreground">Gud Wali Chai</strong>.
          </p>

          {/* Quick trust metrics */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1 text-foreground">
              <ShieldCheck className="size-3.5 text-leaf" /> Separate Veg & Non-Veg Preparation
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1 text-foreground">
              <Flame className="size-3.5 text-primary" /> Live Clay Tandoor
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-muted/80 px-3 py-1 text-foreground">
              <Star className="size-3.5 fill-gold text-gold" /> 3.9★ on Google Maps
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FEATURED SPOTLIGHT SHOWCASES (Visual Wow Factor) */}
        {/* ============================================================ */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* Non-Veg Highlight Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-card via-card to-red-950/15 p-6 shadow-md transition-all duration-300 hover:border-red-500/70 hover:shadow-xl hover:shadow-red-500/10">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
            <div className="grid gap-6 sm:grid-cols-[1.1fr_1.3fr] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <img
                  src={butterChickenImg}
                  alt="Authentic Punjabi Butter Chicken in brass handi with butter garlic naan"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-red-600/90 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-sm backdrop-blur">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  Non-Veg Spotlight
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/75 px-2 py-0.5 font-display text-xs font-bold text-white backdrop-blur">
                  ₹280 / ₹480
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-4 items-center justify-center rounded border border-red-600 bg-red-50"
                    title="Non-Vegetarian"
                  >
                    <div className="size-2 rounded-full bg-red-600" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Specialty Curry
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-extrabold text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                  Punjabi Butter Chicken
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Tandoor-roasted chicken simmered in a velvety tomato-butter-cashew gravy with
                  fresh cream and kasuri methi.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleDietaryChange("non-veg");
                      setSelectedCategory("non-veg-chicken");
                    }}
                    className="bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  >
                    View Non-Veg Menu
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary"
                  >
                    <a href={restaurant.phoneHref} className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-primary" />
                      <span>Order Now</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Veg Maharaja Thali Highlight Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-card via-card to-amber-950/15 p-6 shadow-md transition-all duration-300 hover:border-gold/80 hover:shadow-xl hover:shadow-amber-500/10">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-yellow-400" />
            <div className="grid gap-6 sm:grid-cols-[1.1fr_1.3fr] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <img
                  src={maharajaThaliImg}
                  alt="Authentic Punjabi Maharaja Thali with Paneer Lababdar, Dal Makhani and Paranthas"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-leaf/90 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-sm backdrop-blur">
                  <span className="size-1.5 rounded-full bg-white" />
                  Veg Maharaja Thali
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/75 px-2 py-0.5 font-display text-xs font-bold text-white backdrop-blur">
                  ₹260 Complete
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex size-4 items-center justify-center rounded border border-leaf bg-leaf/10"
                    title="100% Vegetarian"
                  >
                    <div className="size-2 rounded-full bg-leaf" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-leaf">
                    Royal Highway Feast
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-extrabold text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                  Punjabi Maharaja Thali
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Complete royal feast with Paneer Lababdar, Dal Makhani, Mix Veg, Jeera Rice,
                  Tandoori Breads, Raita, and Gulab Jamun.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleDietaryChange("veg");
                      setSelectedCategory("thali");
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  >
                    View Thalis & Veg
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary"
                  >
                    <a href={restaurant.phoneHref} className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-primary" />
                      <span>Order Now</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRIMARY DIETARY MODE SWITCHER (Separate Non-Veg & Veg) */}
        {/* ============================================================ */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="inline-flex rounded-3xl border-2 border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-xl gap-1.5 sm:gap-2">
            {/* All Dishes Tab */}
            <button
              type="button"
              onClick={() => handleDietaryChange("all")}
              className={`group flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                dietaryFilter === "all"
                  ? "bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-950/40 scale-102"
                  : "text-foreground/75 border border-transparent hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-900 dark:hover:text-amber-200"
              }`}
            >
              <Utensils
                className={`size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-115 ${dietaryFilter === "all" ? "text-amber-400" : "text-amber-600"}`}
              />
              <span>Complete Menu</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${dietaryFilter === "all" ? "bg-amber-500/25 text-amber-200 border border-amber-500/40" : "bg-muted text-muted-foreground"}`}
              >
                {fullMenuList.length}
              </span>
            </button>

            {/* Pure Veg Tab */}
            <button
              type="button"
              onClick={() => handleDietaryChange("veg")}
              className={`group flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                dietaryFilter === "veg"
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white border border-emerald-400/40 shadow-lg shadow-emerald-600/35 scale-102"
                  : "text-foreground/75 border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300"
              }`}
            >
              <div
                className={`flex size-4 items-center justify-center rounded border ${dietaryFilter === "veg" ? "border-white bg-white/20" : "border-emerald-600 bg-emerald-50"}`}
              >
                <div
                  className={`size-2 rounded-full ${dietaryFilter === "veg" ? "bg-white animate-pulse" : "bg-emerald-600"}`}
                />
              </div>
              <span>100% Pure Veg</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${dietaryFilter === "veg" ? "bg-white/20 text-white border border-white/20" : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300"}`}
              >
                {vegCount}
              </span>
            </button>

            {/* Non-Veg Tab */}
            <button
              type="button"
              onClick={() => handleDietaryChange("non-veg")}
              className={`group flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                dietaryFilter === "non-veg"
                  ? "bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white border border-red-400/40 shadow-lg shadow-red-600/35 scale-102"
                  : "text-foreground/75 border border-transparent hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
              }`}
            >
              <Flame
                className={`size-4 transition-transform duration-300 group-hover:scale-125 ${dietaryFilter === "non-veg" ? "text-yellow-200 animate-icon-bounce" : "text-red-600"}`}
              />
              <span>Non-Veg Kitchen</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${dietaryFilter === "non-veg" ? "bg-white/20 text-white border border-white/20" : "bg-red-500/15 text-red-800 dark:text-red-300"}`}
              >
                {nonVegCount}
              </span>
            </button>
          </div>
        </div>

        {/* Informative Dietary Banner when Non-Veg or Veg is selected */}
        {dietaryFilter === "non-veg" && (
          <div className="mt-5 mx-auto max-w-2xl flex items-center gap-3 rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/15 via-rose-950/10 to-orange-950/15 px-4 py-3 text-xs sm:text-sm text-foreground shadow-sm animate-pop-in">
            <Flame className="size-5 shrink-0 text-red-600 animate-icon-bounce" />
            <div>
              <strong className="font-bold text-red-700 dark:text-red-400">
                Non-Vegetarian Highway Kitchen:
              </strong>{" "}
              Handpicked chicken, mutton, and farm-fresh egg curries cooked in distinct utensils and
              served hot with tandoori breads.
            </div>
          </div>
        )}
        {dietaryFilter === "veg" && (
          <div className="mt-5 mx-auto max-w-2xl flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/15 via-teal-950/10 to-green-950/15 px-4 py-3 text-xs sm:text-sm text-foreground shadow-sm animate-pop-in">
            <ShieldCheck className="size-5 shrink-0 text-emerald-600 animate-icon-bounce" />
            <div>
              <strong className="font-bold text-emerald-700 dark:text-emerald-400">
                100% Vegetarian Selection:
              </strong>{" "}
              Made with pure desi ghee, fresh daily malai paneer, slow-simmered lentils, and garden
              vegetables.
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* INTERACTIVE CONTROLS (Search, Badges, Category Chips) */}
        {/* ============================================================ */}
        <div className="mt-8 rounded-3xl border border-border/90 bg-card/90 p-4 shadow-lg sm:p-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Butter Chicken, Paneer Lababdar, Parantha, Dal Makhani, Chai...)"
                className="h-11 w-full rounded-2xl border border-input bg-background/90 pl-10 pr-10 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Search menu items"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyBestsellers((v) => !v)}
                className={`group inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-extrabold transition-all duration-300 ${
                  onlyBestsellers
                    ? "border-amber-400 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/25 scale-102"
                    : "border-border/80 bg-background/80 text-muted-foreground hover:border-amber-400 hover:text-amber-600 hover:bg-amber-500/10 hover:scale-102"
                }`}
              >
                <Star
                  className={`size-3.5 transition-transform duration-300 group-hover:rotate-180 ${onlyBestsellers ? "fill-current text-slate-950" : "text-amber-500"}`}
                />
                Bestsellers Only
              </button>

              <button
                type="button"
                onClick={() => setOnlySignatures((v) => !v)}
                className={`group inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-extrabold transition-all duration-300 ${
                  onlySignatures
                    ? "border-purple-400 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 text-white shadow-md shadow-purple-500/25 scale-102"
                    : "border-border/80 bg-background/80 text-muted-foreground hover:border-purple-400 hover:text-purple-600 hover:bg-purple-500/10 hover:scale-102"
                }`}
              >
                <Sparkles
                  className={`size-3.5 transition-transform duration-300 group-hover:scale-125 ${onlySignatures ? "text-yellow-200" : "text-purple-500"}`}
                />
                House Signatures
              </button>

              {(searchQuery ||
                selectedCategory !== "all" ||
                onlyBestsellers ||
                onlySignatures ||
                dietaryFilter !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-extrabold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  Reset all
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs Header with Navigation Title & Scroll Arrows */}
          <div className="mt-6 border-t border-border/80 pt-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="size-4" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-foreground">
                    Menu Categories & Sections
                  </span>
                  <span className="hidden sm:inline text-xs text-muted-foreground ml-2 font-medium">
                    · {visibleCategories.length} authentic sections
                  </span>
                </div>
              </div>

              {/* Horizontal Scroll Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollCategories("left")}
                  className="grid size-8 place-items-center rounded-xl border border-border/80 bg-background/80 text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 shadow-xs"
                  aria-label="Scroll menu categories left"
                  title="Scroll categories left"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories("right")}
                  className="grid size-8 place-items-center rounded-xl border border-border/80 bg-background/80 text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-95 shadow-xs"
                  aria-label="Scroll menu categories right"
                  title="Scroll categories right"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Category Bar with Themed Colors and Micro-Animations */}
            <div
              ref={categoryScrollRef}
              className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 sm:mx-0 sm:px-0 scroll-smooth"
            >
              {visibleCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = iconMap[cat.iconName] || Utensils;
                const count = categoryCounts[cat.id] ?? 0;
                const theme = categoryThemeMap[cat.id] || defaultCategoryTheme;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group relative inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition-all duration-300 sm:text-sm ${
                      isSelected
                        ? `${theme.gradient} ${theme.glow} scale-103 shadow-lg border border-white/20`
                        : `border ${theme.idleBorder} ${theme.idleBg} ${theme.idleText} hover:scale-102 hover:-translate-y-0.5 hover:shadow-md`
                    }`}
                  >
                    <Icon
                      className={`size-4 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 ${
                        isSelected
                          ? `${theme.activeIconColor} animate-icon-bounce`
                          : theme.iconColor
                      }`}
                    />
                    <span>{cat.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors ${
                        isSelected ? theme.badgeActive : theme.badgeIdle
                      }`}
                    >
                      {count}
                    </span>
                    {isSelected && (
                      <span className="size-1.5 rounded-full bg-white animate-pulse shadow-xs" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Category Description Banner Themed to Selected Category */}
        {activeCategoryObj &&
          selectedCategory !== "all" &&
          (() => {
            const theme = categoryThemeMap[selectedCategory] || defaultCategoryTheme;
            const Icon = iconMap[activeCategoryObj.iconName] || Utensils;

            return (
              <div
                className={`mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border ${theme.bannerBorder} ${theme.bannerGradient} p-4 sm:p-5 shadow-sm backdrop-blur-md animate-pop-in`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`grid size-11 shrink-0 place-items-center rounded-xl bg-card border ${theme.idleBorder} ${theme.iconColor} shadow-xs`}
                  >
                    <Icon className="size-6 animate-icon-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${theme.accentDot}`} />
                      <h3 className="font-display text-base font-extrabold text-foreground sm:text-lg">
                        {activeCategoryObj.name}
                      </h3>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                      {activeCategoryObj.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="rounded-full bg-card/90 border border-border px-3.5 py-1 text-xs font-bold text-foreground shadow-xs">
                    {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}{" "}
                    available
                  </span>
                </div>
              </div>
            );
          })()}

        {/* Results Bar */}
        <div className="mt-6 flex items-center justify-between text-xs font-medium text-muted-foreground sm:text-sm">
          <span>
            Showing <strong className="font-bold text-foreground">{filteredItems.length}</strong>{" "}
            delicious items
            {dietaryFilter !== "all" &&
              ` in ${dietaryFilter === "veg" ? "100% Pure Veg" : "Non-Veg"}`}
            {selectedCategory !== "all" && ` · ${activeCategoryObj?.name}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-leaf" /> Veg
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-red-600" /> Non-Veg
            </span>
          </span>
        </div>

        {/* ============================================================ */}
        {/* DISH CARDS GRID */}
        {/* ============================================================ */}
        {filteredItems.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <EnhancedMenuItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center bg-card">
            <Utensils className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">
              No dishes matched your filter
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search terms, changing the category, or switching between Veg &
              Non-Veg.
            </p>
            <Button onClick={clearFilters} variant="outline" className="mt-5">
              Reset Filters & Show All
            </Button>
          </div>
        )}

        {/* ============================================================ */}
        {/* GOOGLE MAPS & LIVE VISITING BANNER */}
        {/* ============================================================ */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground via-foreground/95 to-primary/90 text-primary-foreground shadow-2xl">
          <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_.8fr] md:p-12 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/20 px-3.5 py-1 text-xs font-bold uppercase text-secondary">
                <MapPin className="size-3.5" />
                Live Business Profile & Menu Photos
              </div>
              <h3 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl text-balance">
                Planning Your Stop in Brahmpur? Check Live Photos on Google Maps
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                View real customer photos of our clay tandoor cooking, indoor family dining halls,
                and highway seating directly on Google Maps before you arrive.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1 font-bold text-secondary">
                  <Star className="size-4 fill-secondary" />
                  3.9 Rating (650+ Google Reviews)
                </span>
                <span>•</span>
                <span>Nangal–Chandigarh Road, Brahmpur</span>
                <span>•</span>
                <span>Open 7:00 AM – 12:00 AM</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:items-end">
              <Button
                asChild
                size="lg"
                className="h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md font-bold text-sm"
              >
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <MapPin className="size-4" />
                  <span>Open in Google Maps</span>
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground hover:text-foreground text-sm font-semibold"
              >
                <a
                  href={restaurant.phoneHref}
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Phone className="size-4" />
                  <span>Call {restaurant.phoneDisplay}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DishTheme {
  id: string;
  name: string;
  cardBg: string;
  borderColor: string;
  hoverBorder: string;
  hoverShadow: string;
  topRibbon: string;
  priceBadge: string;
  categoryTag: string;
  titleHover: string;
  callBtn: string;
  badgeStyle: string;
  cornerGlow: string;
}

const dishThemes: Record<string, DishTheme> = {
  // 1. Saffron Amber (Murgh Makhani / Butter Chicken / Shahi Gravy)
  "saffron-amber": {
    id: "saffron-amber",
    name: "Saffron Amber",
    cardBg:
      "bg-gradient-to-br from-amber-500/12 via-orange-500/8 to-amber-500/[0.03] dark:from-amber-950/45 dark:via-stone-900/60 dark:to-orange-950/25",
    borderColor: "border-amber-400/60 dark:border-amber-600/50",
    hoverBorder: "hover:border-amber-500 dark:hover:border-amber-400",
    hoverShadow: "hover:shadow-xl hover:shadow-amber-500/25",
    topRibbon: "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400",
    priceBadge:
      "bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-black shadow-sm border border-amber-400/50",
    categoryTag: "bg-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-500/35",
    titleHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    callBtn:
      "bg-amber-500/15 text-amber-900 dark:text-amber-200 hover:bg-amber-500 hover:text-stone-950 border border-amber-400/40",
    badgeStyle:
      "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700",
    cornerGlow: "from-amber-400/25 to-transparent",
  },
  // 2. Fiery Ruby Red (Dhaba Kadhai / Kolhapuri / Spicy Gravies)
  "ruby-red": {
    id: "ruby-red",
    name: "Fiery Ruby Red",
    cardBg:
      "bg-gradient-to-br from-red-500/12 via-rose-500/8 to-red-500/[0.03] dark:from-red-950/45 dark:via-stone-900/60 dark:to-rose-950/25",
    borderColor: "border-red-400/60 dark:border-red-600/50",
    hoverBorder: "hover:border-red-500 dark:hover:border-red-400",
    hoverShadow: "hover:shadow-xl hover:shadow-red-500/25",
    topRibbon: "bg-gradient-to-r from-red-600 via-rose-600 to-orange-500",
    priceBadge:
      "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-sm border border-red-500/50",
    categoryTag: "bg-red-500/20 text-red-950 dark:text-red-200 border border-red-500/35",
    titleHover: "group-hover:text-red-600 dark:group-hover:text-red-400",
    callBtn:
      "bg-red-500/15 text-red-900 dark:text-red-200 hover:bg-red-600 hover:text-white border border-red-400/40",
    badgeStyle:
      "bg-red-100 text-red-950 border-red-300 dark:bg-red-950/70 dark:text-red-200 dark:border-red-700",
    cornerGlow: "from-red-400/25 to-transparent",
  },
  // 3. Spiced Masala Orange (Tari Wala Highway / Desi Curries)
  "spiced-orange": {
    id: "spiced-orange",
    name: "Spiced Masala Orange",
    cardBg:
      "bg-gradient-to-br from-orange-500/12 via-amber-500/8 to-orange-500/[0.03] dark:from-orange-950/45 dark:via-stone-900/60 dark:to-amber-950/25",
    borderColor: "border-orange-400/60 dark:border-orange-600/50",
    hoverBorder: "hover:border-orange-500 dark:hover:border-orange-400",
    hoverShadow: "hover:shadow-xl hover:shadow-orange-500/25",
    topRibbon: "bg-gradient-to-r from-orange-500 via-amber-500 to-red-500",
    priceBadge:
      "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-600 text-white font-black shadow-sm border border-orange-400/50",
    categoryTag:
      "bg-orange-500/20 text-orange-950 dark:text-orange-200 border border-orange-500/35",
    titleHover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    callBtn:
      "bg-orange-500/15 text-orange-900 dark:text-orange-200 hover:bg-orange-600 hover:text-white border border-orange-400/40",
    badgeStyle:
      "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-700",
    cornerGlow: "from-orange-400/25 to-transparent",
  },
  // 4. Charred Tikka Coral (Tikka Masala / Smoky Tandoor)
  "coral-rose": {
    id: "coral-rose",
    name: "Charred Tikka Coral",
    cardBg:
      "bg-gradient-to-br from-rose-500/12 via-pink-500/8 to-rose-500/[0.03] dark:from-rose-950/45 dark:via-stone-900/60 dark:to-pink-950/25",
    borderColor: "border-rose-400/60 dark:border-rose-600/50",
    hoverBorder: "hover:border-rose-500 dark:hover:border-rose-400",
    hoverShadow: "hover:shadow-xl hover:shadow-rose-500/25",
    topRibbon: "bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400",
    priceBadge:
      "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-black shadow-sm border border-rose-400/50",
    categoryTag: "bg-rose-500/20 text-rose-950 dark:text-rose-200 border border-rose-500/35",
    titleHover: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    callBtn:
      "bg-rose-500/15 text-rose-900 dark:text-rose-200 hover:bg-rose-600 hover:text-white border border-rose-400/40",
    badgeStyle:
      "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-700",
    cornerGlow: "from-rose-400/25 to-transparent",
  },
  // 5. Royal Shahi Maroon (Murgh Rara / Mutton Rogan Josh / Keema)
  "royal-maroon": {
    id: "royal-maroon",
    name: "Royal Shahi Maroon",
    cardBg:
      "bg-gradient-to-br from-red-900/12 via-amber-800/8 to-stone-800/[0.03] dark:from-red-950/50 dark:via-stone-900/60 dark:to-amber-950/30",
    borderColor: "border-red-700/50 dark:border-red-800/60",
    hoverBorder: "hover:border-red-700 dark:hover:border-red-500",
    hoverShadow: "hover:shadow-xl hover:shadow-red-900/30",
    topRibbon: "bg-gradient-to-r from-red-800 via-amber-700 to-stone-800",
    priceBadge:
      "bg-gradient-to-r from-red-800 via-red-900 to-stone-900 text-amber-200 font-black shadow-sm border border-red-700/50",
    categoryTag: "bg-red-800/20 text-red-950 dark:text-red-200 border border-red-700/35",
    titleHover: "group-hover:text-red-800 dark:group-hover:text-red-400",
    callBtn:
      "bg-red-800/15 text-red-950 dark:text-red-200 hover:bg-red-800 hover:text-white border border-red-700/40",
    badgeStyle:
      "bg-red-100 text-red-950 border-red-400 dark:bg-red-950/70 dark:text-red-200 dark:border-red-700",
    cornerGlow: "from-red-800/25 to-transparent",
  },
  // 6. Clay Tandoor Flame (Tandoori Murgh / Kebabs / Charcoal Grill)
  "sunset-flame": {
    id: "sunset-flame",
    name: "Clay Tandoor Flame",
    cardBg:
      "bg-gradient-to-br from-orange-600/12 via-red-600/8 to-amber-500/[0.03] dark:from-orange-950/50 dark:via-stone-900/60 dark:to-red-950/30",
    borderColor: "border-orange-500/60 dark:border-orange-600/50",
    hoverBorder: "hover:border-orange-600 dark:hover:border-orange-400",
    hoverShadow: "hover:shadow-xl hover:shadow-orange-600/30",
    topRibbon: "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600",
    priceBadge:
      "bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-black shadow-sm border border-orange-500/50",
    categoryTag:
      "bg-orange-600/20 text-orange-950 dark:text-orange-200 border border-orange-500/35",
    titleHover: "group-hover:text-orange-700 dark:group-hover:text-orange-400",
    callBtn:
      "bg-orange-600/15 text-orange-950 dark:text-orange-200 hover:bg-orange-600 hover:text-white border border-orange-500/40",
    badgeStyle:
      "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-700",
    cornerGlow: "from-orange-500/25 to-transparent",
  },
  // 7. Malai Emerald & Mint (Paneer Butter / Palak / Fresh Saag)
  "mint-emerald": {
    id: "mint-emerald",
    name: "Malai Emerald & Mint",
    cardBg:
      "bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-emerald-500/[0.03] dark:from-emerald-950/45 dark:via-stone-900/60 dark:to-teal-950/25",
    borderColor: "border-emerald-400/60 dark:border-emerald-600/50",
    hoverBorder: "hover:border-emerald-500 dark:hover:border-emerald-400",
    hoverShadow: "hover:shadow-xl hover:shadow-emerald-500/25",
    topRibbon: "bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500",
    priceBadge:
      "bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white font-black shadow-sm border border-emerald-400/50",
    categoryTag:
      "bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 border border-emerald-500/35",
    titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    callBtn:
      "bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white border border-emerald-400/40",
    badgeStyle:
      "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700",
    cornerGlow: "from-emerald-400/25 to-transparent",
  },
  // 8. Maharaja Purple (Royal Thali / Shahi Biryani / Royal Platters)
  "royal-purple": {
    id: "royal-purple",
    name: "Maharaja Purple",
    cardBg:
      "bg-gradient-to-br from-purple-500/12 via-violet-500/8 to-amber-500/[0.03] dark:from-purple-950/45 dark:via-stone-900/60 dark:to-violet-950/25",
    borderColor: "border-purple-400/60 dark:border-purple-600/50",
    hoverBorder: "hover:border-purple-500 dark:hover:border-purple-400",
    hoverShadow: "hover:shadow-xl hover:shadow-purple-500/25",
    topRibbon: "bg-gradient-to-r from-purple-600 via-violet-600 to-amber-500",
    priceBadge:
      "bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white font-black shadow-sm border border-purple-400/50",
    categoryTag:
      "bg-purple-500/20 text-purple-950 dark:text-purple-200 border border-purple-500/35",
    titleHover: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    callBtn:
      "bg-purple-500/15 text-purple-900 dark:text-purple-200 hover:bg-purple-600 hover:text-white border border-purple-400/40",
    badgeStyle:
      "bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-700",
    cornerGlow: "from-purple-400/25 to-transparent",
  },
  // 9. Crisp Butter Yellow (Tandoori Paranthas / Desi Ghee Dals)
  "butter-yellow": {
    id: "butter-yellow",
    name: "Crisp Butter Yellow",
    cardBg:
      "bg-gradient-to-br from-yellow-500/15 via-amber-500/8 to-yellow-500/[0.03] dark:from-yellow-950/45 dark:via-stone-900/60 dark:to-amber-950/25",
    borderColor: "border-yellow-400/70 dark:border-yellow-600/50",
    hoverBorder: "hover:border-yellow-500 dark:hover:border-yellow-400",
    hoverShadow: "hover:shadow-xl hover:shadow-yellow-500/25",
    topRibbon: "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600",
    priceBadge:
      "bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-stone-950 font-black shadow-sm border border-yellow-400/60",
    categoryTag:
      "bg-yellow-500/20 text-yellow-950 dark:text-yellow-200 border border-yellow-500/35",
    titleHover: "group-hover:text-yellow-700 dark:group-hover:text-yellow-400",
    callBtn:
      "bg-yellow-500/15 text-yellow-950 dark:text-yellow-200 hover:bg-yellow-500 hover:text-stone-950 border border-yellow-400/40",
    badgeStyle:
      "bg-yellow-100 text-yellow-950 border-yellow-300 dark:bg-yellow-950/70 dark:text-yellow-200 dark:border-yellow-700",
    cornerGlow: "from-yellow-400/25 to-transparent",
  },
  // 10. Desi Chinese Wok (Chilli Chicken / Manchurian / Hakka)
  "wok-fuchsia": {
    id: "wok-fuchsia",
    name: "Desi Chinese Wok",
    cardBg:
      "bg-gradient-to-br from-fuchsia-500/12 via-rose-500/8 to-fuchsia-500/[0.03] dark:from-fuchsia-950/45 dark:via-stone-900/60 dark:to-rose-950/25",
    borderColor: "border-fuchsia-400/60 dark:border-fuchsia-600/50",
    hoverBorder: "hover:border-fuchsia-500 dark:hover:border-fuchsia-400",
    hoverShadow: "hover:shadow-xl hover:shadow-fuchsia-500/25",
    topRibbon: "bg-gradient-to-r from-rose-600 via-fuchsia-600 to-red-600",
    priceBadge:
      "bg-gradient-to-r from-rose-600 via-fuchsia-600 to-pink-600 text-white font-black shadow-sm border border-fuchsia-400/50",
    categoryTag:
      "bg-fuchsia-500/20 text-fuchsia-950 dark:text-fuchsia-200 border border-fuchsia-500/35",
    titleHover: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
    callBtn:
      "bg-fuchsia-500/15 text-fuchsia-950 dark:text-fuchsia-200 hover:bg-fuchsia-600 hover:text-white border border-fuchsia-400/40",
    badgeStyle:
      "bg-fuchsia-100 text-fuchsia-950 border-fuchsia-300 dark:bg-fuchsia-950/70 dark:text-fuchsia-200 dark:border-fuchsia-700",
    cornerGlow: "from-fuchsia-400/25 to-transparent",
  },
  // 11. Refreshing Lassi Teal (Cold Beverages / Sharbat / Jaljeera)
  "ocean-teal": {
    id: "ocean-teal",
    name: "Refreshing Lassi Teal",
    cardBg:
      "bg-gradient-to-br from-teal-500/12 via-cyan-500/8 to-teal-500/[0.03] dark:from-teal-950/45 dark:via-stone-900/60 dark:to-cyan-950/25",
    borderColor: "border-teal-400/60 dark:border-teal-600/50",
    hoverBorder: "hover:border-teal-500 dark:hover:border-teal-400",
    hoverShadow: "hover:shadow-xl hover:shadow-teal-500/25",
    topRibbon: "bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500",
    priceBadge:
      "bg-gradient-to-r from-teal-600 via-cyan-600 to-sky-600 text-white font-black shadow-sm border border-teal-400/50",
    categoryTag: "bg-teal-500/20 text-teal-950 dark:text-teal-200 border border-teal-500/35",
    titleHover: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
    callBtn:
      "bg-teal-500/15 text-teal-900 dark:text-teal-200 hover:bg-teal-600 hover:text-white border border-teal-400/40",
    badgeStyle:
      "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700",
    cornerGlow: "from-teal-400/25 to-transparent",
  },
  // 12. Rose & Rabri Sweet Pink (Gulab Jamun / Kheer / Kulfi)
  "rose-pink": {
    id: "rose-pink",
    name: "Rose & Rabri Sweet Pink",
    cardBg:
      "bg-gradient-to-br from-pink-500/12 via-rose-500/8 to-pink-500/[0.03] dark:from-pink-950/45 dark:via-stone-900/60 dark:to-rose-950/25",
    borderColor: "border-pink-400/60 dark:border-pink-600/50",
    hoverBorder: "hover:border-pink-500 dark:hover:border-pink-400",
    hoverShadow: "hover:shadow-xl hover:shadow-pink-500/25",
    topRibbon: "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500",
    priceBadge:
      "bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 text-white font-black shadow-sm border border-pink-400/50",
    categoryTag: "bg-pink-500/20 text-pink-950 dark:text-pink-200 border border-pink-500/35",
    titleHover: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
    callBtn:
      "bg-pink-500/15 text-pink-900 dark:text-pink-200 hover:bg-pink-600 hover:text-white border border-pink-400/40",
    badgeStyle:
      "bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950/70 dark:text-pink-200 dark:border-pink-700",
    cornerGlow: "from-pink-400/25 to-transparent",
  },
};

const categoryPaletteOrder: Record<string, string[]> = {
  "non-veg-chicken": [
    "saffron-amber",
    "ruby-red",
    "spiced-orange",
    "coral-rose",
    "royal-maroon",
    "sunset-flame",
  ],
  "non-veg-tandoori": [
    "sunset-flame",
    "ruby-red",
    "spiced-orange",
    "coral-rose",
    "saffron-amber",
    "royal-maroon",
  ],
  "non-veg-mutton": ["royal-maroon", "ruby-red", "spiced-orange", "coral-rose", "saffron-amber"],
  "non-veg-egg": ["spiced-orange", "saffron-amber", "butter-yellow", "coral-rose", "ruby-red"],
  breakfast: ["butter-yellow", "saffron-amber", "spiced-orange", "mint-emerald", "royal-maroon"],
  paneer: ["mint-emerald", "saffron-amber", "spiced-orange", "butter-yellow", "coral-rose"],
  "dal-curry": ["spiced-orange", "saffron-amber", "mint-emerald", "butter-yellow", "royal-maroon"],
  breads: ["royal-maroon", "saffron-amber", "butter-yellow", "spiced-orange"],
  thali: ["royal-purple", "saffron-amber", "mint-emerald", "ruby-red", "spiced-orange"],
  snacks: ["butter-yellow", "spiced-orange", "mint-emerald", "ruby-red", "coral-rose"],
  chinese: ["wok-fuchsia", "ruby-red", "coral-rose", "spiced-orange"],
  rice: ["saffron-amber", "royal-purple", "spiced-orange", "mint-emerald"],
  beverages: ["ocean-teal", "mint-emerald", "saffron-amber", "rose-pink"],
  desserts: ["rose-pink", "royal-purple", "saffron-amber", "butter-yellow"],
  all: [
    "saffron-amber",
    "ruby-red",
    "spiced-orange",
    "coral-rose",
    "royal-maroon",
    "sunset-flame",
    "mint-emerald",
    "royal-purple",
    "butter-yellow",
    "wok-fuchsia",
    "ocean-teal",
    "rose-pink",
  ],
};

function EnhancedMenuItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const isNonVeg = item.dietary === "non-veg";
  const palette = categoryPaletteOrder[item.categoryId] ?? categoryPaletteOrder["all"] ?? [];
  const themeKey =
    (palette.length > 0 ? palette[index % palette.length] : undefined) ?? "saffron-amber";
  const defaultTheme = dishThemes["saffron-amber"]!;
  const theme = dishThemes[themeKey] ?? defaultTheme;

  return (
    <article
      className={`lift-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${theme.borderColor} ${theme.hoverBorder} ${theme.cardBg} p-6 shadow-sm transition-all duration-300 ${theme.hoverShadow}`}
    >
      {/* Top colorful accent ribbon */}
      <div className={`absolute top-0 inset-x-0 h-1.5 ${theme.topRibbon}`} />

      {/* Subtle ambient corner radial glow */}
      <div
        className={`pointer-events-none absolute -top-12 -right-12 size-36 rounded-full bg-gradient-to-br ${theme.cornerGlow} blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60`}
      />

      {/* Top row: veg/non-veg indicator, spice level & badges */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          {/* FSSAI Standard Dietary Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`flex size-4.5 items-center justify-center rounded border ${
                isNonVeg
                  ? "border-red-600 bg-red-50 dark:bg-red-950/50"
                  : "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50"
              }`}
              title={isNonVeg ? "Non-Vegetarian" : "100% Vegetarian"}
              aria-label={isNonVeg ? "Non-Vegetarian" : "Vegetarian"}
            >
              <div
                className={`size-2 rounded-full ${isNonVeg ? "bg-red-600" : "bg-emerald-600"}`}
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider ${
                isNonVeg
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {isNonVeg ? "Non-Veg" : "Pure Veg"}
            </span>
          </div>

          {/* Badges and Spice Meter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {item.badge && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${theme.badgeStyle} shadow-2xs`}
              >
                {item.badge}
              </span>
            )}
            {item.isSignature && (
              <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground shadow-2xs">
                ★ Signature
              </span>
            )}
            {item.isBestseller && !item.badge && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-400/60 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:text-amber-200">
                <Star className="size-2.5 fill-amber-500 text-amber-500" />
                Bestseller
              </span>
            )}
            {/* Spice meter */}
            {item.spiceLevel && (
              <span
                className="text-[11px] select-none"
                title={`Spice Level: ${item.spiceLevel === 3 ? "Spicy / Hot" : item.spiceLevel === 2 ? "Medium Spiced" : "Mild"}`}
              >
                {item.spiceLevel === 3 ? "🌶️🌶️" : item.spiceLevel === 2 ? "🌶️" : "🌿"}
              </span>
            )}
          </div>
        </div>

        {/* Title and Price */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <h4
            className={`font-display text-lg font-bold leading-snug text-foreground transition-colors ${theme.titleHover}`}
          >
            {item.name}
          </h4>
          <span
            className={`shrink-0 rounded-xl px-2.5 py-1 font-mono text-base font-black transition-transform duration-200 group-hover:scale-105 ${theme.priceBadge}`}
          >
            ₹{item.price}
          </span>
        </div>

        {/* Category tag */}
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${theme.categoryTag}`}
          >
            {item.category}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3 sm:text-sm">
          {item.description}
        </p>
      </div>

      {/* Card Footer: Portion & Quick Order */}
      <div className="relative z-10 mt-5 border-t border-border/70 pt-3 flex items-center justify-between gap-2 text-xs">
        <span
          className="text-muted-foreground font-medium truncate text-[11px] sm:text-xs"
          title={item.portion}
        >
          {item.portion || "Standard serving"}
        </span>
        <a
          href={restaurant.phoneHref}
          onClick={() =>
            activityTracker.trackCallClick({
              dishName: item.name,
              dishPrice: item.price,
              dishCategory: item.category,
              source: "Menu Dish Card",
            })
          }
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 font-bold text-xs transition-all duration-200 ${theme.callBtn}`}
          title={`Call to order ${item.name}`}
        >
          <Phone className="size-3" />
          <span>Call Order</span>
        </a>
      </div>
    </article>
  );
}
