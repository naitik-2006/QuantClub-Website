'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/',             label: 'HOME' },
  { href: '/calendar',     label: 'CALENDAR' },
  { href: '/resources',    label: 'RESOURCES' },
  { href: '/opportunities', label: 'OPPORTUNITIES' },
  { href: '/team',         label: 'TEAM' },
  { href: '/contact',      label: 'CONTACT' },
];

/* Logo — transparent PNG with name baked in */
function LogoMark({ height = 32 }: { height?: number }) {
  return (
    <Image
      src="/logo_with_name_transparent.png"
      alt="The Quant Club"
      width={Math.round(height * 2.2)}
      height={height}
      className="object-contain flex-shrink-0 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]"
      priority
    />
  );
}

export default function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${scrolled
            ? 'glass border-b border-white/5 shadow-[0_1px_0_rgba(0,255,255,0.07)]'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="group min-w-0">
              <LogoMark height={32} />
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`
                      relative font-mono text-[0.68rem] tracking-[0.18em] transition-colors duration-200
                      ${isActive ? 'text-electric-cyan' : 'text-silver hover:text-white'}
                    `}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-electric-cyan"
                        style={{ boxShadow: '0 0 6px #00FFFF' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ── Mobile toggle ── */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="md:hidden text-silver hover:text-white transition-colors p-1.5 -mr-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 glass flex flex-col pt-20 px-6 md:hidden overflow-auto"
          >
            {/* Logo repeat in mobile menu */}
            <div className="mb-10">
              <LogoMark height={40} />
            </div>

            <nav className="flex flex-col gap-5">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={href}
                    className={`
                      flex items-center gap-3 font-mono text-xl tracking-[0.18em] transition-colors py-1
                      ${pathname === href
                        ? 'text-electric-cyan'
                        : 'text-white/60 hover:text-white'
                      }
                    `}
                  >
                    {pathname === href && (
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan flex-shrink-0 shadow-[0_0_8px_#00FFFF]" />
                    )}
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-10 pt-8 border-t border-white/5">
              <Link
                href="/contact"
                className="inline-block font-mono text-sm tracking-[0.18em] px-7 py-3.5 border border-white/10 text-silver/60 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200 rounded-sm"
              >
                CONTACT →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
