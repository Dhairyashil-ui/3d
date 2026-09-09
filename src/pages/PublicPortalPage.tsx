import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  Download,
  Play,
  FileText,
  Calendar,
  Award,
  Globe,
  ArrowRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const PublicPortalPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const milestones = [
    { title: 'NAKSHA Pilot ULBs', count: '150/29', sub: '(ULB/State)', icon: '/assets/Vector_01.svg', bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
    { title: 'District Onboarded', count: '99/26', sub: '(District/State)', icon: '/assets/Vector_02.svg', bg: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
    { title: 'ULB Onboarded', count: '104/99', sub: '(ULB/District)', icon: '/assets/Vector_03.svg', bg: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
    { title: 'Survey User Onboarded', count: '1481', sub: 'Active Surveyors', icon: '/assets/Vector_04.svg', bg: 'linear-gradient(135deg, #059669, #34d399)' },
    { title: 'Survey Unit Created', count: '9979/104', sub: '(SU/ULB)', icon: '/assets/VectorSUC_04.svg', bg: 'linear-gradient(135deg, #2563eb, #60a5fa)' },
    { title: 'Map Uploaded', count: '8698/101', sub: '(SU/ULB)', icon: '/assets/Vector_05.svg', bg: 'linear-gradient(135deg, #0d9488, #2dd4bf)' },
    { title: 'GT Completed', count: '396139/92', sub: '(Plots/ULB)', icon: '/assets/VectorGT_07.svg', bg: 'linear-gradient(135deg, #16a34a, #4ade80)' },
    { title: 'ROR Tagged', count: '193710/84', sub: '(Plots/ULB)', icon: '/assets/Vector_08.svg', bg: 'linear-gradient(135deg, #15803d, #22c55e)' }
  ];

  const circulars = [
    { title: 'Operational Guidelines for Survey in Urban Habitations (NAKSHA)', date: '28-May-2025', isNew: true },
    { title: 'CORS Station RTK Integration Protocol for Drone Operators', date: '22-May-2025', isNew: true },
    { title: 'Standard Operating Procedure (SOP) for 3D Cadastral Boundary Extraction', date: '18-May-2025', isNew: false },
    { title: 'Mandatory Adoption of 14-Digit ULPIN for Urban Land Records', date: '10-May-2025', isNew: false },
    { title: 'Empanelment of Certified Survey of India Remote Sensing Pilots', date: '02-May-2025', isNew: false }
  ];

  const statePartners = [
    { name: 'Maharashtra', file: 'mpsedc_logo.png' },
    { name: 'Odisha', file: 'partner_odisha.png' },
    { name: 'Karnataka', file: 'partner_karnataka.png' },
    { name: 'Rajasthan', file: 'partner_rajasthan.png' },
    { name: 'Punjab', file: 'partner_punjab.png' },
    { name: 'Jammu & Kashmir', file: 'partner_jk.png' },
    { name: 'Puducherry', file: 'partner_puducherry.png' },
    { name: 'Sikkim', file: 'partner_sikkim.png' },
    { name: 'Telangana', file: 'partner_telangana.png' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
      {/* 1. TOP UTILITY BAR */}
      <div style={{
        backgroundColor: '#0f2b5c',
        color: '#e2e8f0',
        padding: '5px 32px',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/bharat-sarkar.svg" alt="India Emblem" style={{ height: '18px' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span>भारत सरकार | Government of India</span>
          <span style={{ color: '#93c5fd' }}>• Ministry of Rural Development • Department of Land Resources</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ cursor: 'pointer', padding: '0 4px' }}>A-</span>
            <span style={{ cursor: 'pointer', padding: '0 4px', fontWeight: 'bold' }}>A</span>
            <span style={{ cursor: 'pointer', padding: '0 4px' }}>A+</span>
          </div>
          <span>English | हिन्दी</span>
          <Link
            to="/login"
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              padding: '3px 14px',
              borderRadius: '16px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '12px',
              boxShadow: '0 2px 6px rgba(245,158,11,0.4)'
            }}
          >
            District Admin Login
          </Link>
        </div>
      </div>

      {/* 2. BRAND HEADER */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src="/assets/top logo of ministery.png"
            alt="Ministry Logo"
            style={{ height: '56px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>DEPARTMENT OF LAND RESOURCES</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1b539c' }}>MINISTRY OF RURAL DEVELOPMENT • GOVERNMENT OF INDIA</div>
          </div>
        </div>

        <div>
          <img
            src="/assets/extracted/naksha_logo.png"
            alt="NAKSHA Portal"
            style={{ height: '58px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = '/assets/top logo of ministery.png';
            }}
          />
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav style={{
        backgroundColor: '#1b539c',
        color: '#ffffff',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Link to="/" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.18)' }}>
            Home
          </Link>
          <a href="#about" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none' }}>
            About NAKSHA
          </a>
          <a href="#milestones" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none' }}>
            Milestones
          </a>
          <a href="#circulars" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none' }}>
            Documents & Circulars
          </a>
          <Link to="/portal/dashboard" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none' }}>
            3D Cadastre Tracker
          </Link>
          <a href="#downloads" style={{ padding: '14px 18px', color: '#ffffff', textDecoration: 'none' }}>
            Downloads
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            to="/surveyor"
            style={{
              backgroundColor: '#f59e0b',
              color: '#0f172a',
              padding: '6px 14px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(245,158,11,0.4)'
            }}
          >
            <span>🛰️ 3D Surveyor Station</span>
          </Link>
          <Link
            to="/desktop"
            style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <span>💻 Desktop App Utility</span>
          </Link>
          <Link
            to="/login"
            style={{
              backgroundColor: '#ffffff',
              color: '#1b539c',
              padding: '6px 16px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            Admin Sign In →
          </Link>
        </div>
      </nav>

      {/* 4. AERIAL HERO BANNER (From Page 1 & original portal) */}
      <div style={{
        position: 'relative',
        minHeight: '380px',
        backgroundColor: '#0a192f',
        backgroundImage: 'url(/assets/banner_01.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 48px',
        color: '#ffffff'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(10,25,47,0.85) 0%, rgba(15,23,42,0.45) 100%)'
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            color: '#facc15',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12.5px',
            fontWeight: 700,
            marginBottom: '16px',
            border: '1px solid rgba(250,204,21,0.3)'
          }}>
            NATIONAL GEOSPATIAL MISSION • 152 CITIES
          </div>

          <h1 style={{
            fontSize: '38px',
            fontWeight: 800,
            lineHeight: '1.2',
            margin: '0 0 12px 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            शहरी भूमि की सही पहचान
          </h1>
          <p style={{ fontSize: '16px', color: '#e2e8f0', lineHeight: '1.5', margin: '0 0 24px 0' }}>
            National geospatial Knowledge-based land Survey of urban HAbitations (NAKSHA) creates authoritative digital land ownership records using 2.5cm drone orthomosaics and GIS parcel mapping.
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Link
              to="/login"
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
              }}
            >
              <span>Access District Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/portal/manage-aoi"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '12px 20px',
                borderRadius: '6px',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '14px',
                backdropFilter: 'blur(4px)'
              }}
            >
              Inspect Pune Map
            </Link>
          </div>
        </div>
      </div>

      {/* 5. ANNOUNCEMENTS TICKER */}
      <div style={{
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 24px',
        fontSize: '13px',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '4px',
          marginRight: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0
        }}>
          <Bell size={14} /> Announcements
        </div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
          <span style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
            📢 NAKSHA Pilot Programme expanded to 152 Cities across India • Drone Survey operations completed in Pune ULB (250946) • RoR passbooks digital verification live under UTM Zone 44N projection system.
          </span>
        </div>
      </div>

      {/* 6. MILESTONES & CIRCULARS (Side by side as in screenshot) */}
      <div id="milestones" style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1b539c', margin: '0 0 4px 0' }}>
              Milestones Covered Towards Nation-Building
            </h2>
            <div style={{ fontSize: '13.5px', color: '#64748b' }}>
              Live real-time progress across 29 States & Union Territories
            </div>
          </div>
          <Link to="/portal/dashboard" style={{ color: '#1b539c', fontWeight: 600, fontSize: '13.5px', textDecoration: 'none' }}>
            View Full Statistics →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* 8 Metric Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px'
          }}>
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  background: m.bg,
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '16px 14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, opacity: 0.9 }}>{m.title}</span>
                  <img
                    src={m.icon}
                    alt=""
                    style={{ width: '22px', height: '22px', filter: 'brightness(0) invert(1)' }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>{m.count}</div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Circulars Panel */}
          <div id="circulars" style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #1b539c', paddingBottom: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1b539c' }}>
                Circulars & Orders
              </h3>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>See All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
              {circulars.map((c, idx) => (
                <div key={idx} style={{ fontSize: '12.5px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <FileText size={14} color="#1b539c" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {c.title}
                        {c.isNew && (
                          <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', marginLeft: '6px', fontWeight: 700 }}>
                            NEW
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{c.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. WHAT IS NAKSHA & 4 KEY OBJECTIVES */}
      <div id="about" style={{ backgroundColor: '#ffffff', padding: '50px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#1b539c', margin: '0 0 8px 0' }}>
              What is NAKSHA Programme?
            </h2>
            <p style={{ maxWidth: '820px', margin: '0 auto', fontSize: '14.5px', color: '#64748b', lineHeight: '1.6' }}>
              Launched by the Department of Land Resources (DoLR), Ministry of Rural Development, NAKSHA modernizes urban land records in 152 cities across India using drone photogrammetry, high-accuracy CORS networks, and legal RoR digital certification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#1b539c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <Globe size={30} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Digitally Map Land Parcels
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                High-resolution orthomosaic imagery mapped to UTM 44N standard.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <Award size={30} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Clear Ownership & Land Use
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                14-digit ULPIN assigning definitive property boundaries and legal title.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <ShieldCheck size={30} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Enhanced Transparency
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Digitally signed RoR passbooks reducing dispute cases and arbitrations.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#faf5ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto' }}>
                <Smartphone size={30} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Urban Planning & Taxation
              </h4>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Fair property taxation, infrastructure planning, and municipal governance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. SUPPORTING STATE PARTNERS CAROUSEL */}
      <div style={{ backgroundColor: '#f1f5f9', padding: '30px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Key Technology & State Government Partners
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          opacity: 0.85
        }}>
          {statePartners.map((p, idx) => (
            <div key={idx} style={{
              background: '#ffffff',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1e293b'
            }}>
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* 9. DOWNLOADS & FOOTER */}
      <footer id="downloads" style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '40px 32px 24px 32px', fontSize: '13px' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div>
            <h4 style={{ color: '#ffffff', margin: '0 0 12px 0', fontSize: '15px' }}>About NAKSHA</h4>
            <p style={{ lineHeight: '1.6', fontSize: '12.5px' }}>
              National geospatial Knowledge-based land Survey of urban HAbitations is an initiative of the Ministry of Rural Development, Department of Land Resources, Government of India.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', margin: '0 0 12px 0', fontSize: '15px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <li><Link to="/login" style={{ color: '#93c5fd', textDecoration: 'none' }}>District Admin Login</Link></li>
              <li><Link to="/portal/manage-aoi" style={{ color: '#93c5fd', textDecoration: 'none' }}>Manage AOI</Link></li>
              <li><Link to="/portal/upload-layer" style={{ color: '#93c5fd', textDecoration: 'none' }}>Upload Layer</Link></li>
              <li><Link to="/portal/case-entry" style={{ color: '#93c5fd', textDecoration: 'none' }}>Case Entry/Manage</Link></li>
              <li><Link to="/portal/survey-activities/manage-publication" style={{ color: '#93c5fd', textDecoration: 'none' }}>Manage Publication</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', margin: '0 0 12px 0', fontSize: '15px' }}>Surveyor Mobile Apps</h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img
                src="/assets/android-app-qr.svg"
                alt="QR Code"
                style={{ width: '80px', height: '80px', background: '#fff', padding: '4px', borderRadius: '4px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
              <div style={{ fontSize: '12px' }}>
                <div>Download NAKSHA Mobile Client for Android</div>
                <a
                  href="/assets/pune_sample_shapefile_utm44n.zip"
                  style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginTop: '6px' }}
                >
                  Download Sample Shapefile (.zip)
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', margin: '0 0 12px 0', fontSize: '15px' }}>Developed By</h4>
            <p style={{ fontSize: '12.5px', lineHeight: '1.5' }}>
              Maharashtra State Electronics Development Corporation Ltd (MPSEDC)<br />
              Department of Science and Technology, GoMP<br />
              Phone: +91-755-2518300 | info@mpsedc.gov.in
            </p>
          </div>
        </div>

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          borderTop: '1px solid #1e293b',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}>
          <div>© 2026 NAKSHA Portal • Department of Land Resources • Ministry of Rural Development</div>
          <div>All maps and geospatial data rendered under UTM Zone 44N projection system.</div>
        </div>
      </footer>
    </div>
  );
};
