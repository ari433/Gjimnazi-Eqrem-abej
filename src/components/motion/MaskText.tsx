"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  as?: "h1" | "h2" | "p";
  className?: string;
  delay?: number;
  /** Animate on mount (page titles) instead of on scroll into view. */
  immediate?: boolean;
  id?: string;
};

/**
 * Headline whose words rise out of a clipping mask. The full string stays in
 * the DOM as one accessible heading; the animated spans are aria-hidden.
 */
export function MaskText({ text, as = "h2", className, delay = 0, immediate = false, id }: Props) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");
  const trigger =
    immediate || reduce ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag id={id} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="block"
        initial={reduce ? false : "hidden"}
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom">
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "105%" },
                show: { y: "0%", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
