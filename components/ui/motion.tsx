"use client";

import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.28,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const staggerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type PageTransitionProps = {
  children: ReactNode;
};

type FadeInProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

type StaggerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function FadeIn({ children, ...props }: FadeInProps) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, ...props }: StaggerProps) {
  return (
    <motion.div variants={staggerVariants} initial="initial" animate="animate" {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: FadeInProps) {
  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}
