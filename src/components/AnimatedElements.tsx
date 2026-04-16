import { motion } from "framer-motion";

/** Floating orbs that drift around a section — purely decorative */
const FloatingOrbs = ({ count = 3, className = "" }: { count?: number; className?: string }) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 80 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full bg-primary/5 blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
};

/** Grid pattern overlay */
const GridPattern = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-0 pointer-events-none opacity-[0.03] ${className}`}
    style={{
      backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
    }}
  />
);

/** Animated gradient line — horizontal or vertical */
const GlowLine = ({ direction = "horizontal", className = "" }: { direction?: "horizontal" | "vertical"; className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className={direction === "horizontal" ? "h-px w-full bg-border relative" : "w-px h-full bg-border relative"}>
      <motion.div
        className={`absolute bg-gradient-to-r from-transparent via-primary to-transparent ${
          direction === "horizontal" ? "h-full w-1/3 top-0" : "w-full h-1/3 left-0"
        }`}
        animate={direction === "horizontal" ? { x: ["-100%", "400%"] } : { y: ["-100%", "400%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
      />
    </div>
  </div>
);

/** Pulsing dot indicator */
const PulsingDot = ({ className = "" }: { className?: string }) => (
  <span className={`relative flex h-2.5 w-2.5 ${className}`}>
    <motion.span
      className="absolute inline-flex h-full w-full rounded-full bg-primary"
      animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
  </span>
);

/** Floating icon that bobs gently */
const FloatingIcon = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ y: [0, -12, 0], rotate: [0, 5, -3, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {children}
  </motion.div>
);

/** Animated counter that counts up on view */
const CountUp = ({ value, className = "" }: { value: string; className?: string }) => {
  const numericPart = value.replace(/[^0-9.]/g, "");
  const prefix = value.replace(/[0-9.+]+.*/, "");
  const suffix = value.replace(/.*[0-9.]/, "");
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
    >
      {value}
    </motion.span>
  );
};

/** Horizontal scanning beam that sweeps across a section */
const ScanBeam = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
    <motion.div
      className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent"
      animate={{ left: ["-5%", "105%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
    />
  </div>
);

/** Animated corner accents for cards/sections */
const CornerAccents = ({ className = "" }: { className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none ${className}`}>
    <motion.div
      className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-primary to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-primary to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-primary to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-px h-8 bg-gradient-to-t from-primary to-transparent"
      animate={{ opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    />
  </div>
);

export { FloatingOrbs, GridPattern, GlowLine, PulsingDot, FloatingIcon, CountUp, ScanBeam, CornerAccents };
