import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MoreVertical, X, Menu } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const isThreeDViewerPage = location.pathname.includes('3d-') || location.pathname.includes('three-d-viewer');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="naksha-portal-layout" style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f1f5f9',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative'
    }}>
      {/* 1. Persistent Left Sidebar (Hidden on 3D Property Intelligence to maximize screen space) */}
      {!isThreeDViewerPage && <Sidebar />}

      {/* 2. Slide-out Drawer for 3-Dot Menu on 3D Property Intelligence */}
      {isThreeDViewerPage && drawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer'
            }}
          />

          {/* Drawer Sidebar */}
          <div style={{
            position: 'relative',
            zIndex: 10000,
            width: '280px',
            height: '100%',
            boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)',
            animation: 'slideInLeft 0.25s ease-out'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '-40px',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
              title="Close Menu"
            >
              <X size={18} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
        position: 'relative'
      }}>
        {/* Top Header */}
        <Header />

        {/* 3-Dot Floating Navigation Button on 3D Property Intelligence */}
        {isThreeDViewerPage && (
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              position: 'absolute',
              top: '58px',
              left: '16px',
              zIndex: 100,
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
            title="Open NAKSHA Navigation Menu (Home, Dashboard, etc.)"
          >
            <MoreVertical size={16} color="#38bdf8" />
            <span style={{ color: '#f8fafc', fontSize: '11px' }}>Menu</span>
          </button>
        )}

        {/* Dynamic Page Outlet: 0 padding on 3D page to provide edge-to-edge full width */}
        <main style={{
          flex: 1,
          overflowY: isThreeDViewerPage ? 'hidden' : 'auto',
          padding: isThreeDViewerPage ? '0' : '20px 28px',
          backgroundColor: isThreeDViewerPage ? '#020617' : '#f8fafc'
        }}>
          <Outlet />
        </main>

        {/* Official NAKSHA UAT Ticker Banner */}
        <footer style={{
          backgroundColor: '#ef4444',
          color: '#ffffff',
          padding: '3px 20px',
          fontSize: '10.5px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexShrink: 0,
          textAlign: 'center',
          letterSpacing: '0.2px'
        }}>
          *This is a User Acceptance Testing (UAT) version of the website. All data displayed here is dummy/test data and not legally valid or authentic. Please do not treat any information on this portal as official or final. This environment is strictly for internal testing and validation.*
        </footer>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
