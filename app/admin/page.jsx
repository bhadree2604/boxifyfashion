'use client';

import { useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured, googleProvider, isAdminEmail } from '@/lib/firebase';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '@/lib/products-service';
import {
  getVisitsByDay,
  getLoginsByDay,
  getCountInRange,
  getTodayCount,
  buildDailyArray,
  buildWeeklyArray,
  buildMonthlyArray,
} from '@/lib/analytics';
import { logLoginEvent } from '@/lib/analytics';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Gate state
  const [gateUnlocked, setGateUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem('adminGateUnlocked') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [gatePassword, setGatePassword] = useState('');
  const [gateError, setGateError] = useState('');

  // Google login state
  const [googleLoginError, setGoogleLoginError] = useState('');
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Products state
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [formError, setFormError] = useState('');

  // Form inputs
  const [formData, setFormData] = useState({
    name: '',
    category: 'Casual Pants',
    article: '',
    sku: '',
    fabric: '',
    price: '',
    description: '',
    inStock: true,
    colorsText: 'Black, Grey, Khaki',
    sizesText: 'M, L, XL, XXL',
    images: [],
  });

  // Analytics state
  const [overviewStats, setOverviewStats] = useState({ visits: 0, logins: 0 });
  const [overviewChart, setOverviewChart] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [reportsVisitChart, setReportsVisitChart] = useState([]);
  const [reportsLoginChart, setReportsLoginChart] = useState([]);
  const [reportsPeriod, setReportsPeriod] = useState('weekly');
  const [loadingReports, setLoadingReports] = useState(false);
  const [todayStats, setTodayStats] = useState({ visits: 0, logins: 0 });

  // Check auth state
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthChecking(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Load products when user is authenticated
  const loadAdminProducts = async () => {
    setLoadingProducts(true);
    try {
      const items = await fetchProducts();
      setProductsList(items || []);
    } catch (err) {
      console.error('Failed to load products in admin:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAdminProducts();
    }
  }, [user]);

  // Load overview analytics
  const loadOverview = useCallback(async () => {
    if (!user) return;
    setLoadingOverview(true);
    try {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 6);
      weekAgo.setHours(0, 0, 0, 0);

      const [visitCounts, loginCounts, visitsThisWeek, loginsThisWeek] = await Promise.all([
        getVisitsByDay(weekAgo, now),
        getLoginsByDay(weekAgo, now),
        getCountInRange('site_visits', weekAgo, now),
        getCountInRange('login_events', weekAgo, now),
      ]);

      const chartData = buildDailyArray(visitCounts, 6);
      setOverviewStats({ visits: visitsThisWeek, logins: loginsThisWeek });
      setOverviewChart(chartData);

      const [todayVisits, todayLogins] = await Promise.all([
        getTodayCount('site_visits'),
        getTodayCount('login_events'),
      ]);
      setTodayStats({ visits: todayVisits, logins: todayLogins });
    } catch (err) {
      console.error('Failed to load overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'overview') {
      loadOverview();
    }
  }, [user, activeTab, loadOverview]);

  // Load reports analytics
  const loadReports = useCallback(async () => {
    if (!user) return;
    setLoadingReports(true);
    try {
      const now = new Date();
      let startDate;
      if (reportsPeriod === 'weekly') {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 27);
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      }

      const [visitCounts, loginCounts] = await Promise.all([
        getVisitsByDay(startDate, now),
        getLoginsByDay(startDate, now),
      ]);

      let visitData, loginData;
      if (reportsPeriod === 'weekly') {
        visitData = buildWeeklyArray(visitCounts, 3);
        loginData = buildWeeklyArray(loginCounts, 3);
      } else {
        visitData = buildMonthlyArray(visitCounts, 3);
        loginData = buildMonthlyArray(loginCounts, 3);
      }
      setReportsVisitChart(visitData);
      setReportsLoginChart(loginData);

      const [todayVisits, todayLogins] = await Promise.all([
        getTodayCount('site_visits'),
        getTodayCount('login_events'),
      ]);
      setTodayStats({ visits: todayVisits, logins: todayLogins });
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoadingReports(false);
    }
  }, [user, reportsPeriod]);

  useEffect(() => {
    if (user && activeTab === 'reports') {
      loadReports();
    }
  }, [user, activeTab, loadReports, reportsPeriod]);

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoginError('');
    if (!isFirebaseConfigured || !auth) {
      setGoogleLoginError('Firebase credentials are not set in .env.local!');
      return;
    }
    setGoogleLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const allowedEmailsStr = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
      if (!allowedEmailsStr) {
        setGoogleLoginError('Admin emails not configured. Please set NEXT_PUBLIC_ADMIN_EMAILS in .env.local');
        await signOut(auth);
      } else {
        const allowedEmails = allowedEmailsStr
          .split(',')
          .map(email => email.trim().toLowerCase())
          .filter(email => email.length > 0);
        const userEmail = result.user.email.toLowerCase();
        if (!allowedEmails.includes(userEmail)) {
          await signOut(auth);
          setGoogleLoginError('Unauthorized account. Access denied.');
        } else {
          logLoginEvent(result.user.email, 'admin');
        }
      }
    } catch (err) {
      console.error('Google login failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setGoogleLoginError('Login cancelled.');
      } else {
        setGoogleLoginError(`Login failed: ${err.message}`);
      }
    } finally {
      setGoogleLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Casual Pants',
      article: '',
      sku: '',
      fabric: '',
      price: '',
      description: '',
      inStock: true,
      colorsText: 'Black, Grey, Khaki',
      sizesText: 'M, L, XL, XXL',
      images: [],
    });
    setFormError('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || 'Casual Pants',
      article: product.article || '',
      sku: product.sku || '',
      fabric: product.fabric || '',
      price: product.price || '',
      description: product.description || '',
      inStock: product.inStock !== undefined ? product.inStock : true,
      colorsText: Array.isArray(product.colors) ? product.colors.join(', ') : '',
      sizesText: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      images: Array.isArray(product.images) ? [...product.images] : (product.image ? [product.image] : []),
    });
    setFormError('');
    setModalOpen(true);
  };

  // Image Upload Handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingImage(true);
    setUploadProgress(`Compressing & uploading ${files.length} file(s)...`);

    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}...`);
        const url = await uploadProductImage(file, editingProduct ? editingProduct.id : 'new');
        uploadedUrls.push(url);
      }
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      setUploadProgress('Upload complete!');
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (err) {
      console.error('Image upload error:', err);
      setFormError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Remove Image from array
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Form Submit (Add / Edit)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (!formData.price || isNaN(formData.price)) {
      setFormError('Please enter a valid Price.');
      return;
    }

    const colors = formData.colorsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const sizes = formData.sizesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      article: formData.article.trim(),
      sku: formData.sku.trim(),
      fabric: formData.fabric.trim(),
      price: Number(formData.price),
      description: formData.description.trim(),
      inStock: Boolean(formData.inStock),
      colors,
      sizes,
      images: formData.images.length > 0 ? formData.images : ['/images/art-201.jpeg'],
    };

    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setModalOpen(false);
      await loadAdminProducts();
    } catch (err) {
      console.error('Save product error:', err);
      setFormError(`Failed to save product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!deleteConfirmProduct) return;
    setSubmitting(true);
    try {
      await deleteProduct(deleteConfirmProduct.id);
      setDeleteConfirmProduct(null);
      await loadAdminProducts();
    } catch (err) {
      console.error('Delete product error:', err);
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Gate: POST password to API ---
  const handleGateSubmit = async (e) => {
    e.preventDefault();
    setGateError('');

    if (!gatePassword.trim()) {
      setGateError('Please enter the gate password.');
      return;
    }

    try {
      const res = await fetch('/api/admin-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: gatePassword }),
      });
      const data = await res.json();

      if (data.valid) {
        setGateUnlocked(true);
        try {
          sessionStorage.setItem('adminGateUnlocked', 'true');
        } catch (e) {
          // sessionStorage may fail in some environments; ignore
        }
        setGatePassword('');
      } else {
        setGateError('Incorrect password');
        setGatePassword('');
      }
    } catch (err) {
      console.error('Gate check failed:', err);
      setGateError('Gate check failed. Please try again.');
      setGatePassword('');
    }
  };

  // --- Render Gate Form ---
  const renderGateForm = () => (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Boxify Fashion</h1>
          <p className="muted">Admin Dashboard</p>
        </div>

        {gateError && <div className="admin-error-banner" style={{ marginBottom: '0.75rem', textAlign: 'left', maxWidth: '100%' }}>{gateError}</div>}

        <form onSubmit={handleGateSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
          <label className="admin-form-group">
            <span>Gate Password</span>
            <input
              type="password"
              required
              className="admin-input"
              placeholder="Enter gate password"
              value={gatePassword}
              onChange={(e) => setGatePassword(e.target.value)}
            />
          </label>
          <button className="btn solid" type="submit" disabled={googleLoggingIn}>
            {googleLoggingIn ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );

  // --- Render Google Sign-In Screen ---
  const renderGoogleScreen = () => (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
      padding: '1.5rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Image src="/logo-2026.png" alt="Boxify Fashion" width={120} height={72} style={{ margin: '0 auto 1rem' }} />
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Boxify Fashion</h1>
          <p className="muted">Admin Dashboard</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="admin-warning-card">
            <h4>Firebase Credentials Required</h4>
            <p>
              To enable live updates and authentication, please update <code>.env.local</code> with your Firebase project API keys.
            </p>
          </div>
        )}

        {googleLoginError && <div className="admin-error-banner" style={{ marginBottom: '0.75rem' }}>{googleLoginError}</div>}
        <button
          className="btn outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoggingIn}
          style={{ width: '100%' }}
        >
          {googleLoggingIn ? 'Signing in with Google...' : 'Continue with Google'}
        </button>

        <p className="muted" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link href="/" style={{ textDecoration: 'underline' }}>Back to Store Home</Link>
        </p>
      </div>
    </div>
  );

  // --- Tab: Overview ---
  const renderOverview = () => (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>This Week</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Site Visits</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#15803d' }}>{overviewStats.visits}</p>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.25rem' }}>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Logins</p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: '#1d4ed8' }}>{overviewStats.logins}</p>
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>
          Today (live): {todayStats.visits} visits, {todayStats.logins} logins
        </p>
      </div>

      <h3 style={{ marginBottom: '0.75rem' }}>Daily Visits (Last 7 Days)</h3>
      {loadingOverview ? (
        <p className="muted">Loading chart data...</p>
      ) : overviewChart.length === 0 ? (
        <p className="muted">No visit data yet.</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={overviewChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  // --- Tab: Products ---
  const renderProducts = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Products ({productsList.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn outline small" type="button" onClick={loadAdminProducts}>
            Refresh
          </button>
          <button className="btn solid small" type="button" onClick={openAddModal}>
            + Add New Product
          </button>
        </div>
      </div>

      {loadingProducts ? (
        <p className="muted">Loading product catalog...</p>
      ) : productsList.length === 0 ? (
        <div className="admin-empty-state">
          <p className="muted">No products found in Firestore.</p>
          <button className="btn solid small" type="button" onClick={openAddModal} style={{ marginTop: '0.5rem' }}>
            Add First Product
          </button>
        </div>
      ) : (
        <div className="admin-products-table-wrap">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Product Details</th>
                <th>SKU / Article</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="admin-thumb-cell">
                      <Image
                        src={p.image || (p.images && p.images[0]) || '/images/art-201.jpeg'}
                        alt={p.name}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="admin-product-info">
                      <strong>{p.name}</strong>
                      <span className="muted" style={{ fontSize: '0.85rem' }}>{p.category} · {p.fabric}</span>
                    </div>
                  </td>
                  <td>
                    <span className="muted">{p.sku || p.article || 'N/A'}</span>
                  </td>
                  <td>
                    <strong>₹{p.price}</strong>
                  </td>
                  <td>
                    {p.inStock ? (
                      <span className="pill subtle" style={{ color: '#15803d', borderColor: '#bbf7d0' }}>In Stock</span>
                    ) : (
                      <span className="badge out-of-stock">Out of Stock</span>
                    )}
                  </td>
                  <td>
                    <div className="cta-row" style={{ gap: '0.35rem' }}>
                      <button className="btn outline small" type="button" onClick={() => openEditModal(p)}>
                        Edit
                      </button>
                      <button
                        className="btn ghost small"
                        type="button"
                        onClick={() => setDeleteConfirmProduct(p)}
                        style={{ color: '#dc2626' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // --- Tab: Reports ---
  const renderReports = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Reports</h2>
        <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', borderRadius: '8px', padding: '0.25rem' }}>
          {['weekly', 'monthly'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setReportsPeriod(p)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: reportsPeriod === p ? 600 : 400,
                background: reportsPeriod === p ? 'white' : 'transparent',
                boxShadow: reportsPeriod === p ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                textTransform: 'capitalize',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#92400e' }}>
          Today (live): {todayStats.visits} visits, {todayStats.logins} logins
        </p>
      </div>

      {loadingReports ? (
        <p className="muted">Loading report data...</p>
      ) : (
        <>
          <h3 style={{ marginBottom: '0.75rem' }}>Visits ({reportsPeriod})</h3>
          {reportsVisitChart.length === 0 ? (
            <p className="muted">No visit data yet.</p>
          ) : (
            <div style={{ width: '100%', height: 300, marginBottom: '2rem' }}>
              <ResponsiveContainer>
                <BarChart data={reportsVisitChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <h3 style={{ marginBottom: '0.75rem' }}>Logins ({reportsPeriod})</h3>
          {reportsLoginChart.length === 0 ? (
            <p className="muted">No login data yet.</p>
          ) : (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={reportsLoginChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#15803d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p className="muted" style={{ fontSize: '0.85rem' }}>
              <strong>Note:</strong> Purchase/order reporting will be available once a Firestore-backed checkout flow is implemented.
              Currently orders are handled via WhatsApp/email.
            </p>
          </div>
        </>
      )}
    </div>
  );

  // --- Render Authenticated Dashboard ---
  const renderDashboard = () => {
    const tabs = [
      { key: 'overview', label: 'Overview' },
      { key: 'products', label: 'Products' },
      { key: 'reports', label: 'Reports' },
    ];

    return (
      <div className="page-main">
        <section className="grid">
          <div className="admin-header-bar">
            <div>
              <h1>Admin Dashboard</h1>
              <p className="muted">Logged in as: <strong>{user.email}</strong></p>
            </div>
            <div className="cta-row">
              <button className="btn ghost" type="button" onClick={handleLogout} style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
                Log out
              </button>
            </div>
          </div>
        </section>

        <section className="grid">
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '0.25rem',
            background: '#f1f5f9',
            borderRadius: '10px',
            padding: '0.3rem',
            marginBottom: '1.5rem',
            maxWidth: 'fit-content',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  background: activeTab === tab.key ? 'white' : 'transparent',
                  boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: '0.95rem',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'reports' && renderReports()}
        </section>

        {/* Add / Edit Product Modal */}
        {modalOpen && (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-backdrop" onClick={() => setModalOpen(false)} />
            <div className="modal-card" style={{ maxWidth: 640 }}>
              <button className="modal-close-top" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
              <div className="modal-body" style={{ gridTemplateColumns: '1fr' }}>
                <div>
                  <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <p className="muted" style={{ marginBottom: '1rem' }}>
                    {editingProduct ? `Updating ${editingProduct.name}` : 'Fill in product details for wholesale catalog'}
                  </p>

                  {formError && <div className="admin-error-banner" style={{ marginBottom: '1rem' }}>{formError}</div>}

                  <form onSubmit={handleSubmitForm} style={{ display: 'grid', gap: '1rem' }}>
                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Product Name *</span>
                        <input
                          type="text"
                          required
                          className="admin-input"
                          placeholder="e.g. Premium Cargo Pants"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Category</span>
                        <select
                          className="admin-input"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="Cargo Pants">Cargo Pants</option>
                          <option value="Casual Pants">Casual Pants</option>
                          <option value="Heavy Lycra">Heavy Lycra</option>
                          <option value="T-Shirts">T-Shirts</option>
                          <option value="Tracksuits">Tracksuits</option>
                          <option value="Jackets">Jackets</option>
                          <option value="Teamwear">Teamwear</option>
                        </select>
                      </label>
                    </div>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Price (₹ / unit) *</span>
                        <input
                          type="number"
                          required
                          min="0"
                          className="admin-input"
                          placeholder="450"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Article No.</span>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="10086"
                          value={formData.article}
                          onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                        />
                      </label>
                      <label className="admin-form-group">
                        <span>SKU</span>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="BOX-CP-001"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Fabric Type</span>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Nylon Crush Lycra Terry"
                          value={formData.fabric}
                          onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="admin-form-group">
                      <span>Description</span>
                      <textarea
                        className="admin-input"
                        rows={3}
                        placeholder="Wholesale fabric description, fit details, pockets, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </label>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Colors (comma separated)</span>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="Black, Grey, Khaki, Olive"
                          value={formData.colorsText}
                          onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
                        />
                      </label>
                    </div>

                    <div className="admin-form-row">
                      <label className="admin-form-group">
                        <span>Sizes (comma separated)</span>
                        <input
                          type="text"
                          className="admin-input"
                          placeholder="M, L, XL, XXL"
                          value={formData.sizesText}
                          onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                        />
                      </label>
                    </div>

                    <label className="admin-checkbox-group">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      />
                      <span>Product is in Stock (Check to enable Add to Cart for customers)</span>
                    </label>

                    {/* Images Upload Section */}
                    <div className="admin-images-section">
                      <label className="admin-form-group">
                        <span>Product Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingImage}
                          onChange={handleFileUpload}
                          className="admin-file-input"
                        />
                      </label>

                      {uploadProgress && <div className="admin-upload-progress">{uploadProgress}</div>}

                      {formData.images.length > 0 && (
                        <div className="admin-images-preview-grid">
                          {formData.images.map((imgUrl, index) => (
                            <div className="admin-img-preview" key={index}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgUrl} alt={`Preview ${index + 1}`} />
                              <button
                                type="button"
                                className="admin-img-remove-btn"
                                onClick={() => handleRemoveImage(index)}
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="cta-row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
                      <button className="btn outline" type="button" onClick={() => setModalOpen(false)}>
                        Cancel
                      </button>
                      <button className="btn solid" type="submit" disabled={submitting || uploadingImage}>
                        {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmProduct && (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-backdrop" onClick={() => setDeleteConfirmProduct(null)} />
            <div className="modal-card" style={{ maxWidth: 440 }}>
              <div className="modal-body" style={{ gridTemplateColumns: '1fr' }}>
                <div>
                  <h3>Delete Product?</h3>
                  <p className="muted" style={{ marginTop: '0.5rem' }}>
                    Are you sure you want to delete <strong>{deleteConfirmProduct.name}</strong>? This action cannot be undone.
                  </p>
                  <div className="cta-row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
                    <button className="btn outline" type="button" onClick={() => setDeleteConfirmProduct(null)}>
                      Cancel
                    </button>
                    <button
                      className="btn solid"
                      type="button"
                      onClick={handleDeleteProduct}
                      disabled={submitting}
                      style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
                    >
                      {submitting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Main Render Logic ---
  if (authChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #e5e7eb',
          borderTopColor: '#4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If not logged in, show gate or Google sign-in
  if (!user) {
    if (!gateUnlocked) {
      return renderGateForm();
    }
    return renderGoogleScreen();
  }

  // Authenticated: show dashboard
  return renderDashboard();
}
