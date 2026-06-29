'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026);
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Check admin session when pathname changes
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('vmc_admin_token') : null;
    const hasToken = !!savedToken;
    const timer = setTimeout(() => {
      setIsAdmin(hasToken);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Column 1: Brand Info */}
          <div className={styles.col}>
            <Logo height={45} light={true} />
            <p className={styles.brandDesc}>
              At VMC Medical Center, we offer clinical excellence, state-of-the-art facilities, and compassionate care. Our patients are at the heart of everything we do.
            </p>
            <div className={styles.socials}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/vmcmedicalcenter/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Linkedin">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://wa.me/919633248480" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="WhatsApp">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.528 2.008 14.067.979 11.99.979c-5.44 0-9.865 4.37-9.87 9.802-.001 1.836.52 3.631 1.508 5.168L2.613 21.9l6.034-1.583c-.001.001-.001.001 0 0zM17.16 14.53c-.284-.143-1.683-.83-1.947-.926-.263-.096-.456-.143-.647.143-.19.286-.739.927-.905 1.117-.166.19-.332.213-.616.072-.284-.143-1.2-.442-2.285-1.41-1.001-.892-1.424-1.393-1.613-1.712-.19-.318-.02-.49.122-.63.127-.126.284-.332.426-.498.143-.166.19-.285.285-.475.095-.19.047-.356-.024-.5-.071-.143-.647-1.56-.886-2.132-.233-.56-.47-.482-.647-.492-.167-.008-.358-.01-.55-.01s-.504.071-.768.356c-.264.285-1.008.986-1.008 2.404s1.033 2.793 1.177 2.985c.145.19 2.033 3.102 4.925 4.35.688.297 1.225.474 1.643.607.69.219 1.32.188 1.817.114.554-.083 1.683-.688 1.921-1.354.238-.665.238-1.235.166-1.354-.07-.12-.256-.19-.54-.333z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.col}>
            <h3 className={styles.title}>Quick Links</h3>
            <ul className={styles.links}>
              <li><Link href="/" className={styles.link}>Home</Link></li>
              <li><Link href="/about" className={styles.link}>About Us</Link></li>
              <li><Link href="/services" className={styles.link}>Our Services</Link></li>
              <li><Link href="/departments" className={styles.link}>Our Departments</Link></li>
              <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
              {isAdmin && <li><Link href="/admin" className={styles.link}>Admin Panel</Link></li>}
            </ul>
          </div>

          {/* Column 3: Contact info */}
          <div className={styles.col}>
            <h3 className={styles.title}>Contact Info</h3>
            <div className={styles.links}>
              <div className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <span>Karumalloor, Paravoor, Aluva</span>
              </div>
              <div className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <span><a href="tel:9633248480" style={{ color: 'inherit', textDecoration: 'none' }}>9633248480</a></span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <span><a href="mailto:mail.vmcmedical@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>mail.vmcmedical@gmail.com</a></span>
              </div>
              <div className={styles.contactItem}>
                <Clock size={18} className={styles.contactIcon} />
                <span>24/7 Emergency Services<br />OPD: 8:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <p>&copy; {currentYear} VMC Medical Center. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
