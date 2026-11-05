"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { NAV } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const panelId = useId();
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 280 && y > lastY.current && !menuOpen);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  // Close everything on route change.
  useEffect(() => {
    setMenuOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen && openGroup === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenGroup(null);
      if (menuOpen) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, openGroup, closeMenu]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || openGroup !== null || !overHero;

  return (
    <>
      <a
        href="#permbajtja"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-pill bg-ink px-5 py-3 font-semibold text-white focus:translate-y-0"
      >
        Kalo te përmbajtja
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)]",
          hidden && !reduce && "-translate-y-full",
        )}
        onMouseLeave={() => setOpenGroup(null)}
      >
        <div
          className={cn(
            "transition-[background-color,box-shadow,backdrop-filter] duration-500",
            solid ? "bg-white/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150" : "bg-transparent",
          )}
        >
          <div className="shell flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
            <Link href="/" className="group flex items-center gap-3" aria-label="Gjimnazi Eqrem Çabej, ballina">
              <Image src="/logo.png" alt="" width={44} height={44} className="size-10 rounded-full md:size-11" priority />
              <span className="leading-[1.05]">
                <span className="block text-[0.98rem] font-bold tracking-[-0.02em]">Gjimnazi &ldquo;Eqrem Çabej&rdquo;</span>
                <span className="block text-[0.8rem] text-muted">Prishtinë</span>
              </span>
            </Link>

            <nav aria-label="Navigimi kryesor" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((group, gi) => {
                  const open = openGroup === gi;
                  const active = group.links.some((l) => isActive(l.href));
                  return (
                    <li key={group.label} onMouseEnter={() => setOpenGroup(gi)}>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`${panelId}-${gi}`}
                        onClick={() => setOpenGroup(open ? null : gi)}
                        className={cn(
                          "flex items-center gap-1 rounded-pill px-4 py-2 text-[0.95rem] font-medium transition-colors",
                          open || active ? "bg-ink/[0.06] text-ink" : "text-ink/80 hover:text-ink",
                        )}
                      >
                        {group.label}
                        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Magnetic className="hidden lg:inline-block">
                <Link
                  href="/kontakti"
                  className="inline-flex min-h-11 items-center rounded-pill bg-ink px-5 text-[0.95rem] font-semibold text-white transition-colors hover:bg-blue"
                >
                  Kontakti
                </Link>
              </Magnetic>
              <button
                ref={menuBtn}
                type="button"
                className="inline-flex min-h-11 items-center gap-2.5 rounded-pill border border-ink/15 bg-white/70 px-4 text-[0.95rem] font-semibold backdrop-blur lg:hidden"
                aria-expanded={menuOpen}
                aria-controls={`${panelId}-mobile`}
                onClick={() => setMenuOpen(true)}
              >
                <span className="flex w-4 flex-col gap-[3px]" aria-hidden>
                  <span className="h-[1.5px] w-full bg-current" />
                  <span className="h-[1.5px] w-full bg-current" />
                  <span className="h-[1.5px] w-2/3 bg-current" />
                </span>
                Menyja
              </button>
            </div>
          </div>
        </div>

        {/* Desktop mega panel */}
        <AnimatePresence>
          {openGroup !== null && (
            <motion.div
              key="panel"
              id={`${panelId}-${openGroup}`}
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="hidden border-b border-line bg-white/95 backdrop-blur-xl lg:block"
            >
              <div className="shell grid grid-cols-12 gap-8 py-10">
                <p className="col-span-3 text-mega font-bold leading-none text-ink/[0.07]" aria-hidden>
                  {NAV[openGroup].label}
                </p>
                <ul className="col-span-9 grid grid-cols-2 gap-x-10 gap-y-2 xl:grid-cols-3">
                  {NAV[openGroup].links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={isActive(l.href) ? "page" : undefined}
                        className="group block rounded-2xl p-4 transition-colors hover:bg-paper"
                        onClick={() => setOpenGroup(null)}
                      >
                        <span className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
                          {isActive(l.href) && <span className="size-1.5 rounded-full bg-blue" aria-hidden />}
                          {l.label}
                        </span>
                        {l.description && <span className="mt-0.5 block text-[0.93rem] text-muted">{l.description}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={`${panelId}-mobile`}
            role="dialog"
            aria-modal="true"
            aria-label="Menyja"
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-white lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="shell flex h-[4.5rem] shrink-0 items-center justify-between">
              <span className="font-bold tracking-[-0.02em]">Gjimnazi &ldquo;Eqrem Çabej&rdquo;</span>
              <button
                type="button"
                autoFocus
                onClick={closeMenu}
                className="inline-flex min-h-11 items-center gap-2 rounded-pill border border-white/20 px-4 font-semibold"
              >
                <X aria-hidden className="size-4" /> Mbyll
              </button>
            </div>
            <nav aria-label="Navigimi kryesor" className="shell flex-1 overflow-y-auto pb-10 pt-4">
              {NAV.map((group, gi) => (
                <motion.div
                  key={group.label}
                  className="border-t border-white/10 py-5"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + gi * 0.06, duration: 0.6, ease: EASE }}
                >
                  <p className="text-sm text-white/50">{group.label}</p>
                  <ul className="mt-2">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive(l.href) ? "page" : undefined}
                          className={cn(
                            "block py-1.5 text-[1.85rem] font-semibold leading-tight tracking-[-0.03em]",
                            isActive(l.href) ? "text-blue-soft" : "text-white",
                          )}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
              <Link
                href="/kontakti"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex min-h-12 items-center rounded-pill bg-blue px-6 font-semibold"
              >
                Kontakti
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
