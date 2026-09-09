import React, { useState } from 'react';
import { User, Search, MapPin, Mail, Phone, Building, ShieldCheck } from 'lucide-react';

interface AssignedAreaItem {
  id: string;
  state: string;
  district: string;
  ulb: string;
  wardVillage: string;
}

const INITIAL_AREAS: AssignedAreaItem[] = [
  { id: '1', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 12 - Hinjawadi Phase 1' },
  { id: '2', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 24 - Baner-Balewadi' },
  { id: '3', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 36 - Kothrud' },
  { id: '4', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 42 - Shivajinagar' },
  { id: '5', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 55 - Viman Nagar' },
  { id: '6', state: 'Maharashtra', district: 'Pune', ulb: 'PMRDA Pune (270410)', wardVillage: 'Ward 68 - Hadapsar Magarpatta' }
];

export const UlbProfilePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = INITIAL_AREAS.filter(a => 
    a.wardVillage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.ulb.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#1b539c' }}>Home</span>
        <span>›</span>
        <span style={{ fontWeight: 600 }}>Officer Profile</span>
      </div>

      {/* Top Officer Profile Card matching video Frame 620s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '28px 36px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        {/* Left Avatar & Identity */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRight: '1px solid #f1f5f9',
          paddingRight: '28px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#e0e7ff',
            color: '#1b539c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '4px solid #bfdbfe',
            boxShadow: '0 4px 12px rgba(27,83,156,0.15)'
          }}>
            <User size={64} />
          </div>

          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
            ULB Pune Admin
          </h3>
          <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '8px' }}>
            pune_ulb@maharashtra.gov.in
          </div>
          <span style={{
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            ✓ Active ULB Administrator
          </span>
        </div>

        {/* Right Officer Metadata Grid matching frame 620s */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          alignContent: 'center'
        }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Name</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>ULB</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Last Name</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>Pune Admin</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Mobile Number</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>9823012345</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Email ID</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1b539c', marginTop: '2px' }}>pune_ulb@maharashtra.gov.in</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Role</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>Ulb</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', gridColumn: 'span 2' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Designation</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>ULB Officer / Assistant Director of Town Planning (ADTP)</div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>Department</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>PMRDA / PMC Pune</div>
          </div>
        </div>
      </div>

      {/* Assigned Area Section matching frame 620s */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
            Assigned Area
          </h3>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '12.5px'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#2563eb', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>State</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>District</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>ULB</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Ward/Village</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                  }}
                >
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{row.state}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{row.district}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{row.ulb}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1b539c' }}>{row.wardVillage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
