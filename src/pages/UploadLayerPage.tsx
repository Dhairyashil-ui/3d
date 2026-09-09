import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DataTable, Column } from '../components/common/DataTable';
import { GisMap } from '../components/common/GisMap';
import { mockStore, UploadedLayer } from '../data/mockStore';
import { UploadCloud, Eye, ArrowLeft, CheckCircle2, Layers, X } from 'lucide-react';

export const UploadLayerPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'upload'>('list');
  const [layerList, setLayerList] = useState<UploadedLayer[]>(mockStore.getLayers());

  // Filter States
  const [filterUlb, setFilterUlb] = useState('Pune-270410');

  // Form States
  const [uploadUlb, setUploadUlb] = useState('Pune-270410');
  const [selectedLayerType, setSelectedLayerType] = useState<UploadedLayer['layerType']>('Cadastral');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewed, setIsPreviewed] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Map inspection state
  const [inspectLayer, setInspectLayer] = useState<UploadedLayer | null>(null);

  const handleSearch = () => {
    let filtered = mockStore.getLayers();
    if (filterUlb) {
      filtered = filtered.filter((l) => filterUlb.toLowerCase().includes(l.ulbName.toLowerCase()));
    }
    setLayerList(filtered);
  };

  const handleClear = () => {
    setFilterUlb('');
    setLayerList(mockStore.getLayers());
  };

  const handleSaveLayer = (e: React.FormEvent) => {
    e.preventDefault();
    const newL = mockStore.addLayer({
      district: 'Maharashtra',
      ulbName: uploadUlb.split('-')[0] || 'Pune',
      ulbType: 'municipality',
      layerType: selectedLayerType,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Pune DM',
      fileName: selectedFile ? selectedFile.name : `${selectedLayerType.toLowerCase()}_layer.zip`
    });

    setLayerList(mockStore.getLayers());
    setSaveSuccess(true);
    setTimeout(() => {
      setViewMode('list');
      setSaveSuccess(false);
      setSelectedFile(null);
    }, 1500);
  };

  const columns: Column<UploadedLayer>[] = [
    { header: 'S.No', accessor: 'sNo', width: '70px', align: 'center' },
    { header: 'District', accessor: 'district' },
    { header: 'ULB Name', accessor: 'ulbName' },
    { header: 'ULB Type', accessor: 'ulbType' },
    {
      header: 'Layer Type',
      accessor: (row) => (
        <span style={{
          backgroundColor:
            row.layerType === 'Cadastral' ? '#dcfce7' :
            row.layerType === 'Property Tax Point' ? '#f3e8ff' :
            row.layerType === 'Building Footprint' ? '#ffedd5' : '#e0f2fe',
          color:
            row.layerType === 'Cadastral' ? '#15803d' :
            row.layerType === 'Property Tax Point' ? '#7e22ce' :
            row.layerType === 'Building Footprint' ? '#c2410c' : '#0369a1',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600
        }}>
          {row.layerType}
        </span>
      )
    },
    { header: 'Upload Date', accessor: 'uploadedDate' },
    { header: 'Uploaded By', accessor: 'uploadedBy' },
    {
      header: 'Action',
      accessor: (row) => (
        <button
          onClick={() => setInspectLayer(row)}
          title="Inspect Layer on Real Map"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1b539c',
            borderRadius: '4px',
            padding: '5px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px'
          }}
        >
          <Eye size={14} /> View Map
        </button>
      ),
      width: '120px',
      align: 'center'
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Upload Layer' }]} />

      {/* VIEW 1: LAYER LIST (Manual Page 8 & 9) */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Upload Layer
            </h2>
            <button
              onClick={() => setViewMode('upload')}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 18px',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(27,83,156,0.2)'
              }}
            >
              <UploadCloud size={16} />
              <span>Upload Layer</span>
            </button>
          </div>

          {/* Search Filter Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              alignItems: 'flex-end'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  District
                </label>
                <input
                  type="text"
                  value="Pune"
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Urban Local Body (ULB)<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={filterUlb}
                    onChange={(e) => setFilterUlb(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 30px 8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13.5px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="">Select ULB</option>
                    <option value="Pune-270410">Pune-270410</option>
                    <option value="Berasia-250947">Berasia-250947</option>
                    <option value="Kolar-250948">Kolar-250948</option>
                  </select>
                  {filterUlb && (
                    <button
                      onClick={() => setFilterUlb('')}
                      style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSearch}
                  style={{
                    flex: 1,
                    backgroundColor: '#1b539c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
                <button
                  onClick={handleClear}
                  style={{
                    flex: 1,
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '9px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Layer Data Table */}
          <DataTable
            columns={columns}
            data={layerList}
            searchPlaceholder="Search Layers..."
          />

          {/* Layer Map Inspection Modal */}
          {inspectLayer && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.65)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '1000px',
                overflow: 'hidden',
                boxShadow: '0 20px 25px rgba(0,0,0,0.3)'
              }}>
                <div style={{
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  padding: '12px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px' }}>
                    Layer Viewer: {inspectLayer.layerType} — {inspectLayer.ulbName}
                  </h3>
                  <button
                    onClick={() => setInspectLayer(null)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <GisMap
                    height="520px"
                    showCadastral={inspectLayer.layerType === 'Cadastral'}
                    showTaxPoints={inspectLayer.layerType === 'Property Tax Point'}
                    showBuildings={inspectLayer.layerType === 'Building Footprint'}
                    title={`${inspectLayer.layerType} Map Layer • Pune`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: UPLOAD LAYER FORM & LIVE PREVIEW (Manual Page 10 & 11) */}
      {viewMode === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row with Back Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Upload Layer
            </h2>
            <button
              onClick={() => setViewMode('list')}
              style={{
                backgroundColor: '#1b539c',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} /> Back
            </button>
          </div>

          {/* Upload Form Card */}
          <form onSubmit={handleSaveLayer} style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            {saveSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#16a34a',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <CheckCircle2 size={18} />
                <span>Layer successfully validated and saved to geospatial database!</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  District
                </label>
                <input
                  type="text"
                  value="Pune"
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    color: '#64748b',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Urban Local Body (ULB)<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={uploadUlb}
                  onChange={(e) => setUploadUlb(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px'
                  }}
                >
                  <option value="Pune-270410">Pune-270410</option>
                  <option value="Berasia-250947">Berasia-250947</option>
                  <option value="Kolar-250948">Kolar-250948</option>
                </select>
              </div>

              {/* Layers* Dropdown with options from PDF Page 10 */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Layers<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={selectedLayerType}
                  onChange={(e) => setSelectedLayerType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px'
                  }}
                >
                  <option value="Cadastral">Cadastral</option>
                  <option value="Property Tax Point">Property Tax Point</option>
                  <option value="Property Tax Polygon">Property Tax Polygon</option>
                  <option value="Building Footprint">Building Footprint</option>
                  <option value="Layout Plan">Layout Plan</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Select file<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="file"
                  accept=".shp,.zip,.geojson,.gdb"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setIsPreviewed(true);
                    }
                  }}
                  style={{
                    width: '100%',
                    fontSize: '13px',
                    color: '#475569'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsPreviewed(true)}
                style={{
                  backgroundColor: '#64748b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Preview
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#1b539c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 24px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </form>

          {/* Interactive Cadastral Map View matching Screenshot Page 11 */}
          {isPreviewed && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#1b539c" />
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1b539c', margin: 0 }}>
                    Geospatial Layer Preview: {selectedLayerType} ({uploadUlb})
                  </h3>
                </div>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  ● Click on any green plot polygon to inspect cadastral parcel details
                </span>
              </div>
              <GisMap
                height="500px"
                showCadastral={selectedLayerType === 'Cadastral' || selectedLayerType === 'Layout Plan'}
                showTaxPoints={selectedLayerType === 'Property Tax Point'}
                showBuildings={selectedLayerType === 'Building Footprint'}
                showDronePath={true}
                title={`Cadastral Layer Preview (${selectedLayerType}) - Pune (UTM 44N)`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
