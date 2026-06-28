'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Menu, X, Calendar, Search, ArrowRight } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

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

  // Fetch doctors and departments on mount for search index
  useEffect(() => {
    Promise.all([
      fetch('/api/doctors').then((res) => res.json()).catch(() => []),
      fetch('/api/departments').then((res) => res.json()).catch(() => [])
    ]).then(([docsData, deptsData]) => {
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setDepartments(Array.isArray(deptsData) ? deptsData : []);
    });
  }, []);

  const clinicalServices = [
    { id: 'home-visit', title: 'Home Visit', category: 'Clinical Services', link: '/services#home-visit' },
    { id: 'usg', title: 'USG (Ultrasonography)', category: 'Clinical Services', link: '/services#usg' },
    { id: 'ecg', title: 'ECG (Electrocardiogram)', category: 'Clinical Services', link: '/services#ecg' },
    { id: 'x-ray', title: 'Digital X-Ray', category: 'Clinical Services', link: '/services#x-ray' },
    { id: 'pharmacy', title: 'In-House Pharmacy', category: 'Clinical Services', link: '/services#pharmacy' },
    { id: 'laboratory', title: 'Diagnostic Laboratory', category: 'Clinical Services', link: '/services#laboratory' },
    { id: 'diabetic-care', title: 'Diabetic Care Unit', category: 'Clinical Services', link: '/services#diabetic-care' },
  ];

  const baseNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Departments', href: '/departments' },
    { label: 'Doctors', href: '/doctors' },
    { label: 'Contact Us', href: '/contact' }
  ];

  const showAdminLink = isAdmin && pathname.startsWith('/admin');

  const navItems = showAdminLink
    ? [...baseNavItems, { label: 'Admin Dashboard', href: '/admin' }]
    : baseNavItems;

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getFilteredResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchedDepts = departments
      .filter(d => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query))
      .map(d => ({
        id: d.id,
        title: `${d.name} Department`,
        category: 'Department',
        link: `/departments/${d.slug}`
      }));
      
    const matchedDocs = doctors
      .filter(doc => doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query))
      .map(doc => ({
        id: doc.id,
        title: `${doc.name} (${doc.specialty})`,
        category: 'Doctor',
        link: `/doctors/${doc.id}`
      }));
      
    const matchedServices = clinicalServices
      .filter(s => s.title.toLowerCase().includes(query))
      .map(s => ({
        id: s.id,
        title: s.title,
        category: 'Service',
        link: s.link
      }));
      
    return [...matchedDepts, ...matchedDocs, ...matchedServices];
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

          {/* Right Actions & Search */}
          <div className={styles.actionsContainer}>
            <button 
              className={styles.searchBtn} 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Toggle Search"
            >
              <Search size={20} />
            </button>
            
            <div className={styles.actions}>
              <Link href="/book" className={styles.bookBtn}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} />
                  Book Consultation
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
        </div>
      </header>

      {/* Search Dropdown Overlay */}
      {isSearchOpen && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchOverlayContainer}>
            <div className={styles.searchBarRow}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search departments, specialists, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                className={styles.searchCloseBtn} 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.searchResultsContainer}>
              {searchQuery.trim() === '' ? (
                <div className={styles.popularSearches}>
                  <p className={styles.searchSectionTitle}>Popular Searches</p>
                  <div className={styles.popularTags}>
                    <button onClick={() => setSearchQuery('Pediatrics')} className={styles.popularTag}>Pediatrics</button>
                    <button onClick={() => setSearchQuery('USG')} className={styles.popularTag}>USG</button>
                    <button onClick={() => setSearchQuery('Orthopedics')} className={styles.popularTag}>Orthopedics</button>
                    <button onClick={() => setSearchQuery('Dermatology')} className={styles.popularTag}>Dermatology</button>
                    <button onClick={() => setSearchQuery('Home Visit')} className={styles.popularTag}>Home Visit</button>
                  </div>
                </div>
              ) : (
                <div className={styles.resultsList}>
                  {getFilteredResults().length > 0 ? (
                    getFilteredResults().map(result => (
                      <Link
                        key={`${result.category}-${result.id}`}
                        href={result.link}
                        className={styles.resultItem}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className={styles.resultDetails}>
                          <span className={styles.resultTitle}>{result.title}</span>
                          <span className={styles.resultCategory}>{result.category}</span>
                        </div>
                        <ArrowRight size={16} className={styles.resultArrow} />
                      </Link>
                    ))
                  ) : (
                    <p className={styles.noResults}>No matches found for &ldquo;{searchQuery}&rdquo;</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          Book Consultation
        </Link>
      </div>
    </>
  );
}
