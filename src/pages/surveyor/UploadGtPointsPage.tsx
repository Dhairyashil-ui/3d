import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT } from '../../data/jurisdictionData';
import { CoherentGtPoint } from '../../data/coherentPuneDataset';
import { apiClient } from '../../services/apiClient';
import {
  AVAILABLE_UNMAPPED_PLOTS,
  HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER,
  PlotBuildingUlpinRecord,
  getCompletedMappingPlots,
  markPlotMappingCompleted
} from '../../data/plotBuildingUlpinRegister';
import { downloadHinjawadiUlpinPdf } from '../../utils/generateUlpinPdf';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  X,
  CheckCircle,
  Download,
  Upload,
  Building2,
  FileText,
  Layers,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  MapPin,
  ExternalLink,
  Sparkles,
  Scissors,
  CheckCircle2
} from 'lucide-react';

interface ModalRowData {
  seqNo: number;
  plotNo: string;
  buildingId: string;
  lat: string;
  lng: string;
  heightM: string;
  elevationMsl: string;
  ulpin: string;
  ulpinType: 'PERMANENT' | 'TEMPORARY';
  mappingStatus: string;
}

export const UploadGtPointsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get('tab');
  const plotParam = searchParams.get('plot');
  const actionParam = searchParams.get('action');

  const [jurisdiction, setJurisdiction] = useState<JurisdictionSelection>({
    state: CURRENT_SURVEYOR_DEFAULT.state,
    district: CURRENT_SURVEYOR_DEFAULT.district,
    ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
    wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
    surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
    surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  });

  const [activeTab, setActiveTab] = useState<'gtPoints' | 'cadastralRegister' | 'unmappedPlots'>(
    tabParam === 'unmappedPlots' ? 'unmappedPlots' : tabParam === 'cadastralRegister' ? 'cadastralRegister' : 'gtPoints'
  );
  const [completedPlots, setCompletedPlots] = useState<string[]>(getCompletedMappingPlots());
  const [ulpinFilter, setUlpinFilter] = useState<'ALL' | 'PERMANENT' | 'TEMPORARY'>('ALL');
  const [entryType, setEntryType] = useState('Add Manually');
  const [modalOpen, setModalOpen] = useState(false);
  const [points, setPoints] = useState<CoherentGtPoint[]>([]);

  // Default initial modal rows with height, elevation, building ID, and ULPIN
  const [modalRows, setModalRows] = useState<ModalRowData[]>([
    {
      seqNo: 1,
      plotNo: 'P-14',
      buildingId: 'BLD-HINJ-001',
      lat: '18.584728',
      lng: '73.737562',
      heightM: '16.4',
      elevationMsl: '568.20',
      ulpin: '27041001002001',
      ulpinType: 'PERMANENT',
      mappingStatus: 'Mapping In Progress'
    }
  ]);

  const [successToast, setSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadPoints = async () => {
    const list = await apiClient.getGtPoints();
    // Augment any missing building / ulpin info for initial points
    const augmented = list.map((pt, idx) => {
      const reg = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.find(r => r.plotNo === pt.plotNo);
      return {
        ...pt,
        buildingId: pt.buildingId || (reg ? reg.buildingId : `BLD-HINJ-00${idx + 1}`),
        heightM: pt.heightM || (reg ? reg.heightM : 14.5),
        elevationM: pt.elevationM || (reg ? reg.elevationMsl : 568.20),
        ulpin: pt.ulpin || (reg ? reg.ulpin : `2704100100200${idx + 1}`),
        ulpinType: pt.ulpinType || (reg ? reg.ulpinType : (idx % 2 === 0 ? 'PERMANENT' : 'TEMPORARY'))
      };
    });
    setPoints(augmented);
  };

  useEffect(() => {
    loadPoints();
    setCompletedPlots(getCompletedMappingPlots());
  }, []);

  useEffect(() => {
    if (tabParam === 'unmappedPlots') {
      setActiveTab('unmappedPlots');
    }
    if (plotParam && actionParam === 'capture_gt') {
      handleOpenModalForPlot(plotParam);
    }
  }, [tabParam, plotParam, actionParam]);

  const handlePlotSelectChange = (index: number, selectedPlotNo: string) => {
    const plotData = AVAILABLE_UNMAPPED_PLOTS.find(p => p.plotNo === selectedPlotNo);
    const existing = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.find(r => r.plotNo === selectedPlotNo);

    const updated = [...modalRows];
    updated[index].plotNo = selectedPlotNo;

    if (plotData) {
      updated[index].lat = plotData.defaultLat.toFixed(6);
      updated[index].lng = plotData.defaultLng.toFixed(6);
      updated[index].elevationMsl = plotData.defaultElevationMsl.toFixed(2);
      updated[index].mappingStatus = plotData.mappingStatus;
    }

    if (existing) {
      updated[index].buildingId = existing.buildingId;
      updated[index].heightM = existing.heightM.toFixed(1);
      updated[index].ulpin = existing.ulpin;
      updated[index].ulpinType = existing.ulpinType;
    } else {
      const bldIdx = (index + 10).toString().padStart(3, '0');
      updated[index].buildingId = `BLD-HINJ-${bldIdx}`;
      updated[index].heightM = '12.0';
      updated[index].ulpin = `TEMP2704100${index + 240}`;
      updated[index].ulpinType = 'TEMPORARY';
    }

    setModalRows(updated);
  };

  const handleAddModalRow = () => {
    // Pick the next available unmapped plot
    const usedPlots = modalRows.map(r => r.plotNo);
    const nextUnmapped = AVAILABLE_UNMAPPED_PLOTS.find(p => !usedPlots.includes(p.plotNo)) || AVAILABLE_UNMAPPED_PLOTS[0];
    const existing = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.find(r => r.plotNo === nextUnmapped.plotNo);

    setModalRows([
      ...modalRows,
      {
        seqNo: modalRows.length + 1,
        plotNo: nextUnmapped.plotNo,
        buildingId: existing ? existing.buildingId : `BLD-HINJ-00${modalRows.length + 1}`,
        lat: nextUnmapped.defaultLat.toFixed(6),
        lng: nextUnmapped.defaultLng.toFixed(6),
        heightM: existing ? existing.heightM.toFixed(1) : '15.0',
        elevationMsl: nextUnmapped.defaultElevationMsl.toFixed(2),
        ulpin: existing ? existing.ulpin : `TEMP2704100${modalRows.length + 200}`,
        ulpinType: existing ? existing.ulpinType : 'TEMPORARY',
        mappingStatus: nextUnmapped.mappingStatus
      }
    ]);
  };

  const handleOpenModalForPlot = (plotNo: string) => {
    const plotData = AVAILABLE_UNMAPPED_PLOTS.find(p => p.plotNo === plotNo);
    const existing = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.find(r => r.plotNo === plotNo);

    if (plotData) {
      setModalRows([
        {
          seqNo: 1,
          plotNo: plotData.plotNo,
          buildingId: existing ? existing.buildingId : 'BLD-HINJ-001',
          lat: plotData.defaultLat.toFixed(6),
          lng: plotData.defaultLng.toFixed(6),
          heightM: existing ? existing.heightM.toFixed(1) : '14.0',
          elevationMsl: plotData.defaultElevationMsl.toFixed(2),
          ulpin: existing ? existing.ulpin : `TEMP2704100089`,
          ulpinType: existing ? existing.ulpinType : 'TEMPORARY',
          mappingStatus: plotData.mappingStatus
        }
      ]);
    }
    setModalOpen(true);
  };

  const handleRemoveModalRow = (index: number) => {
    setModalRows(modalRows.filter((_, idx) => idx !== index));
  };

  const handleModalRowChange = (index: number, field: keyof ModalRowData, value: string) => {
    const updated = [...modalRows];
    (updated[index] as any)[field] = value;
    setModalRows(updated);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const r of modalRows) {
      if (r.plotNo && r.lat && r.lng) {
        await apiClient.addGtPoint({
          plotNo: r.plotNo,
          parcelId: `PAR-${r.plotNo}`,
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lng),
          accuracyM: 0.008,
          elevationM: parseFloat(r.elevationMsl) || 568.2,
          heightM: parseFloat(r.heightM) || 15.0,
          buildingId: r.buildingId,
          ulpin: r.ulpin,
          ulpinType: r.ulpinType,
          status: 'Approved',
          observationType: 'DGPS RTK FIX',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });
        markPlotMappingCompleted(r.plotNo);
      }
    }
    setCompletedPlots(getCompletedMappingPlots());
    await loadPoints();
    setModalOpen(false);
    setToastMessage(`Ground Truth Points with Height and ULPIN IDs saved successfully for Hinjawadi SU-01!`);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  // Filtered cadastral register
  const filteredRegister = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(item => {
    if (ulpinFilter === 'ALL') return true;
    return item.ulpinType === ulpinFilter;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Upload GT Points' }]} />

      {/* Success Notification */}
      {successToast && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13.5px',
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row with PDF Download & Sample Sheet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="#1976d2" />
            Upload GT Points & Cadastral ULPIN Register
          </h2>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Target Unit: <b>{jurisdiction.surveyUnit}</b> ({jurisdiction.ulb} • {jurisdiction.wardVillage})
          </span>
        </div>

        {/* Action Buttons: PDF Export and Sample Sheet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Main PDF Dossier Download Button */}
          <button
            onClick={() => downloadHinjawadiUlpinPdf()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
              transition: 'all 0.15s ease'
            }}
            title="Generate and Download Official PDF Register Dossier"
          >
            <Download size={16} />
            <span>Download Official PDF Dossier</span>
          </button>

          {/* Direct Link to Servable PDF */}
          <a
            href="/Hinjawadi_SU01_Cadastral_ULPIN_Register.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <FileText size={15} color="#dc2626" />
            <span>Open PDF File</span>
          </a>

          <button
            onClick={() => alert('Downloading official PMRDA Hinjawadi GT Point Excel Template (.xlsx)...')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              color: '#1976d2',
              border: '1.5px solid #1976d2',
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <FileSpreadsheet size={16} />
            <span>Download Sample Sheet</span>
          </button>
        </div>
      </div>

      {/* Jurisdiction Dropdown Selector Bar */}
      <JurisdictionFilterBar
        initialValues={jurisdiction}
        onChange={(sel) => setJurisdiction(sel)}
        showButtons={false}
      />

      {/* Entry Mode & Quick Add Trigger */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '280px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Entry Mode
            </label>
            <select
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #0284c7', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff', color: '#1e293b', fontWeight: 600 }}
            >
              <option value="Add Manually">Add Manually (DGPS RTK + Height Coordinates)</option>
              <option value="Upload File">Upload File (.xlsx / .csv / .kml)</option>
            </select>
          </div>

          {entryType === 'Add Manually' ? (
            <button
              onClick={() => setModalOpen(true)}
              style={{
                backgroundColor: '#1976d2',
                color: '#ffffff',
                border: 'none',
                padding: '9px 22px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'flex-end'
              }}
            >
              <Plus size={16} />
              <span>Add DGPS GT Point & Height</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', alignSelf: 'flex-end' }}>
              <input type="file" accept=".xlsx,.csv,.kml" style={{ fontSize: '13px' }} />
              <button
                onClick={() => {
                  setToastMessage('Spreadsheet uploaded and DGPS RTK ground coordinates updated!');
                  setSuccessToast(true);
                  setTimeout(() => setSuccessToast(false), 3000);
                }}
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={16} />
                <span>Upload Sheet</span>
              </button>
            </div>
          )}
        </div>

        {/* Informative Stats Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '12px' }}>
            <span style={{ color: '#1e40af', fontWeight: 700 }}>{HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.length}</span>
            <span style={{ color: '#475569', marginLeft: '4px' }}>Buildings Assigned</span>
          </div>
          <div style={{ backgroundColor: '#ecfdf5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #a7f3d0', fontSize: '12px' }}>
            <span style={{ color: '#047857', fontWeight: 700 }}>
              {HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'PERMANENT').length}
            </span>
            <span style={{ color: '#475569', marginLeft: '4px' }}>Permanent ULPINs</span>
          </div>
          <div style={{ backgroundColor: '#fffbeb', padding: '6px 12px', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '12px' }}>
            <span style={{ color: '#b45309', fontWeight: 700 }}>
              {HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'TEMPORARY').length}
            </span>
            <span style={{ color: '#475569', marginLeft: '4px' }}>Temporary ULPINs</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #e2e8f0', paddingBottom: '0px' }}>
        <button
          onClick={() => setActiveTab('gtPoints')}
          style={{
            padding: '10px 18px',
            backgroundColor: activeTab === 'gtPoints' ? '#ffffff' : 'transparent',
            color: activeTab === 'gtPoints' ? '#1976d2' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'gtPoints' ? '3px solid #1976d2' : '3px solid transparent',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MapPin size={16} />
          <span>Registered GT Points (DGPS RTK + Height)</span>
          <span style={{ backgroundColor: activeTab === 'gtPoints' ? '#e0f2fe' : '#f1f5f9', color: activeTab === 'gtPoints' ? '#0369a1' : '#64748b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
            {points.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cadastralRegister')}
          style={{
            padding: '10px 18px',
            backgroundColor: activeTab === 'cadastralRegister' ? '#ffffff' : 'transparent',
            color: activeTab === 'cadastralRegister' ? '#1976d2' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'cadastralRegister' ? '3px solid #1976d2' : '3px solid transparent',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Building2 size={16} />
          <span>Cadastral Plot, Building & ULPIN Register</span>
          <span style={{ backgroundColor: activeTab === 'cadastralRegister' ? '#e0f2fe' : '#f1f5f9', color: activeTab === 'cadastralRegister' ? '#0369a1' : '#64748b', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
            {HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('unmappedPlots')}
          style={{
            padding: '10px 18px',
            backgroundColor: activeTab === 'unmappedPlots' ? '#ffffff' : 'transparent',
            color: activeTab === 'unmappedPlots' ? '#1976d2' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'unmappedPlots' ? '3px solid #1976d2' : '3px solid transparent',
            fontWeight: 700,
            fontSize: '13.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>Plots Available for Mapping Completion</span>
          <span style={{
            backgroundColor: AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length === 0 ? '#dcfce7' : '#fee2e2',
            color: AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length === 0 ? '#15803d' : '#991b1b',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 700
          }}>
            {AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length === 0
              ? 'All 8 Completed ✓'
              : `${AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length} Pending`}
          </span>
        </button>
      </div>

      {/* TAB 1: Registered Ground Truth Points with Height and ULPIN */}
      {activeTab === 'gtPoints' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '18px 22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1e293b' }}>
                Registered Ground Truth Points for {jurisdiction.surveyUnit.split('-')[0].trim()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Spatial Datum: WGS84 UTM Zone 43N • Vertical Datum: Mean Sea Level (MSL) • Dual Height Enabled
              </div>
            </div>
            <button
              onClick={() => downloadHinjawadiUlpinPdf()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <Download size={14} color="#dc2626" />
              <span>Export PDF Register</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#29b6f6', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Seq No</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Plot No</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Building ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Latitude (°N)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Longitude (°E)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Height / Elev (m MSL)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Accuracy (RMS)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Assigned ULPIN</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Observation Type</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.seqNo} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>{p.seqNo}</td>
                    <td style={{ padding: '12px 14px', color: '#0284c7', fontWeight: 700 }}>Plot {p.plotNo}</td>
                    <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600, fontFamily: 'monospace' }}>
                      {p.buildingId || 'BLD-HINJ-001'}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#1e293b', fontFamily: 'monospace' }}>{p.lat.toFixed(6)}</td>
                    <td style={{ padding: '12px 14px', color: '#1e293b', fontFamily: 'monospace' }}>{p.lng.toFixed(6)}</td>
                    <td style={{ padding: '12px 14px', color: '#334155', fontWeight: 600 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{(p.elevationM || 568.2).toFixed(1)} m MSL</span>
                        {p.heightM && <span style={{ fontSize: '11px', color: '#64748b' }}>H: {p.heightM.toFixed(1)}m structure</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#16a34a', fontWeight: 600 }}>±{(p.accuracyM || 0.008).toFixed(3)} m</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: p.ulpinType === 'TEMPORARY' ? '#b45309' : '#0f766e' }}>
                          {p.ulpin || '27041001002001'}
                        </span>
                        {p.ulpinType === 'TEMPORARY' ? (
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, width: 'fit-content' }}>
                            TEMP ULPIN
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '1px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700, width: 'fit-content' }}>
                            PERMANENT
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>{p.observationType || 'DGPS RTK FIX'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        backgroundColor: p.status === 'Approved' ? '#dcfce7' : '#fef9c3',
                        color: p.status === 'Approved' ? '#15803d' : '#a16207',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={async () => {
                          await apiClient.deleteGtPoint(p.seqNo);
                          await loadPoints();
                        }}
                        title="Delete GT Point"
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Official Cadastral Register of Plots, Building IDs, Heights & ULPINs */}
      {activeTab === 'cadastralRegister' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                Hinjawadi Survey Unit 01 — Plot, Building & ULPIN Assignment Register
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Listing all verified buildings, structural heights, MSL ground elevations, and assigned Permanent / Temporary ULPINs.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Filter Pills */}
              <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', fontSize: '12px', fontWeight: 600 }}>
                <button
                  onClick={() => setUlpinFilter('ALL')}
                  style={{
                    padding: '5px 12px',
                    border: 'none',
                    backgroundColor: ulpinFilter === 'ALL' ? '#1976d2' : '#ffffff',
                    color: ulpinFilter === 'ALL' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  All ({HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.length})
                </button>
                <button
                  onClick={() => setUlpinFilter('PERMANENT')}
                  style={{
                    padding: '5px 12px',
                    border: 'none',
                    backgroundColor: ulpinFilter === 'PERMANENT' ? '#0f766e' : '#ffffff',
                    color: ulpinFilter === 'PERMANENT' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Permanent ({HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'PERMANENT').length})
                </button>
                <button
                  onClick={() => setUlpinFilter('TEMPORARY')}
                  style={{
                    padding: '5px 12px',
                    border: 'none',
                    backgroundColor: ulpinFilter === 'TEMPORARY' ? '#d97706' : '#ffffff',
                    color: ulpinFilter === 'TEMPORARY' ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Temp ULPIN ({HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'TEMPORARY').length})
                </button>
              </div>

              {/* Download PDF button */}
              <button
                onClick={() => downloadHinjawadiUlpinPdf()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e293b', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Plot No</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Khasra</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Building ID</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Building Name & Usage</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Height (m)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Elev (m MSL)</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Lat / Long</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Assigned ULPIN</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>ULPIN Type</th>
                  <th style={{ padding: '10px 12px', fontWeight: 700 }}>Mapping Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegister.map((r, index) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <td style={{ padding: '10px 12px', color: '#0284c7', fontWeight: 700 }}>{r.plotNo}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{r.khasraNo}</td>
                    <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: 700, fontFamily: 'monospace' }}>
                      {r.buildingId}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.buildingName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{r.buildingCategory}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>
                      {r.heightM.toFixed(1)}m <span style={{ fontSize: '11px', color: '#64748b' }}>({r.totalFloors} Flr)</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#334155' }}>
                      {r.elevationMsl.toFixed(1)} m
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '11.5px', color: '#334155' }}>
                      {r.latitude.toFixed(5)}, {r.longitude.toFixed(5)}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: r.ulpinType === 'TEMPORARY' ? '#b45309' : '#0f766e'
                      }}>
                        {r.ulpin}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {r.ulpinType === 'TEMPORARY' ? (
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          TEMP ULPIN
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: '#ccfbf1',
                          color: '#0f766e',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          PERMANENT
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        backgroundColor: (r.mappingStatus === 'Completed' || completedPlots.includes(r.plotNo)) ? '#dcfce7' : '#f1f5f9',
                        color: (r.mappingStatus === 'Completed' || completedPlots.includes(r.plotNo)) ? '#15803d' : '#475569',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {completedPlots.includes(r.plotNo) ? 'Completed' : r.mappingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Unmapped Plots Whose Mapping Is Yet To Over */}
      {activeTab === 'unmappedPlots' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#1976d2" />
                <span>Plots Available for Mapping Completion ({AVAILABLE_UNMAPPED_PLOTS.length})</span>
                <span style={{
                  backgroundColor: AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length === 0 ? '#dcfce7' : '#fee2e2',
                  color: AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length === 0 ? '#15803d' : '#991b1b',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {AVAILABLE_UNMAPPED_PLOTS.filter(p => !completedPlots.includes(p.plotNo)).length} Pending
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                Select any pending cadastral work below to redirect directly to that surveyor tool and complete the field mapping.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => downloadHinjawadiUlpinPdf()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Download PDF Schedule</span>
              </button>
            </div>
          </div>

          {/* Grid of Plots with Real Pending Work */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {AVAILABLE_UNMAPPED_PLOTS.map((plot) => {
              const isCompleted = completedPlots.includes(plot.plotNo);
              const existingReg = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.find(r => r.plotNo === plot.plotNo);

              return (
                <div
                  key={plot.plotNo}
                  style={{
                    border: isCompleted ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '18px',
                    backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    {/* Card Header: Plot No & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: isCompleted ? '#15803d' : '#0284c7' }}>
                            Plot {plot.plotNo}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                            ({plot.parcelId})
                          </span>
                        </div>
                        <span style={{ fontSize: '11.5px', color: '#475569' }}>
                          Khasra No: <b>{plot.khasraNo}</b> • Hinjawadi SU-01
                        </span>
                      </div>

                      {isCompleted ? (
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={13} />
                          Mapping Completed
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: `${plot.badgeColor}18`,
                          color: plot.badgeColor,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {plot.mappingStatus}
                        </span>
                      )}
                    </div>

                    {/* Pending Work Description Box */}
                    <div style={{
                      backgroundColor: isCompleted ? '#ffffff' : '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: isCompleted ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                      marginBottom: '10px'
                    }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: isCompleted ? '#166534' : '#1e293b', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {isCompleted ? <Check size={14} color="#16a34a" /> : <Sparkles size={14} color={plot.badgeColor} />}
                        <span>{isCompleted ? 'Demarcation & Field Survey Verified' : plot.pendingTaskTitle}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                        {isCompleted
                          ? `Field survey completed for Plot ${plot.plotNo}. Structure height and coordinates certified.`
                          : plot.pendingTaskDescription}
                      </div>
                    </div>

                    {/* Technical Survey Details */}
                    <div style={{ fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Assigned Building:</span>
                        <b>{existingReg?.buildingId || 'BLD-HINJ-AUTO'}</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Assigned ULPIN:</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: existingReg?.ulpinType === 'TEMPORARY' ? '#b45309' : '#0f766e' }}>
                          {existingReg?.ulpin || `TEMP2704100099`}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Elevation (MSL):</span>
                        <b>{plot.defaultElevationMsl.toFixed(2)} m MSL</b>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Coordinates:</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                          {plot.defaultLat.toFixed(5)}°N, {plot.defaultLng.toFixed(5)}°E
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Redirect to Target Page to Complete Work */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {isCompleted ? (
                      <button
                        onClick={() => setActiveTab('cadastralRegister')}
                        style={{
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 14px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>View in Cadastral ULPIN Register</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (plot.pendingTaskCategory === 'DGPS_HEIGHT') {
                              handleOpenModalForPlot(plot.plotNo);
                            } else {
                              navigate(plot.targetRoute);
                            }
                          }}
                          style={{
                            backgroundColor: plot.badgeColor,
                            color: '#ffffff',
                            border: 'none',
                            padding: '9px 14px',
                            borderRadius: '6px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: `0 2px 4px ${plot.badgeColor}33`
                          }}
                        >
                          <span>{plot.actionButtonText}</span>
                        </button>

                        {plot.pendingTaskCategory !== 'DGPS_HEIGHT' && (
                          <button
                            onClick={() => handleOpenModalForPlot(plot.plotNo)}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              color: '#475569',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Plus size={13} />
                            <span>Quick DGPS RTK & Height Entry</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add DGPS RTK GT Points with Plot Selection, Height & ULPIN */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '920px',
            boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header matching user's image */}
            <div style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>
                Add DGPS RTK Ground Control Points & Height
              </span>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '2px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleModalSubmit} style={{ padding: '22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Location Strip with Add Row button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#334155'
              }}>
                <div>ULB: <b style={{ color: '#0f172a' }}>{jurisdiction.ulb}</b></div>
                <div>Village: <b style={{ color: '#0f172a' }}>{jurisdiction.wardVillage}</b></div>
                <div>Survey Unit: <b style={{ color: '#0f172a' }}>SU-01 (348671)</b></div>
                <button
                  type="button"
                  onClick={handleAddModalRow}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #1976d2',
                    color: '#1976d2',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Add Row
                </button>
              </div>

              {/* Dynamic Coordinate Entry Rows with Height & Plot Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {modalRows.map((row, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: '#f8fafc',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {/* Seq No */}
                    <div style={{ width: '60px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Seq No
                      </label>
                      <div style={{ padding: '7px 8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                        {row.seqNo}
                      </div>
                    </div>

                    {/* Plot No Dropdown of Available Plots */}
                    <div style={{ width: '160px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Select Plot No *
                      </label>
                      <select
                        value={row.plotNo}
                        onChange={(e) => handlePlotSelectChange(index, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 8px',
                          border: '1.5px solid #0284c7',
                          borderRadius: '4px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          backgroundColor: '#ffffff',
                          color: '#0369a1'
                        }}
                      >
                        {AVAILABLE_UNMAPPED_PLOTS.map((p) => (
                          <option key={p.plotNo} value={p.plotNo}>
                            {p.plotNo} ({p.mappingStatus.replace('Pending ', '').substring(0, 14)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Building ID */}
                    <div style={{ width: '120px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Building ID *
                      </label>
                      <input
                        type="text"
                        value={row.buildingId}
                        onChange={(e) => handleModalRowChange(index, 'buildingId', e.target.value)}
                        placeholder="BLD-HINJ-001"
                        required
                        style={{ width: '100%', padding: '7px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    </div>

                    {/* Latitude */}
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Latitude (°N) *
                      </label>
                      <input
                        type="text"
                        value={row.lat}
                        onChange={(e) => handleModalRowChange(index, 'lat', e.target.value)}
                        placeholder="18.584728"
                        required
                        style={{ width: '100%', padding: '7px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', fontFamily: 'monospace' }}
                      />
                    </div>

                    {/* Longitude */}
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Longitude (°E) *
                      </label>
                      <input
                        type="text"
                        value={row.lng}
                        onChange={(e) => handleModalRowChange(index, 'lng', e.target.value)}
                        placeholder="73.737562"
                        required
                        style={{ width: '100%', padding: '7px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12.5px', fontFamily: 'monospace' }}
                      />
                    </div>

                    {/* Height / Elevation MSL */}
                    <div style={{ width: '115px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Height (m MSL) *
                      </label>
                      <input
                        type="text"
                        value={row.elevationMsl}
                        onChange={(e) => handleModalRowChange(index, 'elevationMsl', e.target.value)}
                        placeholder="568.20"
                        required
                        style={{ width: '100%', padding: '7px 8px', border: '1.5px solid #16a34a', borderRadius: '4px', fontSize: '12.5px', fontWeight: 600, color: '#166534' }}
                      />
                    </div>

                    {/* Assigned ULPIN / TEMP ULPIN */}
                    <div style={{ width: '165px' }}>
                      <label style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>
                        Assigned ULPIN
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <input
                          type="text"
                          value={row.ulpin}
                          onChange={(e) => handleModalRowChange(index, 'ulpin', e.target.value)}
                          placeholder="270410..."
                          required
                          style={{
                            width: '100%',
                            padding: '5px 6px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: row.ulpinType === 'TEMPORARY' ? '#b45309' : '#0f766e'
                          }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...modalRows];
                              updated[index].ulpinType = updated[index].ulpinType === 'PERMANENT' ? 'TEMPORARY' : 'PERMANENT';
                              if (updated[index].ulpinType === 'TEMPORARY' && !updated[index].ulpin.startsWith('TEMP-')) {
                                updated[index].ulpin = `TEMP2704100${index + 101}`;
                              }
                              setModalRows(updated);
                            }}
                            style={{
                              backgroundColor: row.ulpinType === 'TEMPORARY' ? '#fef3c7' : '#ccfbf1',
                              color: row.ulpinType === 'TEMPORARY' ? '#b45309' : '#0f766e',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {row.ulpinType === 'TEMPORARY' ? 'TEMP ULPIN' : 'PERMANENT'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove row button */}
                    <div style={{ paddingTop: '16px' }}>
                      <button
                        type="button"
                        onClick={() => handleRemoveModalRow(index)}
                        disabled={modalRows.length === 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: modalRows.length === 1 ? '#cbd5e1' : '#ef4444',
                          cursor: modalRows.length === 1 ? 'not-allowed' : 'pointer',
                          padding: '6px'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Regulatory standard note */}
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={18} />
                <span>
                  <b>Cadastral Standard:</b> Plots undergoing active field mapping are automatically provisioned with a <b>Temporary ULPIN</b> (<code>TEMP270410XXXX (14 Digits)</code>). Upon approval of DGPS RTK & Height, the final 14-digit permanent ULPIN will be issued.
                </span>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 26px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)'
                  }}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    backgroundColor: '#b0bec5',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 24px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
