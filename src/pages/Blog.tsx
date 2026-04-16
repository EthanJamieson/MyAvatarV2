import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogHero from "@/assets/blog-hero.jpg";
import { FloatingOrbs, GlowLine, ScanBeam } from "@/components/AnimatedElements";
import { articles } from "@/data/blog-data";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const Blog = () => {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <FloatingOrbs count={3} />
        <div className="absolute inset-0">
          <img src={blogHero} alt="Blog resources" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Resources</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5">
              Insights & <span className="text-gradient-cyan">guides</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Expert articles on AI avatars, video marketing, and the future of content creation.
            </p>
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Featured article */}
      {featured && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="glass-card p-8 md:p-12 relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
            >
              <ScanBeam />
              <div className="relative z-10">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                  Featured
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-4 mb-3">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-2xl">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-6">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {featured.category}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                  <span>{featured.date}</span>
                </div>
                <Link to={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline">
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Article grid */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article, i) => (
              <Link key={article.title} to={`/blog/${article.slug}`} className="flex">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                className="glass-card p-7 group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 flex flex-col w-full"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <article.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-primary mb-2">{article.category}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{article.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="glass-card p-8 text-center"
          >
            <BookOpen className="w-7 h-7 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Stay in the loop</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Get the latest insights on AI avatars and video marketing delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 bg-muted border border-border rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="btn-press bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity duration-150 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
