import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Send, Facebook, Linkedin, Bot } from "lucide-react";
import ChatbotPanel from "./ChatbotPanel";

const WHATSAPP_NUMBER = "27765877288";
const WHATSAPP_URL = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=Hi%2C%20I'm%20interested%20in%20MyAvatar%20services.`;
const EMAIL_ADDRESS = "studio@myavatar.co.za";
const TELEGRAM_URL = "https://t.me/+27765877288";
const FACEBOOK_URL = "https://www.facebook.com/people/MyAvatar-Studios/61571986520641/";
const LINKEDIN_URL = "https://www.linkedin.com/company/myavatar-studios/about/?viewAsMember=true";
const TIKTOK_URL = "https://www.tiktok.com/@myavatar.studios";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
  </svg>
);

const channels = [
  {
    name: "Ask AI",
    icon: Bot,
    href: "#chatbot",
    color: "bg-accent hover:bg-accent/90",
    isChatbot: true,
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: WHATSAPP_URL,
    color: "bg-[#25D366] hover:bg-[#20bd5a]",
  },
  {
    name: "Email",
    icon: Mail,
    href: `mailto:${EMAIL_ADDRESS}?subject=MyAvatar%20Enquiry`,
    color: "bg-primary hover:bg-primary/90",
  },
  {
    name: "Telegram",
    icon: Send,
    href: TELEGRAM_URL,
    color: "bg-[#229ED9] hover:bg-[#1a8abf]",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: FACEBOOK_URL,
    color: "bg-[#1877F2] hover:bg-[#1565d8]",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: LINKEDIN_URL,
    color: "bg-[#0A66C2] hover:bg-[#0958a8]",
  },
  {
    name: "TikTok",
    icon: TikTokIcon,
    href: TIKTOK_URL,
    color: "bg-[#010101] hover:bg-[#333333]",
  },
];

const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {chatbotOpen && (
          <ChatbotPanel onClose={() => setChatbotOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && !chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 mb-1"
          >
            {channels.map((ch) => (
              <motion.a
                key={ch.name}
                href={ch.isChatbot ? undefined : ch.href}
                target={ch.isChatbot ? undefined : "_blank"}
                rel={ch.isChatbot ? undefined : "noopener noreferrer"}
                onClick={
                  ch.isChatbot
                    ? (e) => {
                        e.preventDefault();
                        setChatbotOpen(true);
                        setOpen(false);
                      }
                    : undefined
                }
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15 }}
                className={`flex items-center gap-2 ${ch.color} text-white pl-4 pr-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold whitespace-nowrap cursor-pointer`}
              >
                <ch.icon className="w-4 h-4" />
                {ch.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          if (chatbotOpen) {
            setChatbotOpen(false);
          } else {
            setOpen((prev) => !prev);
          }
        }}
        aria-label="Chat with us"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", bounce: 0.4 }}
        className="flex items-center gap-2 bg-primary text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        {open || chatbotOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
        <span className="text-sm font-semibold hidden sm:inline">
          {open || chatbotOpen ? "Close" : "Chat with us"}
        </span>
      </motion.button>
    </div>
  );
};

export default WhatsAppWidget;
