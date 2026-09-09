import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FileText, Download, Bell, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const downloadReport = (title: string, filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloadToast(`Downloaded: ${title}`);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleDownloadGroundTruth = () => {
    const csvContent = "S.No,Parcel ID,ULPIN,Ward,Ground Truth Status,Surveyor,Date\n1,PAR-000123,23-396-250946-000123,Ward 43,Verified,Surveyor Pune,2025-11-14\n2,PAR-000124,23-396-250946-000124,Ward 43,Verified,Surveyor Pune,2025-11-14\n3,PAR-000125,23-396-250946-000125,Ward 43,Verified,Surveyor Pune,2025-11-15\n";
    downloadReport("Ward-wise Ground Truthing Report", "NAKSHA_Ward43_Ground_Truthing_Report.csv", csvContent);
  };

  const handleDownloadUlpinRegister = () => {
    const csvContent = "S.No,ULPIN,Khasra No,Owner Name,Building ID,Area Sqm,Tax Status\n1,23-396-250946-000123,412/1,Gulmohar Residency Society,BLD-000781,768.04,Paid\n2,23-396-250946-000124,412/2,Smt. Kavita Sharma,BLD-000782,412.50,Paid\n3,23-396-250946-000125,413/1,Shri Rajesh Agrawal,BLD-000783,520.00,Exempt\n";
    downloadReport("14-Digit ULPIN Issuance Register", "NAKSHA_ULPIN_Register_Pune.csv", csvContent);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Reports' }]} />

      {downloadToast && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '10px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <CheckCircle size={16} />
          <span>{downloadToast}</span>
        </div>
      )}

      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Geospatial Survey & RoR Reports
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1b539c' }}>Ward-wise Ground Truthing Report</h4>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Complete summary of parcel ground verification across Pune ULB.</p>
          <button 
            onClick={handleDownloadGroundTruth}
            style={{ backgroundColor: '#1b539c', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Download CSV Report
          </button>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1b539c' }}>14-Digit ULPIN Issuance Register</h4>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Authoritative list of Unique Land Parcel Identification Numbers.</p>
          <button 
            onClick={handleDownloadUlpinRegister}
            style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} /> Download Register (.csv)
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Notification' }]} />
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        System Notifications
      </h2>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ borderLeft: '4px solid #22c55e', padding: '10px 16px', background: '#f8fafc', borderRadius: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>RoR Published for Ward 2 - Shahpura</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Collector & DM applied cryptographic e-sign to 320 parcels.</div>
        </div>
        <div style={{ borderLeft: '4px solid #3b82f6', padding: '10px 16px', background: '#f8fafc', borderRadius: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e293b' }}>CORS Station Calibration Online</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Survey of India RTK corrections active for drone flight quadcopters.</div>
        </div>
      </div>
    </div>
  );
};

export const ManageLogPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Manage Log' }]} />
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Audit & System Logs
      </h2>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1b539c', color: '#fff' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Timestamp</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>User</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>Action</th>
              <th style={{ padding: '8px 12px', textAlign: 'left' }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 12px' }}>05-09-2026 10:45:12</td>
              <td style={{ padding: '8px 12px' }}>Pune DM</td>
              <td style={{ padding: '8px 12px' }}>Logged in via 2FA State Portal</td>
              <td style={{ padding: '8px 12px' }}>10.125.44.12</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '8px 12px' }}>05-09-2026 09:30:00</td>
              <td style={{ padding: '8px 12px' }}>Dhiren Surveyor</td>
              <td style={{ padding: '8px 12px' }}>Uploaded Cadastral Layer (UTM 44N)</td>
              <td style={{ padding: '8px 12px' }}>10.125.44.88</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ComplaintsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Breadcrumb items={[{ label: 'Raise a complaint' }]} />
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Grievance Redressal & Helpdesk
      </h2>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px', maxWidth: '640px' }}>
        <form onSubmit={(e) => { e.preventDefault(); alert('Complaint submitted to MPSEDC Helpdesk!'); }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Subject</label>
            <input type="text" placeholder="Grievance subject" required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Details</label>
            <textarea rows={4} placeholder="Describe technical or survey issue..." required style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
          </div>
          <button type="submit" style={{ backgroundColor: '#1b539c', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }}>
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};
