import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Monitor, Globe, Mic, Video, Sparkles, Users, Shield, ChevronDown, ArrowRight } from "lucide-react";
import heroVideo from "@/assets/hero-video.mp4";
import heroBg from "@/assets/hero-bg.jpg";
import homeCreator from "@/assets/home-creator.jpg";
import homeCorporate from "@/assets/home-corporate.jpg";
import homeEnterprise from "@/assets/home-enterprise.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingOrbs, GridPattern, GlowLine, FloatingIcon, PulsingDot, ScanBeam } from "@/components/AnimatedElements";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const stats = [
  { value: "4K", label: "Resolution" },
  { value: "30+", label: "Languages" },
  { value: "100%", label: "Secure" },
  { value: "Global", label: "Reach" },
];

const features = [
  {
    icon: Zap,
    title: "Studio-Grade Quality",
    description: "Every avatar is meticulously rendered using our proprietary AI pipeline for unmatched photorealism.",
  },
  {
    icon: Monitor,
    title: "Up to 4K Resolution",
    description: "Rendered in cinema-grade quality, up to 4K, ready for any platform or broadcast.",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Fast, reliable rendering powered by a globally distributed network—built for performance at scale.",
  },
];

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Upload Your Voice",
    description: "Record or upload a voice sample. Our AI captures your unique vocal patterns, tone, and cadence.",
  },
  {
    icon: Video,
    step: "02",
    title: "Upload Your Video",
    description: "Provide a brief video clip. We extract facial geometry, expressions, and movement patterns.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Generate & Download",
    description: "Our engine synthesises your avatar with cinema-grade precision. Download in 4K, ready for any platform.",
  },
];

const useCases = [
  {
    image: homeCorporate,
    title: "Corporate & Enterprise",
    description: "Produce training videos, internal comms, and client-facing presentations at a fraction of the cost of traditional video production. Scale across departments and languages effortlessly.",
  },
  {
    image: homeEnterprise,
    title: "Professional Services",
    description: "Consultants, agencies, and professional firms use MyAvatar to create high-quality video content for client and internal onboarding, marketing campaigns, and executive communications — all without the need for a production team.",
  },
  {
    image: homeCreator,
    title: "Content Creators",
    description: "Scale your video output without being on camera. Create consistent content in multiple languages while you focus on strategy and storytelling.",
  },
];


const faqs = [
  {
    question: "What quality can I expect from my avatar?",
    answer: "Experience lifelike visuals, natural movement, and high-quality video output with resolution and features depending on your selected package.",
  },
  {
    question: "What languages are supported?",
    answer: "We support 30+ languages globally, including English, French, Spanish, Portuguese, Arabic, Swahili, Mandarin, Hindi, and many more — with new languages added regularly.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. All data is processed on secure, enterprise-grade infrastructure with end-to-end encryption. We're fully compliant with global data protection regulations and your likeness data is never shared with third parties.",
  },
  {
    question: "Can I use my avatar for commercial purposes?",
    answer: "Yes. You own full commercial rights to any avatar generated from your likeness. Use it across YouTube, TikTok, broadcast TV, or corporate presentations.",
  },
  {
    question: "What video and audio formats do you accept?",
    answer: "We accept MP4, MOV, and WebM for video, and MP3, WAV, and M4A for audio. Files up to 500MB are supported.",
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

const Index = () => {
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  useEffect(() => {
    if (!heroVideoRef.current || heroVideoFailed) return;
    const playPromise = heroVideoRef.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay can be blocked on some devices; keep muted loop attributes as the primary signal.
      });
    }
  }, [heroVideoFailed]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative min-h-svh flex items-center overflow-hidden">
        <FloatingOrbs count={5} />
        <GridPattern />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />

        {/* Floating decorative icons */}
        <FloatingIcon className="top-[20%] right-[8%] opacity-10" delay={0}>
          <Sparkles className="w-10 h-10 text-primary" />
        </FloatingIcon>
        <FloatingIcon className="bottom-[25%] left-[5%] opacity-10" delay={2}>
          <Monitor className="w-8 h-8 text-primary" />
        </FloatingIcon>
        <FloatingIcon className="top-[40%] right-[45%] opacity-5" delay={4}>
          <Globe className="w-14 h-14 text-primary" />
        </FloatingIcon>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="text-primary font-mono text-sm tracking-widest uppercase mb-6"
            >
              AI Avatar Generation
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.05] mb-6"
            >
              Your digital twin,{" "}
              <span className="text-gradient-cyan">crafted to perfection.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10"
            >
              Create a studio-grade avatar video
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link
                to="/upload"
                className="btn-press bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
              >
                Create your Avatar
              </Link>
              <Link
                to="/about"
                className="btn-press border border-border text-foreground px-8 py-4 rounded-full text-base font-medium hover:bg-muted transition-colors duration-150"
              >
                Learn More
              </Link>
            </motion.div>

            {/* Quick process preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.65 }}
              className="flex items-center gap-3 border-t border-border pt-8"
            >
              {[
                { icon: Mic, label: "Voice" },
                { icon: Video, label: "Video" },
                { icon: Sparkles, label: "Avatar" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-xs font-mono">{step.label}</span>
                  </div>
                  {i < 2 && <ArrowRight className="w-3 h-3 text-muted-foreground/40" />}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden glow-cyan"
          >
            {heroVideoFailed ? (
              <motion.img
                src={heroBg}
                alt="MyAvatar hero preview"
                className="w-full aspect-[4/5] md:aspect-[3/4] object-cover rounded-2xl"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <video
                ref={heroVideoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={heroBg}
                onError={() => setHeroVideoFailed(true)}
                onCanPlay={(e) => {
                  const playPromise = e.currentTarget.play();
                  if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
                }}
                className="w-full aspect-[4/5] md:aspect-[3/4] object-cover rounded-2xl"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-cyan">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1 font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        <FloatingOrbs count={2} className="opacity-50" />
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
              Accelerate your content.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to produce studio-quality avatar videos at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-150"
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title === "Up to 4K Resolution" ? (
                    <><span className="text-primary">Up to</span> 4K <span className="text-primary">Resolution</span></>
                  ) : feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-y border-border bg-card/30 relative overflow-hidden">
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
              Three steps. Premium results.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Creating your AI avatar is as simple as uploading two files.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className="glass-card p-8 text-center group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-150"
                  whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 400 } }}
                >
                  <item.icon className="w-7 h-7 text-primary" />
                </motion.div>
                <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Step {item.step}</p>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                {i < steps.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 text-primary/30" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Use Cases */}
      <section className="py-24 relative overflow-hidden">
        <FloatingOrbs count={2} className="opacity-40" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Trusted by professionals.
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From corporate teams to independent professionals, MyAvatar powers studio-grade video at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                className="glass-card overflow-hidden group hover:border-primary/20 transition-colors duration-150"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={uc.image}
                    alt={uc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                </div>
                <div className="p-8 -mt-12 relative">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">{uc.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{uc.description}</p>
                  <a href="#" className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                    See video example <span aria-hidden="true">→</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to know about MyAvatar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="border-t border-border"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* CTA */}
      <section className="py-24 border-t border-border relative overflow-hidden">
        <FloatingOrbs count={3} />
        <ScanBeam />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to create your avatar?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of professionals and organisations already using MyAvatar to produce studio-grade videos.
            </p>
            <Link
              to="/pricing"
              className="btn-press inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
            >
              Start Generating →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
