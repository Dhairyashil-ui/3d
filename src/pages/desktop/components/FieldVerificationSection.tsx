import React, { useState } from 'react';
import {
  FileCheck2,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { FieldVerificationWorkOrder, MOCK_FIELD_VERIFICATIONS, SurveyProject } from '../../../data/survey3dData';

interface FieldVerificationSectionProps {
  project: SurveyProject;
  onNavigateSection: (sectionId: string) => void;
}

export const FieldVerificationSection: React.FC<FieldVerificationSectionProps> = ({
  project,
  onNavigateSection
}) => {
  const [orders, setOrders] = useState<FieldVerificationWorkOrder[]>(MOCK_FIELD_VERIFICATIONS);
  const [selectedOrder, setSelectedOrder] = useState<FieldVerificationWorkOrder>(orders[0]);
  const [isIncorporated, setIsIncorporated] = useState(false);

  const handleIncorporateEvidence = () => {
    setIsIncorporated(true);
    setOrders((prev) =>
      prev.map((o) =>
        o.workOrderId === selectedOrder.workOrderId
          ? { ...o, status: 'INCORPORATED' }
          : o
      )
    );
    alert(`Ground truth evidence from Field Work Order ${selectedOrder.workOrderId} successfully incorporated into 3D building model ${selectedOrder.buildingId}! Rooftop penthouse structure confirmed.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
      {/* Cyan Header Banner */}
      <div style={{
        backgroundColor: '#06b6d4',
        backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #0284c7 100%)',
        color: '#ffffff',
        padding: '10px 18px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCheck2 size={16} />
          <span>Field Verification Work Orders & Ground-Truth Evidence Integration</span>
        </div>
        <div style={{ fontSize: '11.5px', color: '#e0f2fe' }}>
          Dual-Stage Desktop + Physical Inspection Synchronization
        </div>
      </div>

      {/* Main Split: Left Work Orders List + Right Returned Ground Evidence Dossier */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '14px' }}>
        {/* Left: Work Order List */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
              Field Verification Requests ({orders.length})
            </span>

            <button
              onClick={() => alert('New Field Verification Request created for Building BLDG-IND-003.')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} />
              <span>Create Request</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {orders.map((o) => {
              const isSel = selectedOrder.workOrderId === o.workOrderId;

              return (
                <div
                  key={o.workOrderId}
                  onClick={() => setSelectedOrder(o)}
                  style={{
                    backgroundColor: isSel ? '#eff6ff' : '#ffffff',
                    border: isSel ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '5px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f2b5c' }}>
                      {o.workOrderId}
                    </span>
                    <span style={{
                      backgroundColor: o.status === 'INCORPORATED' ? '#dcfce7' : o.status === 'SUBMITTED_BY_FIELD' ? '#fef3c7' : '#e0f2fe',
                      color: o.status === 'INCORPORATED' ? '#15803d' : o.status === 'SUBMITTED_BY_FIELD' ? '#b45309' : '#0369a1',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 700
                    }}>
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#1e293b' }}>
                    {o.buildingId} • Parcel #{o.parcelNo}
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Issue: {o.issue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Work Order Dossier & Evidence Incorporator */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f2b5c' }}>
                Field Work Order Dossier: {selectedOrder.workOrderId}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Assigned Team: <b>{selectedOrder.fieldTeam}</b>
              </div>
            </div>

            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
              ULPIN: {selectedOrder.ulpin}
            </span>
          </div>

          {/* Requested Protocol */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '10px 12px', fontSize: '11.5px' }}>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '2px' }}>Dispatched Enquiry Reason:</div>
            <div style={{ color: '#475569' }}>{selectedOrder.reason}</div>
            <div style={{ fontWeight: 700, color: '#1e293b', marginTop: '6px', marginBottom: '2px' }}>Required Evidence Mandate:</div>
            <ul style={{ margin: '0', paddingLeft: '18px', color: '#64748b' }}>
              {selectedOrder.requiredEvidence.map((ev, i) => (
                <li key={i}>{ev}</li>
              ))}
            </ul>
          </div>

          {/* Returned Evidence from Field Inspection */}
          {selectedOrder.returnedEvidence ? (
            <div style={{
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '6px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} />
                  <span>Returned Ground Evidence (Inspector: {selectedOrder.returnedEvidence.surveyorId})</span>
                </span>
                <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 600 }}>
                  {selectedOrder.returnedEvidence.timestamp}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px', color: '#14532d' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  RTK Coordinates: <b>{selectedOrder.returnedEvidence.gnssLat.toFixed(5)}°N, {selectedOrder.returnedEvidence.gnssLng.toFixed(5)}°E</b>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  Measured Height: <b>{selectedOrder.returnedEvidence.measuredHeightM}m</b>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  Photos Attached: <b>{selectedOrder.returnedEvidence.photographsCount} Geotagged</b>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '8px 10px', borderRadius: '4px', border: '1px solid #bbf7d0', fontSize: '11.5px', color: '#1e293b' }}>
                <div style={{ fontWeight: 700, color: '#166534', marginBottom: '2px' }}>Inspector Signed Field Remarks:</div>
                "{selectedOrder.returnedEvidence.surveyorRemarks}"
              </div>

              {/* Action Button to Incorporate */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  onClick={handleIncorporateEvidence}
                  disabled={isIncorporated || selectedOrder.status === 'INCORPORATED'}
                  style={{
                    backgroundColor: isIncorporated || selectedOrder.status === 'INCORPORATED' ? '#15803d' : '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: isIncorporated || selectedOrder.status === 'INCORPORATED' ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>
                    {isIncorporated || selectedOrder.status === 'INCORPORATED'
                      ? '✓ Evidence Incorporated Into Model'
                      : 'Incorporate Field Evidence Into 3D Model'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic', padding: '12px' }}>
              Awaiting submission of ground evidence by field crew.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
