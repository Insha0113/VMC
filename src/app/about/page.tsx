import { Target, Eye, Sparkles } from 'lucide-react';
import styles from './page.module.css';
import BackButton from '@/components/BackButton';

export default function AboutPage() {
  const timelineMilestones = [
    { year: '2024', desc: 'VMC Medical Center founded as a small community outpatient clinic in Paravoor, Aluva, Kerala.' },
    { year: '2025', desc: 'Expanded facilities to include specialized Pediatric and Orthopedic surgery wards.' },
    { year: '2026', desc: 'Inaugurated state-of-the-art ENT diagnostic lab and launched 24/7 emergency services.' }
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
          className="responsive-banner-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/doctor interaction.jpg')",
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
    </div>
  );
}
