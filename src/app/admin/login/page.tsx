'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { Lock, AlertCircle } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials.');
      }

      // Store session token
      localStorage.setItem('vmc_admin_token', data.token);
      
      // Redirect to Admin dashboard
      router.push('/admin');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify password.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 1rem' }}>
      <div className={styles.loginContainer}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Logo height={45} />
        </div>

        <h1 className={styles.loginTitle}>Admin Portal</h1>
        <p className={styles.loginSubtitle}>Access control for clinical listings & bookings</p>

        {errorMsg && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            border: '1.5px solid var(--error)', 
            color: 'var(--error)', 
            padding: '0.85rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }} htmlFor="pwd">
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                id="pwd"
                required
                className={styles.input}
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: vmcadmin123)"
              />
              <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={styles.btnExplore} 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In As Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
}
