import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { RealGisMap } from '../../components/common/RealGisMap';
import { JurisdictionFilterBar, JurisdictionSelection } from '../../components/common/JurisdictionFilterBar';
import { CURRENT_SURVEYOR_DEFAULT } from '../../data/jurisdictionData';
import { apiClient } from '../../services/apiClient';
import { useSelectionStore } from '../../services/selectionStore';
import { CoherentParcel } from '../../data/coherentPuneDataset';
import { markPlotMappingCompleted } from '../../data/plotBuildingUlpinRegister';
import {
  Scissors,
  Split,
  PenTool,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  ArrowLeft,
  Check
} from 'lucide-react';

export const MergeSplitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetPlotParam = searchParams.get('plot');
  const targetParcelParam = searchParams.get('parcelId');
  const targetActionParam = searchParams.get('action');

  const [selection, selectStore] = useSelectionStore();
  const [activeTool, setActiveTool] = useState<'split' | 'merge' | 'draw'>(
    targetActionParam === 'merge' ? 'merge' : 'split'
  );
  const [selectedParcel, setSelectedParcel] = useState<CoherentParcel | null>(null);
  const [secondParcelForMerge, setSecondParcelForMerge] = useState<CoherentParcel | null>(null);
  const [cuttingLine, setCuttingLine] = useState<[number, number][] | null>(null);
  const [drawnVertices, setDrawnVertices] = useState<[number, number][]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [taskCompletedPlot, setTaskCompletedPlot] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Jurisdiction selection state
  const [jurisdiction, setJurisdiction] = useState<JurisdictionSelection>({
    state: CURRENT_SURVEYOR_DEFAULT.state,
    district: CURRENT_SURVEYOR_DEFAULT.district,
    ulb: CURRENT_SURVEYOR_DEFAULT.ulb,
    wardVillage: CURRENT_SURVEYOR_DEFAULT.wardVillage,
    surveyUnit: CURRENT_SURVEYOR_DEFAULT.surveyUnit,
    surveyUnitCode: CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  });

  // Split dialog state matching Image 2
  const [splitPlotNumberA, setSplitPlotNumberA] = useState('14/1');
  const [splitPlotNumberB, setSplitPlotNumberB] = useState('14/2');

  // Load selected parcel initially
  useEffect(() => {
    async function initParcel() {
      const all = await apiClient.getParcels();
      if (all.length > 0) {
        let p: CoherentParcel | undefined;
        if (targetParcelParam) {
          p = all.find(item => item.parcelId === targetParcelParam);
        } else if (targetPlotParam) {
          p = all.find(item => item.plotNo === targetPlotParam || item.plotNo.includes(targetPlotParam));
        }
        if (!p) {
          p = all.find(item => item.parcelId === selection.selectedParcelId) || all[0];
        }

        setSelectedParcel(p);
        selectStore.selectParcel(p.parcelId);
        const plotBase = p.plotNo.replace(/[^0-9]/g, '') || '14';
        setSplitPlotNumberA(`${plotBase}/1`);
        setSplitPlotNumberB(`${plotBase}/2`);

        if (targetPlotParam) {
          setFeedback({
            type: 'success',
            message: `🎯 Loaded pending work for Plot ${p.plotNo} (${p.parcelId}) in Hinjawadi SU-01. Proceed to split/merge to complete mapping.`
          });
        }
      }
    }
    initParcel();
  }, [selection.selectedParcelId, targetPlotParam, targetParcelParam]);

  const handleParcelSelect = (parcel: CoherentParcel) => {
    if (activeTool === 'merge' && selectedParcel && parcel.parcelId !== selectedParcel.parcelId) {
      setSecondParcelForMerge(parcel);
      setFeedback({
        type: 'success',
        message: `Selected second parcel: ${parcel.parcelId} (Plot ${parcel.plotNo}). Ready to merge.`
      });
    } else {
      setSelectedParcel(parcel);
      setSecondParcelForMerge(null);
      setCuttingLine(null);
      const plotBase = parcel.plotNo.replace(/[^0-9]/g, '') || '16';
      setSplitPlotNumberA(`${plotBase}/1`);
      setSplitPlotNumberB(`${plotBase}/2`);
    }
  };

  const handleSplitLine = (line: [number, number][]) => {
    setCuttingLine(line);
    setFeedback({
      type: 'success',
      message: `Cutting line set from [${line[0][1].toFixed(5)}, ${line[0][0].toFixed(5)}] to [${line[1][1].toFixed(5)}, ${line[1][0].toFixed(5)}]. Ready to split.`
    });
  };

  // Generate automated perpendicular bisector split line for the selected parcel
  const handleAutoGenerateBisector = () => {
    if (!selectedParcel) return;
    const ring = selectedParcel.geometry.coordinates[0];
    const lats = ring.map(p => p[1]);
    const lngs = ring.map(p => p[0]);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const midLng = (minLng + maxLng) / 2;

    const line: [number, number][] = [
      [midLng, minLat - 0.0001],
      [midLng, maxLat + 0.0001]
    ];
    setCuttingLine(line);
    setFeedback({
      type: 'success',
      message: `Automated bisector cutting line generated through parcel centroid.`
    });
  };

  // Real Split Execution matching Image 2 "Submit"
  const handleExecuteSplit = async () => {
    if (!selectedParcel) {
      setFeedback({ type: 'error', message: 'Please click and select a cadastral parcel to split.' });
      return;
    }

    let line = cuttingLine;
    if (!line || line.length < 2) {
      // Auto generate bisector if not drawn manually
      const ring = selectedParcel.geometry.coordinates[0];
      const lats = ring.map(p => p[1]);
      const lngs = ring.map(p => p[0]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const midLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
      line = [
        [midLng, minLat - 0.0001],
        [midLng, maxLat + 0.0001]
      ];
    }

    setIsProcessing(true);
    try {
      const res = await apiClient.splitParcel(selectedParcel.parcelId, line);
      if (res.success && res.newParcels) {
        setFeedback({
          type: 'success',
          message: `Parcel ${selectedParcel.parcelId} successfully divided into Plot ${splitPlotNumberA} (${res.newParcels[0].areaSqm.toFixed(1)}m²) and Plot ${splitPlotNumberB} (${res.newParcels[1].areaSqm.toFixed(1)}m²)! Cadastre updated.`
        });
        const completedPlot = targetPlotParam || selectedParcel.plotNo;
        markPlotMappingCompleted(completedPlot);
        setTaskCompletedPlot(completedPlot);
        setCuttingLine(null);
        setSelectedParcel(res.newParcels[0]);
        selectStore.selectParcel(res.newParcels[0].parcelId);
        setMapKey(prev => prev + 1);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to split parcel.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error executing split.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Real Merge Execution
  const handleExecuteMerge = async () => {
    if (!selectedParcel || !secondParcelForMerge) {
      setFeedback({ type: 'error', message: 'Please select two parcels to merge.' });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await apiClient.mergeParcels(selectedParcel.parcelId, secondParcelForMerge.parcelId);
      if (res.success && res.mergedParcel) {
        setFeedback({
          type: 'success',
          message: `Parcels ${selectedParcel.parcelId} and ${secondParcelForMerge.parcelId} merged into ${res.mergedParcel.parcelId} (Area: ${res.mergedParcel.areaSqm}m²)!`
        });
        const completedPlot = targetPlotParam || selectedParcel.plotNo;
        markPlotMappingCompleted(completedPlot);
        setTaskCompletedPlot(completedPlot);
        setSelectedParcel(res.mergedParcel);
        selectStore.selectParcel(res.mergedParcel.parcelId);
        setSecondParcelForMerge(null);
        setMapKey(prev => prev + 1);
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to merge parcels.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error executing merge.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', link: '/surveyor/home' }, { label: 'Merge & Split' }]} />

      {/* Jurisdiction Selector Bar */}
      <JurisdictionFilterBar
        initialValues={jurisdiction}
        onChange={(sel) => setJurisdiction(sel)}
        showButtons={false}
      />

      {/* Task Completed Celebration Banner */}
      {taskCompletedPlot && (
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #10b981',
          color: '#065f46',
          padding: '12px 18px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={22} color="#059669" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                🎉 Cadastral Mapping Completed for Plot {taskCompletedPlot}!
              </div>
              <div style={{ fontSize: '12px', color: '#047857' }}>
                Subdivision / Demarcation saved to PMRDA Hinjawadi SU-01 register. Status updated to <b>Completed</b>.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/surveyor/upload-gt-points?tab=unmappedPlots')}
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            <span>Return to Mapping Completion Register</span>
            <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

      {/* Real-time Feedback Toast / Alert */}
      {feedback && !taskCompletedPlot && (
        <div style={{
          backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${feedback.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
          color: feedback.type === 'success' ? '#065f46' : '#991b1b',
          padding: '10px 16px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Map Container matching Image 2 */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        height: 'calc(100vh - 230px)',
        minHeight: '660px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
      }}>
        {/* Real Interactive 2D GIS Map with Thin Cadastral Lines & 317 Real Hinjawadi Buildings */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <RealGisMap
            key={mapKey}
            height="100%"
            onParcelSelect={handleParcelSelect}
            enableSplitMode={activeTool === 'split'}
            onSplitLineComplete={handleSplitLine}
            splitCuttingLine={cuttingLine || undefined}
          />
        </div>

        {/* Floating Tool Switcher on Left Side matching Official NAKSHA */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '14px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #cbd5e1',
          zIndex: 25
        }}>
          <button
            onClick={() => setActiveTool('split')}
            title="Split Plot Operation"
            style={{
              padding: '10px 12px',
              background: activeTool === 'split' ? '#eff6ff' : '#ffffff',
              border: 'none',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              color: activeTool === 'split' ? '#1976d2' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Scissors size={18} />
          </button>

          <button
            onClick={() => setActiveTool('merge')}
            title="Merge Two Plots"
            style={{
              padding: '10px 12px',
              background: activeTool === 'merge' ? '#eff6ff' : '#ffffff',
              border: 'none',
              borderBottom: '1px solid #e2e8f0',
              cursor: 'pointer',
              color: activeTool === 'merge' ? '#1976d2' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Split size={18} />
          </button>

          <button
            onClick={handleAutoGenerateBisector}
            title="Generate Automated Perpendicular Bisector"
            style={{
              padding: '10px 12px',
              background: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sparkles size={18} />
          </button>
        </div>

        {/* Mode Prompt Pill matching Image 2 */}
        <div style={{
          position: 'absolute',
          top: '58px',
          left: '70px',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          color: '#ffffff',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '11.5px',
          fontWeight: 600,
          zIndex: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {activeTool === 'split' && (
            <>
              <Scissors size={13} color="#f87171" />
              <span>Selected: <b>{selectedParcel?.parcelId || 'PAR-000123'}</b> (Plot {selectedParcel?.plotNo || 'P-14'}) • Click 2 points or use Auto-Bisector</span>
            </>
          )}
          {activeTool === 'merge' && (
            <>
              <Split size={13} color="#38bdf8" />
              <span>Select Parcel A, then click Parcel B, then click Execute Merge</span>
            </>
          )}
        </div>

        {/* FLOATING SPLIT DIALOG MATCHING IMAGE 2 EXACTLY */}
        {activeTool === 'split' && (
          <div style={{
            position: 'absolute',
            top: '55px',
            right: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '10px',
            padding: '14px 18px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            border: '1px solid #cbd5e1',
            zIndex: 30,
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backdropFilter: 'blur(6px)'
          }}>
            {/* Plot Number 1 Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={splitPlotNumberA}
                onChange={(e) => setSplitPlotNumberA(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={splitPlotNumberA}>Plot Number: {splitPlotNumberA}</option>
                <option value="14/1">Plot Number: 14/1</option>
                <option value="16/1">Plot Number: 16/1</option>
                <option value="21/1">Plot Number: 21/1</option>
              </select>
              <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Plot Number 2 Dropdown */}
            <div style={{ position: 'relative' }}>
              <select
                value={splitPlotNumberB}
                onChange={(e) => setSplitPlotNumberB(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 12px',
                  borderRadius: '6px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={splitPlotNumberB}>Plot Number: {splitPlotNumberB}</option>
                <option value="14/2">Plot Number: 14/2</option>
                <option value="16/2">Plot Number: 16/2</option>
                <option value="21/2">Plot Number: 21/2</option>
              </select>
              <ChevronDown size={15} color="#64748b" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>

            {/* Action Buttons matching Image 2 ("Submit" and "Split Further") */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleExecuteSplit}
                disabled={isProcessing}
                style={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(25, 118, 210, 0.35)',
                  transition: 'background 0.15s ease'
                }}
              >
                {isProcessing ? 'Splitting...' : 'Submit'}
              </button>

              <button
                type="button"
                onClick={handleAutoGenerateBisector}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(139, 92, 246, 0.35)',
                  transition: 'background 0.15s ease'
                }}
              >
                Split Further
              </button>
            </div>

            {/* Split Info Footer */}
            <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <Info size={13} color="#3b82f6" />
              <span>Target: {selectedParcel?.areaSqm.toFixed(1) || '38450.0'} m² in Hinjawadi SU-01</span>
            </div>
          </div>
        )}

        {/* FLOATING MERGE DIALOG */}
        {activeTool === 'merge' && (
          <div style={{
            position: 'absolute',
            top: '55px',
            right: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '10px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            border: '1px solid #cbd5e1',
            zIndex: 30,
            width: '290px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            backdropFilter: 'blur(6px)'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a' }}>
              Merge Cadastral Parcels
            </div>
            <div style={{ fontSize: '12px', color: '#334155' }}>
              Primary: <b>{selectedParcel?.parcelId || 'None'}</b> (Plot {selectedParcel?.plotNo || '-'})
            </div>
            <div style={{ fontSize: '12px', color: '#1565c0' }}>
              Secondary: <b>{secondParcelForMerge ? `${secondParcelForMerge.parcelId} (Plot ${secondParcelForMerge.plotNo})` : 'Click second plot on map...'}</b>
            </div>

            <button
              type="button"
              onClick={handleExecuteMerge}
              disabled={isProcessing || !secondParcelForMerge}
              style={{
                backgroundColor: secondParcelForMerge ? '#1976d2' : '#cbd5e1',
                color: '#ffffff',
                border: 'none',
                padding: '9px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: secondParcelForMerge ? 'pointer' : 'not-allowed',
                boxShadow: secondParcelForMerge ? '0 2px 6px rgba(25, 118, 210, 0.35)' : 'none',
                marginTop: '4px'
              }}
            >
              {isProcessing ? 'Merging...' : 'Execute Merge'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
