// ─── Framer Motion animation variants ─────────────────────────────────────────
// Using "easeOut" string to avoid TypeScript easing type issues with cubic-bezier arrays

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: "easeOut" as const } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export const slideInLeft = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.4, ease: "easeOut" as const } },
};

export const slideInRight = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.4, ease: "easeOut" as const } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1,    transition: { duration: 0.35, ease: "easeOut" as const } },
};

export const dropIn = {
  hidden:  { opacity: 0, scale: 0.94, y: -10 },
  visible: { opacity: 1, scale: 1,    y: 0,   transition: { duration: 0.3, ease: "easeOut" as const } },
  exit:    { opacity: 0, scale: 0.94, y: -10, transition: { duration: 0.2, ease: "easeIn" as const  } },
};

// Container that staggers children
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
});

// Single staggered child
export const staggerChild = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// Table row stagger child
export const tableRow = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0,   transition: { duration: 0.3, ease: "easeOut" as const } },
};

// Hover card — use as whileHover prop value
export const cardHover = {
  y: -4,
  scale: 1.025,
  boxShadow: "0 20px 40px -8px rgba(59, 130, 246, 0.22), 0 8px 16px -4px rgba(0,0,0,0.1)",
  transition: { duration: 0.25, ease: "easeOut" as const },
};

// Button press
export const buttonTap = { scale: 0.96 };
