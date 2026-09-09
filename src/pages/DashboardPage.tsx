import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { GisMap } from '../components/common/GisMap';
import { BarChart3, TrendingUp, CheckCircle, Clock, MapPin } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          District Geospatial Monitoring Dashboard
        </h2>
        <span style={{ fontSize: '13px', background: '#eff6ff', color: '#1b539c', padding: '4px 12px', borderRadius: '16px', fontWeight: 600 }}>
          Live Status • Pune District
        </span>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#1b539c', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Total Habitation Plots</span>
            <MapPin size={18} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>683</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>99.2% surveyed with drone GSD 2.5cm</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Ground Truthing Done</span>
            <CheckCircle size={18} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>678</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>5 pending field verification</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ea580c', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>RoR passbooks Issued</span>
            <TrendingUp size={18} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>663</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>97.8% title record security</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9333ea', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Active Dispute Cases</span>
            <Clock size={18} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>2</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>In District Gazette arbitration</div>
        </div>
      </div>

      {/* Live Map */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1b539c', margin: '0 0 12px 0' }}>
          Interactive Pune Habitations Spatial Cadastre
        </h3>
        <GisMap height="480px" showAoi={true} showCadastral={true} showTaxPoints={true} showBuildings={true} showDronePath={true} />
      </div>
    </div>
  );
};
