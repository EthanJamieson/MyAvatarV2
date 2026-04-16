export interface GallerySample {
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  resolution: string;
  language: string;
  duration: string;
  features: string[];
}

export const demoSamples: GallerySample[] = [
  {
    slug: "corporate-presenter",
    title: "Corporate Presenter",
    category: "Business",
    description: "Professional corporate announcement delivered by an AI avatar in a formal studio setting.",
    fullDescription: "This demo showcases a polished corporate announcement video featuring an AI-generated avatar in a professional studio environment. The avatar delivers a quarterly results summary with natural gestures, precise lip-sync, and branded lower-thirds. Ideal for internal communications, investor updates, and company-wide announcements — produced in minutes instead of days.",
    resolution: "Up to 4K",
    language: "English",
    duration: "2:30",
    features: ["Custom branded background", "Professional gestures", "Lower-third overlays", "Up to 4K output"],
  },
  {
    slug: "training-module",
    title: "Training Module",
    category: "Education",
    description: "Employee onboarding walkthrough with multi-language subtitles and custom branding.",
    fullDescription: "An employee onboarding training module featuring an AI avatar guiding new hires through company policies, safety procedures, and role-specific training. The video includes auto-generated subtitles in both English and Zulu, making it accessible to a diverse South African workforce. Perfect for scaling training across multiple branches without repeated filming sessions.",
    resolution: "Up to 4K",
    language: "English / Zulu",
    duration: "5:00",
    features: ["Multi-language subtitles", "Chapter markers", "Custom branding", "Consistent delivery"],
  },
  {
    slug: "product-launch",
    title: "Product Launch",
    category: "Marketing",
    description: "Dynamic product reveal video featuring an AI avatar with branded backgrounds and motion graphics.",
    fullDescription: "A high-energy product launch video where an AI avatar introduces a new product with enthusiasm and precision. The video features dynamic motion graphics, branded colour palettes, and a professional call-to-action. This demo proves that marketing teams can produce launch content at scale without booking studios or coordinating talent schedules.",
    resolution: "Up to 4K",
    language: "English",
    duration: "1:45",
    features: ["Motion graphics", "Branded colour palette", "Call-to-action overlay", "Social media ready"],
  },
  {
    slug: "real-estate-tour",
    title: "Real Estate Tour",
    category: "Real Estate",
    description: "Virtual property walkthrough narrated by a professional AI avatar with custom voiceover.",
    fullDescription: "A virtual property tour narrated by a professional AI avatar in Afrikaans, designed for the South African real estate market. The avatar introduces the property, highlights key features, and guides potential buyers through each room. Estate agents can generate personalised tour videos for every listing without hiring a videographer.",
    resolution: "1080p",
    language: "Afrikaans",
    duration: "3:15",
    features: ["Afrikaans voiceover", "Property highlight cards", "Contact details overlay", "Shareable format"],
  },
  {
    slug: "healthcare-explainer",
    title: "Healthcare Explainer",
    category: "Healthcare",
    description: "Patient education video explaining medical procedures in clear, accessible language.",
    fullDescription: "A patient education video where an AI avatar explains a common medical procedure in simple, reassuring language. Available in both English and Sotho, this video helps healthcare providers communicate complex information to diverse patient populations. Clinics and hospitals can create procedure-specific explainers for waiting rooms, patient portals, and pre-appointment communications.",
    resolution: "Up to 4K",
    language: "English / Sotho",
    duration: "4:00",
    features: ["Bilingual narration", "Clear medical terminology", "Patient-friendly tone", "Clinic branding"],
  },
  {
    slug: "financial-advisory",
    title: "Financial Advisory",
    category: "Finance",
    description: "Personalised financial advisory update delivered with a professional, trustworthy avatar.",
    fullDescription: "A personalised financial advisory update where an AI avatar delivers portfolio performance summaries and market insights. The avatar projects trust and professionalism, making it ideal for wealth management firms and financial advisors who want to scale their client communications. Each video can be customised per client with specific data points and recommendations.",
    resolution: "Up to 4K",
    language: "English",
    duration: "2:00",
    features: ["Data-driven content", "Trustworthy presentation", "Client personalisation", "Compliance-ready"],
  },
];
