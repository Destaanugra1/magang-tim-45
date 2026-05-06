"use client";
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  containerClassName?: string;
  desktopActions?: ReactNode;
  mobileActions?: ReactNode;
  mobileFooter?: ReactNode;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const isExternalLink = (href: string) =>
  href.startsWith("http://") ||
  href.startsWith("https://") ||
  href.startsWith("//") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("#");

function NavLink({
  href,
  className,
  style,
  ariaLabel,
  role,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
  role?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  children: ReactNode;
}) {
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        aria-label={ariaLabel}
        role={role}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      aria-label={ariaLabel}
      role={role}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default function PillNav({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  containerClassName = "",
  desktopActions,
  mobileActions,
  mobileFooter,
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#120F17",
  hoveredPillTextColor = "#120F17",
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const itemKey = items.map((item) => `${item.href}:${item.label}`).join("|");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) {
          return;
        }

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const radius = ((w * w) / 4 + h * h) / (2 * h);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta =
          Math.ceil(
            radius - Math.sqrt(Math.max(0, radius * radius - (w * w) / 4)),
          ) + 1;
        const originY = diameter - delta;

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hoveredLabel =
          pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) {
          gsap.set(label, { y: 0 });
        }

        if (hoveredLabel) {
          gsap.set(hoveredLabel, { y: h + 12, opacity: 0 });
        }

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) {
          return;
        }

        tlRefs.current[index]?.kill();
        const timeline = gsap.timeline({ paused: true });

        timeline.to(
          circle,
          {
            scale: 1.2,
            xPercent: -50,
            duration: 2,
            ease,
            overwrite: "auto",
          },
          0,
        );

        if (label) {
          timeline.to(
            label,
            {
              y: -(h + 8),
              duration: 2,
              ease,
              overwrite: "auto",
            },
            0,
          );
        }

        if (hoveredLabel) {
          gsap.set(hoveredLabel, { y: Math.ceil(h + 100), opacity: 0 });
          timeline.to(
            hoveredLabel,
            {
              y: 0,
              opacity: 1,
              duration: 2,
              ease,
              overwrite: "auto",
            },
            0,
          );
        }

        tlRefs.current[index] = timeline;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1, y: 0 });
    }

    if (initialLoadAnimation) {
      const navLogo = logoRef.current;
      const navItems = navItemsRef.current;

      if (navLogo) {
        gsap.set(navLogo, { scale: 0 });
        gsap.to(navLogo, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, {
          width: "auto",
          duration: 0.6,
          ease,
        });
      }
    }

    const activeTweens = activeTweenRefs.current;
    const timelines = tlRefs.current;

    return () => {
      window.removeEventListener("resize", onResize);
      logoTweenRef.current?.kill();
      activeTweens.forEach((tween) => tween?.kill());
      timelines.forEach((timeline) => timeline?.kill());
    };
  }, [ease, initialLoadAnimation, itemKey]);

  const handleEnter = (index: number) => {
    const timeline = tlRefs.current[index];
    if (!timeline) {
      return;
    }

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (index: number) => {
    const timeline = tlRefs.current[index];
    if (!timeline) {
      return;
    }

    activeTweenRefs.current[index]?.kill();
    activeTweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) {
      return;
    }

    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const openMobileMenu = () => {
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
    }

    if (menu) {
      gsap.set(menu, { visibility: "visible" });
      gsap.fromTo(
        menu,
        { opacity: 0, y: 10, scaleY: 1 },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          duration: 0.3,
          ease,
          transformOrigin: "top center",
        },
      );
    }
  };

  const closeMobileMenu = () => {
    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
    }

    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        scaleY: 1,
        duration: 0.2,
        ease,
        transformOrigin: "top center",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    if (newState) {
      openMobileMenu();
    } else {
      closeMobileMenu();
    }

    onMobileMenuClick?.();
  };

  const handleMobileItemClick = () => {
    setIsMobileMenuOpen(false);
    closeMobileMenu();
  };

  const handleBackdropClick = () => {
    setIsMobileMenuOpen(false);
    closeMobileMenu();
  };

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": resolvedPillTextColor,
    "--nav-h": "44px",
    "--logo": "36px",
    "--pill-pad-x": "18px",
    "--pill-gap": "3px",
  } as CSSProperties;

  const logoHref = items[0]?.href ?? "/";

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-all duration-300 ${containerClassName}`}
    > 
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full border border-white/15 bg-slate-950/70 px-2 py-2 shadow-[0_18px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl lg:w-auto lg:max-w-none lg:border-0 lg:bg-transparent lg:px-4 lg:py-0 lg:shadow-none lg:backdrop-blur-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isExternalLink(logoHref) ? (
          <a
            href={logoHref}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
            className="inline-flex items-center justify-center overflow-hidden rounded-full p-2 lg:shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
            style={{
              width: "var(--nav-h)",
              height: "var(--nav-h)",
              background: "transparent",
            }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="block h-full w-full object-cover"
            />
          </a>
        ) : (
          <Link
            href={logoHref}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={logoRef}
            className="inline-flex items-center justify-center overflow-hidden rounded-full p-2 lg:shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
            style={{
              width: "var(--nav-h)",
              height: "var(--nav-h)",
              background: "transparent",
            }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="block h-full w-full object-cover"
            />
          </Link>
        )}

        <div
          ref={navItemsRef}
          className="relative ml-2 hidden max-w-[calc(100vw-8rem)] items-center overflow-x-auto rounded-full lg:flex"
          style={{
            height: "var(--nav-h)",
            background: "var(--base, #000)",
            scrollbarWidth: "none",
            boxShadow: "0 18px 60px rgba(15,23,42,0.18)",
          }}
        >
          <ul
            role="menubar"
            className="m-0 flex h-full list-none items-stretch p-[3px]"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, index) => {
              const isActive = activeHref === item.href;
              const pillStyle: CSSProperties = {
                background: "var(--pill-bg, #fff)",
                color: "var(--pill-text, var(--base, #000))",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const pillContent = (
                <>
                  <span
                    className="pointer-events-none absolute bottom-0 left-1/2 z-[1] block rounded-full"
                    style={{
                      background: "var(--base, #000)",
                      willChange: "transform",
                    }}
                    aria-hidden="true"
                    ref={(element) => {
                      circleRefs.current[index] = element;
                    }}
                  />
                  <span className="relative z-[2] inline-block leading-[1]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: "transform" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: "var(--hover-text, #fff)",
                        willChange: "transform, opacity",
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive ? (
                    <span
                      className="absolute left-1/2 -bottom-[6px] z-[4] h-3 w-3 -translate-x-1/2 rounded-full"
                      style={{ background: "var(--base, #000)" }}
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              );

              return (
                <li key={item.href} role="none" className="flex h-full">
                  <NavLink
                    href={item.href}
                    role="menuitem"
                    className="relative inline-flex h-full cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-0 text-[15px] font-semibold uppercase leading-[0] tracking-[0.2px] no-underline"
                    style={pillStyle}
                    ariaLabel={item.ariaLabel ?? item.label}
                    onMouseEnter={() => handleEnter(index)}
                    onMouseLeave={() => handleLeave(index)}
                  >
                    {pillContent}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {desktopActions ? (
          <div className="ml-3 hidden items-center gap-2 lg:flex">
            {desktopActions}
          </div>
        ) : null}

        {mobileActions ? (
          <div className="mx-2 min-w-0 flex-1 lg:hidden">{mobileActions}</div>
        ) : null}

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="relative ml-2 flex h-[var(--nav-h)] w-[var(--nav-h)] flex-col items-center justify-center gap-1 rounded-full border-0 p-0 lg:hidden"
          style={{
            background: "var(--pill-bg, #fff)",
          }}
        >
          <span
            className="hamburger-line h-0.5 w-4 rounded"
            style={{ background: "var(--base, #000)" }}
          />
          <span
            className="hamburger-line h-0.5 w-4 rounded"
            style={{ background: "var(--base, #000)" }}
          />
        </button>
      </nav>

      {isMobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={handleBackdropClick}
          className="fixed inset-0 -z-10 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
        />
      ) : null}

      <div
        ref={mobileMenuRef}
        className="absolute left-4 right-4 top-[4.5rem] overflow-hidden rounded-[28px] border border-white/15 shadow-[0_24px_80px_rgba(15,23,42,0.28)] lg:hidden"
        style={{
          ...cssVars,
          background: "color-mix(in srgb, var(--base, #0f172a) 92%, white 8%)",
        }}
      >
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Navigation
          </p>
        </div>

        <ul className="m-0 flex max-h-[min(70vh,32rem)] list-none flex-col gap-2 overflow-y-auto p-3">
          {items.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="block rounded-[22px] px-4 py-3 text-[15px] font-semibold transition-colors duration-200"
                  style={{
                    background: isActive
                      ? "var(--base)"
                      : "var(--pill-bg, #fff)",
                    color: isActive
                      ? "var(--hover-text, #fff)"
                      : "var(--pill-text, #fff)",
                  }}
                  ariaLabel={item.ariaLabel ?? item.label}
                  onClick={handleMobileItemClick}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {mobileFooter ? (
          <div className="border-t border-white/10 px-3 py-3">{mobileFooter}</div>
        ) : null}
      </div>
    </div>
  );
}
