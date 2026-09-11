"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "./cn";

interface RevealProps {
  children: ReactNode;
  /** Décalage en millisecondes, pour faire arriver les éléments en cascade. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Révèle son contenu quand il entre dans la fenêtre.
 * L'animation elle-même vit dans globals.css : ici, on ne fait que basculer
 * un attribut, ce qui laisse le respect de `prefers-reduced-motion` au CSS.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      data-reveal={visible ? "in" : ""}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
