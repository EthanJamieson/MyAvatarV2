import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, GraduationCap, Heart, Home, Briefcase, ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import solutionsHero from "@/assets/solutions-hero.jpg";
import { FloatingOrbs, GlowLine, GridPattern, ScanBeam } from "@/components/AnimatedElements";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const industries = [
  {
    icon: Building2,
    title: "Corporate & Enterprise",
    description: "Internal communications, CEO updates, training materials, and investor presentations — all without booking a studio.",
    benefits: ["Scale company-wide announcements", "Consistent brand voice across regions", "80% cost reduction vs traditional video"],
    stat: "80%",
    statLabel: "Cost savings",
  },
  {
    icon: GraduationCap,
    title: "Education & E-Learning",
    description: "Transform course content into engaging video lessons with AI presenters that speak multiple languages.",
    benefits: ["Multi-language course delivery", "Consistent instructor presence", "Rapid content updates"],
    stat: "30+",
    statLabel: "Languages",
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Patient education videos, medical training content, and public health announcements in accessible formats.",
    benefits: ["Patient-friendly explainers", "Multilingual health content", "HIPAA-aware workflows"],
    stat: "24/7",
    statLabel: "Availability",
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Virtual property tours narrated by professional AI avatars, personalised buyer communications, and listing videos.",
    benefits: ["Personalised property videos", "Virtual tour narration", "Agent brand consistency"],
    stat: "3x",
    statLabel: "Engagement",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    description: "Law firms, consultancies, and advisory practices using AI avatars for client updates and thought leadership.",
    benefits: ["Professional client updates", "Thought leadership content", "Proposal video pitches"],
    stat: "5x",
    statLabel: "Faster delivery",
  },
  {
    icon: ShoppingBag,
    title: "Retail & E-Commerce",
    description: "Product demonstrations, brand storytelling, and personalised marketing campaigns at scale.",
    benefits: ["Product demo videos", "Seasonal campaign content", "Personalised recommendations"],
    stat: "2x",
    statLabel: "Conversion lift",
  },
];

const Solutions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingOrbs count={4} />
        <div className="absolute inset-0">
          <img src={solutionsHero} alt="Industry solutions" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Solutions</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
              Built for <span className="text-gradient-cyan">every industry</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover how professionals across industries use MyAvatar to create studio-grade video content at scale.
            </p>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Industry cards */}
      <section className="py-24 relative overflow-hidden">
        <ScanBeam />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass-card p-8 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <industry.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-gradient-cyan">{industry.stat}</p>
                    <p className="text-muted-foreground text-xs font-mono">{industry.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{industry.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{industry.description}</p>
                <ul className="space-y-2">
                  {industry.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* CTA */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <GridPattern />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Don't see your industry?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              MyAvatar works for any industry that needs professional video content. Get in touch to discuss your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/pricing#contact"
                className="btn-press inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
              >
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/gallery"
                className="btn-press inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-muted transition-colors duration-150"
              >
                View Demo Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
