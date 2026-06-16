'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Layers, 
  MessageSquare, 
  LogOut, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Edit,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { Booking, Doctor, Department, Enquiry } from '@/lib/db';
import styles from './admin.module.css';
import ECGLoader from '@/components/ECGLoader';

type ActiveTab = 'appointments' | 'doctors' | 'departments' | 'enquiries';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Tab tracker
  const [activeTab, setActiveTab] = useState<ActiveTab>('appointments');

  // Loaded DB records
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [loading, setLoading] = useState(true);

  // Modals state
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docFormData, setDocFormData] = useState({
    name: '',
    specialty: '',
    department: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    availability: 'Monday, Wednesday, Friday',
    bio: ''
  });

  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptFormData, setDeptFormData] = useState({
    name: '',
    description: '',
    services: ''
  });

  // Verify auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('vmc_admin_token');
    if (!savedToken) {
      router.push('/admin/login');
    } else {
      const timer = setTimeout(() => {
        setToken(savedToken);
        setCheckingAuth(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [router]);

  // Load resources once token is validated
  const loadResources = useCallback(async (authToken: string) => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` };
      
      const [bookingsRes, doctorsRes, deptsRes, enqsRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/doctors', { headers }),
        fetch('/api/departments', { headers }),
        fetch('/api/enquiries', { headers })
      ]);

      if (bookingsRes.status === 401 || doctorsRes.status === 401) {
        // Token expired/invalidated
        localStorage.removeItem('vmc_admin_token');
        router.push('/admin/login');
        return;
      }

      const bookingsData = await bookingsRes.json();
      const doctorsData = await doctorsRes.json();
      const deptsData = await deptsRes.json();
      const enqsData = await enqsRes.json();

      setBookings(bookingsData);
      setDoctors(doctorsData);
      setDepartments(deptsData);
      setEnquiries(enqsData);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        loadResources(token);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [token, loadResources]);

  const handleLogout = () => {
    localStorage.removeItem('vmc_admin_token');
    router.push('/admin/login');
  };

  // Appointment status update
  const handleUpdateStatus = async (bookingId: string, newStatus: Booking['status']) => {
    if (!token) return;
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: bookingId, status: newStatus })
      });

      if (res.ok) {
        setBookings(prev => 
          prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
        );
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  // Delete appointment
  const handleDeleteBooking = async (bookingId: string) => {
    if (!token || !confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Open Doctor Modal (Add/Edit)
  const openDoctorModal = (doc: Doctor | null = null) => {
    setEditingDoctor(doc);
    if (doc) {
      setDocFormData({
        name: doc.name,
        specialty: doc.specialty,
        department: doc.department,
        email: doc.email,
        phone: doc.phone,
        experience: doc.experience,
        education: doc.education,
        availability: doc.availability.join(', '),
        bio: doc.bio
      });
    } else {
      setDocFormData({
        name: '',
        specialty: '',
        department: 'orthopedics',
        email: '',
        phone: '',
        experience: '5+ Years',
        education: '',
        availability: 'Monday, Wednesday, Friday',
        bio: ''
      });
    }
    setDoctorModalOpen(true);
  };

  // Save/Update Doctor
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const payload: Doctor = {
      id: editingDoctor?.id || `doc-${Date.now()}`,
      name: docFormData.name,
      specialty: docFormData.specialty,
      department: docFormData.department,
      email: docFormData.email,
      phone: docFormData.phone,
      experience: docFormData.experience,
      education: docFormData.education,
      availability: docFormData.availability.split(',').map(s => s.trim()),
      bio: docFormData.bio,
      image: editingDoctor?.image || `doctor_${Math.random() > 0.5 ? 'male' : 'female'}_${Math.random() > 0.5 ? '1' : '2'}`
    };

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingDoctor) {
          setDoctors(prev => prev.map(d => d.id === saved.id ? saved : d));
        } else {
          setDoctors(prev => [...prev, saved]);
        }
        setDoctorModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save doctor details:', err);
    }
  };

  // Delete Doctor
  const handleDeleteDoctor = async (docId: string) => {
    if (!token || !confirm('Are you sure you want to delete this doctor listing?')) return;
    try {
      const res = await fetch(`/api/doctors?id=${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setDoctors(prev => prev.filter(d => d.id !== docId));
      }
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    }
  };

  // Open Department Modal
  const openDeptModal = (dept: Department) => {
    setEditingDept(dept);
    setDeptFormData({
      name: dept.name,
      description: dept.description,
      services: dept.services.join(', ')
    });
    setDeptModalOpen(true);
  };

  // Save Department details
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingDept) return;

    const payload: Department = {
      ...editingDept,
      name: deptFormData.name,
      description: deptFormData.description,
      services: deptFormData.services.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        setDepartments(prev => prev.map(d => d.id === saved.id ? saved : d));
        setDeptModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save department details:', err);
    }
  };

  if (checkingAuth) {
    return (
      <ECGLoader message="Verifying Administrator Credentials..." />
    );
  }

  return (
    <div className={styles.dashboardGrid}>
      {/* Sidebar Panel */}
      <aside className={styles.sidebar}>
        <div>
          <h2 className={styles.sidebarTitle}>VMC Dashboard</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin Session Active</span>
        </div>

        <nav className={styles.nav}>
          <button 
            className={`${styles.navBtn} ${activeTab === 'appointments' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={18} />
            Appointments
          </button>
          
          <button 
            className={`${styles.navBtn} ${activeTab === 'doctors' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <Users size={18} />
            Doctors List
          </button>
          
          <button 
            className={`${styles.navBtn} ${activeTab === 'departments' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <Layers size={18} />
            Departments
          </button>

          <button 
            className={`${styles.navBtn} ${activeTab === 'enquiries' ? styles.navBtnActive : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <MessageSquare size={18} />
            Patient Enquiries
          </button>
          
          <button 
            className={`${styles.navBtn} ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </nav>
      </aside>

      {/* Main Panel Content */}
      <main className={styles.mainPanel}>
        {loading ? (
          <ECGLoader message="Synchronizing Database Records..." />
        ) : (
          <>
            {/* Stats Summary widgets */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>Total Appointments</div>
                <div className={styles.statNum}>{bookings.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>Pending Requests</div>
                <div className={styles.statNum}>{bookings.filter(b => b.status === 'pending').length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>Active Staff</div>
                <div className={styles.statNum}>{doctors.length}</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statTitle}>Enquiries Received</div>
                <div className={styles.statNum}>{enquiries.length}</div>
              </div>
            </div>

            {/* TAB 1: Appointments Panel */}
            {activeTab === 'appointments' && (
              <div>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Patient Booking Requests</h2>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Patient</th>
                        <th className={styles.th}>Phone</th>
                        <th className={styles.th}>Doctor / Service</th>
                        <th className={styles.th}>Date & Time</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th} style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={styles.td} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            No booking requests registered.
                          </td>
                        </tr>
                      ) : (
                        bookings.map((booking) => (
                          <tr key={booking.id} className={styles.tr}>
                            <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{booking.id}</td>
                            <td className={styles.td}>
                              <div style={{ fontWeight: 'bold' }}>{booking.patientName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <a href={`mailto:${booking.patientEmail}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{booking.patientEmail}</a>
                              </div>
                              {booking.symptoms && (
                                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '220px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                  <strong>Notes:</strong> {booking.symptoms}
                                </div>
                              )}
                            </td>
                            <td className={styles.td} style={{ whiteSpace: 'nowrap' }}>
                              <a href={`tel:${booking.patientPhone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{booking.patientPhone}</a>
                            </td>
                            <td className={styles.td}>
                              <div style={booking.department.toLowerCase() === 'clinical services' ? { fontWeight: 'bold' } : undefined}>
                                {booking.doctorName}
                              </div>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                backgroundColor: booking.department.toLowerCase() === 'clinical services' ? 'var(--accent-light)' : 'var(--primary-light)', 
                                color: booking.department.toLowerCase() === 'clinical services' ? 'var(--accent-dark)' : 'var(--primary)', 
                                padding: '2px 6px', 
                                borderRadius: '4px',
                                fontWeight: booking.department.toLowerCase() === 'clinical services' ? 'bold' : 'normal'
                              }}>
                                {booking.department.toUpperCase()}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <div style={{ fontWeight: '600' }}>{booking.date}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.time}</div>
                            </td>
                            <td className={styles.td}>
                              <span className={`${styles.badge} ${
                                booking.status === 'approved' ? styles.badgeApproved :
                                booking.status === 'cancelled' ? styles.badgeCancelled :
                                booking.status === 'completed' ? styles.badgeCompleted :
                                styles.badgePending
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className={styles.td}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                {booking.status === 'pending' && (
                                  <button 
                                    className={`${styles.btnIcon} ${styles.btnIconSuccess}`}
                                    title="Approve Appointment"
                                    onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                
                                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                  <button 
                                    className={`${styles.btnIcon} ${styles.btnIconInfo}`}
                                    title="Complete Visit"
                                    onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                  >
                                    <ClipboardList size={16} />
                                  </button>
                                )}

                                {booking.status === 'pending' && (
                                  <button 
                                    className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                                    title="Cancel Appointment"
                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                  >
                                    <X size={16} />
                                  </button>
                                )}

                                <button 
                                  className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                                  title="Delete Record"
                                  onClick={() => handleDeleteBooking(booking.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Doctors Management Panel */}
            {activeTab === 'doctors' && (
              <div>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Clinic Specialists</h2>
                  <button className={styles.btnExplore} onClick={() => openDoctorModal(null)}>
                    <Plus size={16} /> Add Doctor Listing
                  </button>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Doctor Name</th>
                        <th className={styles.th}>Department</th>
                        <th className={styles.th}>Specialty</th>
                        <th className={styles.th}>Contact Details</th>
                        <th className={styles.th}>Availability</th>
                        <th className={styles.th} style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doc) => (
                        <tr key={doc.id} className={styles.tr}>
                          <td className={styles.td} style={{ fontWeight: 'bold' }}>{doc.name}</td>
                          <td className={styles.td} style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {doc.department}
                          </td>
                          <td className={styles.td}>{doc.specialty}</td>
                          <td className={styles.td} style={{ fontSize: '0.8rem' }}>
                            <div>Email: <a href={`mailto:${doc.email}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{doc.email}</a></div>
                            <div>Phone: <a href={`tel:${doc.phone}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{doc.phone}</a></div>
                          </td>
                          <td className={styles.td} style={{ fontSize: '0.8rem' }}>{doc.availability.join(', ')}</td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button 
                                className={styles.btnIcon}
                                onClick={() => openDoctorModal(doc)}
                                title="Edit Info"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className={`${styles.btnIcon} ${styles.btnIconDanger}`}
                                onClick={() => handleDeleteDoctor(doc.id)}
                                title="Remove Doctor"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: Departments Management Panel */}
            {activeTab === 'departments' && (
              <div>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Clinic Departments</h2>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Description</th>
                        <th className={styles.th}>Featured Services</th>
                        <th className={styles.th} style={{ textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((dept) => (
                        <tr key={dept.id} className={styles.tr}>
                          <td className={styles.td} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{dept.name}</td>
                          <td className={styles.td} style={{ fontSize: '0.85rem', maxWidth: '350px' }}>{dept.description}</td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {dept.services.map((s, idx) => (
                                <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className={styles.td}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <button 
                                className={styles.btnIcon}
                                onClick={() => openDeptModal(dept)}
                                title="Edit Department Details"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Patient Enquiries Viewer */}
            {activeTab === 'enquiries' && (
              <div>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Patient Enquiry Logs</h2>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Submit Date</th>
                        <th className={styles.th}>Sender</th>
                        <th className={styles.th}>Subject</th>
                        <th className={styles.th}>Message Content</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={4} className={styles.td} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            No enquiries submitted yet.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((enq) => (
                          <tr key={enq.id} className={styles.tr}>
                            <td className={styles.td} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                              {new Date(enq.createdAt).toLocaleString()}
                            </td>
                            <td className={styles.td}>
                              <div style={{ fontWeight: 'bold' }}>{enq.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <a href={`mailto:${enq.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{enq.email}</a>
                              </div>
                              {enq.phone && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  Tel: <a href={`tel:${enq.phone}`} style={{ color: 'inherit', textDecoration: 'underline' }}>{enq.phone}</a>
                                </div>
                              )}
                            </td>
                            <td className={styles.td} style={{ fontWeight: '700' }}>{enq.subject}</td>
                            <td className={styles.td} style={{ fontSize: '0.85rem', lineBreak: 'anywhere', maxWidth: '400px' }}>
                              {enq.message}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* DOCTOR CREATION/EDIT MODAL */}
      {doctorModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {editingDoctor ? `Edit Details: ${editingDoctor.name}` : 'Add Specialist Listing'}
            </h3>
            
            <form onSubmit={handleSaveDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={docFormData.name}
                    onChange={e => setDocFormData({ ...docFormData, name: e.target.value })}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Department Specialty *</label>
                  <select
                    className={styles.input}
                    value={docFormData.department}
                    onChange={e => setDocFormData({ ...docFormData, department: e.target.value })}
                  >
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="ent">ENT</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Clinical Title / Specialty *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={docFormData.specialty}
                    onChange={e => setDocFormData({ ...docFormData, specialty: e.target.value })}
                    placeholder="e.g. Senior Pediatrician"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Experience Badge *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={docFormData.experience}
                    onChange={e => setDocFormData({ ...docFormData, experience: e.target.value })}
                    placeholder="e.g. 10+ Years"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Contact Email *</label>
                  <input
                    type="email"
                    required
                    className={styles.input}
                    value={docFormData.email}
                    onChange={e => setDocFormData({ ...docFormData, email: e.target.value })}
                    placeholder="doctor@vmc.com"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Contact Phone *</label>
                  <input
                    type="text"
                    required
                    className={styles.input}
                    value={docFormData.phone}
                    onChange={e => setDocFormData({ ...docFormData, phone: e.target.value })}
                    placeholder="+91 99999 99999"
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Education / Credentials *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={docFormData.education}
                  onChange={e => setDocFormData({ ...docFormData, education: e.target.value })}
                  placeholder="e.g. MD - Harvard Medical School"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Availability (Comma separated days) *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={docFormData.availability}
                  onChange={e => setDocFormData({ ...docFormData, availability: e.target.value })}
                  placeholder="e.g. Monday, Wednesday, Thursday"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Professional Biography *</label>
                <textarea
                  required
                  rows={3}
                  className={styles.input}
                  value={docFormData.bio}
                  onChange={e => setDocFormData({ ...docFormData, bio: e.target.value })}
                  placeholder="Summarize the doctor's experience, specialties, and clinical achievements."
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnBack} onClick={() => setDoctorModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnExplore}>
                  {editingDoctor ? 'Save Changes' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTMENT EDIT MODAL */}
      {deptModalOpen && editingDept && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Edit Department: {editingDept.name}</h3>
            
            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Department Name *</label>
                <input
                  type="text"
                  required
                  className={styles.input}
                  value={deptFormData.name}
                  onChange={e => setDeptFormData({ ...deptFormData, name: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Description Overview *</label>
                <textarea
                  required
                  rows={4}
                  className={styles.input}
                  value={deptFormData.description}
                  onChange={e => setDeptFormData({ ...deptFormData, description: e.target.value })}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Services (Comma separated list) *</label>
                <textarea
                  required
                  rows={3}
                  className={styles.input}
                  value={deptFormData.services}
                  onChange={e => setDeptFormData({ ...deptFormData, services: e.target.value })}
                  placeholder="e.g. Checkups, Scans, Operations"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.btnBack} onClick={() => setDeptModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnExplore}>
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
