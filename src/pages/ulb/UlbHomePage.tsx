import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Activity, 
  AlertOctagon, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Building2,
  FileText,
  UserCheck
} from 'lucide-react';

export const UlbHomePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Hero Container matching State & District Home Page */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '36px 32px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #ffffff 0%, #f8fafc 100%)'
      }}>
        {/* Welcome Text */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#1b539c',
          margin: '0 0 6px 0',
          letterSpacing: '-0.5px'
        }}>
          Welcome to the NAKSHA Portal
        </h1>
        <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 600, marginBottom: '24px' }}>
          State: <span style={{ color: '#ea580c', fontWeight: 700 }}>Maharashtra</span>
          <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
          Assigned District: <span style={{ color: '#1b539c', fontWeight: 700 }}>Pune</span>
          <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
          Urban Local Body (ULB): <span style={{ color: '#1b539c', fontWeight: 700 }}>PMRDA Pune (270410) / PMC</span>
        </div>

        {/* Center 3D Heritage & Survey Equipment Art Display (Matching State & District Home Page) */}
        <div style={{
          position: 'relative',
          height: '240px',
          maxWidth: '780px',
          margin: '0 auto 28px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Background 3D Perspective Grid */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '110px',
            background: 'linear-gradient(180deg, rgba(27, 83, 156, 0.08) 0%, rgba(27, 83, 156, 0.22) 100%)',
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
            borderBottom: '3px solid #1b539c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ color: '#1b539c', fontSize: '11px', fontWeight: 600, opacity: 0.6, letterSpacing: '2px' }}>
              NATIONAL GEOSPATIAL 3D GRID • UTM ZONE 43N
            </div>
          </div>

          {/* Sanchi Stupa / 3D Parcel Graphic matching State and District home pages */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '12px',
            opacity: 0.95
          }}>
            <img
              src="/assets/extracted/3d_parcel.png"
              alt="NAKSHA 3D Parcel"
              style={{ height: '170px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))' }}
              onError={(e) => {
                e.currentTarget.src = '/assets/3d plan.png';
              }}
            />
          </div>

          {/* Left Surveyor Tripod Icon Graphic */}
          <div style={{
            position: 'absolute',
            left: '8%',
            bottom: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '8px', borderRadius: '8px', color: '#1b539c' }}>
              <ShieldCheck size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Survey Validation</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1b539c' }}>DoLR / PMRDA Pune</div>
            </div>
          </div>

          {/* Right Laptop Display Graphic */}
          <div style={{
            position: 'absolute',
            right: '8%',
            bottom: '25px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '8px', borderRadius: '8px', color: '#16a34a' }}>
              <CheckCircle size={24} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>RoR Cadastre</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>PMRDA Pune Live</div>
            </div>
          </div>
        </div>

        {/* Quick Summary Pill Badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '24px'
        }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Assigned ULB</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1b539c' }}>PMRDA (270410)</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Survey Units</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>18 Units</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Plots Ground Truthed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>24,850 / 25,400</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Pending Publications</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706' }}>3 Publications</div>
          </div>
        </div>
      </div>

      {/* Quick Access Modules Grid matching State & District Home Page */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
          ULB Admin Modules & Quick Navigation
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Card 1: Dashboard */}
          <Link
            to="/ulb/dashboard"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#eff6ff', color: '#1b539c', padding: '10px', borderRadius: '8px' }}>
                  <LayoutDashboard size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: '10px' }}>
                  Live Status
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Survey Dashboard
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                View onboarded users breakdown donut chart, 18 ward survey units, GIS uploads, and publication statuses.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1b539c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Package Ingestion & Team Allocation */}
          <Link
            to="/ulb/package-receiving"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#f0f9ff', color: '#0284c7', padding: '10px', borderRadius: '8px' }}>
                  <Users size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '10px' }}>
                  DoLR Ingestion
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Package Ingestion & Team Allocation
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Receive verified 4-package assets from Desktop and allocate Superintending Officer & survey specialists.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Create Survey Unit */}
          <Link
            to="/ulb/create-survey-unit"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '8px' }}>
                  <FileSpreadsheet size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                  GIS Units
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Create Survey Unit
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Define and register survey unit codes, target plot counts, and link designated committees across Pune wards.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Survey Unit Details */}
          <Link
            to="/ulb/survey-units-details"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '10px', borderRadius: '8px' }}>
                  <FileText size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#ea580c', background: '#ffedd5', padding: '2px 8px', borderRadius: '10px' }}>
                  Unit Tracker
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Survey Unit Details
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Track surveyor allocations, map upload timestamps, total cadastral plots, and committee status.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 5: User Management */}
          <Link
            to="/ulb/master/manage-user"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#ecfeff', color: '#0891b2', padding: '10px', borderRadius: '8px' }}>
                  <Building2 size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0891b2', background: '#cffafe', padding: '2px 8px', borderRadius: '10px' }}>
                  RBAC Controls
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                User Management
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Manage departments, designations, granular Add/Update/View permissions matrix, and assign ward areas.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0891b2', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 6: Manage Publication */}
          <Link
            to="/ulb/urban-survey-publication"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#fef2f2', color: '#e11d48', padding: '10px', borderRadius: '8px' }}>
                  <Send size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#e11d48', background: '#ffe4e6', padding: '2px 8px', borderRadius: '10px' }}>
                  Section 7 Notice
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Manage Publication
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Verify First & Final Urban Survey publications, review owner documents, title photos, and forward notices.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 7: Claim & Redressal */}
          <Link
            to="/ulb/claim-redressal"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#fff1f2', color: '#be123c', padding: '10px', borderRadius: '8px' }}>
                  <AlertOctagon size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#be123c', background: '#ffe4e6', padding: '2px 8px', borderRadius: '10px' }}>
                  Disputes
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Claim & Redressal
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Schedule revenue hearings for citizen claims and boundary objections, upload hearing orders and survey corrections.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be123c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 8: Officer Profile & Area Allocation */}
          <Link
            to="/ulb/profile"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ backgroundColor: '#f0fdfa', color: '#0f766e', padding: '10px', borderRadius: '8px' }}>
                  <UserCheck size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f766e', background: '#ccfbf1', padding: '2px 8px', borderRadius: '10px' }}>
                  PMRDA 270410
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Officer Profile & Areas
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Review ULB Pune Admin credentials, contact details, assigned wards table, and security settings.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f766e', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
