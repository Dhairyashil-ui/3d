// NAKSHA V2.0 â€” Building Search Widget
// Accepts ULPIN + Building ID â†’ flies map to building â†’ animated red polygon selection
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Building2, X, CheckCircle2, AlertCircle, Loader2, Layers, Navigation } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { selectionStore } from '../../services/selectionStore';
import { CoherentBuilding, CoherentParcel } from '../../data/coherentPuneDataset';

interface BuildingSearchWidgetProps {
  /** Optional callback when a building is found and selected */
  onBuildingFound?: (building: CoherentBuilding, parcel: CoherentParcel | null) => void;
  /** Whether to show the map preview panel */
  showMapHint?: boolean;
}

type SearchStatus = 'idle' | 'searching' | 'found' | 'not_found';

export const BuildingSearchWidget: React.FC<BuildingSearchWidgetProps> = ({
  onBuildingFound,
  showMapHint = true
}) => {
  const [ulpinInput, setUlpinInput] = useState('');
  const [buildingIdInput, setBuildingIdInput] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [foundBuilding, setFoundBuilding] = useState<CoherentBuilding | null>(null);
  const [foundParcel, setFoundParcel] = useState<CoherentParcel | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quick-fill examples
  const QUICK_FILLS = [
    { label: 'IÂ²IT Main Block', ulpin: '27041001002001', bldId: 'BLD-000781' },
    { label: 'Tower A (Res)', ulpin: '27041001002002', bldId: 'BLD-000782' },
    { label: 'Tower B (Res)', ulpin: '27041001002003', bldId: 'BLD-000783' },
  ];

  const handleSearch = async () => {
    const ulpin = ulpinInput.trim();
    const bldId = buildingIdInput.trim();

    if (!ulpin && !bldId) {
      setErrorMsg('Please enter at least a ULPIN or Building ID.');
      setStatus('not_found');
      return;
    }

    setStatus('searching');
    setFoundBuilding(null);
    setFoundParcel(null);
    setErrorMsg('');

    // Small artificial delay for UX polish
    await new Promise(r => setTimeout(r, 600));

    try {
      const [buildings, parcels] = await Promise.all([
        apiClient.getBuildings(),
        apiClient.getParcels()
      ]);

      let matched: CoherentBuilding | undefined;

      if (bldId) {
        matched = buildings.find(b => b.buildingId.toLowerCase() === bldId.toLowerCase());
      }

      if (!matched && ulpin) {
        // Try matching by parcel ulpin â†’ find building in that parcel
        const parcel = parcels.find(p => p.ulpin === ulpin);
        if (parcel) {
          matched = buildings.find(b => b.parcelId === parcel.parcelId);
        }
        // Also try direct ulpin field on building
        if (!matched) {
          matched = buildings.find(b => (b as any).ulpin === ulpin);
        }
      }

      if (!matched) {
        setStatus('not_found');
        setErrorMsg(`No building found for ${bldId ? `Building ID "${bldId}"` : ''} ${ulpin ? `ULPIN "${ulpin}"` : ''}.`);
        return;
      }

      const parcel = parcels.find(p => p.parcelId === matched!.parcelId) || null;

      setFoundBuilding(matched);
      setFoundParcel(parcel);
      setStatus('found');

      // Compute centroid from building polygon
      const ring = matched.geometry.coordinates[0];
      const avgLat = ring.reduce((s, pt) => s + pt[1], 0) / ring.length;
      const avgLng = ring.reduce((s, pt) => s + pt[0], 0) / ring.length;

      // Trigger map fly + animated selection
      selectionStore.selectBuildingAndFly(
        matched.buildingId,
        matched.parcelId,
        avgLat,
        avgLng,
        19
      );

      if (onBuildingFound) onBuildingFound(matched, parcel);
    } catch (err) {
      setStatus('not_found');
      setErrorMsg('Search failed. Please try again.');
    }
  };

  const handleClear = () => {
    setUlpinInput('');
    setBuildingIdInput('');
    setStatus('idle');
    setFoundBuilding(null);
    setFoundParcel(null);
    setErrorMsg('');
    selectionStore.clearAnimatedBuilding();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const borderColor = status === 'found' ? '#10b981' : status === 'not_found' ? '#ef4444' : '#cbd5e1';

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: `1.5px solid ${borderColor}`,
      boxShadow: status === 'found'
        ? '0 0 0 3px rgba(16, 185, 129, 0.12), 0 4px 16px rgba(0,0,0,0.08)'
        : '0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      fontFamily: 'inherit'
    }}>
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(e => !e)}
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1976d2 100%)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Navigation size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', letterSpacing: '0.3px' }}>
              Building Search & Map Selection
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '1px' }}>
              Enter ULPIN or Building ID â†’ map flies & animates selection
            </div>
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          â–²
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '18px' }}>
          {/* Quick Fill Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, alignSelf: 'center' }}>Quick fill:</span>
            {QUICK_FILLS.map(qf => (
              <button
                key={qf.bldId}
                onClick={() => { setUlpinInput(qf.ulpin); setBuildingIdInput(qf.bldId); setStatus('idle'); setErrorMsg(''); }}
                style={{
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: '#eff6ff',
                  color: '#1976d2',
                  border: '1.5px solid #bfdbfe',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              >
                ðŸ¢ {qf.label}
              </button>
            ))}
          </div>

          {/* Input Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            {/* ULPIN Input */}
            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: '#334155', marginBottom: '5px', letterSpacing: '0.4px'
              }}>
                ULPIN <span style={{ color: '#94a3b8', fontWeight: 400 }}>(14-digit land parcel ID)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} color="#94a3b8" style={{
                  position: 'absolute', left: '10px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  value={ulpinInput}
                  onChange={e => { setUlpinInput(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 27041001002001"
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '9px 10px 9px 30px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#0f172a',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#1976d2')}
                  onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                />
                {ulpinInput && (
                  <button
                    onClick={() => setUlpinInput('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                  ><X size={13} /></button>
                )}
              </div>
            </div>

            {/* Building ID Input */}
            <div>
              <label style={{
                display: 'block', fontSize: '11px', fontWeight: 700,
                color: '#334155', marginBottom: '5px', letterSpacing: '0.4px'
              }}>
                Building ID <span style={{ color: '#94a3b8', fontWeight: 400 }}>(e.g. BLD-000781)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={14} color="#94a3b8" style={{
                  position: 'absolute', left: '10px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none'
                }} />
                <input
                  type="text"
                  value={buildingIdInput}
                  onChange={e => { setBuildingIdInput(e.target.value); setStatus('idle'); setErrorMsg(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. BLD-000781"
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '9px 10px 9px 30px',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#0f172a',
                    backgroundColor: '#f8fafc',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s'
                  }}
                  onFocus={e => (e.target.style.borderColor = '#1976d2')}
                  onBlur={e => (e.target.style.borderColor = '#cbd5e1')}
                />
                {buildingIdInput && (
                  <button
                    onClick={() => setBuildingIdInput('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#94a3b8' }}
                  ><X size={13} /></button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleSearch}
              disabled={status === 'searching'}
              style={{
                flex: 1,
                padding: '10px 20px',
                background: status === 'searching'
                  ? '#94a3b8'
                  : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: status === 'searching' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: status === 'searching' ? 'none' : '0 2px 8px rgba(25,118,210,0.35)',
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px'
              }}
            >
              {status === 'searching' ? (
                <>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  Searching & Flying to Location...
                </>
              ) : (
                <>
                  <Search size={15} />
                  Search & Select on Map
                </>
              )}
            </button>

            {(ulpinInput || buildingIdInput || status !== 'idle') && (
              <button
                onClick={handleClear}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                <X size={13} /> Clear
              </button>
            )}
          </div>

          {/* Status Feedback */}
          {status === 'not_found' && errorMsg && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '12px', color: '#dc2626', fontWeight: 600
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {errorMsg}
            </div>
          )}

          {/* Found Building Card */}
          {status === 'found' && foundBuilding && (
            <div style={{
              marginTop: '14px',
              padding: '14px',
              backgroundColor: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '10px',
              animation: 'slideDown 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#15803d' }}>
                  Building Found â€” Map is animating selection
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>BUILDING ID</div>
                  <div style={{ color: '#1e293b', fontWeight: 700, fontFamily: 'monospace' }}>{foundBuilding.buildingId}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>PARCEL ID</div>
                  <div style={{ color: '#1976d2', fontWeight: 700, fontFamily: 'monospace' }}>{foundBuilding.parcelId}</div>
                </div>
                {foundParcel && (
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>ULPIN</div>
                    <div style={{ color: '#7c3aed', fontWeight: 700, fontFamily: 'monospace' }}>{foundParcel.ulpin}</div>
                  </div>
                )}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>FLOORS / HEIGHT</div>
                  <div style={{ color: '#1e293b', fontWeight: 700 }}>{foundBuilding.totalFloors}F / {foundBuilding.approxHeightM}m</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '6px', padding: '8px 12px', border: '1px solid #bbf7d0', gridColumn: 'span 2' }}>
                  <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, marginBottom: '2px' }}>BUILDING NAME</div>
                  <div style={{ color: '#1e293b', fontWeight: 700 }}>{foundBuilding.buildingName}</div>
                </div>
              </div>

              {showMapHint && (
                <div style={{
                  marginTop: '10px', padding: '8px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px dashed #ef4444',
                  borderRadius: '6px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '11px', color: '#b91c1c', fontWeight: 600
                }}>
                  <Layers size={13} style={{ flexShrink: 0 }} />
                  Red polygon is being traced around the building footprint on the map below
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

