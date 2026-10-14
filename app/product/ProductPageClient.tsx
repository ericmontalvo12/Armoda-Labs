"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Star, Shield, FlaskConical, FileText, Lock, Zap, TrendingUp, Target, Layers, X, Minus, Plus } from "lucide-react";
import { getBundleTotal, getRegularBundleTotal, getPricePerBottle, getRegularPricePerBottle, isSaleActive, SUBSCRIPTION_PRICE } from "@/lib/sale";
import { SaleCountdown } from "@/components/SaleCountdown";
import { MAX_REVIEW_PHOTO_BYTES } from "@/lib/reviews-config";
import { trackFbEvent } from "@/lib/fbpixel";
import { LazyCheckoutModal } from "@/components/LazyCheckoutModal";

const SALE_ACTIVE = isSaleActive();

const REVIEW_SUBMISSION_ENABLED = true;

interface BundleOption {
  id: string;
  qty: number;
  label: string;
  pricePerBottle: number;
  total: number;
  regularTotal: number;
  badge: string | null;
  perks: string[];
  isSubscription: boolean;
  priceSuffix: string;
}

const BUNDLES: BundleOption[] = [
  {
    id: "subscribe",
    qty: 1,
    label: "Monthly Subscription",
    pricePerBottle: SUBSCRIPTION_PRICE,
    total: SUBSCRIPTION_PRICE,
    regularTotal: getRegularBundleTotal(1),
    badge: "MOST POPULAR",
    perks: ["Cancel anytime", "Free shipping", "30-day guarantee"],
    isSubscription: true,
    priceSuffix: "/mo",
  },
  {
    id: "bundle-3",
    qty: 3,
    label: "90 Day Supply",
    pricePerBottle: getPricePerBottle(3),
    total: getBundleTotal(3),
    regularTotal: getRegularBundleTotal(3),
    badge: "BEST RESULTS",
    perks: ["Biggest savings", "Free shipping", "30-day guarantee"],
    isSubscription: false,
    priceSuffix: "",
  },
  {
    id: "one-time",
    qty: 1,
    label: "30 Day Supply",
    pricePerBottle: getPricePerBottle(1),
    total: getBundleTotal(1),
    regularTotal: getRegularBundleTotal(1),
    badge: null,
    perks: ["Free shipping", "30-day guarantee"],
    isSubscription: false,
    priceSuffix: "",
  },
];

const corePrinciples = [
  {
    title: "Foundational nutrients enable natural production",
    description: "Zinc, magnesium, vitamin D3, and fenugreek provide the raw materials and enzymatic support testosterone synthesis requires.",
  },
  {
    title: "Stress balance restores hormonal function",
    description: "Ashwagandha and Tongkat Ali lower cortisol, removing a barrier that suppresses natural testosterone production.",
  },
  {
    title: "Free testosterone availability",
    description: "Boron reduces SHBG to make more of your existing testosterone available for use.",
  },
];

const galleryImages = [
  { src: "/product-bottle.png", alt: "Peak Performance Bottle" },
  { src: "/supplement-facts-new.png", alt: "Supplement Facts" },
  { src: "/how-to-use.jpg", alt: "How to Use" },
];


const ingredients = [
  {
    name: "Vitamin D3",
    form: "Cholecalciferol",
    dosage: "3,000 IU",
    image: "/vitamin-d3.png",
    shortDesc: "In a 12-month RCT (Pilz et al., 2011), men with low vitamin D who supplemented with 3,332 IU/day saw significant increases in total, free, and bioactive testosterone vs. placebo.",
    fullDesc: "A 12-month randomized controlled trial found that men supplementing with vitamin D experienced a significant increase in total testosterone, free testosterone, and bioactive testosterone compared to placebo. Most men training indoors are deficient without knowing it.",
    benefits: [
      "Increased total testosterone in clinical trial (Pilz et al., 2011)",
      "Supports free and bioactive testosterone levels",
      "Corrects a deficiency linked to low T",
    ],
    research: [
      { title: "Effect of vitamin D supplementation on testosterone levels in men (Pilz et al., 2011)", url: "https://www.thieme-connect.de/products/ejournals/abstract/10.1055/s-0030-1269854" },
    ],
  },
  {
    name: "Zinc",
    form: "Citrate",
    dosage: "20 mg",
    image: "/zinc.png",
    shortDesc: "In a study by Prasad et al. (1996), zinc-deficient men had significantly lower testosterone, and supplementation restored levels over 6 months.",
    fullDesc: "Zinc is required for testosterone production at the cellular level. The study by Prasad et al. showed that zinc-deficient men have significantly lower testosterone, and supplementation restores levels. It is one of the most well-established testosterone support nutrients.",
    benefits: [
      "Required for testosterone synthesis",
      "Restores T levels in deficient men (Prasad et al., 1996)",
      "One of the most studied T-support minerals",
    ],
    research: [
      { title: "Zinc status and serum testosterone levels in adult males (Prasad et al., 1996)", url: "https://pubmed.ncbi.nlm.nih.gov/8875519/" },
    ],
  },
  {
    name: "Boron",
    form: "Citrate",
    dosage: "9 mg",
    image: "/boron.png",
    shortDesc: "In a 2011 trial (Naghii et al.), 10mg/day of boron increased free testosterone and reduced SHBG in healthy men within 7 days.",
    fullDesc: "The study by Naghii et al. found that 10mg of boron daily significantly increased free testosterone and DHT while decreasing estradiol and SHBG after only 7 days. Boron may help make more existing testosterone available for the body to use.",
    benefits: [
      "Increased free testosterone (Naghii et al., 2011)",
      "Reduces SHBG (testosterone-binding protein)",
      "Significant changes observed within 7 days (Naghii et al., 2011)",
    ],
    research: [
      { title: "Comparative effects of daily boron supplementation on plasma steroid hormones (Naghii et al., 2011)", url: "https://pubmed.ncbi.nlm.nih.gov/21129941/" },
    ],
  },
  {
    name: "Ashwagandha",
    form: "KSM-66 Root Extract",
    dosage: "500 mg",
    image: "/ashwagandha.png",
    shortDesc: "In a 2019 RCT (Lopresti et al.), 600mg/day of KSM-66 was associated with a 14–17% increase in testosterone in overweight men aged 40–70.",
    fullDesc: "The study by Lopresti et al. showed significant testosterone increases (14–17%) alongside cortisol reductions with KSM-66 supplementation. High cortisol suppresses testosterone production — by managing stress hormones, ashwagandha may indirectly support the body’s natural T production.",
    benefits: [
      "14–17% testosterone increase (Lopresti et al., 2019)",
      "Reduces cortisol (which suppresses T)",
      "Dual-action: direct and indirect T support",
    ],
    research: [
      { title: "Ashwagandha supplementation and testosterone in overweight men (Lopresti et al., 2019)", url: "https://pubmed.ncbi.nlm.nih.gov/31517876/" },
    ],
  },
  {
    name: "Tongkat Ali",
    form: "200:1 Eurycomanone",
    dosage: "300 mg",
    image: "/tongkat-ali.png",
    shortDesc: "In a 4-week RCT (Tambi et al., 2012), 200mg/day of Tongkat Ali extract increased testosterone by 37% in moderately stressed men.",
    fullDesc: "In the study by Tambi et al., Tongkat Ali increased testosterone by 37% while reducing cortisol by 16% over 4 weeks. It is believed to work by stimulating the release of free testosterone from SHBG and supporting the hypothalamic-pituitary-gonadal axis.",
    benefits: [
      "37% testosterone increase in 4-week RCT (Tambi et al., 2012)",
      "16% cortisol reduction (Tambi et al., 2012)",
      "Releases bound testosterone from SHBG",
    ],
    research: [
      { title: "Eurycoma longifolia and androgenic status in moderately stressed males (Tambi et al., 2012)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3669033/" },
    ],
  },
  {
    name: "Fenugreek",
    form: "50% Saponins Extract",
    dosage: "500 mg",
    image: "/fenugreek.png",
    shortDesc: "A 2020 meta-analysis (Mansoori et al.) of clinical trials found that fenugreek extract supplementation significantly increased total testosterone levels in men.",
    fullDesc: "The meta-analysis by Mansoori et al. reviewed multiple clinical trials and found that fenugreek extract significantly increases total testosterone levels in men. It is thought to work by inhibiting enzymes that convert testosterone to estrogen, keeping more T in circulation.",
    benefits: [
      "Significant T increase across multiple studies (Mansoori et al., 2020)",
      "May inhibit testosterone-to-estrogen conversion",
      "Meta-analysis confirmed effectiveness",
    ],
    research: [
      { title: "Effect of fenugreek extract supplement on testosterone levels in male: A meta-analysis (Mansoori et al., 2020)", url: "https://pubmed.ncbi.nlm.nih.gov/32048383/" },
    ],
  },
  {
    name: "Magnesium",
    form: "Bisglycinate",
    dosage: "28.6 mg",
    image: "/magnesium.png",
    shortDesc: "In a study by Cinar et al. (2011), magnesium supplementation was associated with higher total and free testosterone in both athletes and sedentary men.",
    fullDesc: "Research by Cinar et al. shows a strong positive correlation between magnesium levels and testosterone in men. Athletes lose magnesium through sweat, and the study confirms that supplementation supports both total and free testosterone, especially in active men.",
    benefits: [
      "Positively correlated with testosterone levels (Cinar et al., 2011)",
      "Supports both total and free testosterone",
      "Essential mineral depleted by training",
    ],
    research: [
      { title: "Effects of magnesium supplementation on testosterone levels (Cinar et al., 2011)", url: "https://pubmed.ncbi.nlm.nih.gov/20352370/" },
    ],
  },
];

const timeline = [
  { week: "Week 1-2", title: "Foundation Building", description: "Ingredients accumulate in your system", icon: Layers },
  { week: "Week 2-4", title: "Energy Stabilizes", description: "More consistent energy through the day", icon: Zap },
  { week: "Week 4-6", title: "Recovery Improves", description: "Better training recovery and mental clarity", icon: TrendingUp },
  { week: "Week 6-8", title: "Full Effect", description: "Libido returns, body composition shifts", icon: Target },
];

const comparisonRows = [
  { typical: "Hidden dosages", peak: "Full label transparency" },
  { typical: "Underdosed ingredients", peak: "Human-study dosing" },
  { typical: "Hype-driven ingredient selection", peak: "Purpose-built formulation" },
  { typical: "Short-term marketing claims", peak: "Support for energy, recovery, and drive" },
];

// =============================================================================
// ORIGINAL REVIEWS DATA (uncomment after launch)
// =============================================================================
/*
const reviews = [
  {
    name: "Mike T.",
    age: 34,
    rating: 5,
    title: "Finally something that actually works",
    text: "I was skeptical after trying other testosterone boosters. But after 6 weeks, my energy is noticeably better and recovery from the gym is way faster. This isn't a miracle pill - it's a slow build that actually delivers.",
    verified: true,
  },
  {
    name: "Jason R.",
    age: 42,
    rating: 5,
    title: "Wish I found this sooner",
    text: "At 42, I was feeling sluggish and my drive was gone. Started this formula and by week 4, I felt like myself again. The research-backed dosing makes a real difference.",
    verified: true,
  },
  {
    name: "David K.",
    age: 29,
    rating: 5,
    title: "Solid formula, no BS",
    text: "I appreciate the transparency - no proprietary blends, just research-backed doses. Sleep improved first, then energy, then everything else followed. Exactly as described.",
    verified: true,
  },
  {
    name: "Chris M.",
    age: 38,
    rating: 5,
    title: "Takes time but worth it",
    text: "Didn't feel anything for the first 2 weeks. Almost gave up. But by week 5, the difference was clear. More focus, better workouts, and my wife noticed too. Patience pays off.",
    verified: true,
  },
  {
    name: "Marcus L.",
    age: 31,
    rating: 5,
    title: "Did my research - this one checks out",
    text: "I spent weeks comparing formulas before buying. Most testosterone boosters are underdosed garbage. This one actually has the doses that match the studies. Three months in and I'm recovering faster and hitting PRs again.",
    verified: true,
  },
  {
    name: "Tony B.",
    age: 47,
    rating: 5,
    title: "Feeling like I did in my 30s",
    text: "At 47, I figured feeling tired all the time was just part of getting older. Gave this a shot and after about 6 weeks, my energy is back and I'm not dragging through the afternoon anymore. Solid product.",
    verified: true,
  },
  {
    name: "Ryan S.",
    age: 36,
    rating: 5,
    title: "Recovery is night and day",
    text: "I train 5x a week and was constantly sore and beaten down. Started Peak Performance and within a month my recovery improved significantly. I can actually push hard without feeling wrecked the next day.",
    verified: true,
  },
  {
    name: "Andrew P.",
    age: 33,
    rating: 4,
    title: "Good results, takes consistency",
    text: "Works as advertised. Took about 5 weeks before I noticed real changes. Energy is better, mood is more stable, and workouts feel stronger. Consistency pays off.",
    verified: true,
  },
  {
    name: "Kevin H.",
    age: 40,
    rating: 5,
    title: "Wife noticed before I did",
    text: "About a month in, my wife asked what I was doing differently. More energy, better mood, and let's just say things improved in other areas too. The transparent label sold me, the results kept me.",
    verified: true,
  },
];
*/


const productSections = [
  {
    title: "Who This Is For",
    content: (
      <div className="space-y-4 text-text-secondary text-left max-w-lg mx-auto">
        <p className="text-sm">This formula was built for men who:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Feel off but aren't broken — energy lower, drive dulled, recovery slower</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Have tried generic boosters and seen nothing change</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Understand that free testosterone availability matters more than total T</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Are ready to commit to consistent daily support</span>
          </li>
        </ul>
        <p className="text-sm text-text-muted pt-2 text-center">
          Designed to support energy, drive, and recovery — the way your body is meant to function.
        </p>
      </div>
    ),
  },
  {
    title: "What to Expect",
    content: (
      <div className="space-y-4 text-text-secondary text-left max-w-lg mx-auto">
        <p className="text-sm">
          Peak Performance is designed for consistent, foundational support.
        </p>
        <p className="text-sm font-medium text-text-primary">Over 4–8 weeks of daily use, most men notice:</p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Energy becomes more stable through the day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Recovery from training improves</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Mental clarity sharpens gradually</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Libido begins to return — not dramatic, but consistent</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Body composition shifts when training and diet support it</span>
          </li>
        </ul>
        <p className="text-sm text-text-muted">These changes are progressive. They compound with consistency.</p>
      </div>
    ),
  },
  {
    title: "How to Use It",
    content: (
      <div className="space-y-4 text-text-secondary text-left max-w-lg mx-auto">
        <div>
          <p className="text-sm">Three capsules, once daily with food.</p>
        </div>
        <div>
          <p className="text-sm">Morning with breakfast or early afternoon. Consistency matters more than exact timing.</p>
        </div>
        <div>
          <p className="text-sm">Minimum 30-day commitment before evaluating response.</p>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4 mt-2">
          <p className="text-sm text-text-muted">
            Do not combine with other testosterone support supplements or hormone-modulating compounds without consulting your doctor.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Full Ingredient List",
    content: (
      <div className="space-y-6 text-text-secondary text-left max-w-lg mx-auto">
        <p className="text-sm text-center">Seven ingredients. Clinical dosing. Fully disclosed. No proprietary blends.</p>
        <div>
          <ul className="space-y-2 text-sm">
            <li>Vitamin D3 (Cholecalciferol) — 3,000 IU</li>
            <li>Magnesium (Bisglycinate) — 28.6 mg</li>
            <li>Zinc (Citrate) — 20 mg</li>
            <li>Fenugreek Seed Extract (50% saponins) — 500 mg</li>
            <li>Ashwagandha Root Extract (KSM-66) — 500 mg</li>
            <li>Tongkat Ali Root Extract (200:1 Eurycomanone) — 300 mg</li>
            <li>Boron (Citrate) — 9 mg</li>
          </ul>
        </div>
        <p className="text-sm text-text-muted text-center">
          Every ingredient is dosed at levels informed by peer-reviewed human research. No proprietary blends. No filler.
        </p>
        <div className="text-center pt-2">
          <button
            onClick={() => document.getElementById('ingredient-library')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
          >
            See the full research breakdown
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    ),
  },
  {
    title: "30-Day Guarantee",
    content: (
      <div className="space-y-4 text-text-secondary text-left max-w-lg mx-auto">
        <p className="text-sm">
          Try Peak Performance for 30 days. If you don't notice a difference, contact us for a full refund.
        </p>
        <p className="text-sm text-text-muted">
          We give you 30 days because that's the window where real, consistent support starts to show.
        </p>
        <div className="pt-2">
          <p className="text-sm font-medium text-text-primary mb-2">Shipping</p>
          <ul className="space-y-1 text-sm">
            <li>• Ships within 1-2 business days</li>
            <li>• Free shipping on every order</li>
            <li>• You'll receive tracking once your order ships</li>
          </ul>
        </div>
      </div>
    ),
  },
];

function AccordionItem({
  title,
  content,
  isOpen,
  onToggle,
}: {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full py-5 sm:py-4 flex items-center justify-center text-center min-h-[56px] sm:min-h-0 gap-3"
      >
        <span className="font-semibold text-text-primary">{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-primary" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 sm:pb-4">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export interface ProductReview {
  id: number;
  name: string;
  rating: number;
  quote: string;
  createdAt: string;
  hasPhoto: boolean;
  verifiedPurchase: boolean;
}

interface ProductPageClientProps {
  initialReviews: ProductReview[];
  initialReviewCount: number;
  initialReviewAverage: number;
  /** True when the server could not read reviews, as opposed to there being none. */
  reviewsUnavailable?: boolean;
}

export default function ProductPageClient({
  initialReviews,
  initialReviewCount,
  initialReviewAverage,
  reviewsUnavailable = false,
}: ProductPageClientProps) {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedBundleId, setSelectedBundleId] = useState("subscribe");
  const [oneTimeQty, setOneTimeQty] = useState(1);
  const { addToCart, customerEmail } = useCart();

  const getActiveBundle = (): BundleOption => {
    const bundle = BUNDLES.find((b) => b.id === selectedBundleId)!;
    if (bundle.id === "one-time") {
      const perBottle = getPricePerBottle(oneTimeQty);
      const regularPerBottle = getRegularPricePerBottle(oneTimeQty);
      return {
        ...bundle,
        qty: oneTimeQty,
        total: parseFloat((perBottle * oneTimeQty).toFixed(2)),
        regularTotal: parseFloat((regularPerBottle * oneTimeQty).toFixed(2)),
        pricePerBottle: perBottle,
      };
    }
    return bundle;
  };
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPromoId, setCheckoutPromoId] = useState<string | undefined>();
  const [checkoutItems, setCheckoutItems] = useState<
    { name: string; price: number; quantity: number; image?: string; isSubscription?: boolean }[]
  >([]);

  const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(0);

  const handleIngredientSelect = (index: number) => {
    setSelectedIngredientIndex(index);
  };

  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [reviewAverage, setReviewAverage] = useState(initialReviewAverage);

  const [reviewName, setReviewName] = useState("");
  const [reviewEmail, setReviewEmail] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState<File | null>(null);
  const [reviewPhotoPreview, setReviewPhotoPreview] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleReviewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReviewError("");
    if (!file) {
      setReviewPhoto(null);
      setReviewPhotoPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setReviewError("Photo must be an image.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_REVIEW_PHOTO_BYTES) {
      setReviewError("Photo must be under 2MB.");
      e.target.value = "";
      return;
    }
    setReviewPhoto(file);
    setReviewPhotoPreview(URL.createObjectURL(file));
  };

  const clearReviewPhoto = () => {
    setReviewPhoto(null);
    setReviewPhotoPreview(null);
  };

  // The list response is CDN-cached for five minutes, so a plain reload after
  // submitting can come back without the new review while the form says it is
  // live. A unique query string is a distinct cache key, so it hits the origin.
  const loadReviews = () => {
    fetch(`/api/reviews?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || []);
        setReviewCount(data.count || 0);
        setReviewAverage(data.average || 0);
      })
      .catch(() => {});
  };

  // ViewContent on the product page. Meta uses this to build product-viewer
  // audiences for retargeting and as the funnel step between PageView and
  // AddToCart; without it there is nothing for catalog/Advantage+ features to
  // key off. Fires once per visit to this page.
  useEffect(() => {
    trackFbEvent("ViewContent", {
      content_name: "Peak Performance",
      content_ids: ["peak-performance"],
      content_type: "product",
      value: getPricePerBottle(1),
      currency: "USD",
    });
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    if (reviewRating < 1) {
      setReviewError("Select a star rating.");
      return;
    }
    setReviewSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", reviewName.trim());
      formData.append("email", reviewEmail.trim());
      formData.append("rating", String(reviewRating));
      formData.append("quote", reviewQuote.trim());
      if (reviewPhoto) formData.append("photo", reviewPhoto);

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || "Something went wrong. Try again.");
      } else {
        setReviewSuccess(true);
        setReviewName("");
        setReviewEmail("");
        setReviewRating(0);
        setReviewQuote("");
        clearReviewPhoto();
        loadReviews();
      }
    } catch {
      setReviewError("Something went wrong. Try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  /**
   * Previously this only added to the cart and flashed "Added to Cart!",
   * leaving the shopper on the page with no route forward - they had to find
   * the header cart icon themselves. That was the largest drop-off in the
   * funnel. Now it opens checkout directly.
   */
  const handleAddToCart = async () => {
    const bundle = getActiveBundle();

    addToCart(
      {
        id: "peak-performance",
        name: "Peak Performance",
        price: bundle.pricePerBottle,
        image: "/product-bottle.png",
      },
      bundle.qty
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);

    setCheckoutItems([
      {
        name: "Peak Performance",
        price: bundle.pricePerBottle,
        quantity: bundle.qty,
        image:
          typeof window !== "undefined"
            ? `${window.location.origin}/product-bottle.png`
            : undefined,
        isSubscription: bundle.isSubscription,
      },
    ]);

    let promotionCodeId: string | undefined;
    try {
      const stored = localStorage.getItem("promoCode");
      if (stored) {
        const res = await fetch("/api/validate-promo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: stored }),
        });
        if (res.ok) promotionCodeId = (await res.json()).promotionCodeId;
      }
    } catch {
      // ignore - checkout still opens
    }
    setCheckoutPromoId(promotionCodeId);

    trackFbEvent("InitiateCheckout", {
      value: bundle.total,
      currency: "USD",
      num_items: bundle.qty,
      content_type: "product",
    });

    setCheckoutOpen(true);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Header />
      <main className="pt-28 sm:pt-32 pb-24 sm:pb-24 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile-only: title + reviews above gallery */}
          <div className="lg:hidden text-center mb-4">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Peak Performance
            </h1>
            {REVIEW_SUBMISSION_ENABLED && (
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                {reviewCount > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <StarRating rating={Math.round(reviewAverage)} />
                    </div>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-primary hover:underline"
                    >
                      {reviewCount} review{reviewCount === 1 ? "" : "s"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-primary hover:underline"
                  >
                    Be the first to leave a review
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Product Image Gallery */}
            <div className="relative order-1 lg:order-1">
              <div className="lg:sticky lg:top-32">
                {/* Main Image */}
                <div className="rounded-2xl border border-border overflow-hidden flex items-center justify-center max-w-[500px] lg:max-w-none mx-auto mb-4 lg:w-[550px] bg-neutral-100">
                  {/* No entrance animation here on purpose. This is the LCP
                      element: wrapping it in a motion.div that starts at
                      opacity 0 shipped it to the browser invisible, so despite
                      `priority` preloading it, it could not paint until the
                      whole JS bundle had downloaded and hydrated. A CSS
                      crossfade keyed on the image keeps the gallery transition
                      without blocking first paint. */}
                  <div key={activeImage} className="w-full h-full animate-[fadeIn_200ms_ease-out]">
                    <Image
                      src={galleryImages[activeImage].src}
                      alt={galleryImages[activeImage].alt}
                      width={550}
                      height={650}
                      className="w-full h-auto"
                      priority
                    />
                  </div>
                </div>

                {/* Thumbnail Strip */}
                <div className="flex justify-center gap-3 max-w-[400px] lg:max-w-none mx-auto">
                  {galleryImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all bg-white ${
                        activeImage === index
                          ? "border-primary"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full p-1"
                      />
                    </button>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="flex justify-center items-center gap-8 sm:gap-16 mt-6">
                  {[
                    { src: "/gmp-certified.png", alt: "GMP Certified", label: "GMP Certified" },
                    { src: "/made-in-usa.png", alt: "Made in USA", label: "Made in USA" },
                    { src: "/lab-tested.png", alt: "Lab Tested", label: "Lab Tested" },
                  ].map((badge) => (
                    <div key={badge.alt} className="flex flex-col items-center gap-2">
                      <Image
                        src={badge.src}
                        alt={badge.alt}
                        width={56}
                        height={56}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                      />
                      <span className="text-[10px] sm:text-xs font-heading font-bold text-text-secondary uppercase tracking-wider">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="order-2 lg:order-2 text-center">
              {/* Desktop-only: title + reviews (shown above gallery on mobile) */}
              <h1 className="hidden lg:block text-4xl font-bold text-text-primary mb-2">
                Peak Performance
              </h1>

              {REVIEW_SUBMISSION_ENABLED && (
                <div className="hidden lg:flex flex-wrap items-center justify-center gap-3 mb-4 text-sm">
                  {reviewCount > 0 ? (
                    <>
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(reviewAverage)} />
                      </div>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-primary hover:underline"
                      >
                        {reviewCount} review{reviewCount === 1 ? "" : "s"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-primary hover:underline"
                    >
                      Be the first to leave a review
                    </button>
                  )}
                </div>
              )}

              <p className="text-sm sm:text-base text-text-secondary mb-6">
                A foundational testosterone support formula designed to help your body respond the way it used to.
              </p>

              {/* Core Principles */}
              <div className="bg-surface border border-border rounded-lg p-4 sm:p-5 mb-8 text-left">
                <h3 className="text-sm font-semibold text-text-primary mb-4 text-center">Core Principles</h3>
                <div className="space-y-4">
                  {corePrinciples.map((principle, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{principle.title}</p>
                        <p className="text-xs sm:text-sm text-text-muted">{principle.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sale banner */}
              {SALE_ACTIVE && (
                <div className="flex items-center justify-between gap-3 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 mb-4">
                  <p className="text-sm font-semibold text-primary">20% Off Sale — Ends In</p>
                  <SaleCountdown className="text-sm font-bold text-primary tabular-nums" />
                </div>
              )}

              {/* Bundle Options */}
              <div className="space-y-3 mb-4">
                {BUNDLES.map((bundle) => {
                  const isSelected = selectedBundleId === bundle.id;
                  const displayBundle = bundle.id === "one-time" && isSelected
                    ? getActiveBundle()
                    : bundle;
                  return (
                    <button
                      key={bundle.id}
                      onClick={() => setSelectedBundleId(bundle.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-primary" : "border-gray-300"
                          }`}>
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-text-primary text-sm">{bundle.label}</p>
                              {bundle.badge && (
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                  {bundle.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted mt-0.5">
                              {bundle.perks.join(" • ")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1.5 justify-end">
                            {displayBundle.total < displayBundle.regularTotal && (
                              <p className="text-xs text-text-muted line-through whitespace-nowrap">${displayBundle.regularTotal.toFixed(2)}</p>
                            )}
                            <p className="font-bold text-text-primary whitespace-nowrap">
                              ${displayBundle.total.toFixed(2)}{bundle.priceSuffix}
                            </p>
                          </div>
                          {displayBundle.qty > 1 && (
                            <p className="text-xs text-text-muted whitespace-nowrap">${displayBundle.pricePerBottle.toFixed(2)}/bottle</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quantity selector (one-time only) */}
              {selectedBundleId === "one-time" && (
                <div className="flex items-center justify-center gap-4 mb-4 p-3 rounded-lg bg-surface border border-border">
                  <span className="text-sm text-text-secondary font-medium">Quantity:</span>
                  <div className="flex items-center border border-border rounded-lg bg-white">
                    <button
                      onClick={() => setOneTimeQty((q) => Math.max(1, q - 1))}
                      disabled={oneTimeQty <= 1}
                      className={`px-3 py-2 transition-colors ${oneTimeQty <= 1 ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-text-primary"}`}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 text-text-primary font-semibold min-w-[40px] text-center tabular-nums">
                      {oneTimeQty}
                    </span>
                    <button
                      onClick={() => setOneTimeQty((q) => Math.min(10, q + 1))}
                      disabled={oneTimeQty >= 10}
                      className={`px-3 py-2 transition-colors ${oneTimeQty >= 10 ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-text-primary"}`}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mb-4">
                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  {addedToCart ? "Opening…" : selectedBundleId === "subscribe" ? "Subscribe Now" : "Buy Now"}
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-8 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" />30-Day Guarantee</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" />{selectedBundleId === "subscribe" ? "Cancel anytime" : "No commitment"}</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-primary" />Ships in 1-2 Days</span>
              </div>

            </div>
          </div>

          {/* ============ NEW SECTIONS BELOW ============ */}

          {/* Inside the Formula */}
          <section id="ingredient-library" className="mt-16 sm:mt-24">
            <div className="bg-primary rounded-lg py-3 px-6 mb-8">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                What&apos;s Inside
              </h2>
            </div>

            {/* Mobile: Pill selector + image + detail card */}
            <div className="lg:hidden">
              <div
                className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
                style={{ touchAction: "pan-x pinch-zoom" }}
              >
                {ingredients.map((ingredient, index) => (
                  <button
                    key={ingredient.name}
                    onClick={() => handleIngredientSelect(index)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedIngredientIndex === index
                        ? "bg-primary text-white"
                        : "bg-surface border border-border text-text-secondary"
                    }`}
                  >
                    {ingredient.name}
                  </button>
                ))}
              </div>

              <div className="flex justify-center py-4">
                <motion.div
                  key={ingredients[selectedIngredientIndex]?.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-36 h-36 rounded-full bg-surface border-2 border-primary/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src={ingredients[selectedIngredientIndex]?.image || "/vitamin-d3.png"}
                      alt={ingredients[selectedIngredientIndex]?.name || "Ingredient"}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                key={`panel-mobile-${ingredients[selectedIngredientIndex]?.name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-primary rounded-lg overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading text-lg font-bold text-white">
                      {ingredients[selectedIngredientIndex]?.name}
                    </h3>
                    <span className="text-xs font-heading font-bold px-2 py-1 rounded-[5px] bg-white/20 text-white">
                      {ingredients[selectedIngredientIndex]?.dosage}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-3">{ingredients[selectedIngredientIndex]?.form}</p>
                  <p className="text-white text-sm leading-relaxed mb-4">
                    {ingredients[selectedIngredientIndex]?.shortDesc}
                  </p>

                  <h4 className="text-white/70 font-heading font-medium text-[10px] mb-2 uppercase tracking-wide">
                    Key Benefits
                  </h4>
                  <ul className="space-y-1.5 mb-4">
                    {ingredients[selectedIngredientIndex]?.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-white text-xs leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {ingredients[selectedIngredientIndex]?.research?.[0] && (
                    <a
                      href={ingredients[selectedIngredientIndex].research[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[5px] bg-white text-primary font-heading font-semibold text-xs hover:bg-white/90 transition-colors"
                    >
                      See the Research
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Desktop: 3-column layout */}
            <div className="hidden lg:block bg-white rounded-lg border border-border p-6 overflow-hidden">
              <div className="grid lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-3 flex flex-col gap-1.5">
                  {ingredients.map((ingredient, index) => (
                    <button
                      key={ingredient.name}
                      onClick={() => handleIngredientSelect(index)}
                      className={`text-left px-3 py-2.5 rounded-lg transition-all ${
                        selectedIngredientIndex === index
                          ? "bg-primary/10 border-l-4 border-primary"
                          : "hover:bg-surface border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm ${selectedIngredientIndex === index ? "text-primary font-semibold" : "text-text-secondary font-medium"}`}>
                          {ingredient.name}
                        </span>
                        <span className={`text-[10px] font-heading font-bold px-1.5 py-0.5 rounded-[5px] ${
                          selectedIngredientIndex === index
                            ? "bg-primary text-white"
                            : "bg-surface text-text-muted"
                        }`}>
                          {ingredient.dosage}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-3 flex justify-center items-center py-2">
                  <motion.div
                    key={ingredients[selectedIngredientIndex]?.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-64 h-64 rounded-full bg-surface border-4 border-primary/10 flex items-center justify-center overflow-hidden">
                      <Image
                        src={ingredients[selectedIngredientIndex]?.image || "/vitamin-d3.png"}
                        alt={ingredients[selectedIngredientIndex]?.name || "Ingredient"}
                        width={256}
                        height={256}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  key={`panel-${ingredients[selectedIngredientIndex]?.name}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:col-span-6 rounded-lg bg-primary overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="font-heading text-2xl font-bold text-white mb-1.5">
                      {ingredients[selectedIngredientIndex]?.name}
                    </h3>
                    <p className="text-white text-base leading-relaxed mb-4">
                      {ingredients[selectedIngredientIndex]?.shortDesc}
                    </p>

                    <div className="bg-white/10 rounded-lg p-3 mb-4">
                      <div className="flex justify-between items-center border-b border-white/15 pb-2 mb-2">
                        <span className="text-white/80 text-sm">Dose</span>
                        <span className="text-white font-heading font-semibold text-sm">
                          {ingredients[selectedIngredientIndex]?.dosage}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 text-sm">Form</span>
                        <span className="text-white text-sm text-right max-w-[65%]">
                          {ingredients[selectedIngredientIndex]?.form}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-white font-heading font-medium text-xs mb-2 uppercase tracking-wide">
                      Key Benefits
                    </h4>
                    <ul className="space-y-1.5 mb-4">
                      {ingredients[selectedIngredientIndex]?.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-white text-sm leading-snug">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {ingredients[selectedIngredientIndex]?.research?.[0] && (
                      <a
                        href={ingredients[selectedIngredientIndex].research[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-[5px] bg-white text-primary font-heading font-semibold text-sm hover:bg-white/90 transition-colors"
                      >
                        See the Research
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Product Details */}
          <section className="mt-16 sm:mt-24">
            <div className="bg-primary rounded-lg py-3 px-6 mb-2">
              <h2 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide text-center">
                Product Details
              </h2>
            </div>
            <div>
              {productSections.map((section, index) => (
                <AccordionItem
                  key={section.title}
                  title={section.title}
                  content={section.content}
                  isOpen={openSection === index}
                  onToggle={() =>
                    setOpenSection(openSection === index ? null : index)
                  }
                />
              ))}
            </div>
          </section>

          {/* The Difference */}
          <section className="mt-16 sm:mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">
                The Difference
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Why Peak Performance Is Different
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              {/* Product Images */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex justify-center items-end h-[200px] sm:h-[240px]">
                  <Image
                    src="/typical-boosters.jpg"
                    alt="Typical Testosterone Boosters"
                    width={300}
                    height={240}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div className="flex justify-center items-end h-[200px] sm:h-[240px]">
                  <Image
                    src="/difference-peak.jpg"
                    alt="Peak Performance"
                    width={300}
                    height={240}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-100 rounded-xl px-4 py-3 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Typical Testosterone Booster
                  </span>
                </div>
                <div className="bg-primary rounded-xl px-4 py-3 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Peak Performance
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2">
                {comparisonRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-3">
                      <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-gray-600 text-sm leading-snug">{row.typical}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-primary/[0.05] border border-primary/20 rounded-xl px-4 py-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-gray-800 text-sm font-medium leading-snug">{row.peak}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Backs up the "full label transparency" row directly above. */}
              <div className="mt-6 text-center">
                <Link
                  href="/lab-results"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  Read the Certificate of Analysis for your batch
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Benefits Timeline */}
          <section className="mt-16 sm:mt-24">
            <div className="text-center mb-10">
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">What To Expect</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Results Over Time</h2>
              <p className="text-gray-600 mt-2">Designed for consistent, foundational support that builds over time.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.week}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-5 text-center relative"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-primary font-semibold text-sm mb-1">{item.week}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          {REVIEW_SUBMISSION_ENABLED && (
          <section id="reviews" className="mt-16 sm:mt-24 scroll-mt-24">
            <div className="text-center mb-10">
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-2">Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Reviews</h2>
              {reviewCount > 0 && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <StarRating rating={Math.round(reviewAverage)} />
                  <span className="text-gray-600 text-sm">
                    {reviewAverage.toFixed(1)} out of 5 ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                  </span>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Review list */}
              <div className="space-y-4">
                {reviews.length === 0 && reviewsUnavailable ? (
                  // A failed load is not an empty list. Claiming zero reviews
                  // when we could not read them tells every visitor the product
                  // has none, and hides the outage from us.
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
                    We couldn&apos;t load reviews just now. Please check back shortly.
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
                    No reviews yet. Be the first to share your experience.
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-900">{review.name}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.quote}</p>
                      {review.hasPhoto && (
                        // Fetched per photo rather than inlined in the page
                        // payload, and lazy so photos below the fold cost
                        // nothing until scrolled to.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`/api/reviews/${review.id}/photo`}
                          alt={`Photo from ${review.name}'s review`}
                          loading="lazy"
                          decoding="async"
                          width={192}
                          height={192}
                          className="mt-3 w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Write a review form */}
              {REVIEW_SUBMISSION_ENABLED ? (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 h-fit">
                  <h3 className="font-bold text-gray-900 mb-1">Write a Review</h3>
                  <p className="text-gray-500 text-sm mb-5">
                    Only verified purchasers can leave a review. We'll check your email against your order.
                  </p>

                  {reviewSuccess ? (
                    <div className="text-center py-6">
                      <Check className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="font-semibold text-gray-900">Thanks for your review!</p>
                      <p className="text-gray-500 text-sm mt-1">It's now live on this page.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-700 mb-1 block">Your Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              aria-label={`${star} star${star === 1 ? "" : "s"}`}
                            >
                              <Star
                                className={`w-6 h-6 ${star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="review-name" className="text-sm text-gray-700 mb-1 block">Name</label>
                        <input
                          id="review-name"
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="review-email" className="text-sm text-gray-700 mb-1 block">
                          Email <span className="text-gray-400">(used only to verify your purchase, not shown publicly)</span>
                        </label>
                        <input
                          id="review-email"
                          type="email"
                          required
                          value={reviewEmail}
                          onChange={(e) => setReviewEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="review-quote" className="text-sm text-gray-700 mb-1 block">Your Review</label>
                        <textarea
                          id="review-quote"
                          required
                          minLength={10}
                          rows={4}
                          value={reviewQuote}
                          onChange={(e) => setReviewQuote(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="review-photo" className="text-sm text-gray-700 mb-1 block">
                          Photo <span className="text-gray-400">(optional)</span>
                        </label>
                        {reviewPhotoPreview ? (
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={reviewPhotoPreview}
                              alt="Selected review photo preview"
                              className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={clearReviewPhoto}
                              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <input
                            id="review-photo"
                            type="file"
                            accept="image/*"
                            onChange={handleReviewPhotoChange}
                            className="w-full text-sm text-gray-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-sm file:font-medium hover:file:bg-primary/20"
                          />
                        )}
                      </div>

                      {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}

                      <Button type="submit" className="w-full" disabled={reviewSubmitting}>
                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 h-fit flex items-center justify-center text-center text-gray-500 text-sm min-h-[200px]">
                  Review submissions are temporarily paused. Check back soon.
                </div>
              )}
            </div>
          </section>
          )}

          {/* In Action — hidden until lifestyle photos are ready */}

        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 md:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5">
              {getActiveBundle().total < getActiveBundle().regularTotal && (
                <p className="text-xs text-text-muted line-through">
                  ${getActiveBundle().regularTotal.toFixed(2)}
                </p>
              )}
              <p className="font-bold text-text-primary">
                ${getActiveBundle().total.toFixed(2)}{getActiveBundle().priceSuffix}
              </p>
            </div>
            <p className="text-xs text-text-muted">
              {getActiveBundle().isSubscription
                ? "Monthly • Cancel anytime"
                : `${getActiveBundle().qty} bottle${getActiveBundle().qty > 1 ? "s" : ""} • One-time`}
            </p>
          </div>
          <Button className="flex-1" onClick={handleAddToCart}>
            {addedToCart ? "Opening…" : getActiveBundle().isSubscription ? "Subscribe" : "Buy Now"}
          </Button>
        </div>
      </div>

      {checkoutOpen && (
        <LazyCheckoutModal
          cartItems={checkoutItems}
          promotionCodeId={checkoutPromoId}
          email={customerEmail || undefined}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
