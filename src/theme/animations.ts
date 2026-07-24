export const animations = {
  transitionFast: "all 0.15s ease",
  transitionNormal: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  transitionSlow: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  motionVariants: {
    fadeIn: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
      transition: { duration: 0.25, ease: "easeOut" },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, ease: "easeOut" },
    },
  },
} as const;

export type Animations = typeof animations;
