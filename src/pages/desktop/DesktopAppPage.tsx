import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Minus,
  Square,
  X,
  Layers,
  ExternalLink
} from 'lucide-react';
import { GisMap } from '../../components/common/GisMap';

// NAKSHA V2.0 3D Survey Data & Components
import { MOCK_PROJECTS, MOCK_ANOMALY_QUEUE, SurveyProject } from '../../data/survey3dData';
import { DesktopSidebar } from './components/DesktopSidebar';
import { ProjectProgressBar } from './components/ProjectProgressBar';
import { DashboardSection } from './components/DashboardSection';
import { ProjectDetailSection } from './components/ProjectDetailSection';
import { DataPreparationSection } from './components/DataPreparationSection';
import { GnssControlSection } from './components/GnssControlSection';
import { FlightPlanningSection } from './components/FlightPlanningSection';
import { PreFlightSection } from './components/PreFlightSection';
import { LiveAcquisitionSection } from './components/LiveAcquisitionSection';
import { ProcessingCenterSection } from './components/ProcessingCenterSection';
import { DsmDemSection } from './components/DsmDemSection';
import { ThreeDReconstructionSection } from './components/ThreeDReconstructionSection';
import { ArchitectureComparisonSection } from './components/ArchitectureComparisonSection';
import { GisComparisonSection } from './components/GisComparisonSection';
import { AnomalyDetectionSection } from './components/AnomalyDetectionSection';
import { FieldVerificationSection } from './components/FieldVerificationSection';
import { QualityControlSection } from './components/QualityControlSection';
import { DeliverablesSection } from './components/DeliverablesSection';
import { NakshaSubmissionSection } from './components/NakshaSubmissionSection';
import { AuditLogsSection } from './components/AuditLogsSection';

// 36 Indian States and Union Territories matching Desktop Manual Page 5
const INDIAN_STATES = [
  'Andaman And Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu And Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Maharashtra',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'The Dadra And Nagar Haveli And Daman And Diu',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal'
];

type AppScreen = 'state-select' | 'login' | 'workspace';

export const DesktopAppPage: React.FC = () => {
  const navigate = useNavigate();

  // Desktop Window State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('state-select');

  // Screen 1: State Selection
  const [selectedState, setSelectedState] = useState('Maharashtra');

  // Screen 2: Login
  const [username, setUsername] = useState('soi_operator_01');
  const [password, setPassword] = useState('••••••••');
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Screen 3: Workstation Workspace State
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [projects, setProjects] = useState<SurveyProject[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<SurveyProject>(projects[0]);

  // Map Preview Modal
  const [showMapPreview, setShowMapPreview] = useState(false);

  const openProjectDetail = (prj: SurveyProject) => {
    setSelectedProject(prj);
    setActiveSection('project-detail');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a192f',
      backgroundImage: 'radial-gradient(ellipse at center, #1e3a8a 0%, #0f172a 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: isFullscreen ? 'stretch' : 'center',
      alignItems: 'center',
      padding: isFullscreen ? '0' : '16px 12px',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Top Floating Helper Bar */}
      <div style={{
        width: '100%',
        maxWidth: isFullscreen ? '100%' : '1280px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isFullscreen ? '0' : '8px',
        color: '#94a3b8',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={14} color="#60a5fa" />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>NAKSHA Desktop Application Workstation</span>
          <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px' }}>
            V2.0 3D Survey Edition
          </span>
          <span style={{ backgroundColor: '#0f2b5c', border: '1px solid #1e3a8a', color: '#67e8f9', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px' }}>
            Survey Agency Workstation
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/portal/home"
            style={{ color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <span>Switch to WebGIS Portal</span>
            <ExternalLink size={12} />
          </Link>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              background: '#1e293b',
              border: '1px solid #475569',
              color: '#f8fafc',
              padding: '3px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Square size={11} />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Desktop Application Window (Approved Desktop Frame) */}
      <div style={{
        width: '100%',
        maxWidth: isFullscreen ? '100vw' : '1280px',
        height: isFullscreen ? '100vh' : '780px',
        backgroundColor: '#ffffff',
        borderRadius: isFullscreen ? '0' : '8px',
        boxShadow: isFullscreen ? 'none' : '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1px solid #334155'
      }}>
        {/* Windows 11 / Desktop Title Bar */}
        <div style={{
          backgroundColor: '#0f2b5c',
          color: '#ffffff',
          height: '34px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 12px',
          userSelect: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src="/assets/bharat-sarkar.svg"
              alt="Emblem"
              style={{ height: '18px', filter: 'brightness(0) invert(1)' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.2px' }}>
              NAKSHA Desktop Application v2.0 — 3D Aerial Survey & Building Reconstruction Workstation
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            <button
              onClick={() => {}}
              title="Minimize"
              style={{ background: 'transparent', border: 'none', color: '#ffffff', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Minus size={13} />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Restore' : 'Maximize'}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Square size={12} />
            </button>
            <button
              onClick={() => navigate('/portal/home')}
              title="Close Application"
              style={{ background: 'transparent', border: 'none', color: '#ffffff', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 1: STEP 2 - SELECT STATE SCREEN (Approved Manual Page 5) */}
        {/* ------------------------------------------------------------- */}
        {currentScreen === 'state-select' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0c356a',
            backgroundImage: 'radial-gradient(circle at center, #1b539c 0%, #0c356a 100%)',
            color: '#ffffff',
            position: 'relative'
          }}>
            {/* Inner App Window Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/assets/extracted/naksha_logo.png"
                  alt="NAKSHA"
                  style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
                  onError={(e) => (e.currentTarget.src = '/assets/top logo of ministery.png')}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd', textAlign: 'right' }}>
                Department of Land Resources • Ministry of Rural Development
              </div>
            </div>

            {/* Center Content: Two Columns */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 40px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '820px',
                minHeight: '440px',
                display: 'flex',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                color: '#1e293b'
              }}>
                {/* Left Art Panel */}
                <div style={{
                  flex: '1 1 45%',
                  backgroundColor: '#0f3875',
                  backgroundImage: 'linear-gradient(135deg, #1b539c 0%, #0f3875 100%)',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff',
                  position: 'relative',
                  textAlign: 'center'
                }}>
                  <h2 style={{ fontSize: '38px', fontWeight: 300, margin: '0 0 8px 0', letterSpacing: '1px' }}>
                    Login
                  </h2>
                  <div style={{
                    width: '50px',
                    height: '3px',
                    backgroundColor: '#38bdf8',
                    marginBottom: '28px'
                  }} />

                  <img
                    src="/assets/extracted/login-left-img.svg"
                    alt="Desktop Login Laptop"
                    style={{ width: '220px', height: '160px', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget.src = '/assets/login-left-img.svg')}
                  />

                  <div style={{ fontSize: '11.5px', color: '#93c5fd', marginTop: '24px', lineHeight: 1.5 }}>
                    Survey Agency & Drone Operator<br />2D + 3D Building Reconstruction Workstation
                  </div>
                </div>

                {/* Right Form: Select State Dropdown */}
                <div style={{
                  flex: '1 1 55%',
                  padding: '48px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ marginBottom: '28px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#1e293b',
                      marginBottom: '10px'
                    }}>
                      Select State
                    </label>

                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1.5px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: '#1e293b',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="">Please Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                      Choose the administrative state jurisdiction to synchronize survey projects.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <button
                      onClick={() => {
                        if (selectedState) setCurrentScreen('login');
                      }}
                      disabled={!selectedState}
                      style={{
                        flex: 1,
                        backgroundColor: '#0ea5e9',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '11px 24px',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: selectedState ? 'pointer' : 'not-allowed',
                        opacity: selectedState ? 1 : 0.6,
                        boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Next
                    </button>

                    <button
                      onClick={() => navigate('/portal/home')}
                      style={{
                        flex: 1,
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '11px 24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 2: STEP 3 & 4 - LOGIN SCREEN (Approved Manual Page 5 & 6) */}
        {/* ------------------------------------------------------------- */}
        {currentScreen === 'login' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0c356a',
            backgroundImage: 'radial-gradient(circle at center, #1b539c 0%, #0c356a 100%)',
            color: '#ffffff'
          }}>
            {/* Inner Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 28px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/assets/extracted/naksha_logo.png"
                  alt="NAKSHA"
                  style={{ height: '36px', filter: 'brightness(0) invert(1)' }}
                  onError={(e) => (e.currentTarget.src = '/assets/top logo of ministery.png')}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                State Selected: <b>{selectedState}</b>
              </div>
            </div>

            {/* Center Content */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 40px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '820px',
                minHeight: '440px',
                display: 'flex',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                color: '#1e293b'
              }}>
                {/* Left Art */}
                <div style={{
                  flex: '1 1 45%',
                  backgroundColor: '#0f3875',
                  backgroundImage: 'linear-gradient(135deg, #1b539c 0%, #0f3875 100%)',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#ffffff',
                  textAlign: 'center'
                }}>
                  <h2 style={{ fontSize: '38px', fontWeight: 300, margin: '0 0 8px 0', letterSpacing: '1px' }}>
                    Login
                  </h2>
                  <div style={{ width: '50px', height: '3px', backgroundColor: '#38bdf8', marginBottom: '28px' }} />

                  <img
                    src="/assets/extracted/login-left-img.svg"
                    alt="Desktop Login Laptop"
                    style={{ width: '220px', height: '160px', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget.src = '/assets/login-left-img.svg')}
                  />
                </div>

                {/* Right Form */}
                <div style={{
                  flex: '1 1 55%',
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      User Name
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="User Name"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13.5px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        fontSize: '13.5px'
                      }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        setIsGuestMode(true);
                        setCurrentScreen('workspace');
                      }}
                      title="Validate files without login (Upload restricted)"
                      style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#334155',
                        borderRadius: '24px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Guest User
                    </button>

                    <button
                      onClick={() => {
                        setIsGuestMode(false);
                        setCurrentScreen('workspace');
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#f59e0b',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '10px 14px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
                      }}
                    >
                      Login
                    </button>

                    <button
                      onClick={() => setCurrentScreen('state-select')}
                      style={{
                        flex: 1,
                        backgroundColor: '#e2e8f0',
                        color: '#64748b',
                        border: 'none',
                        borderRadius: '24px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    State: <span style={{ fontWeight: 600, color: '#1b539c' }}>{selectedState}</span>
                    {isGuestMode && <span style={{ color: '#ea580c', marginLeft: '6px' }}>• Guest Mode</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SCREEN 3: WORKSPACE - NAKSHA V2.0 3D AERIAL SURVEY WORKSTATION */}
        {/* ------------------------------------------------------------- */}
        {currentScreen === 'workspace' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
            {/* Top Workspace Bar */}
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              height: '50px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 20px',
              borderBottom: '2px solid #0284c7',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src="/assets/extracted/naksha_logo.png"
                  alt="NAKSHA"
                  style={{ height: '32px', filter: 'brightness(0) invert(1)' }}
                  onError={(e) => (e.currentTarget.src = '/assets/top logo of ministery.png')}
                />
                <span style={{ fontSize: '13px', color: '#bfdbfe', marginLeft: '8px' }}>
                  | {selectedState} 3D Survey & Photogrammetry Workstation
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Project Quick Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#bfdbfe' }}>Active Project:</span>
                  <select
                    value={selectedProject.id}
                    onChange={(e) => {
                      const found = projects.find((p) => p.id === e.target.value);
                      if (found) setSelectedProject(found);
                    }}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '4px',
                      padding: '3px 8px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id} style={{ color: '#000000' }}>
                        {p.id} ({p.district})
                      </option>
                    ))}
                  </select>
                </div>

                {isGuestMode ? (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 700
                  }}>
                    Guest Mode (Validation Only)
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 700
                  }}>
                    ● Surveyor: {username}
                  </span>
                )}

                <button
                  onClick={() => setCurrentScreen('login')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Global 9-Stage Progress Pipeline Bar */}
            <ProjectProgressBar
              project={selectedProject}
              activeSection={activeSection}
              onNavigateSection={(sec) => setActiveSection(sec)}
            />

            {/* Split Layout: Left Sidebar + Right Dynamic Section Outlet */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {/* Left Navigation Sidebar */}
              <DesktopSidebar
                activeSection={activeSection}
                onSelectSection={(secId) => setActiveSection(secId)}
                anomaliesCount={MOCK_ANOMALY_QUEUE.length}
              />

              {/* Right Scrollable Content Pane */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 20px',
                overflowY: 'auto',
                backgroundColor: '#f8fafc'
              }}>
                {/* 1. Dashboard View */}
                {activeSection === 'dashboard' && (
                  <DashboardSection
                    projects={projects}
                    selectedProject={selectedProject}
                    onSelectProject={(p) => setSelectedProject(p)}
                    onOpenProjectDetail={openProjectDetail}
                  />
                )}

                {/* 2. Project Detail / Projects View */}
                {(activeSection === 'project-detail' ||
                  activeSection === 'projects-assigned' ||
                  activeSection === 'projects-active' ||
                  activeSection === 'projects-completed' ||
                  activeSection === 'projects-returned') && (
                  <ProjectDetailSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 3. Survey Planning - AOI & GIS Layers & GCP */}
                {(activeSection === 'planning-aoi' ||
                  activeSection === 'planning-gis-layers' ||
                  activeSection === 'planning-gcp' ||
                  activeSection === 'field-gnss' ||
                  activeSection === 'data-gnss') && (
                  <GnssControlSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 4. Flight Plans */}
                {activeSection === 'flight-plans' && (
                  <FlightPlanningSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 5. Pre-Flight Check */}
                {activeSection === 'preflight-check' && (
                  <PreFlightSection
                    project={selectedProject}
                    onStartSurvey={() => setActiveSection('field-acquisition')}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 6. Live Aerial Acquisition */}
                {(activeSection === 'field-acquisition' ||
                  activeSection === 'field-drone-images' ||
                  activeSection === 'field-lidar') && (
                  <LiveAcquisitionSection
                    project={selectedProject}
                    onEndSurvey={() => setActiveSection('data-preparation')}
                  />
                )}

                {/* 7. Data Ingestion & Validation (Retains and expands GDB & TPK) */}
                {(activeSection === 'data-preparation' ||
                  activeSection === 'data-gdb' ||
                  activeSection === 'data-tpk' ||
                  activeSection === 'data-lidar' ||
                  activeSection === 'data-architecture') && (
                  <DataPreparationSection
                    project={selectedProject}
                    defaultTab={activeSection === 'data-gdb' ? 'gdb' : activeSection === 'data-tpk' ? 'tpk' : activeSection === 'data-lidar' ? 'lidar' : activeSection === 'data-architecture' ? 'architecture' : 'all'}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                    onPreviewMap={() => setShowMapPreview(true)}
                    isGuestMode={isGuestMode}
                  />
                )}

                {/* 8. Processing Center */}
                {(activeSection === 'processing-photogrammetry' ||
                  activeSection === 'processing-lidar' ||
                  activeSection === 'processing-fusion' ||
                  activeSection === 'processing-ori') && (
                  <ProcessingCenterSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 9. DSM / DEM Elevation Workspace */}
                {activeSection === 'processing-dsm-dem' && (
                  <DsmDemSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 10. 3D Building Reconstruction & Floor Slicing */}
                {(activeSection === 'reconstruction-buildings' ||
                  activeSection === 'reconstruction-floors' ||
                  activeSection === 'reconstruction-units') && (
                  <ThreeDReconstructionSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 11. Architecture Plan Comparison */}
                {activeSection === 'verification-architecture' && (
                  <ArchitectureComparisonSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 12. GIS Layer Overlay Comparison */}
                {activeSection === 'verification-gis' && (
                  <GisComparisonSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 13. Anomaly Queue */}
                {activeSection === 'verification-anomalies' && (
                  <AnomalyDetectionSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                    onSelectFieldOrder={() => setActiveSection('verification-field')}
                  />
                )}

                {/* 14. Field Verification Work Orders */}
                {activeSection === 'verification-field' && (
                  <FieldVerificationSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 15. Quality Control */}
                {activeSection === 'quality-control' && (
                  <QualityControlSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 16. Deliverables Packaging */}
                {activeSection === 'deliverables' && (
                  <DeliverablesSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 17. Final NAKSHA Portal Submission */}
                {activeSection === 'naksha-submission' && (
                  <NakshaSubmissionSection
                    project={selectedProject}
                    onNavigateSection={(sec) => setActiveSection(sec)}
                  />
                )}

                {/* 18. Audit & Processing Logs */}
                {activeSection === 'audit-logs' && (
                  <AuditLogsSection project={selectedProject} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Preview Modal (Real Satellite Drone Inspection) */}
      {showMapPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '920px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              backgroundColor: '#1b539c',
              color: '#ffffff',
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={17} />
                <span style={{ fontWeight: 700, fontSize: '14.5px' }}>
                  Validated Geospatial Layer Inspection — {selectedProject.district} ({selectedProject.ward})
                </span>
              </div>
              <button
                onClick={() => setShowMapPreview(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                Displaying validated Vector Cadastral Plots & Drone Orthorectified Image (ORI) (WKID: 32643) overlay on ESRI World Imagery:
              </div>
              <GisMap
                height="440px"
                showAoi={true}
                showCadastral={true}
                showBuildings={true}
                showDronePath={true}
                title={`NAKSHA Desktop Validation Preview • ${selectedProject.district}`}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setShowMapPreview(false)}
                style={{ backgroundColor: '#1b539c', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopAppPage;
