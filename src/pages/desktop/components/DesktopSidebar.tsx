import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Layers,
  Crosshair,
  Compass,
  Radio,
  Camera,
  Cpu,
  Database,
  Workflow,
  Box,
  Sliders,
  Sparkles,
  GitCompare,
  FileCheck2,
  AlertTriangle,
  ClipboardCheck,
  PackageCheck,
  Send,
  ScrollText,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react';

interface DesktopSidebarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  anomaliesCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  isExpandable: boolean;
  defaultExpanded?: boolean;
  items: NavItem[];
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeSection,
  onSelectSection,
  anomaliesCount
}) => {
  // Accordion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Projects: true,
    'Survey Planning': true,
    'Field Acquisition': false,
    Data: true,
    Processing: true,
    '3D Reconstruction': true,
    Verification: true
  });

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const navSections: NavSection[] = [
    {
      title: 'Projects',
      isExpandable: true,
      items: [
        { id: 'projects-assigned', label: 'Assigned', icon: <FolderKanban size={14} />, badge: '3', badgeColor: '#38bdf8' },
        { id: 'projects-active', label: 'Active Surveys', icon: <Radio size={14} />, badge: '1', badgeColor: '#22c55e' },
        { id: 'projects-completed', label: 'Completed', icon: <PackageCheck size={14} />, badge: '6' },
        { id: 'projects-returned', label: 'Returned', icon: <AlertTriangle size={14} />, badge: '0' }
      ]
    },
    {
      title: 'Survey Planning',
      isExpandable: true,
      items: [
        { id: 'planning-aoi', label: 'AOI Boundary', icon: <MapPin size={14} /> },
        { id: 'planning-gis-layers', label: 'GIS Layers', icon: <Layers size={14} /> },
        { id: 'planning-gcp', label: 'GCP & Control', icon: <Crosshair size={14} /> },
        { id: 'flight-plans', label: 'Flight Plans', icon: <Compass size={14} /> },
        { id: 'preflight-check', label: 'Pre-Flight Check', icon: <ClipboardCheck size={14} /> }
      ]
    },
    {
      title: 'Field Acquisition',
      isExpandable: true,
      items: [
        { id: 'field-acquisition', label: 'Live Drone Flight', icon: <Radio size={14} />, badge: 'LIVE', badgeColor: '#ef4444' },
        { id: 'field-drone-images', label: 'Drone Imagery', icon: <Camera size={14} /> },
        { id: 'field-lidar', label: 'LiDAR Sensor', icon: <Cpu size={14} /> },
        { id: 'field-gnss', label: 'GNSS / RTK Telemetry', icon: <Crosshair size={14} /> }
      ]
    },
    {
      title: 'Data',
      isExpandable: true,
      items: [
        { id: 'data-preparation', label: 'Data Ingestion & QC', icon: <Database size={14} /> },
        { id: 'data-gdb', label: 'Upload GDB (Vector)', icon: <FileText size={14} /> },
        { id: 'data-tpk', label: 'Upload TPK (Raster)', icon: <Layers size={14} /> },
        { id: 'data-lidar', label: 'LiDAR LAS Data', icon: <Cpu size={14} /> },
        { id: 'data-gnss', label: 'GNSS RINEX / CORS', icon: <Crosshair size={14} /> },
        { id: 'data-architecture', label: 'Building Architecture', icon: <Box size={14} /> }
      ]
    },
    {
      title: 'Processing',
      isExpandable: true,
      items: [
        { id: 'processing-photogrammetry', label: 'Photogrammetry Center', icon: <Workflow size={14} />, badge: '●', badgeColor: '#f59e0b' },
        { id: 'processing-lidar', label: 'LiDAR Classification', icon: <Cpu size={14} /> },
        { id: 'processing-fusion', label: 'Registration / Fusion', icon: <Sparkles size={14} /> },
        { id: 'processing-ori', label: 'ORI Orthomosaic', icon: <Eye size={14} /> },
        { id: 'processing-dsm-dem', label: 'DSM & DEM / DTM', icon: <Sliders size={14} /> }
      ]
    },
    {
      title: '3D Reconstruction',
      isExpandable: true,
      items: [
        { id: 'reconstruction-buildings', label: '3D Building Viewer', icon: <Box size={14} />, badge: '412', badgeColor: '#0ea5e9' },
        { id: 'reconstruction-floors', label: 'Floor Extraction', icon: <Layers size={14} /> },
        { id: 'reconstruction-units', label: 'Property / Unit Volumes', icon: <Crosshair size={14} /> }
      ]
    },
    {
      title: 'Verification',
      isExpandable: true,
      items: [
        { id: 'verification-architecture', label: 'Architecture Comparison', icon: <GitCompare size={14} /> },
        { id: 'verification-gis', label: 'GIS Layer Comparison', icon: <Layers size={14} /> },
        { id: 'verification-anomalies', label: 'Anomaly Queue', icon: <AlertTriangle size={14} />, badge: anomaliesCount > 0 ? String(anomaliesCount) : undefined, badgeColor: '#ef4444' },
        { id: 'verification-field', label: 'Field Verification Orders', icon: <FileCheck2 size={14} />, badge: '1', badgeColor: '#f59e0b' }
      ]
    }
  ];

  return (
    <div style={{
      width: '210px',
      backgroundColor: '#174880',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid #1e3a8a',
      overflowY: 'auto',
      userSelect: 'none'
    }}>
      {/* Top Fixed: Dashboard */}
      <div style={{ padding: '12px 10px 6px 10px' }}>
        <button
          onClick={() => onSelectSection('dashboard')}
          style={{
            width: '100%',
            padding: '9px 12px',
            textAlign: 'left',
            backgroundColor: activeSection === 'dashboard' ? '#06b6d4' : 'rgba(255,255,255,0.08)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: activeSection === 'dashboard' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease'
          }}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Accordion Navigation Groups */}
      <div style={{ flex: 1, padding: '4px 10px 14px 10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navSections.map((section) => {
          const isExpanded = expandedSections[section.title] ?? true;

          return (
            <div key={section.title}>
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.title)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  color: '#93c5fd',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px'
                }}
              >
                <span>{section.title}</span>
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </div>

              {/* Sub-items */}
              {isExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  {section.items.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectSection(item.id)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          textAlign: 'left',
                          backgroundColor: isActive ? '#06b6d4' : 'transparent',
                          color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                          border: 'none',
                          borderRadius: '5px',
                          fontSize: '12px',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '6px',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden' }}>
                          <span style={{ color: isActive ? '#ffffff' : '#38bdf8' }}>{item.icon}</span>
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                        </div>

                        {item.badge && (
                          <span style={{
                            backgroundColor: item.badgeColor || 'rgba(255,255,255,0.2)',
                            color: '#ffffff',
                            padding: '1px 5px',
                            borderRadius: '10px',
                            fontSize: '9.5px',
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Standalone Bottom Items */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <button
            onClick={() => onSelectSection('quality-control')}
            style={{
              width: '100%',
              padding: '8px 10px',
              textAlign: 'left',
              backgroundColor: activeSection === 'quality-control' ? '#06b6d4' : 'transparent',
              color: activeSection === 'quality-control' ? '#ffffff' : 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12.5px',
              fontWeight: activeSection === 'quality-control' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ClipboardCheck size={14} color="#4ade80" />
            <span>Quality Control</span>
          </button>

          <button
            onClick={() => onSelectSection('deliverables')}
            style={{
              width: '100%',
              padding: '8px 10px',
              textAlign: 'left',
              backgroundColor: activeSection === 'deliverables' ? '#06b6d4' : 'transparent',
              color: activeSection === 'deliverables' ? '#ffffff' : 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12.5px',
              fontWeight: activeSection === 'deliverables' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <PackageCheck size={14} color="#f59e0b" />
            <span>Deliverables</span>
          </button>

          <button
            onClick={() => onSelectSection('naksha-submission')}
            style={{
              width: '100%',
              padding: '8px 10px',
              textAlign: 'left',
              backgroundColor: activeSection === 'naksha-submission' ? '#06b6d4' : 'transparent',
              color: activeSection === 'naksha-submission' ? '#ffffff' : 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12.5px',
              fontWeight: activeSection === 'naksha-submission' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={14} color="#38bdf8" />
            <span>NAKSHA Submission</span>
          </button>

          <button
            onClick={() => onSelectSection('audit-logs')}
            style={{
              width: '100%',
              padding: '8px 10px',
              textAlign: 'left',
              backgroundColor: activeSection === 'audit-logs' ? '#06b6d4' : 'transparent',
              color: activeSection === 'audit-logs' ? '#ffffff' : 'rgba(255,255,255,0.85)',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12.5px',
              fontWeight: activeSection === 'audit-logs' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ScrollText size={14} color="#cbd5e1" />
            <span>Audit / Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
