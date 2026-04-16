import { Link } from "react-router-dom";
import { Facebook, Linkedin, MessageCircle, Send } from "lucide-react";
import logo from "@/assets/logo.png";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
  </svg>
);

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/people/MyAvatar-Studios/61571986520641/" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/myavatar-studios/about/?viewAsMember=true" },
  { name: "TikTok", icon: TikTokIcon, href: "https://www.tiktok.com/@myavatar.studios" },
  { name: "WhatsApp", icon: MessageCircle, href: "https://web.whatsapp.com/send?phone=27765877288&text=Hi%2C%20I'm%20interested%20in%20MyAvatar%20services." },
  { name: "Telegram", icon: Send, href: "https://t.me/+27765877288" },
];

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="MyAvatar" className="h-8 w-8 object-contain" />
            <span className="font-display font-bold text-lg tracking-tighter text-foreground">
              MyAvatar
            </span>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs mb-4">
            Premium AI avatar generation with global infrastructure. Studio-grade quality, crafted for creators worldwide.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
          <div className="space-y-2">
            <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">Pricing</Link>
            <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">Blog</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
          <div className="space-y-2">
            <Link to="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">About Us</Link>
            <a href="mailto:studio@myavatar.co.za" className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">Contact</a>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 MyAvatar. All rights reserved.</p>
        <p className="text-xs text-muted-foreground font-mono">myavatar.co.za</p>
      </div>
    </div>
  </footer>
);

export default Footer;
