import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { mockStore } from '../../data/mockStore';

export const StateHomePage: React.FC = () => {
  const metrics = mockStore.getStateMetrics();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Hero Container matching State Admin Manual Page 6 & 7 */}
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
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '8px' }}>
          National geospatial Knowledge-based land Survey of urban Habitations (NAKSHA)
        </div>
        <div style={{ fontSize: '15px', color: '#ea580c', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
          STATE: MADHYA PRADESH
        </div>

        {/* Center 3D Heritage & Survey Equipment Display */}
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
              MADHYA PRADESH STATE GEOSPATIAL COMMAND • NAKSHA
            </div>
          </div>

          {/* Sanchi Stupa / 3D Parcel Art */}
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

          {/* Left State Coordination Badge */}
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
              <div style={{ fontSize: '11px', color: '#64748b' }}>State Authority</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1b539c' }}>MPSEDC / GoMP</div>
            </div>
          </div>

          {/* Right Cadastral Live Coverage Badge */}
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
              <div style={{ fontSize: '11px', color: '#64748b' }}>Districts Onboarded</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16a34a' }}>52 Districts Live</div>
            </div>
          </div>
        </div>

        {/* State Summary Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '24px'
        }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>State Total Users</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#eab308' }}>{metrics.totalUsers}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active Survey Personnel</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>{metrics.activeUsers}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Inactive / Pending</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{metrics.inactiveUsers}</div>
          </div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 20px', minWidth: '160px' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Onboarded ULBs</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1b539c' }}>104 ULBs</div>
          </div>
        </div>
      </div>

      {/* State Admin Quick Modules */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
          State Administration & Oversight Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <Link
            to="/state/dashboard"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ backgroundColor: '#eff6ff', color: '#1b539c', padding: '10px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px' }}>
                <LayoutDashboard size={22} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                State Dashboard
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                State-wide user activity, system usage breakdown across 52 districts, and live GIS progress.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1b539c', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Open Dashboard</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            to="/state/user-management/users"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '10px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px' }}>
                <Users size={22} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                User Management
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                Manage state departments, designations, 9-module roles matrix, user onboarding, and role assignments.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>Manage Users</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            to="/state/reports"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ backgroundColor: '#faf5ff', color: '#9333ea', padding: '10px', borderRadius: '8px', width: 'fit-content', marginBottom: '12px' }}>
                <FileText size={22} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#1e293b', fontWeight: 700 }}>
                State Reports & Analytics
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                District-wise progress reports, CORS network operational status, and ULPIN registry downloads.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9333ea', fontSize: '13px', fontWeight: 600, marginTop: '16px' }}>
              <span>View Reports</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
