import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingOrbs } from "@/components/AnimatedElements";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden py-24 md:py-32">
        <FloatingOrbs count={3} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto max-w-3xl glass-card p-8 md:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary font-mono">Payment Received</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Thank you for choosing MyAvatar
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Your payment has been received. We are now processing your order and our team will be in touch shortly
              with the next steps.
            </p>
            {reference && (
              <p className="mt-6 text-sm text-muted-foreground">
                Payment reference: <span className="font-mono text-foreground">{reference}</span>
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/pricing#contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90"
              >
                Contact support
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/27837524764"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-foreground transition hover:bg-secondary"
              >
                WhatsApp us
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PaymentCallback;
