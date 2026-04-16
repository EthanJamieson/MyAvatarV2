import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Cpu, Users, MapPin, Mic, Video, Sparkles, Building2, Briefcase, Presentation, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import aboutInfrastructure from "@/assets/about-infrastructure.jpg";
import aboutTeam from "@/assets/about-team.jpg";
import aboutTechnology from "@/assets/about-technology.jpg";
import aboutVideo from "@/assets/about-video.mp4";
import { FloatingOrbs, GridPattern, GlowLine, PulsingDot, ScanBeam } from "@/components/AnimatedElements";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const About = () => {
  const aboutVideoRef = useRef<HTMLVideoElement | null>(null);
  const [aboutVideoFailed, setAboutVideoFailed] = useState(false);

  useEffect(() => {
    if (!aboutVideoRef.current || aboutVideoFailed) return;
    const playPromise = aboutVideoRef.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Ignore autoplay failures; video attributes still request autoplay where allowed.
      });
    }
  }, [aboutVideoFailed]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <FloatingOrbs count={4} />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl mb-8"
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">About Us</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.05] mb-6">
              High-fidelity rendering,{" "}
              <span className="text-gradient-cyan">built for the world.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              We're building the next-generation AI avatar platform — premium, secure, and designed for uncompromising quality. 
              Our mission is to put professional video production within reach for every team and creator.
            </p>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Video showcase */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="relative rounded-2xl overflow-hidden glow-cyan aspect-video"
          >
            {aboutVideoFailed ? (
              <motion.img
                src={aboutTechnology}
                alt="AI avatar technology showcase"
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <video
                ref={aboutVideoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onError={() => setAboutVideoFailed(true)}
                onCanPlay={(e) => {
                  const playPromise = e.currentTarget.play();
                  if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
                }}
                className="w-full h-full object-cover"
              >
                <source src={aboutVideo} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="text-foreground font-display text-2xl md:text-3xl font-bold mb-2">
                See it in action
              </p>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg">
                Our AI avatars deliver studio-quality video output, rendered on enterprise-grade global infrastructure.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story sections with images */}
      <section className="py-20 relative overflow-hidden">
        <FloatingOrbs count={2} className="opacity-40" />
        <ScanBeam />
        <div className="container mx-auto px-6 space-y-24">

          {/* Section 1 — Built for Creators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div>
              <span className="font-display text-6xl font-bold text-muted-foreground/15">01</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 mt-2">
                Built for Creators Worldwide
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MyAvatar was born from a simple belief: world-class AI tools should be accessible to everyone, 
                regardless of where you are. We built premium rendering infrastructure designed to serve creators globally.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From New York to Tokyo, London to São Paulo — creators everywhere deserve tools that 
                deliver exceptional quality, fair pricing, and uncompromising data security.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden glow-cyan">
              <img
                src={aboutTeam}
                alt="Creators working in a modern studio"
                className="w-full h-72 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Section 2 — Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div className="order-2 md:order-1 rounded-2xl overflow-hidden glow-cyan">
              <img
                src={aboutInfrastructure}
                alt="Enterprise server infrastructure"
                className="w-full h-72 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="font-display text-6xl font-bold text-muted-foreground/15">02</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 mt-2">
                Studio-Grade, Zero Compromise
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our avatar engine produces up to 4K photorealistic output that's indistinguishable from studio footage. 
                Every frame is rendered on secure, enterprise-grade infrastructure with full data protection compliance.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We've invested heavily in GPU clusters housed in Tier-3 data centres globally, 
                delivering sub-5ms inference times that set the industry standard.
              </p>
            </div>
          </motion.div>

          {/* Section 3 — Technology */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <div>
              <span className="font-display text-6xl font-bold text-muted-foreground/15">03</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 mt-2">
                The Technology
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We combine state-of-the-art neural radiance fields with proprietary voice synthesis 
                to create digital twins that move, speak, and emote with uncanny fidelity. 
                Every detail is precision-crafted for studio-grade output.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our models are trained on globally diverse datasets, ensuring accurate representation 
                across skin tones, accents, and languages. We support 30+ languages 
                and growing.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden glow-cyan">
              <img
                src={aboutTechnology}
                alt="AI neural network technology visualization"
                className="w-full h-72 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* How it works */}
      <section className="py-20 border-y border-border bg-card/30 relative overflow-hidden">
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
              How it works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to create your photorealistic AI avatar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
                description: "Provide a brief video clip. We extract facial geometry, expressions, and movement patterns to build your digital twin.",
              },
              {
                icon: Sparkles,
                step: "03",
                title: "Generate & Download",
                description: "Our engine synthesises your avatar with cinema-grade precision. Download in up to 4K, ready for any platform or broadcast.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className="glass-card p-8 text-center group hover:border-primary/20 transition-colors duration-150"
              >
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-150">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Step {item.step}</p>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "Up to 4K", label: "Output Resolution" },
            { value: "30+", label: "Languages Supported" },
            { value: "Global", label: "Infrastructure" },
            { value: "99.9%", label: "Uptime SLA" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <p className="font-display text-3xl font-bold text-gradient-cyan">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1 font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why MyAvatar */}
      <section className="py-20 relative overflow-hidden">
        <FloatingOrbs count={3} className="opacity-30" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Why MyAvatar?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Purpose-built advantages that set us apart.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Global Infrastructure",
                description: "Distributed rendering across Tier-3 data centres worldwide. Your data is protected with enterprise-grade security and regional compliance.",
              },
              {
                icon: Shield,
                title: "Data Security",
                description: "Full compliance with global data protection regulations including GDPR. Your likeness, voice, and content are encrypted and never shared.",
              },
              {
                icon: Cpu,
                title: "Cutting-Edge AI",
                description: "Neural radiance fields, voice cloning, and lip sync powered by custom models trained on globally diverse datasets.",
              },
              {
                icon: Users,
                title: "Creator-First Pricing",
                description: "Flexible pay-per-video packs designed for creators at every level. No subscriptions, no hidden fees — just fair, transparent pricing.",
              },
              {
                icon: Video,
                title: "Broadcast Ready",
                description: "Up to 4K output at 60fps with alpha channel support. Ready for YouTube, TikTok, broadcast TV, or corporate presentations.",
              },
              {
                icon: Sparkles,
                title: "30+ Languages",
                description: "Supporting a growing library of languages with natural accent preservation and cultural nuance for creators worldwide.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                className="glass-card p-8 group hover:border-primary/20 transition-colors duration-150"
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-150">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Built for Professionals */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <FloatingOrbs count={2} className="opacity-30" />
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Built for professionals & corporates
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              MyAvatar is designed for organisations and individuals that demand premium quality, security, and scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: Building2,
                title: "Corporate Training",
                description: "Produce multilingual training and onboarding videos without scheduling studio time. Consistent, brandable, and scalable across your entire organisation.",
              },
              {
                icon: Briefcase,
                title: "Professional Services",
                description: "Consultants, agencies, and law firms use MyAvatar for client presentations, pitch videos, and thought leadership content that elevates their brand.",
              },
              {
                icon: Presentation,
                title: "Internal Communications",
                description: "Deliver clear, engaging updates across your organisation — from CEO messages and team briefings to company-wide announcements, all in professional video.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-150"
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                >
                  <item.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="glass-card p-8 md:p-10 border-primary/20 glow-cyan"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  Enterprise & Volume Solutions
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Need 100+ videos, white-label integration, or a dedicated API? We offer tailored solutions 
                  for organisations with high-volume requirements, including dedicated support, custom SLAs, 
                  and priority rendering.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/pricing#contact"
                    className="btn-press inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-150"
                  >
                    Contact Sales <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/pricing"
                    className="btn-press inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-muted transition-colors duration-150"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "100+", label: "Video packs" },
                  { value: "SLA", label: "Guaranteed" },
                  { value: "24/7", label: "Support" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-xl">
                    <p className="font-display text-xl font-bold text-gradient-cyan">{stat.value}</p>
                    <p className="text-muted-foreground text-xs font-mono mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              To bring studio-grade video production to every professional and organisation. 
              Whether you're a corporate team producing training content or a consultancy creating 
              client-facing presentations, MyAvatar gives you Hollywood-grade tools — at a fraction 
              of the cost.
            </p>
            <Link
              to="/upload"
              className="btn-press inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-opacity duration-150 glow-cyan"
            >
              Start Creating →
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
