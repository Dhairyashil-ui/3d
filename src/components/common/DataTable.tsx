import React, { useState } from 'react';
import { Search, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  showExport?: boolean;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
  pageSizeDefault?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  showExport = true,
  onExportPdf,
  onExportExcel,
  pageSizeDefault = 10
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  // Filter data across all string/number fields
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      val !== null &&
      val !== undefined &&
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Default export CSV if no handler provided
  const handleDefaultExcel = () => {
    if (onExportExcel) {
      onExportExcel();
      return;
    }
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((row) =>
      columns.map((c) => {
        const val = typeof c.accessor === 'function' ? '' : row[c.accessor as string] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `naksha_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDefaultPdf = () => {
    if (onExportPdf) {
      onExportPdf();
      return;
    }
    window.print();
  };

  return (
    <div className="naksha-data-table-wrapper" style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      {/* Top Filter & Export Bar */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f1f5f9',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Field */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        </div>

        {/* Export Data Icons (PDF, Excel) */}
        {showExport && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Export:</span>
            {/* PDF Icon */}
            <button
              onClick={handleDefaultPdf}
              title="Export as PDF"
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <FileText size={15} />
              <span>PDF</span>
            </button>
            {/* Excel Icon */}
            <button
              onClick={handleDefaultExcel}
              title="Export as Excel"
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#16a34a',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <Download size={15} />
              <span>Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1b539c', color: '#ffffff' }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    fontWeight: 600,
                    width: col.width,
                    textAlign: col.align || 'left',
                    whiteSpace: 'nowrap',
                    borderRight: idx < columns.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No record found!
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  style={{
                    backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc')}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        padding: '9px 14px',
                        color: '#334155',
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle'
                      }}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor as string] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div style={{
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid #f1f5f9',
        fontSize: '12.5px',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} entries</span>
          <span>•</span>
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: '2px 6px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{ padding: '0 6px', fontWeight: 600, color: '#1e293b' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
