import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageCircle, Building2, Users, Headphones, ChevronDown, Globe, PenTool, Zap, RefreshCw, Mic, Languages } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { usePaystackCheckout } from "@/hooks/usePaystackCheckout";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import pricingHero from "@/assets/pricing-hero.jpg";
import pricingTutorials from "@/assets/pricing-tutorials.jpg";
import pricingEnterprise from "@/assets/pricing-enterprise.jpg";
import { FloatingOrbs, GridPattern, GlowLine, ScanBeam } from "@/components/AnimatedElements";
import CheckoutDialog from "@/components/CheckoutDialog";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

type PricingPlanRow = Tables<"pricing_plans">;

const formatRand = (amount: number) => `R${Math.round(amount).toLocaleString("en-ZA")}`;
const discountedAmount = (amount: number, discountPercent: number | null) =>
  !discountPercent || discountPercent <= 0 ? amount : Math.round(amount * (1 - discountPercent / 100));

const videoPlanMeta: Record<string, { period?: string; perUnit?: string; features: string[]; cta: string; featured?: boolean }> = {
  "single-video": {
    period: "/video",
    features: ["1 video", "1080p resolution", "Basic voice cloning", "Email support"],
    cta: "Buy Now",
  },
  "10-pack": {
    perUnit: "R400/video",
    features: ["10 videos", "Up to 4K resolution", "Advanced voice cloning", "Custom backgrounds", "Priority support"],
    cta: "Buy 10-Pack →",
  },
  "25-pack": {
    perUnit: "R350/video",
    features: ["25 videos", "Up to 4K resolution", "Advanced voice cloning", "Custom backgrounds", "Brand kit included", "Priority support"],
    cta: "Buy 25-Pack →",
    featured: true,
  },
  "50-pack": {
    perUnit: "R300/video",
    features: ["50 videos", "Up to 4K resolution", "Advanced voice cloning", "Custom backgrounds", "Brand kit included", "Dedicated support"],
    cta: "Buy 50-Pack →",
  },
};

const addOns = [
  { name: "Script Writing", price: "R200 – R500", amount: 200, icon: PenTool, note: "from R200" },
  { name: "Express Delivery (24 hrs)", price: "+R400", amount: 400, icon: Zap },
  { name: "Additional Revisions", price: "R150", amount: 150, icon: RefreshCw },
  { name: "Voice Enhancement", price: "R250", amount: 250, icon: Mic },
  { name: "Foreign Language (Non-English)", price: "R500", amount: 500, icon: Languages },
];

const tutorialPlanMeta: Record<string, { features: string[]; featured?: boolean }> = {
  "tutorial-beginner": {
    features: ["Getting started guide", "Voice upload basics", "Your first avatar video", "Email support"],
  },
  "tutorial-creator-pro": {
    features: ["All Beginner content", "Advanced voice techniques", "Multi-scene workflows", "Custom background mastery", "Priority support"],
    featured: true,
  },
  "tutorial-studio-master": {
    features: ["All Creator Pro content", "API integration guide", "Batch generation workflows", "Brand consistency training", "1-on-1 onboarding call"],
  },
};

const enterpriseFeatures = [
  {
    icon: Building2,
    title: "Custom Volume Pricing",
    description: "Tailored pricing for teams generating 200+ videos per month with dedicated account management.",
  },
  {
    icon: Users,
    title: "Custom Avatar Training",
    description: "Train bespoke avatars on client-specific faces, gestures, and brand personas for a truly unique presence.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Access support via WhatsApp, email, and our built-in chatbot — providing fast, reliable assistance whenever you need it.",
  },
  {
    icon: Globe,
    title: "Brand Kit Integration",
    description: "Upload logos, fonts, and colour palettes that auto-apply to every generated video for consistent branding.",
  },
];

const contactFaqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards, EFT bank transfers, and mobile money services. Enterprise clients can request invoicing with 30-day payment terms.",
  },
  {
    question: "Can I upgrade my pack mid-way?",
    answer: "Yes. You can upgrade at any time and your remaining credits will roll over. Contact us and we'll adjust your plan accordingly.",
  },
  {
    question: "Do video credits expire?",
    answer: "No. Your video credits never expire. Use them at your own pace — whether that's all in one week or spread over a year.",
  },
];

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        className="overflow-hidden"
      >
        <p className="text-muted-foreground text-sm leading-relaxed pb-5">{answer}</p>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<PricingPlanRow[]>([]);
  const { openCheckout, closeCheckout, processPayment, loading, checkoutState } = usePaystackCheckout();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast.success("Payment successful! We'll be in touch shortly.");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load pricing plans:", error);
        toast.error("Could not load latest pricing plans");
        return;
      }
      setPricingPlans(data ?? []);
    };

    void fetchPlans();
  }, []);

  const videoPacks = useMemo(
    () =>
      pricingPlans
        .filter((plan) => plan.category === "video")
        .map((plan) => {
          const meta = videoPlanMeta[plan.plan_key] ?? {
            features: ["Custom package details available on request"],
            cta: `Buy ${plan.name} →`,
          };
          const planFeatures = Array.isArray(plan.features) && plan.features.length > 0 ? plan.features : meta.features;
          const finalAmount = discountedAmount(plan.amount_in_rands, plan.discount_percent);
          return {
            ...plan,
            ...meta,
            features: planFeatures,
            amountInRands: finalAmount,
            originalAmountInRands: plan.amount_in_rands,
            originalPrice: formatRand(plan.amount_in_rands),
            price: formatRand(finalAmount),
            saving: plan.discount_percent ? `Save ${plan.discount_percent}%` : undefined,
            tagline: plan.description,
            featured: Boolean(meta.featured),
          };
        }),
    [pricingPlans],
  );

  const tutorialPacks = useMemo(
    () =>
      pricingPlans
        .filter((plan) => plan.category === "tutorial")
        .map((plan) => {
          const meta = tutorialPlanMeta[plan.plan_key] ?? {
            features: ["Tailored training support"],
          };
          const planFeatures = Array.isArray(plan.features) && plan.features.length > 0 ? plan.features : meta.features;
          const finalAmount = discountedAmount(plan.amount_in_rands, plan.discount_percent);
          return {
            ...plan,
            ...meta,
            features: planFeatures,
            amountInRands: finalAmount,
            originalAmountInRands: plan.amount_in_rands,
            originalPrice: formatRand(plan.amount_in_rands),
            price: formatRand(finalAmount),
            tagline: plan.description,
          };
        }),
    [pricingPlans],
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, subject, message },
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Message sent! Check your inbox for a confirmation.");
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }, [name, email, subject, message]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <FloatingOrbs count={3} />
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Pricing & Contact</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.05] mb-6">
              Plans that scale{" "}
              <span className="text-gradient-cyan">with you.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Pay per video or save with bulk packs. No subscriptions, no hidden fees — just transparent pricing designed for creators everywhere.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="rounded-2xl overflow-hidden glow-cyan hidden md:block"
          >
            <img src={pricingHero} alt="Pricing dashboard" className="w-full h-64 object-cover rounded-2xl" loading="lazy" />
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Video Packs */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8"
          >
            Video Packs
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoPacks.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className={`glass-card p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  pack.featured ? "border-primary/30 glow-cyan relative" : ""
                }`}
              >
                {pack.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                {pack.saving && (
                  <span className="text-primary text-xs font-mono font-semibold mb-2">{pack.saving}</span>
                )}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{pack.name}</h3>
                <div className="mb-1">
                  {pack.discount_percent ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground line-through">{pack.originalPrice}</span>
                      <span className="font-display text-3xl font-bold text-foreground">{pack.price}</span>
                    </div>
                  ) : (
                    <span className="font-display text-3xl font-bold text-foreground">{pack.price}</span>
                  )}
                  {pack.period && <span className="text-muted-foreground text-sm">{pack.period}</span>}
                </div>
                {"perUnit" in pack && pack.perUnit && (
                  <p className="text-muted-foreground text-xs font-mono mb-4">{pack.perUnit}</p>
                )}
                {!("perUnit" in pack && pack.perUnit) && <div className="mb-4" />}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {pack.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground italic mb-5">👉 {pack.tagline}</p>
                <button
                  onClick={() => openCheckout(pack.name, pack.amountInRands, pack.price)}
                  className={`btn-press w-full py-3 rounded-full text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                    pack.featured
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {pack.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Tutorial Packages */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
                className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2"
              >
                Tutorial Packages
              </motion.h2>
              <p className="text-muted-foreground">Level up your avatar game with expert-led training.</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="rounded-2xl overflow-hidden hidden md:block"
            >
              <img src={pricingTutorials} alt="Creator learning on tablet" className="w-full h-48 object-cover rounded-2xl" loading="lazy" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {tutorialPacks.map((pack, i) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className={`glass-card p-7 flex flex-col ${
                  "featured" in pack && pack.featured ? "border-primary/30 glow-cyan relative" : ""
                }`}
              >
                {"featured" in pack && pack.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{pack.name}</h3>
                <div className="mb-5">
                  {pack.discount_percent ? (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground line-through">{pack.originalPrice}</span>
                      <span className="font-display text-3xl font-bold text-foreground">{pack.price}</span>
                    </div>
                  ) : (
                    <span className="font-display text-3xl font-bold text-foreground">{pack.price}</span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {pack.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openCheckout(`Tutorial: ${pack.name}`, pack.amountInRands, pack.price)}
                  className="btn-press w-full py-3 rounded-full text-sm font-semibold border border-border text-foreground hover:bg-muted transition-all duration-150"
                >
                  Get {pack.name}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Comparison Table */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8"
          >
            Compare All Plans
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-display font-semibold text-foreground">Feature</th>
                    <th className="text-center p-4 font-display font-semibold text-foreground">Single</th>
                    <th className="text-center p-4 font-display font-semibold text-foreground">10-Pack</th>
                    <th className="text-center p-4 font-display font-semibold text-primary">25-Pack</th>
                    <th className="text-center p-4 font-display font-semibold text-foreground">50-Pack</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Videos Included", values: ["1", "10", "25", "50"] },
                    { feature: "Resolution", values: ["1080p", "Up to 4K", "Up to 4K", "Up to 4K"] },
                    { feature: "Voice Cloning", values: ["Basic", "Advanced", "Advanced", "Advanced"] },
                    { feature: "Custom Backgrounds", values: ["—", "✓", "✓", "✓"] },
                    { feature: "Brand Kit", values: ["—", "—", "✓", "✓"] },
                    { feature: "Support", values: ["Email", "Priority", "Priority", "Dedicated"] },
                    { feature: "Price per Video", values: ["R500", "R400", "R350", "R300"] },
                    { feature: "Total Price", values: ["R500", "R4,000", "R8,750", "R15,000"] },
                  ].map((row, i) => (
                    <tr key={row.feature} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}>
                      <td className="p-4 font-medium text-foreground">{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className={`text-center p-4 ${j === 2 ? "text-primary font-semibold" : "text-muted-foreground"} ${val === "✓" ? "text-primary" : ""}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Enterprise */}
      <section className="py-24 border-y border-border bg-card/30 relative overflow-hidden">
        <ScanBeam />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Enterprise Solutions
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Need more than a pack? We build custom solutions for agencies, broadcasters, and enterprise teams.
            </p>
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden">
              <img src={pricingEnterprise} alt="Enterprise AI avatar boardroom" className="w-full h-56 object-cover rounded-2xl" loading="lazy" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {enterpriseFeatures.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass-card p-7 group hover:border-primary/20 transition-colors duration-150"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-150">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-center"
          >
            <a
              href="#contact"
              className="btn-press inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
            >
              Contact Sales →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Pricing FAQ
            </h2>
            <p className="text-muted-foreground text-lg">
              Common questions about plans, payments, and credits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="border-t border-border"
          >
            {contactFaqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Contact Us */}
      <section id="contact" className="py-24 border-t border-border relative overflow-hidden">
        <GridPattern />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Get in touch
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Need a custom package, have a question, or just want to say hello? We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    detail: "studio@myavatar.co.za",
                    sub: "We respond within 24 hours",
                    href: "mailto:studio@myavatar.co.za",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    detail: "+27 76 587 7288",
                    sub: "Mon–Fri, 8am–5pm SAST",
                    href: "tel:+27765877288",
                  },
                  {
                    icon: MessageCircle,
                    title: "WhatsApp",
                    detail: "+27 76 587 7288",
                    sub: "Quick questions & support",
                    href: `https://wa.me/27765877288`,
                  },
                  {
                    icon: MapPin,
                    title: "Location",
                    detail: "Global",
                    sub: "Serving creators worldwide",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease, delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-semibold">{item.title}</p>
                      {item.href ? (
                        <a href={item.href} className="text-foreground text-sm hover:text-primary transition-colors duration-150">
                          {item.detail}
                        </a>
                      ) : (
                        <p className="text-foreground text-sm">{item.detail}</p>
                      )}
                      <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-semibold text-foreground">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { day: "Monday – Friday", hours: "08:00 – 17:00 SAST" },
                    { day: "Saturday", hours: "09:00 – 13:00 SAST" },
                    { day: "Sunday & Public Holidays", hours: "Closed" },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between">
                      <span className="text-muted-foreground">{row.day}</span>
                      <span className="text-foreground font-medium">{row.hours}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
            >
              <div className="glass-card p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">Message sent!</h3>
                    <p className="text-muted-foreground text-sm mb-6">We'll get back to you within 24 hours.</p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName("");
                        setEmail("");
                        setSubject("");
                        setMessage("");
                      }}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-foreground text-xs font-medium mb-1.5 block">Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={100}
                          className="w-full bg-muted/50 text-foreground placeholder:text-muted-foreground px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-foreground text-xs font-medium mb-1.5 block">Email</label>
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          maxLength={255}
                          className="w-full bg-muted/50 text-foreground placeholder:text-muted-foreground px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-foreground text-xs font-medium mb-1.5 block">Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150 appearance-none"
                        required
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="pricing">Pricing & Plans</option>
                        <option value="enterprise">Enterprise Enquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-foreground text-xs font-medium mb-1.5 block">Message</label>
                      <textarea
                        placeholder="Tell us what you need..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        maxLength={1000}
                        className="w-full bg-muted/50 text-foreground placeholder:text-muted-foreground px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-150 resize-none"
                        required
                      />
                      <p className="text-muted-foreground text-xs mt-1 text-right">{message.length}/1000</p>
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="btn-press w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send Message →"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CheckoutDialog
        isOpen={checkoutState.isOpen}
        onClose={closeCheckout}
        onSubmit={processPayment}
        loading={loading}
        productName={checkoutState.productName}
        formattedPrice={checkoutState.formattedPrice}
        baseAmount={checkoutState.amountInRands}
      />
      <Footer />
    </div>
  );
};

export default Pricing;
