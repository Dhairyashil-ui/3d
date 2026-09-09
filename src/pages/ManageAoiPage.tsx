import React, { useState } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DataTable, Column } from '../components/common/DataTable';
import { GisMap } from '../components/common/GisMap';
import { mockStore, UploadedAoi } from '../data/mockStore';
import { UploadCloud, Download, Eye, ArrowLeft, CheckCircle2, Calendar, X } from 'lucide-react';

export const ManageAoiPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'upload'>('list');
  const [aoiList, setAoiList] = useState<UploadedAoi[]>(mockStore.getAOIs());

  // Filter States
  const [selectedUlb, setSelectedUlb] = useState('Pune-270410');
  const [dateRange, setDateRange] = useState('');

  // Upload Form States
  const [uploadUlb, setUploadUlb] = useState('Pune-270410');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPreviewed, setIsPreviewed] = useState(true); // Default true so map shows nicely as in manual
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Map Preview Modal State for List view
  const [activeMapAoi, setActiveMapAoi] = useState<UploadedAoi | null>(null);

  const handleSearch = () => {
    let filtered = mockStore.getAOIs();
    if (selectedUlb) {
      const code = selectedUlb.split('-')[1];
      if (code) filtered = filtered.filter(a => a.ulbCode === code);
    }
    setAoiList(filtered);
  };

  const handleClear = () => {
    setSelectedUlb('');
    setDateRange('');
    setAoiList(mockStore.getAOIs());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsPreviewed(true);
      setUploadSuccess(false);
    }
  };

  const handleSubmitAOI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUlb) return;

    const newAoi = mockStore.addAOI({
      ulbName: uploadUlb.split('-')[0] || 'Pune',
      ulbType: 'municipality',
      ulbCode: uploadUlb.split('-')[1] || '250946',
      uploadedDate: new Date().toLocaleDateString('en-US'),
      createdBy: 'Pune DM',
      fileName: selectedFile ? selectedFile.name : 'pune_aoi_utm44n.shp',
      projection: 'UTM 44N'
    });

    setAoiList(mockStore.getAOIs());
    setUploadSuccess(true);
    setTimeout(() => {
      setViewMode('list');
      setUploadSuccess(false);
      setSelectedFile(null);
    }, 1500);
  };

  const columns: Column<UploadedAoi>[] = [
    { header: 'S.No', accessor: 'sNo', width: '70px', align: 'center' },
    { header: 'ULB Name', accessor: 'ulbName' },
    { header: 'ULB Type', accessor: 'ulbType' },
    { header: 'ULB Code', accessor: 'ulbCode' },
    { header: 'Uploaded Date', accessor: 'uploadedDate' },
    { header: 'Uploaded By', accessor: 'createdBy' },
    {
      header: 'Action',
      accessor: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveMapAoi(row)}
            title="View AOI Boundary on Real Map"
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1b539c',
              borderRadius: '4px',
              padding: '5px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            <Eye size={14} /> View Map
          </button>
        </div>
      ),
      width: '120px',
      align: 'center'
    }
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Manage AOI' }]} />

      {/* VIEW 1: MANAGE AOI LIST (Matching Manual Page 6 & 7) */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Manage AOI
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
              <span>Upload AOI</span>
            </button>
          </div>

          {/* Search Filter Card (Matching Screenshot Page 6) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              alignItems: 'flex-end'
            }}>
              {/* District Field (Pre-filled / Disabled) */}
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

              {/* Urban Local Body (ULB)* Field with Clear X */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Urban Local Body (ULB)<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUlb}
                    onChange={(e) => setSelectedUlb(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 30px 8px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13.5px',
                      outline: 'none',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="">Choose ULB</option>
                    <option value="Pune-270410">Pune-270410</option>
                    <option value="Berasia-250947">Berasia-250947</option>
                    <option value="Kolar-250948">Kolar-250948</option>
                  </select>
                  {selectedUlb && (
                    <button
                      onClick={() => setSelectedUlb('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Date Range Picker */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Enter a date range
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="MM/DD/YYYY - MM/DD/YYYY"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              {/* Action Buttons */}
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

          {/* AOI Data Table */}
          <DataTable
            columns={columns}
            data={aoiList}
            searchPlaceholder="Search AOIs..."
          />

          {/* Quick Map Preview Modal */}
          {activeMapAoi && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
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
                maxWidth: '960px',
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
                    AOI Boundary View: {activeMapAoi.ulbName} ({activeMapAoi.ulbCode})
                  </h3>
                  <button
                    onClick={() => setActiveMapAoi(null)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div style={{ padding: '16px' }}>
                  <GisMap
                    height="480px"
                    showAoi={true}
                    showCadastral={true}
                    title={`AOI Satellite View - ${activeMapAoi.ulbName}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 4.1 UPLOAD AOI (Matching Manual Page 7 & 8) */}
      {viewMode === 'upload' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Row with Back Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
              Upload AOI
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

          {/* Upload AOI Form Card */}
          <form onSubmit={handleSubmitAOI} style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            {uploadSuccess && (
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
                <span>AOI shapefile uploaded and validated successfully under UTM 44N projection!</span>
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              {/* District (Disabled) */}
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

              {/* Urban Local Body (ULB)* */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Urban Local Body (ULB)<span style={{ color: '#dc2626' }}>*</span>
                </label>
                <select
                  value={uploadUlb}
                  onChange={(e) => setUploadUlb(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                >
                  <option value="Pune-270410">Pune-270410</option>
                  <option value="Berasia-250947">Berasia-250947</option>
                  <option value="Kolar-250948">Kolar-250948</option>
                </select>
              </div>

              {/* Select file* & Download sample link */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Select file<span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <a
                    href="/assets/pune_sample_shapefile_utm44n.zip"
                    download="pune_sample_shapefile_utm44n.zip"
                    style={{
                      fontSize: '12px',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    <Download size={13} /> Download sample
                  </a>
                </div>
                <input
                  type="file"
                  accept=".shp,.zip,.geojson,.kml"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    fontSize: '13px',
                    color: '#475569'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#d97706', marginTop: '6px', fontWeight: 500 }}>
                  Selected Shapefile should be in 'UTM 44N' Projection
                </div>
              </div>
            </div>

            {/* Preview and Submit Buttons */}
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
                Save AOI
              </button>
            </div>
          </form>

          {/* Interactive Satellite GIS Map (As shown in screenshot Page 8) */}
          {isPreviewed && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1b539c', margin: 0 }}>
                  AOI Spatial Preview: {uploadUlb} (UTM 44N Projection)
                </h3>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                  ✓ Geometry Verified • Bounding Box: [23.195, 77.355] to [23.292, 77.490]
                </span>
              </div>
              <GisMap
                height="500px"
                showAoi={true}
                showCadastral={true}
                title={`Live AOI Satellite Preview - ${uploadUlb}`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
