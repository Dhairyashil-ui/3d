import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { selectionStore, useSelectionStore } from '../../services/selectionStore';
import { CoherentParcel, CoherentBuilding, CoherentUnit } from '../../data/coherentPuneDataset';
import { BuildingSearchWidget } from '../../components/common/BuildingSearchWidget';
import { RealGisMap } from '../../components/common/RealGisMap';
import { 
  Search, 
  RotateCcw, 
  Building2, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Filter, 
  SlidersHorizontal,
  Home,
  ShieldCheck,
  ChevronRight,
  Map
} from 'lucide-react';

export const PropertySearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [selection, selectStore] = useSelectionStore();

  const [parcels, setParcels] = useState<CoherentParcel[]>([]);
  const [buildings, setBuildings] = useState<CoherentBuilding[]>([]);
  const [units, setUnits] = useState<CoherentUnit[]>([]);

  useEffect(() => {
    async function loadData() {
      const [p, b, u] = await Promise.all([
        apiClient.getParcels(),
        apiClient.getBuildings(),
        apiClient.getUnits()
      ]);
      setParcels(p);
      setBuildings(b);
      setUnits(u);
    }
    loadData();
  }, []);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchField, setSelectedSearchField] = useState('ALL');
  const [selectedULB, setSelectedULB] = useState('PMRDA Pune (270410)');
  const [selectedWard, setSelectedWard] = useState('Ward 12 - Hinjawadi Phase 1 (411057)');
  const [selectedSurveyUnit, setSelectedSurveyUnit] = useState('SU-HINJ-01 (IÂ²IT Campus)');
  const [filter3DStatus, setFilter3DStatus] = useState('ALL');
  const [filterPropertyType, setFilterPropertyType] = useState('ALL');

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSearchField('ALL');
    setFilter3DStatus('ALL');
    setFilterPropertyType('ALL');
  };

  const filteredParcels = parcels.filter(parcel => {
    const q = searchQuery.toLowerCase().trim();

    let matchesQuery = true;
    if (q) {
      if (selectedSearchField === 'ULPIN') {
        matchesQuery = parcel.ulpin.toLowerCase().includes(q);
      } else if (selectedSearchField === 'KHASRA') {
        matchesQuery = parcel.khasraNo.toLowerCase().includes(q);
      } else if (selectedSearchField === 'PARCEL_ID') {
        matchesQuery = parcel.parcelId.toLowerCase().includes(q);
      } else if (selectedSearchField === 'BUILDING_ID') {
        const hasBld = buildings.some(b => b.parcelId === parcel.parcelId && b.buildingId.toLowerCase().includes(q));
        matchesQuery = hasBld;
      } else if (selectedSearchField === 'UNIT_NO') {
        const hasUnit = units.some(u => u.parcelId === parcel.parcelId && (u.unitNumber || u.flatNumber).toLowerCase().includes(q));
        matchesQuery = hasUnit;
      } else if (selectedSearchField === 'TAX_ID') {
        const hasTax = units.some(u => u.parcelId === parcel.parcelId && u.propertyTaxId.toLowerCase().includes(q));
        matchesQuery = hasTax;
      } else {
        // Broad search: also match I2IT / International Institute / Pune
        const isI2itQuery = q.includes('i2it') || q.includes('information technology') || q.includes('pune') || q.includes('hinjawadi');
        const hasBld = buildings.some(b => 
          b.parcelId === parcel.parcelId && 
          (b.buildingId.toLowerCase().includes(q) || 
           b.buildingName.toLowerCase().includes(q) ||
           (isI2itQuery && parcel.parcelId === 'PAR-000123'))
        );
        const hasUnit = units.some(u => u.parcelId === parcel.parcelId && ((u.unitNumber || u.flatNumber).toLowerCase().includes(q) || (u.ownerName || '').toLowerCase().includes(q)));
        matchesQuery = 
          parcel.parcelId.toLowerCase().includes(q) ||
          parcel.ulpin.toLowerCase().includes(q) ||
          parcel.khasraNo.toLowerCase().includes(q) ||
          parcel.plotNo.toLowerCase().includes(q) ||
          parcel.propertyType.toLowerCase().includes(q) ||
          (isI2itQuery && parcel.parcelId === 'PAR-000123') ||
          hasBld ||
          hasUnit;
      }
    }

    const matches3D = filter3DStatus === 'ALL' || parcel.threeDStatus === filter3DStatus;
    const matchesType = filterPropertyType === 'ALL' || parcel.propertyType === filterPropertyType;

    return matchesQuery && matches3D && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'inherit', color: '#1e293b' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748b',
        backgroundColor: '#ffffff',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#1976d2', fontWeight: 600 }}>Home</span>
          <span>&gt;</span>
          <span style={{ color: '#1976d2' }}>Property Intelligence</span>
          <span>&gt;</span>
          <span style={{ color: '#1e293b', fontWeight: 600 }}>Unified Property Search</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px' }}>
          <span style={{ color: '#64748b' }}>Authoritative Anchor:</span>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: '#eff6ff',
            color: '#1976d2',
            fontWeight: 700,
            border: '1px solid #bfdbfe'
          }}>
            ULPIN (14-Digit Land Parcel)
          </span>
        </div>
      </div>

      {/* === BUILDING SEARCH + LIVE MAP PANEL === */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: '16px',
        alignItems: 'stretch',
        minHeight: '420px'
      }}>
        {/* Left: Building Search Widget */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <BuildingSearchWidget showMapHint={true} />
        </div>

        {/* Right: Live GIS Map */}
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          minHeight: '400px'
        }}>
          <RealGisMap height="100%" />
        </div>
      </div>

      {/* Main Search Filter Box */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: '#eff6ff', borderRadius: '6px' }}>
              <Search size={20} color="#1976d2" />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Unified 2D/3D Property & Parcel Search
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                Search authoritative land records, 3D volumetric buildings, floor plans, and ownership records across survey units
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} /> Reset Filters
          </button>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {/* Target Identifier Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>Search Target Field</label>
            <select
              value={selectedSearchField}
              onChange={e => setSelectedSearchField(e.target.value)}
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                backgroundColor: '#f8fafc',
                color: '#1e293b',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Fields (Universal Search)</option>
              <option value="ULPIN">ULPIN (14-Digit Parcel Anchor)</option>
              <option value="KHASRA">Khasra Number</option>
              <option value="PARCEL_ID">Parcel ID (e.g. PAR-000123)</option>
              <option value="BUILDING_ID">Building ID (e.g. BLD-000781)</option>
              <option value="UNIT_NO">Flat / Unit Number (e.g. 109)</option>
              <option value="TAX_ID">Property Tax ID</option>
            </select>
          </div>

          {/* Search Query Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
              Enter Search Query (e.g. 27250401420089, 112/3, PAR-000123, BLD-000781, 109)
            </label>
            <div style={{ position: 'relative', display: 'flex' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Type query to filter properties in real-time..."
                style={{
                  width: '100%',
                  padding: '8px 100px 8px 14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontFamily: 'monospace',
                  color: '#0f172a'
                }}
              />
              <button
                onClick={() => {}}
                style={{
                  position: 'absolute',
                  right: '4px',
                  top: '4px',
                  bottom: '4px',
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Search size={14} /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Administrative Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9',
          fontSize: '12px'
        }}>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>Urban Local Body</label>
            <select 
              value={selectedULB}
              onChange={e => setSelectedULB(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}
            >
              <option>PMRDA Pune (270410)</option>
              <option>PMC Pune (270411)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>Ward / Village</label>
            <select 
              value={selectedWard}
              onChange={e => setSelectedWard(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}
            >
              <option>Ward 12 - Hinjawadi Phase 1 (411057)</option>
              <option>Ward 14 - Rajiv Gandhi Infotech Park</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>Survey Unit</label>
            <select 
              value={selectedSurveyUnit}
              onChange={e => setSelectedSurveyUnit(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc', fontSize: '12px' }}
            >
              <option>SU-HINJ-01 (IÂ²IT Campus)</option>
              <option>SU-HINJ-02 (Blue Ridge)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>3D Spatial Status</label>
            <select 
              value={filter3DStatus}
              onChange={e => setFilter3DStatus(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#ffffff', fontSize: '12px' }}
            >
              <option value="ALL">All 3D States</option>
              <option value="Ready for Verification">Ready for Verification</option>
              <option value="Model Reconstructed">Model Reconstructed</option>
              <option value="Pending Photogrammetry">Pending Photogrammetry</option>
              <option value="Anomalies Flagged">Anomalies Flagged</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', marginBottom: '4px', fontSize: '11px', fontWeight: 600 }}>Property Category</label>
            <select 
              value={filterPropertyType}
              onChange={e => setFilterPropertyType(e.target.value)}
              style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#ffffff', fontSize: '12px' }}
            >
              <option value="ALL">All Property Types</option>
              <option value="Single/Joint Owners Individual Building">Individual Building</option>
              <option value="Multi-Ownership/Group Housing Society">Institutional / Campus</option>
              <option value="Plot">Vacant Plot</option>
              <option value="Commercial Complex">Commercial Complex</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', paddingTop: '4px', fontSize: '11px' }}>
          <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SlidersHorizontal size={13} /> Quick Filter:
          </span>
          <button
            onClick={() => setSearchQuery('International Institute of Information Technology, Pune')}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              color: '#1976d2',
              border: '1.5px solid #bfdbfe',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ðŸŽ“ IÂ²IT Pune Campus (Hero 3D Digital Twin)
          </button>
          <button
            onClick={() => setSearchQuery('PAR-000123')}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              color: '#1976d2',
              border: '1px solid #bfdbfe',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            PAR-000123 (Plot P-14)
          </button>
          <button
            onClick={() => setSearchQuery('27041001002001')}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#f5f3ff',
              color: '#7c3aed',
              border: '1px solid #ddd6fe',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            ULPIN: 27041001002001
          </button>
          <button
            onClick={() => setSearchQuery('BLD-000781')}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            BLD-000781 (Academic Complex)
          </button>
          <button
            onClick={() => setSearchQuery('302')}
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 600
            }}
          >
            Flat 302 (Unit)
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: '#64748b', padding: '0 4px' }}>
        <span>
          Found <b style={{ color: '#0f172a' }}>{filteredParcels.length}</b> property parcels matching criteria
        </span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Showing hierarchical linkages: Parcel âž” Building âž” Floor âž” Unit âž” 3D Volume
        </span>
      </div>

      {/* Results Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filteredParcels.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            padding: '40px',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '13px'
          }}>
            <Building2 size={32} color="#cbd5e1" style={{ margin: '0 auto 8px auto' }} />
            <p style={{ fontWeight: 700, color: '#334155' }}>No matching property records found</p>
            <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Try resetting search filters or using universal search mode.</p>
          </div>
        ) : (
          filteredParcels.map(item => {
            const bld = buildings.find(b => b.parcelId === item.parcelId);
            const unitsCount = units.filter(u => u.parcelId === item.parcelId).length;

            return (
              <div 
                key={item.parcelId}
                onClick={() => {
                  const firstPt = item.geometry.coordinates[0][0];
                  // Find first building on this parcel and trigger animated selection
                  const firstBld = buildings.find(b => b.parcelId === item.parcelId);
                  if (firstBld) {
                    const ring = firstBld.geometry.coordinates[0];
                    const avgLat = ring.reduce((s, pt) => s + pt[1], 0) / ring.length;
                    const avgLng = ring.reduce((s, pt) => s + pt[0], 0) / ring.length;
                    selectionStore.selectBuildingAndFly(firstBld.buildingId, item.parcelId, avgLat, avgLng, 19);
                  } else {
                    selectStore.selectParcel(item.parcelId, { lat: firstPt[1], lng: firstPt[0] });
                  }
                  navigate(`/surveyor/property-detail?parcelId=${item.parcelId}`);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Top Strip Header */}
                <div style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '12px', letterSpacing: '0.5px' }}>
                    <Building2 size={16} color="#bfdbfe" />
                    <span>PROPERTY</span>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    backgroundColor: item.ulpinStatus === 'Available' ? '#10b981' : (item.ulpinStatus === 'Pending' ? '#f59e0b' : '#ef4444'),
                    color: '#ffffff'
                  }}>
                    ULPIN: {item.ulpinStatus}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, fontSize: '12px' }}>
                  {/* Identifiers */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>ULPIN:</span>
                      <span style={{ fontWeight: 700, color: '#7c3aed' }}>{item.ulpin || 'Pending Assignment'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Khasra:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.khasraNo}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>Parcel:</span>
                      <span style={{ fontWeight: 700, color: '#1976d2' }}>{item.parcelId}</span>
                    </div>
                  </div>

                  {/* Property Type & Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Property Type:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {item.propertyType.replace('Multi-Ownership/', '').replace('Single/Joint Owners ', '')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Buildings:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {buildings.filter(b => b.parcelId === item.parcelId).length || item.buildingsCount || 1}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Floors:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {buildings.filter(b => b.parcelId === item.parcelId).reduce((acc, b) => acc + b.totalFloors, 0) || item.floorsCount || 5} Floors
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Units:</span>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {units.filter(u => u.parcelId === item.parcelId).length || item.unitsCount || 4} Flats
                      </span>
                    </div>
                  </div>

                  {/* Statuses */}
                  <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>3D Status:</span>
                      <span style={{ fontWeight: 700, color: '#4338ca', backgroundColor: '#eef2ff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #c7d2fe' }}>
                        {item.threeDStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>RoR:</span>
                      <span style={{ fontWeight: 700, color: '#047857', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                        {item.rorStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>Publication:</span>
                      <span style={{ fontWeight: 700, color: item.publicationStatus === 'Published' ? '#047857' : '#b45309', backgroundColor: item.publicationStatus === 'Published' ? '#ecfdf5' : '#fffbeb', padding: '2px 8px', borderRadius: '4px', border: item.publicationStatus === 'Published' ? '1px solid #a7f3d0' : '1px solid #fde68a' }}>
                        {item.publicationStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '10px 14px',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#1976d2',
                  fontWeight: 700
                }}>
                  <span>Open Property Detail</span>
                  <ChevronRight size={15} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

