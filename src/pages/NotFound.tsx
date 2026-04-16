import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FloatingOrbs } from "@/components/AnimatedElements";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="flex min-h-screen items-center justify-center relative overflow-hidden">
        <FloatingOrbs count={4} />
        <div className="text-center relative z-10">
          <h1 className="mb-4 font-display text-6xl font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
          <Link to="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
