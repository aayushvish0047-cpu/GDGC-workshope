"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useGame } from "@/components/GameProvider";
import { navLinks, profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";

export function Navbar() {
  const { xp } = useGame();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.75] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || menuOpen
          ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#hero"
          className="group flex items-center gap-3 rounded-full"
          aria-label={`${profile.name}, ${profile.role} — back to top`}
        >
          <span className="flex size-9 items-center justify-center rounded-full border border-white/15 text-sm font-medium text-paper transition-colors duration-300 group-hover:border-white/45">
            {profile.name.charAt(0)}
          </span>
          <span className="hidden text-sm tracking-tight text-white/60 sm:block">
            {profile.name}
            <span className="px-2 text-white/25">/</span>
            {profile.role}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] tracking-tight transition-colors duration-300",
                  isActive
                    ? "bg-white/[0.07] text-paper"
                    : "text-white/50 hover:text-paper",
                )}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[11px] tracking-[0.18em] text-white/55 sm:inline-flex">
            LVL <span className="text-paper">{String(xp.level).padStart(2, "0")}</span>
          </span>

          <a
            href="#contact"
            className="hidden rounded-full bg-paper px-4 py-2 text-[13px] font-medium tracking-tight text-ink transition-opacity duration-300 hover:opacity-80 md:inline-flex"
          >
            Start a project
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-paper transition-colors duration-300 hover:border-white/40 md:hidden"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            {menuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="mobile-navigation"
          className="animate-menu-in border-t border-white/10 bg-ink/95 backdrop-blur-xl md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                aria-current={activeSection === link.id ? "true" : undefined}
                className={cn(
                  "border-b border-white/5 py-4 text-lg tracking-tight transition-colors duration-300",
                  activeSection === link.id ? "text-paper" : "text-white/60",
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-5 inline-flex justify-center rounded-full bg-paper px-5 py-3 text-sm font-medium text-ink"
            >
              Start a project
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
