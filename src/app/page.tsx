import React from 'react';
export const unstable_instant = { prefetch: 'static' };
import Link from 'next/link';
import { getDoctors, getDepartments } from '@/lib/db';
import QuickContactForm from '@/components/QuickContactForm';
import ReviewsMarquee from '@/components/ReviewsMarquee';
import HeroVideo from '@/components/HeroVideo';
import TrustCounterAnimation from '@/components/TrustCounterAnimation';
import DoctorsMarquee from '@/components/DoctorsMarquee';
import { 
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
  Home,
  Award,
  HeartPulse,
  Clock,
  UserCheck,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import styles from './page.module.css';

const deptImages: Record<string, string> = {
  pediatrics: '/images/pediatric.jpg',
  ent: '/images/ent.jpg',
  orthopedics: '/images/orthopedics image.jpg',
  dermatology: '/images/dermatology.jpg',
  'diabetic-care': '/images/diabetic care.jpg',
  gastroenterology: '/images/doctor interaction.jpg',
  gynaecology: '/images/doctor interaction2.jpg',
  radiology: '/images/xray.jpg'
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

              {/* Enriched Content: Hero Stats */}
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>15+</span>
                  <span className={styles.statLabel}>Specialty Units</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>50k+</span>
                  <span className={styles.statLabel}>Patients Served</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>24/7</span>
                  <span className={styles.statLabel}>Emergency Care</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>99%</span>
                  <span className={styles.statLabel}>Recovery Rating</span>
                </div>
              </div>
            </div>
            
            <div className={styles.heroVisual}>
              <TrustCounterAnimation />
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
                  <h3 style={{ textTransform: 'uppercase', fontSize: '1.5rem', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', textAlign: 'center', padding: '0 1rem' }}>{dept.name}</h3>
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

          {/* Enriched Content: Why Choose Our Specialties */}
          <div className={styles.deptHighlights}>
            <h3 className={styles.deptHighlightTitle}>Why Choose VMC Specialty Units?</h3>
            <div className={styles.deptHighlightGrid}>
              <div className={styles.deptHighlightCard}>
                <Award className={styles.deptHighlightIcon} size={24} />
                <div className={styles.deptHighlightContent}>
                  <h4>Senior Board Consultants</h4>
                  <p>Direct consults and guidance with senior, board-certified clinicians who are active leaders in their medical specialties.</p>
                </div>
              </div>
              <div className={styles.deptHighlightCard}>
                <HeartPulse className={styles.deptHighlightIcon} size={24} />
                <div className={styles.deptHighlightContent}>
                  <h4>Integrative Diagnostic Care</h4>
                  <p>Fully coordinated treatments spanning pediatric care, dermatology, orthopedics, and diabetes, backed by our in-house lab.</p>
                </div>
              </div>
              <div className={styles.deptHighlightCard}>
                <CheckCircle2 className={styles.deptHighlightIcon} size={24} />
                <div className={styles.deptHighlightContent}>
                  <h4>Patient-Centered Recovery</h4>
                  <p>Continuous recovery tracking and personalized rehabilitation plans designed around your family's daily lifestyle.</p>
                </div>
              </div>
            </div>
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

          {/* Enriched Content: Services callout box */}
          <div className={styles.servicesCallout}>
            <div className={styles.servicesCalloutContent}>
              <h4>Need a Customized Family Health Plan or Routine Checkup?</h4>
              <p>We provide comprehensive health screening packages for corporate teams, working professionals, senior citizens, and young children. Our plans include full lab screenings, diagnostic imaging, and direct specialist consultations all scheduled in one visit.</p>
            </div>
            <div className={styles.servicesCalloutBtn}>
              <Link href="/book?type=service" className={styles.btnPrimary}>
                Request Health Screening
              </Link>
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

        <DoctorsMarquee doctors={featuredDoctors} />

        {/* Enriched Content: Doctor Philosophy */}
        <div className="container">
          <div className={styles.doctorPhilosophy}>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}>
                <Clock size={28} />
              </div>
              <h4>Minimal Wait Times</h4>
              <p>We honor your time. Our scheduling algorithms ensure that you meet your doctor with minimal delay in the waiting room.</p>
            </div>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}>
                <UserCheck size={28} />
              </div>
              <h4>Empathetic Consults</h4>
              <p>Our specialists listen to you. We believe that proper diagnosis begins with fully understanding a patient's concerns and clinical history.</p>
            </div>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}>
                <HeartPulse size={28} />
              </div>
              <h4>Evidence-Based Treatment</h4>
              <p>All VMC medical guidelines follow international evidence-based standards, avoiding unnecessary prescriptions or procedures.</p>
            </div>
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

          {/* Enriched Content: Frequently Asked Questions */}
          <div className={styles.faqContainer}>
            <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <HelpCircle className={styles.faqQuestionIcon} size={18} />
                  <span>How can I schedule a home doctor visit?</span>
                </div>
                <p className={styles.faqAnswer}>
                  You can easily schedule a home visit by clicking "Book Service" at the top of the page, selecting "Home Visit", and choosing your preferred slot. Alternatively, call us at 9947653954 for immediate scheduling support.
                </p>
              </div>
              <div className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <HelpCircle className={styles.faqQuestionIcon} size={18} />
                  <span>How quickly can I receive my laboratory test results?</span>
                </div>
                <p className={styles.faqAnswer}>
                  Most routine clinical blood panels, ECG, and digital X-ray scans are processed and emailed to you or uploaded to your profile within 3 to 6 hours of sample collection. Complex pathology reports may take up to 24 hours.
                </p>
              </div>
              <div className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <HelpCircle className={styles.faqQuestionIcon} size={18} />
                  <span>Do I need a prior appointment for the Outpatient Department (OPD)?</span>
                </div>
                <p className={styles.faqAnswer}>
                  Walk-ins are always welcome at VMC Medical Center. However, to guarantee meeting a specific senior consultant in Ped, Ortho, ENT, or Dermatology, we highly recommend scheduling an appointment online beforehand.
                </p>
              </div>
              <div className={styles.faqCard}>
                <div className={styles.faqQuestion}>
                  <HelpCircle className={styles.faqQuestionIcon} size={18} />
                  <span>What emergency clinical services are available 24/7?</span>
                </div>
                <p className={styles.faqAnswer}>
                  Our emergency room is equipped for acute trauma care, minor surgical procedures, sudden cardiac monitoring, pediatric emergencies, and immediate intravenous therapies. Our diagnostic labs and pharmacy remain operational 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Patient Reviews Section */}
      <ReviewsMarquee />
    </div>
  );
}
