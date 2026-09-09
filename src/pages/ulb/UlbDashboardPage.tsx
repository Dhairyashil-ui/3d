import React from 'react';
import { 
  Users, 
  MapPin, 
  UploadCloud, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  RefreshCw,
  Clock
} from 'lucide-react';

export const UlbDashboardPage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c', fontWeight: 600 }}>Home</span>
        <span>›</span>
        <span>Dashboard</span>
      </div>

      {/* Top Banner matching video Frame 95s */}
      <div style={{
        background: 'linear-gradient(90deg, #dbeafe 0%, #eff6ff 60%, #e0f2fe 100%)',
        borderRadius: '12px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #bfdbfe',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#1e3a8a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.5px'
          }}>
            Real-Time Survey Insights
          </h2>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#2563eb' }}>
            for Maharashtra &bull; PMRDA Pune (270410) / PMC
          </div>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px' }}>
            Active Cadastral Zones: Hinjawadi Phase 1, Baner, Kothrud, Shivajinagar, Viman Nagar
          </div>
        </div>

        {/* Banner Graphic badge matching video */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 4px 12px rgba(30,58,138,0.08)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '8px',
            backgroundColor: '#1b539c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              ULB Command Status
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              Operational (Active Survey)
            </div>
          </div>
        </div>
      </div>

      {/* 8-Widget Grid matching video Frame 95s */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {/* 1. Survey User Onboarded (with Donut Chart) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Survey User Onboarded</span>
            <Users size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b', width: '60px' }}>Total</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>16</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b', width: '60px' }}>Active</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>16</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ color: '#64748b', width: '60px' }}>Inactive</span>
                <span style={{ fontWeight: 700, color: '#dc2626' }}>0</span>
              </div>
            </div>

            {/* Donut Chart matching video Frame 95s */}
            <div style={{ position: 'relative', width: '90px', height: '90px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#4ade80"
                  strokeWidth="4"
                  strokeDasharray="88 100"
                  strokeDashoffset="0"
                />
              </svg>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 800,
                color: '#16a34a'
              }}>
                100%
              </div>
            </div>
          </div>
        </div>

        {/* 2. Survey Unit Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Survey Unit Status</span>
            <MapPin size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>12</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ca8a04' }}>3</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Assigned</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>9</span>
            </div>
          </div>
        </div>

        {/* 3. Data Upload Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Data Upload Status</span>
            <UploadCloud size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total Survey Unit</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>12</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Map Uploaded</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>10</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                <span style={{ color: '#64748b' }}>Image Uploaded</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>10</span>
            </div>
          </div>
        </div>

        {/* 4. Survey Activities Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Survey Activities Status</span>
            <Activity size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total Plots</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>345</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Verified</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>290</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#e05a1e' }} />
                <span style={{ color: '#64748b' }}>RoR Tagged</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ea580c' }}>280</span>
            </div>
          </div>
        </div>

        {/* 5. Claims Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Claims Status</span>
            <AlertCircle size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>18</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Online</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>14</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f97316' }} />
                <span style={{ color: '#64748b' }}>Offline</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ea580c' }}>4</span>
            </div>
          </div>
        </div>

        {/* 6. Redressal Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Redressal Status</span>
            <CheckCircle2 size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>18</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ca8a04' }}>5</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Addressed</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>13</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: 7. Publication Status Matrix (2 cols) & 8. Claim Correction Status (1 col) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* 7. Publication Status Table matching video Frame 95s */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Publication Status</span>
            <FileCheck size={18} color="#2563eb" />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#475569', fontWeight: 600 }}>Stage</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#475569', fontWeight: 600 }}>First Publication</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#475569', fontWeight: 600 }}>Provisional Publication</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#475569', fontWeight: 600 }}>Final Publication</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>Published</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>4</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>2</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#16a34a', fontWeight: 700 }}>1</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>Rejected</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#dc2626', fontWeight: 700 }}>0</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#dc2626', fontWeight: 700 }}>0</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#dc2626', fontWeight: 700 }}>0</td>
              </tr>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1b539c' }}>Total Received</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#1b539c', fontWeight: 800 }}>4</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#1b539c', fontWeight: 800 }}>2</td>
                <td style={{ textAlign: 'center', padding: '10px 12px', color: '#1b539c', fontWeight: 800 }}>1</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 8. Claim Correction Status matching video Frame 95s */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Claim Correction Status</span>
            <RefreshCw size={18} color="#2563eb" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
                <span style={{ color: '#64748b' }}>Total</span>
              </div>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>12</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
              </div>
              <span style={{ fontWeight: 700, color: '#ca8a04' }}>2</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Corrected</span>
              </div>
              <span style={{ fontWeight: 700, color: '#16a34a' }}>10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
