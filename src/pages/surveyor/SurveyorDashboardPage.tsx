import React from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  Layers,
  MapPin,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  Scissors,
  Split,
  PenTool,
  ArrowRight,
  Box,
  Building2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

import { apiClient } from '../../services/apiClient';

export const SurveyorDashboardPage: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalParcels: 56,
    verifiedParcels: 28,
    pendingParcels: 26,
    disputedParcels: 2,
    totalBuildings: 28,
    multiStoreyBuildings: 12,
    totalUnits: 74,
    rorCompleted: 34,
    rorPending: 22,
    openClaims: 1,
    resolvedClaims: 1,
    gtPointsCount: 45,
    splitCount: 0,
    mergedCount: 0,
    createdCount: 0,
    verificationPct: 50.0,
    rorPct: 60.7
  });

  React.useEffect(() => {
    async function loadStats() {
      const s = await apiClient.getDashboardStats();
      setStats(s);
    }
    loadStats();
  }, []);
  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header Banner matching Screenshot 220336.png */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #dbeafe',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 50%, #dbeafe 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#1e88e5',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '12px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <span>NAKSHA MAP-2 GROUND TRUTHING</span>
          </div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#1565c0',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            Real-Time Survey Insights for Maharashtra • Pune District
          </h1>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: 0, fontWeight: 500 }}>
            ULB: <b style={{ color: '#0f172a' }}>PMRDA Pune (270410)</b> • Ward: <b style={{ color: '#0f172a' }}>Ward 12 - Hinjawadi Phase 1</b> • Survey Unit: <b style={{ color: '#0f172a' }}>SU-HINJ-01 (I²IT Campus)</b>
          </p>
        </div>

        {/* Right 3D Intelligence Callout Button */}
        <div style={{ zIndex: 2, display: 'flex', gap: '10px' }}>
          <Link
            to="/surveyor/property-search"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(25, 118, 210, 0.3)'
            }}
          >
            <Box size={16} />
            <span>3D Property Intelligence</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Subtle Map Silhouette Background Decoration */}
        <div style={{
          position: 'absolute',
          right: '220px',
          top: '-20px',
          opacity: 0.12,
          pointerEvents: 'none'
        }}>
          <Map size={180} color="#1e88e5" />
        </div>
      </div>

      {/* 2. Exact 9 KPI Cards in 3x3 Grid matching Screenshot 220336.png */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        {/* Card 1: Map Verification (Survey Units) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              Map Verification (Survey Units)
            </span>
            <div style={{ color: '#94a3b8' }}>
              <Map size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
                <b style={{ marginLeft: '12px', color: '#0f172a' }}>0</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Verified</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>1</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ color: '#64748b' }}>Reject</span>
                <b style={{ marginLeft: '22px', color: '#0f172a' }}>0</b>
              </div>
            </div>
            {/* SVG Donut Chart (100% Verified Green) */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Image Verification */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              Image Verification
            </span>
            <div style={{ color: '#94a3b8' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
                <b style={{ marginLeft: '12px', color: '#0f172a' }}>0</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Verified</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>1</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                <span style={{ color: '#64748b' }}>Completed</span>
                <b style={{ marginLeft: '2px', color: '#0f172a' }}>1</b>
              </div>
            </div>
            {/* SVG Donut Chart (Green) */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Ground Truthing */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              Ground Truthing (GT Points)
            </span>
            <div style={{ color: '#94a3b8' }}>
              <MapPin size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <span style={{ color: '#64748b' }}>Total Plots</span>
                <b style={{ marginLeft: '8px', color: '#0f172a' }}>{stats.totalParcels}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                <span style={{ color: '#64748b' }}>GT Controls</span>
                <b style={{ marginLeft: '8px', color: '#0f172a' }}>{stats.gtPointsCount}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Verified</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>{stats.verifiedParcels}</b>
              </div>
            </div>
            {/* SVG Donut Chart */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="6"
                  strokeDasharray={`${stats.verificationPct}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4: Plot Verification */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              Plot Verification
            </span>
            <div style={{ color: '#94a3b8' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <span style={{ color: '#64748b' }}>Total Plots</span>
                <b style={{ marginLeft: '8px', color: '#0f172a' }}>{stats.totalParcels}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#facc15' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>{stats.pendingParcels}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Verified</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>{stats.verifiedParcels}</b>
              </div>
            </div>
            {/* SVG Donut Chart */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="6"
                  strokeDasharray={`${stats.verificationPct}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 5: ROR Entry */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              ROR Entry
            </span>
            <div style={{ color: '#94a3b8' }}>
              <FileCheck2 size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#facc15' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
                <b style={{ marginLeft: '12px', color: '#0f172a' }}>{stats.rorPending}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ color: '#64748b' }}>Disputed</span>
                <b style={{ marginLeft: '10px', color: '#0f172a' }}>{stats.disputedParcels}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                <span style={{ color: '#64748b' }}>Completed</span>
                <b style={{ marginLeft: '2px', color: '#0f172a' }}>{stats.rorCompleted}</b>
              </div>
            </div>
            {/* SVG Donut Chart */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fde047"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeDasharray={`${stats.rorPct}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 6: Claim Correction Status */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>
              Claim Correction Status
            </span>
            <div style={{ color: '#94a3b8' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                <span style={{ color: '#64748b' }}>Total</span>
                <b style={{ marginLeft: '30px', color: '#0f172a' }}>{stats.openClaims + stats.resolvedClaims}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#facc15' }} />
                <span style={{ color: '#64748b' }}>Pending</span>
                <b style={{ marginLeft: '16px', color: '#0f172a' }}>{stats.openClaims}</b>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ color: '#64748b' }}>Corrected</span>
                <b style={{ marginLeft: '4px', color: '#0f172a' }}>{stats.resolvedClaims}</b>
              </div>
            </div>
            {/* SVG Donut Chart */}
            <div style={{ width: '70px', height: '70px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="6"
                  strokeDasharray="100, 100"
                />
                {stats.openClaims > 0 && (
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#fde047"
                    strokeWidth="6"
                    strokeDasharray={`${((stats.openClaims / Math.max(1, stats.openClaims + stats.resolvedClaims)) * 100).toFixed(0)}, 100`}
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Card 7: Total Plot Split */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Total Plot <br /><b style={{ color: '#1e293b' }}>Split</b>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1565c0' }}>{stats.splitCount}</div>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e88e5'
          }}>
            <Scissors size={32} />
          </div>
        </div>

        {/* Card 8: Total Plot Merged */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Total Plot <br /><b style={{ color: '#1e293b' }}>Merged</b>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1565c0' }}>{stats.mergedCount}</div>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e88e5'
          }}>
            <Split size={32} />
          </div>
        </div>

        {/* Card 9: Total New Plots Created */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
              Total New Plots <br /><b style={{ color: '#1e293b' }}>Created</b>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1565c0' }}>{stats.createdCount}</div>
          </div>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e88e5'
          }}>
            <PenTool size={32} />
          </div>
        </div>
      </div>

      {/* 3. New 3D Property Intelligence Summary Strip */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={20} color="#1976d2" />
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              3D Property Intelligence Status (Survey Unit 1)
            </span>
          </div>
          <Link
            to="/surveyor/property-search"
            style={{ fontSize: '12.5px', color: '#1976d2', fontWeight: 700, textDecoration: 'none' }}
          >
            Open Unified Property Search →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Active Land Parcels</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{stats.totalParcels} Parcels</div>
            <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>{stats.verifiedParcels} ULPINs Verified</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>3D Building Massings</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e88e5', marginTop: '2px' }}>{stats.totalBuildings} Buildings</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Extruded Footprints</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Multi-Storey Slabs</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{stats.multiStoreyBuildings * 4} Floors</div>
            <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>Georeferenced Heights</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Unit Spatial Volumes</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e88e5', marginTop: '2px' }}>{stats.totalUnits} Volumes</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Multi-Unit Ownership</div>
          </div>
        </div>
      </div>
    </div>
  );
};
