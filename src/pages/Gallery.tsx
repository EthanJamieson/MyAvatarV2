import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Sparkles, ArrowRight, Mic, Monitor } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import galleryHero from "@/assets/gallery-hero.jpg";
import { FloatingOrbs, GlowLine, ScanBeam } from "@/components/AnimatedElements";
import { demoSamples } from "@/data/gallery-data";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingOrbs count={4} />
        <div className="absolute inset-0">
          <img src={galleryHero} alt="Demo gallery" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Demo Gallery</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
              See what <span className="text-gradient-cyan">MyAvatar</span> can do
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse sample avatar videos across industries. Every example was generated using our AI platform.
            </p>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Sample Grid */}
      <section className="py-24 relative overflow-hidden">
        <ScanBeam />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoSamples.map((sample, i) => (
              <Link key={sample.title} to={`/gallery/${sample.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass-card overflow-hidden group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Placeholder video thumbnail */}
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                  <motion.div
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer group-hover:bg-primary/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="w-6 h-6 text-primary ml-0.5" />
                  </motion.div>
                  <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                    {sample.category}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs font-mono text-muted-foreground bg-background/80 px-2 py-0.5 rounded">
                    {sample.duration}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{sample.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{sample.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {sample.resolution}</span>
                    <span className="flex items-center gap-1"><Mic className="w-3 h-3" /> {sample.language}</span>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Gallery;
