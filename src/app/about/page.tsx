import React from 'react';
export const unstable_instant = { prefetch: 'static' };
import { Target, Eye, Sparkles, User, Briefcase, Award } from 'lucide-react';
import styles from './page.module.css';
import BackButton from '@/components/BackButton';

// Reusable SVG for leadership profiles to ensure high resolution graphics
const LeadershipAvatar = ({ role }: { role: string }) => {
  let shirtColor = '#0871B2';
  let tieColor = '#95C83E';
  
  if (role.includes('Medical')) {
    shirtColor = '#10b981';
    tieColor = '#f59e0b';
  } else if (role.includes('Nursing')) {
    shirtColor = '#d946ef';
    tieColor = '#6366f1';
  }

  return (
    <svg viewBox="0 0 100 100" className={styles.mgmtAvatarSvg} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="35" r="18" fill="#f87171" />
      {/* Hair outline */}
      <path d="M30 35C30 20 70 20 70 35C70 40 65 42 50 42C35 42 30 40 30 35Z" fill="#1e293b" />
      {/* Suit/Coat */}
      <path d="M22 80C22 65 32 58 50 58C68 58 78 65 78 80V100H22V80Z" fill="#334155" />
      {/* Shirt */}
      <path d="M38 58L50 80L62 58" fill="#ffffff" />
      {/* Tie */}
      <path d="M47 58H53L51 76L49 76Z" fill={tieColor} />
      {/* Stethoscope for Medical Director */}
      {role.includes('Medical') && (
        <path d="M35 58C35 68 65 68 65 58" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />
      )}
    </svg>
  );
};

export default function AboutPage() {
  const timelineMilestones = [
    { year: '2012', desc: 'VMC Medical Center founded as a small community outpatient clinic in NY.' },
    { year: '2016', desc: 'Expanded facilities to include specialized Pediatric and Orthopedic surgery wards.' },
    { year: '2020', desc: 'Inaugurated state-of-the-art ENT diagnostic lab and launched 24/7 emergency services.' },
    { year: '2025', desc: 'Awarded national clinical excellence accreditation and expanded telemedicine facilities.' }
  ];

  const managementTeam = [
    {
      name: 'Dr. Arthur Vance',
      role: 'Chief Executive Officer',
      image: '/images/doc10.jpg',
      bio: 'Dr. Vance has over 20 years of experience in healthcare management and clinical operations, steering VMC towards digital integration and patient care excellence.'
    },
    {
      name: 'Dr. Helen Morris',
      role: 'Medical Director',
      image: '/images/doc11.jpg',
      bio: 'Dr. Morris oversees clinical protocols and specialist compliance, ensuring VMC maintains its leading position in surgery safety and evidence-based diagnostic protocols.'
    },
    {
      name: 'Sarah Jenkins, RN',
      role: 'Head of Operations & Nursing',
      image: '/images/doc1.jpg',
      bio: 'Sarah leads our primary care nursing staff and patient admissions operations, focusing on compassionate outpatient hospitality and efficient clinic flow.'
    }
  ];

  return (
    <div>
      {/* Header Banner */}
      <section 
        className={styles.aboutHeader}
        style={{
          minHeight: 'var(--header-min-height, 75vh)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'none',
          padding: '2.5rem 0',
          backgroundColor: '#043f65'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/doctor interaction.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.75,
            zIndex: 1
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(4, 63, 101, 0.85) 0%, rgba(8, 113, 178, 0.6) 60%, rgba(149, 200, 62, 0.25) 100%)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(149, 200, 62, 0.08) 35%, rgba(149, 200, 62, 0.2) 70%, var(--background) 100%)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 4 }}>
          <BackButton />
          <h1 className={styles.title}>About VMC Medical Center</h1>
          <p className={styles.subtitle}>
            A decade of providing world-class medical services, clinical integrity, and personalized care.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className={styles.historySection}>
        <div className="container">
          <div className={styles.historyGrid}>
            <div>
              <h2 className={styles.historyTitle}>
                Our Journey & History
              </h2>
              <div className={styles.historyText}>
                <p>
                  VMC Medical Center was founded with a singular, powerful vision: to make advanced, high-quality, and patient-centric healthcare accessible to our community. What started as a modest diagnostic and consultation clinic has grown into a major multi-specialty center.
                </p>
                <p>
                  Over the past ten years, we have continuously upgraded our facilities, integrated cutting-edge diagnostic equipment, and brought together a team of outstanding board-certified physicians, surgeons, and nurses.
                </p>
                <p>
                  Today, we continue to lead the way in outpatient treatments, sports medicine rehabilitation, and pediatric care, maintaining our signature high standard of clinical excellence and safety.
                </p>
              </div>
            </div>

            <div className={styles.historyVisual}>
              <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-dark)' }}>Milestones & Growth</h3>
              {timelineMilestones.map((m) => (
                <div key={m.year} className={styles.timelineItem}>
                  <div className={styles.timelineYear}>{m.year}</div>
                  <div className={styles.timelineDesc}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, and Values */}
      <section className={styles.missionVision}>
        <div className="container">
          <div className={styles.mvGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                <Target size={24} />
              </div>
              <h3 className={styles.mvTitle}>Our Mission</h3>
              <p className={styles.mvDesc}>
                To deliver compassionate, comprehensive, and top-tier healthcare services, blending scientific excellence with empathetic human care to restore health and improve lives.
              </p>
            </div>

            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                <Eye size={24} />
              </div>
              <h3 className={styles.mvTitle}>Our Vision</h3>
              <p className={styles.mvDesc}>
                To be the most trusted and preferred healthcare partner in the region, recognized for clinical innovation, safety, and outstanding patient satisfaction metrics.
              </p>
            </div>

            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                <Sparkles size={24} />
              </div>
              <h3 className={styles.mvTitle}>Core Values</h3>
              <p className={styles.mvDesc}>
                Integrity, Empathy, Safety, Collaboration, and Continuous Improvement. We treat every patient with the dignity and care we would extend to our own family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Management Leadership */}
      <section className={styles.mgmtSection}>
        <div className="container">
          <div className={styles.mgmtHeader}>
            <h2 className={styles.mgmtTitle}>Leadership & Management</h2>
            <p className={styles.mgmtSubtitle}>
              Our executive board is committed to maintaining VMC&apos;s standard of medical ethics and clinical safety.
            </p>
          </div>

          <div className={styles.mgmtGrid}>
            {managementTeam.map((member) => (
              <div key={member.name} className={styles.mgmtCard}>
                <div className={styles.mgmtAvatar}>
                  <img src={member.image} alt={member.name} className={styles.mgmtAvatarImg} />
                </div>
                <div className={styles.mgmtInfo}>
                  <h3 className={styles.mgmtName}>{member.name}</h3>
                  <p className={styles.mgmtRole}>{member.role}</p>
                  <p className={styles.mgmtBio}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
