import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Layers, FileText, FileSpreadsheet, Users, Activity, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockStore } from '../data/mockStore';

export const HomePage: React.FC = () => {
  const authUser = mockStore.getAuthUser();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Hero Container matching PDF Manual Page 6 */}
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
          State: <span style={{ color: '#ea580c', fontWeight: 700 }}>{authUser.state || 'Maharashtra'}</span>
          <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
          Assigned District: <span style={{ color: '#1b539c', fontWeight: 700 }}>{authUser.district || 'Pune'}</span>
        </div>

        {/* Center 3D Heritage & Survey Equipment Art Display (Matching Screenshot Page 6) */}
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
              NATIONAL GEOSPATIAL 3D GRID • UTM ZONE 44N
            </div>
          </div>

          {/* Sanchi Stupa / Heritage Monument Silhouettes */}
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
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1b539c' }}>DoLR / MPSEDC</div>
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
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>152 Cities Live</div>
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
            <div style={{ fontSize: '12px', color: '#64748b' }}>Assigned ULBs</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1b539c' }}>3</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Survey Units</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0284c7' }}>7 Units</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Plots Ground Truthed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>678 / 683</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Pending Publications</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#d97706' }}>1 Publication</div>
          </div>
        </div>
      </div>

      {/* Quick Access Modules Grid */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
          District Admin Modules & Quick Navigation
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {/* Card 1: Manage AOI */}
          <Link
            to="/portal/manage-aoi"
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
                  <Map size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: '10px' }}>
                  UTM 44N
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Manage AOI
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Define geographic Areas of Interest, upload and inspect shapefiles on real satellite maps.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1b539c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Upload Layer */}
          <Link
            to="/portal/upload-layer"
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
                  <Layers size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                  Cadastral GIS
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Upload Layer
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Integrate cadastral boundaries, property tax points, building footprints, and layout plans.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Case Entry/Manage */}
          <Link
            to="/portal/case-entry"
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
                <div style={{ backgroundColor: '#faf5ff', color: '#9333ea', padding: '10px', borderRadius: '8px' }}>
                  <FileText size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#9333ea', background: '#f3e8ff', padding: '2px 8px', borderRadius: '10px' }}>
                  Gazette Orders
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Case Entry / Manage
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Track survey-related legal cases, upload settlement orders, and record official proceedings.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9333ea', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Survey Unit Details */}
          <Link
            to="/portal/survey-units"
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
                  <FileSpreadsheet size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#ea580c', background: '#ffedd5', padding: '2px 8px', borderRadius: '10px' }}>
                  Unit Tracker
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Survey Unit Details
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Monitor surveyor unit assignments, ward coverage, and live map upload timestamps.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 5: User Management */}
          <Link
            to="/portal/user-management/users"
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
                  <Users size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0891b2', background: '#cffafe', padding: '2px 8px', borderRadius: '10px' }}>
                  RBAC Controls
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                User Management
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Departments, designations, role permissions matrix, user directory, and area allocations.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0891b2', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 6: Manage Publication */}
          <Link
            to="/portal/survey-activities/manage-publication"
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
                  <Activity size={22} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#e11d48', background: '#ffe4e6', padding: '2px 8px', borderRadius: '10px' }}>
                  OTP & e-Sign
                </span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                Manage Publication
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Final RoR publication workflow with parcel map inspection, OTP verification, and Aadhaar e-Sign.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Module</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
