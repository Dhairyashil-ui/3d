import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { mockStore } from '../data/mockStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [userType, setUserType] = useState<'state' | 'national'>('state');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [emailOrMobile, setEmailOrMobile] = useState('Pune_DM@mh.gov.in');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Generate randomized alphanumeric Captcha
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha(code); // Pre-fill for quick testing ease
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (userType === 'state' && !selectedState) {
      setErrorMessage('Please select your state.');
      return;
    }
    if (!emailOrMobile.trim()) {
      setErrorMessage('Please enter your Username, Email ID, or Mobile Number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    if (userCaptcha.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setErrorMessage('Invalid Captcha code entered. Please try again.');
      generateCaptcha();
      return;
    }

    // Successfully log in
    mockStore.setAuthUser({
      name: userType === 'state' ? 'Pune DM' : 'National Admin',
      role: 'GIS DM',
      state: userType === 'state' ? selectedState : 'All India',
      district: 'Pune',
      email: emailOrMobile,
      isLoggedIn: true
    });

    navigate('/portal/home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Top Ministry Ribbon */}
      <div style={{
        backgroundColor: '#0f2b5c',
        color: '#e2e8f0',
        padding: '6px 24px',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/bharat-sarkar.svg" alt="Emblem" style={{ height: '16px' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span>भारत सरकार | Department of Land Resources | Ministry of Rural Development</span>
        </div>
        <div>
          <Link to="/" style={{ color: '#93c5fd', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={13} /> Back to Public Portal
          </Link>
        </div>
      </div>

      {/* Center Login Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 51, 102, 0.12)',
          width: '100%',
          maxWidth: '920px',
          overflow: 'hidden',
          border: '1px solid #dbeafe',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Logo Bar */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '2px solid #1b539c',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffffff'
          }}>
            <img
              src="/assets/extracted/naksha_logo.png"
              alt="NAKSHA Portal"
              style={{ height: '52px', objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.src = '/assets/top logo of ministery.png';
              }}
            />
          </div>

          {/* Body: Left Graphic Illustration & Right Form */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {/* Left Column Graphic */}
            <div style={{
              flex: '1 1 380px',
              backgroundColor: '#f8fafc',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid #e2e8f0'
            }}>
              <img
                src="/assets/login-left-img.svg"
                alt="Login Illustration"
                style={{ width: '100%', maxWidth: '320px', height: 'auto' }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/3d plan.png';
                }}
              />
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h4 style={{ color: '#1b539c', margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700 }}>
                  District Admin & Survey Portal
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', margin: 0, maxWidth: '280px' }}>
                  Secure role-based GIS land records modernization across 152 Indian cities.
                </p>
              </div>
            </div>

            {/* Right Column Login Form */}
            <div style={{
              flex: '1 1 440px',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {errorMessage && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #f87171',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignIn}>
                {/* User Type Radio Toggle */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '18px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    <input
                      type="radio"
                      name="userType"
                      checked={userType === 'state'}
                      onChange={() => setUserType('state')}
                      style={{ accentColor: '#1b539c', width: '16px', height: '16px' }}
                    />
                    <span>State User</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                    <input
                      type="radio"
                      name="userType"
                      checked={userType === 'national'}
                      onChange={() => setUserType('national')}
                      style={{ accentColor: '#1b539c', width: '16px', height: '16px' }}
                    />
                    <span>National User</span>
                  </label>
                </div>

                {/* State Dropdown (Enabled only for State User) */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    State <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={userType === 'national'}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13.5px',
                      backgroundColor: userType === 'national' ? '#f1f5f9' : '#ffffff',
                      color: userType === 'national' ? '#94a3b8' : '#0f172a',
                      outline: 'none',
                      cursor: userType === 'national' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>

                {/* Username / Email / Mobile Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Id/Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={emailOrMobile}
                      onChange={(e) => setEmailOrMobile(e.target.value)}
                      placeholder="e.g. Pune_DM@mh.gov.in"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Captcha Field */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Captcha <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                      placeholder="Enter Captcha"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        outline: 'none'
                      }}
                    />
                    {/* Visual Captcha Box */}
                    <div style={{
                      backgroundColor: '#e2e8f0',
                      border: '1px solid #94a3b8',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '20px',
                      fontWeight: 800,
                      letterSpacing: '5px',
                      color: '#0f172a',
                      userSelect: 'none',
                      textDecoration: 'line-through',
                      background: 'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 10px, #f1f5f9 10px, #f1f5f9 20px)'
                    }}>
                      {captchaCode}
                    </div>
                    {/* Refresh Captcha Button */}
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      title="Reload Captcha"
                      style={{
                        backgroundColor: '#1b539c',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', fontSize: '13px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#475569' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#1b539c' }}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotSubmitted(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1b539c',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '13px',
                      textDecoration: 'underline'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(27, 83, 156, 0.3)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#134482')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1b539c')}
                >
                  SIGN IN
                </button>

                {/* OR Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '18px 0',
                  color: '#94a3b8',
                  fontSize: '12px'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ padding: '0 12px', fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>

                {/* Direct Station Portals */}
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link
                    to="/surveyor"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      backgroundColor: '#f59e0b',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 2px 6px rgba(245,158,11,0.3)'
                    }}
                  >
                    <span>🛰️ Enter Surveyor Station (MAP-2 & 3D GIS)</span>
                  </Link>
                  <Link
                    to="/desktop"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <span>💻 Open Desktop Workstation</span>
                  </Link>
                </div>

                {/* Back to Home Button */}
                <div style={{ marginTop: '12px' }}>
                  <Link
                    to="/"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: '#ffffff',
                      color: '#1b539c',
                      border: '1.5px solid #1b539c',
                      borderRadius: '6px',
                      padding: '9px',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    BACK TO PUBLIC HOME
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '440px',
            padding: '24px',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#1b539c', fontSize: '18px', fontWeight: 700 }}>
              Password Recovery
            </h3>
            {forgotSubmitted ? (
              <div>
                <p style={{ color: '#16a34a', fontSize: '14px' }}>
                  ✓ A password reset link and OTP have been dispatched to your registered government email address.
                </p>
                <button
                  onClick={() => setForgotModalOpen(false)}
                  style={{
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                  Enter your registered official email or mobile number to receive instructions.
                </p>
                <input
                  type="text"
                  placeholder="Official Email ID or Mobile"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    marginBottom: '16px',
                    outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSubmitted(true)}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      backgroundColor: '#1b539c',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
