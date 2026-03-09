import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';

const navLinks = [
  { href: '/',          label: 'HOME' },
  { href: '/calendar',  label: 'CALENDAR' },
  { href: '/resources', label: 'RESOURCES' },
  { href: '/team',      label: 'TEAM' },
  { href: '/contact',   label: 'CONTACT' },
];

const socials = [
  { href: '#', icon: Github,         label: 'GitHub' },
  { href: '#', icon: Twitter,        label: 'Twitter' },
  { href: '#', icon: Linkedin,       label: 'LinkedIn' },
  { href: '#', icon: MessageCircle,  label: 'Discord' },
  { href: '#', icon: Mail,           label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-obsidian mt-24">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-cyan/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">

          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div>
              <Image
                src="/logo_with_name_transparent.png"
                alt="The Quant Club"
                width={140}
                height={60}
                className="object-contain"
              />
            </div>

            <p className="font-mono text-xs tracking-[0.12em] text-silver/60 leading-relaxed">
              MASTERING MARKETS.<br />
              DECODING DATA.<br />
              BUILDING ALPHA.
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-white/10 rounded flex items-center justify-center text-silver/40 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200 hover:shadow-[0_0_8px_rgba(0,255,255,0.3)]"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-5">NAVIGATION</p>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-mono text-xs tracking-[0.12em] text-silver/60 hover:text-electric-cyan transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label mb-5">CONNECT</p>
            <div className="space-y-3">
              <p className="font-mono text-xs tracking-wider text-silver/60">
                quantclub@university.edu
              </p>
              <p className="font-mono text-xs tracking-wider text-silver/60">
                Student Union Building<br />Level 2, Club Room 12
              </p>
              <p className="font-mono text-xs tracking-wider text-electric-cyan/50">
                Discord: discord.gg/quantclub
              </p>
              <Link
                href="/contact"
                className="inline-block mt-3 font-mono text-xs tracking-[0.15em] text-electric-cyan border border-electric-cyan/35 px-4 py-2 hover:bg-electric-cyan hover:text-black transition-all duration-200 hover:shadow-[0_0_14px_rgba(0,255,255,0.35)] rounded-sm"
              >
                GET IN TOUCH →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[0.58rem] tracking-[0.2em] text-white/20">
            © {new Date().getFullYear()} THE QUANT CLUB · ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[0.58rem] tracking-[0.14em] text-white/15">
            BUILT WITH PRECISION. ENGINEERED FOR ALPHA.
          </p>
        </div>
      </div>
    </footer>
  );
}
