import React from 'react';
export const unstable_instant = { prefetch: 'static' };
import Link from 'next/link';
import { getDoctors, getDepartments } from '@/lib/db';
import DoctorCard from '@/components/DoctorCard';
import QuickContactForm from '@/components/QuickContactForm';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import HeroVideo from '@/components/HeroVideo';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  TrendingUp,
  Home
} from 'lucide-react';
import styles from './page.module.css';

const deptImages: Record<string, string> = {
  pediatrics: '/images/pediatric.jpg',
  ent: '/images/ent.jpg',
  orthopedics: '/images/orthopedics image.jpg',
  dermatology: '/images/dermatology.jpg'
};

export default async function HomePage() {
  // Fetch doctors and departments on the server
  const doctors = await getDoctors();
  const departments = await getDepartments();

  // Pick top 6 doctors for highlights
  const featuredDoctors = doctors.slice(0, 6);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className={styles.hero}>
        <HeroVideo />
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.badge}>
                <ShieldCheck size={16} />
                <span>Accredited Healthcare Facility</span>
              </div>
              <h1 className={styles.heroTitle}>
                Caring for your health 24x7, <span>VMC</span>
              </h1>
              <p className={styles.heroDesc}>
                VMC Medical Center provides advanced clinical care, experienced doctors, and state-of-the-art diagnostic services. We focus on patient-centric treatments in Orthopedics, Pediatrics, ENT, and Dermatology.
              </p>
              <div className={styles.heroBtns}>
                <Link href="/book" className={styles.btnPrimary}>
                  Book Consultation
                </Link>
                <Link href="/book?type=service" className={styles.btnSecondary}>
                  Book Service
                </Link>
              </div>
            </div>
            
            <div className={styles.heroVisual}>
              <div className={styles.medicalGraphic}>
                <div className={styles.graphicHeader}>
                  <div className={styles.graphicIcon} style={{ backgroundColor: 'transparent', padding: '2px' }}>
                    <img src="/images/vmc logo.png" alt="VMC Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 className={styles.graphicTitle}>VMC Medical center</h3>
                    <p className={styles.graphicSub}>Weekly Patient Recovery Rate</p>
                  </div>
                </div>
                
                {/* Visual bar chart representing recovery metrics */}
                <div className={styles.graphicChart}>
                  <div className={styles.chartBar} style={{ height: '40%' }}></div>
                  <div className={styles.chartBar} style={{ height: '60%' }}></div>
                  <div className={styles.chartBar} style={{ height: '75%' }}></div>
                  <div className={styles.chartBar} style={{ height: '92%' }}></div>
                  <div className={styles.chartBar} style={{ height: '88%' }}></div>
                  <div className={styles.chartBar} style={{ height: '98%' }}></div>
                </div>
                
                <div className={styles.graphicStats}>
                  <div>
                    <div className={styles.statVal}>98%</div>
                    <div className={styles.statLabel}>Success Rate</div>
                  </div>
                  <div>
                    <div className={styles.statVal}>15k+</div>
                    <div className={styles.statLabel}>Happy Patients</div>
                  </div>
                  <div>
                    <div className={styles.statVal}>24/7</div>
                    <div className={styles.statLabel}>Emergency Care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Curved shape divider for smooth background transition */}
        <div className={styles.curveDivider}>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" className={styles.shapeFill}></path>
          </svg>
        </div>
      </section>

      {/* 2. Department Highlights */}
      <section className="section">
        <div className="container">
          <div className={styles.secHeader}>
            <span className={styles.badge} style={{ margin: '0 auto 1rem auto' }}>Medical Specialty Units</span>
            <h2 className={styles.secTitle}>Our Core Departments</h2>
            <p className={styles.secDesc}>Explore our main clinical practices, custom diagnostics, and expert physicians.</p>
          </div>

          <div className={styles.deptRow}>
            {departments.map((dept) => (
              <Link href={`/departments/${dept.slug}`} key={dept.id} className={styles.deptCard}>
                <div 
                  className={styles.deptVisual}
                  style={deptImages[dept.slug] ? {
                    backgroundImage: `linear-gradient(135deg, rgba(8, 113, 178, 0.7) 0%, rgba(149, 200, 62, 0.7) 100%), url('${deptImages[dept.slug]}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                >
                  <h3 style={{ textTransform: 'uppercase', fontSize: '1.5rem', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{dept.name}</h3>
                </div>
                <div className={styles.deptBody}>
                  <h3 className={styles.deptName}>{dept.name}</h3>
                  <p className={styles.deptDesc}>{dept.description}</p>
                  
                  <ul className={styles.deptFeatures}>
                    {dept.services.slice(0, 3).map((service, index) => (
                      <li key={index} className={styles.deptFeature}>
                        <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.deptLink}>
                    Explore Department & Doctors <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Services Overview */}
      <section className="section section-bg">
        <div className="container">
          <div className={styles.secHeader}>
            <span className={styles.badge} style={{ margin: '0 auto 1rem auto' }}>Our Core Services</span>
            <h2 className={styles.secTitle}>Comprehensive Clinical Solutions</h2>
            <p className={styles.secDesc}>Providing dynamic healthcare solutions to meet all your family needs.</p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Activity size={28} />
              </div>
              <h3 className={styles.serviceTitle}>Emergency Care</h3>
              <p className={styles.serviceDesc}>Equipped for critical medical procedures with swift response services and 24/7 support.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Stethoscope size={28} />
              </div>
              <h3 className={styles.serviceTitle}>Specialist Consults</h3>
              <p className={styles.serviceDesc}>Direct consultation and therapy guidance with highly trained department professionals.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Users size={28} />
              </div>
              <h3 className={styles.serviceTitle}>Outpatient Clinic</h3>
              <p className={styles.serviceDesc}>Accessible walk-in hours for minor illnesses, diagnostics, prescriptions, and health checkups.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <TrendingUp size={28} />
              </div>
              <h3 className={styles.serviceTitle}>Rehabilitation</h3>
              <p className={styles.serviceDesc}>Personalized physical therapy and mobility treatment programs for bone and joint recovery.</p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <Home size={28} />
              </div>
              <h3 className={styles.serviceTitle}>Home Visit</h3>
              <p className={styles.serviceDesc}>Get professional medical consultations, primary health screenings, and nursing support in the comfort of your home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Doctor Highlights */}
      <section className="section" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className={styles.secHeader}>
            <span className={styles.badge} style={{ margin: '0 auto 1rem auto' }}>Medical Consultants</span>
            <h2 className={styles.secTitle}>Meet Our Specialist Team</h2>
            <p className={styles.secDesc}>Our team consists of highly experienced board-certified clinical professionals.</p>
          </div>
        </div>

        {/* Doctor horizontal moving marquee */}
        <div className={styles.docMarqueeContainer}>
          <div className={styles.docOverlayLeft}></div>
          <div className={styles.docOverlayRight}></div>
          <div className={styles.docMarqueeTrack}>
            {[...featuredDoctors, ...featuredDoctors].map((doc, idx) => (
              <div key={`${doc.id}-${idx}`} className={styles.docMarqueeCard}>
                <DoctorCard doctor={doc} compact={true} />
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/doctors" className={styles.btnSecondary} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View All Doctors <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section className="section section-bg" id="contact-info">
        <div className="container">
          <div className={styles.secHeader}>
            <span className={styles.badge} style={{ margin: '0 auto 1rem auto' }}>Reach Out</span>
            <h2 className={styles.secTitle}>Get In Touch With VMC</h2>
            <p className={styles.secDesc}>We are here to support your healthcare journey. Contact us for any clinical or general inquiry.</p>
          </div>

          <div className={styles.contactGrid}>
            {/* Contact Details Column */}
            <div className={styles.contactInfoCard}>
              <h3 className={styles.contactInfoTitle}>Contact Information</h3>
              <div className={styles.contactList}>
                <div className={styles.contactRow}>
                  <div className={styles.contactIconBox}>
                    <MapPin size={20} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h4>Location</h4>
                    <p>Karumalloor, Paravur, Aluva</p>
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <div className={styles.contactIconBox}>
                    <Phone size={20} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h4>Phone Number</h4>
                    <p><a href="tel:9947653954" style={{ color: 'inherit', textDecoration: 'underline' }}>9947653954</a></p>
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <div className={styles.contactIconBox}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h4>Email Address</h4>
                    <p><a href="mailto:vmcclinic@gmail.com" style={{ color: 'inherit', textDecoration: 'underline' }}>vmcclinic@gmail.com</a></p>
                  </div>
                </div>

                <div className={styles.contactRow}>
                  <div className={styles.contactIconBox}>
                    <Calendar size={20} />
                  </div>
                  <div className={styles.contactDetails}>
                    <h4>Working Hours</h4>
                    <p>Emergency Services: 24/7 Available</p>
                    <p>Outpatient Department: Mon - Fri, 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Form Column */}
            <QuickContactForm />
          </div>
        </div>
      </section>

      {/* 6. Patient Reviews Section */}
      <ReviewsMarquee />
    </div>
  );
}
