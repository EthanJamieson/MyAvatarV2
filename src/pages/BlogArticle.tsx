import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingOrbs, GlowLine } from "@/components/AnimatedElements";
import { articles } from "@/data/blog-data";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);
  const otherArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Link to="/blog" className="text-primary hover:underline">← Back to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = article.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <FloatingOrbs count={3} />
        <div className="relative container mx-auto px-6 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-mono mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {article.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                <span>{article.date}</span>
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">{article.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 border-l-2 border-primary/30 pl-4">{article.excerpt}</p>
          </motion.div>

          {/* Article content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="prose-custom space-y-5"
          >
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{
                __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
              }} />
            ))}
          </motion.div>
        </div>
      </section>

      <GlowLine className="container mx-auto px-6" />

      {/* Related articles */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">More articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherArticles.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease, delay: i * 0.06 }}
              >
                <Link
                  to={`/blog/${a.slug}`}
                  className="glass-card p-5 block group hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 h-full"
                >
                  <span className="text-[10px] font-mono tracking-widest uppercase text-primary">{a.category}</span>
                  <h3 className="font-display text-sm font-semibold text-foreground mt-2 mb-2 line-clamp-2">{a.title}</h3>
                  <span className="text-xs text-muted-foreground font-mono">{a.readTime}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogArticle;
