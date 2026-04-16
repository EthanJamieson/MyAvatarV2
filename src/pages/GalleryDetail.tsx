import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, Mic, Clock, Play, Sparkles, ArrowRight, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingOrbs, GlowLine } from "@/components/AnimatedElements";
import { demoSamples } from "@/data/gallery-data";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const GalleryDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const sample = demoSamples.find((s) => s.slug === slug);

  if (!sample) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Sample not found</h1>
          <Link to="/gallery" className="text-primary hover:underline">← Back to Gallery</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <FloatingOrbs count={3} />
        <div className="relative container mx-auto px-6 max-w-4xl">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-mono mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
              {sample.category}
            </span>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-4">{sample.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-mono mb-8">
              <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4" /> {sample.resolution}</span>
              <span className="flex items-center gap-1.5"><Mic className="w-4 h-4" /> {sample.language}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {sample.duration}</span>
            </div>
          </motion.div>

          {/* Video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="glass-card overflow-hidden mb-12"
          >
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15" />
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.div>
              <p className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground bg-background/80 px-3 py-1 rounded">
                Demo video coming soon
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">About this demo</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{sample.fullDescription}</p>

            <h3 className="font-display text-lg font-semibold text-foreground mb-3">Key features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {sample.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default GalleryDetail;
