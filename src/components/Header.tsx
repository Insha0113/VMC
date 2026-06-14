'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Menu, X, Calendar } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Check admin session when pathname changes
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('vmc_admin_token') : null;
    const hasToken = !!savedToken;
    const timer = setTimeout(() => {
      setIsAdmin(hasToken);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const baseNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Departments', href: '/departments' },
    { label: 'Contact Us', href: '/contact' }
  ];

  const navItems = isAdmin
    ? [...baseNavItems, { label: 'Admin Dashboard', href: '/admin' }]
    : baseNavItems;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" onClick={closeMenu}>
            <Logo height={48} />
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  isActive(item.href) ? styles.activeLink : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            <Link href="/book" className={styles.bookBtn}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} />
                Book Appointment
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn} 
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.drawerLink} ${
              isActive(item.href) ? styles.active : ''
            }`}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/book" className={styles.drawerBtn} onClick={closeMenu}>
          Book Appointment
        </Link>
      </div>
    </>
  );
}
