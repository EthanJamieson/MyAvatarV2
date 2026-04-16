import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, Brain, MessageSquare, Palette, Radio, Rocket, Sparkles, Mic, Film, Shield, ArrowRight, Target, TrendingUp, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import roadmapHero from "@/assets/roadmap-hero.jpg";
import { FloatingOrbs, GridPattern, GlowLine, PulsingDot } from "@/components/AnimatedElements";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const roadmapPhases = [
  {
    phase: "Q2 2026",
    status: "completed" as const,
    title: "Foundation",
    items: [
      { icon: Mic, label: "Voice cloning with 30+ languages" },
      { icon: Film, label: "4K avatar video generation" },
      { icon: Shield, label: "Enterprise-grade secure infrastructure" },
    ],
  },
  {
    phase: "Q3 2026",
    status: "upcoming" as const,
    title: "Expansion",
    items: [
      { icon: Globe, label: "Additional regional language packs" },
      { icon: MessageSquare, label: "Real-time lip-sync from text scripts" },
      { icon: Palette, label: "Custom avatar outfits & backgrounds" },
    ],
  },
  {
    phase: "Q4 2026",
    status: "upcoming" as const,
    title: "Intelligence",
    items: [
      { icon: Brain, label: "Conversational AI avatars for live chat" },
      { icon: Radio, label: "Live-stream integration (YouTube, TikTok)" },
      { icon: Sparkles, label: "Multi-avatar scenes & split-screen" },
    ],
  },
  {
    phase: "2027",
    status: "planned" as const,
    title: "Scale",
    items: [
      { icon: Globe, label: "API access for enterprise integrations" },
      { icon: Rocket, label: "Mobile app for on-the-go generation" },
      { icon: Brain, label: "Emotion-aware avatar expressions" },
    ],
  },
];

const statusStyles = {
  completed: "bg-primary/10 text-primary border-primary/30",
  "in-progress": "bg-primary/10 text-primary border-primary/30",
  upcoming: "bg-muted text-muted-foreground border-border",
  planned: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  completed: "Completed",
  "in-progress": "In Progress",
  upcoming: "Upcoming",
  planned: "Planned",
};

const visionCards = [
  {
    icon: Target,
    title: "Global Reach",
    description: "Expanding language support and infrastructure to serve creators in every market worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Enterprise Scale",
    description: "Building API-first tools for seamless integration into enterprise workflows.",
  },
  {
    icon: Award,
    title: "Industry Leading",
    description: "Setting the global standard for AI avatar quality and photorealism.",
  },
];

const Roadmap = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero with image */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingOrbs count={4} />
        <div className="absolute inset-0">
          <img
            src={roadmapHero}
            alt="Roadmap timeline visualization"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-center mb-6"
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Roadmap</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
              Building the future of{" "}
              <span className="text-gradient-cyan">AI avatars</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're crafting the most powerful AI avatar platform in the world. Here's our vision for what's ahead.
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            {roadmapPhases.map((phase, i) => (
              <div key={phase.phase} className="flex items-center gap-2">
                <div className={`h-2 rounded-full transition-all ${
                  phase.status === "completed" ? "w-16 bg-primary" : "w-12 bg-muted"
                }`} />
                {i < roadmapPhases.length - 1 && <div className="w-1" />}
              </div>
            ))}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-muted-foreground text-xs font-mono mt-3"
          >
            1 of {roadmapPhases.length} phases completed
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-3xl">
           <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border hidden md:block overflow-hidden">
              <motion.div
                className="absolute w-full bg-gradient-to-b from-transparent via-primary to-transparent"
                style={{ height: "30%" }}
                animate={{ top: ["-30%", "130%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />
            </div>

            <div className="space-y-8">
              {roadmapPhases.map((phase, i) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                  className="relative flex gap-6"
                >
                  <div className="hidden md:flex shrink-0 w-10 h-10 items-center justify-center z-10">
                    {phase.status === "completed" ? (
                      <PulsingDot />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>
                  <div className="glass-card p-6 flex-1 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-mono text-sm font-semibold text-foreground">{phase.phase}</span>
                      <span className="text-xs font-mono tracking-wide uppercase">&mdash;</span>
                      <span className="font-display text-sm font-semibold text-foreground">{phase.title}</span>
                      <span className={`text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${statusStyles[phase.status]}`}>
                        {statusLabels[phase.status]}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {phase.items.map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-muted-foreground text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision cards */}
      <section className="py-20 border-y border-border bg-card/30 relative overflow-hidden">
        <GridPattern />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our vision
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Where we're headed and what drives us forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visionCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className="glass-card p-7 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-150"
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                >
                  <card.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="glass-card p-8 text-center"
          >
            <Rocket className="w-7 h-7 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Have a feature request?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              We'd love to hear what you want us to build next. Your feedback shapes our roadmap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/about"
                className="btn-press inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
              >
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/upload"
                className="btn-press inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-muted transition-colors duration-150"
              >
                Try MyAvatar Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmap;
