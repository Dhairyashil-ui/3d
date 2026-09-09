import { jsPDF } from 'jspdf';
import {
  HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER,
  AVAILABLE_UNMAPPED_PLOTS
} from '../data/plotBuildingUlpinRegister';

/**
 * Generates an official, publication-quality A4 Landscape Cadastral Register PDF
 * containing:
 * - PMRDA / MoHUA Government Headers & Seals
 * - Statistical Summary of Survey Unit 01
 * - Complete Plot, Building, Height, Elevation MSL & ULPIN (Permanent & Temporary) Register
 * - Table of Plots whose mapping is yet to complete
 * - Surveyor & Town Planning Officer Endorsement Block
 */
export function createHinjawadiUlpinPdfDocument(): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 14;

  // ----------------------------------------------------
  // PAGE 1: Master Register
  // ----------------------------------------------------

  // Header Banner
  doc.setFillColor(25, 118, 210); // #1976d2 PMRDA / NAKSHA Blue
  doc.rect(margin, margin, pageWidth - margin * 2, 22, 'F');

  // Title Text inside Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('NAKSHA PORTAL • GOVERNMENT OF INDIA / PMRDA PUNE', margin + 6, margin + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(224, 242, 254);
  doc.text('National Geospatial Knowledge-based Land Survey of Urban Habitations — Survey Unit 01 Cadastral Register', margin + 6, margin + 14);
  doc.text('Datum: WGS84 UTM 43N • Vertical Datum: MSL (EGM2008) • Date: 09-Sep-2026', margin + 6, margin + 19);

  // Status Badge in Top Right
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth - margin - 52, margin + 4, 46, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('OFFICIAL DOSSIER', pageWidth - margin - 49, margin + 10);
  doc.setFontSize(7);
  doc.text('VERIFIED & CERTIFIED', pageWidth - margin - 49, margin + 15);

  // Jurisdiction & Summary Box
  let y = margin + 26;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('JURISDICTION DETAILS:', margin + 4, y + 6);
  doc.text('STATISTICAL SUMMARY:', margin + 140, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('State: Maharashtra (27)  •  District: Pune (25)  •  ULB: PMRDA Pune (270410)', margin + 4, y + 11);
  doc.text('Village: Hinjawadi (411057)  •  Survey Unit: SU-01 (348671) Rajiv Gandhi Infotech Park', margin + 4, y + 15);

  doc.text(`Total Buildings Registered: ${HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.length} structures across 6 Plots`, margin + 140, y + 11);
  const permCount = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'PERMANENT').length;
  const tempCount = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'TEMPORARY').length;
  doc.text(`Permanent ULPINs (14-Digit): ${permCount}  |  Temporary ULPINs (14-Digit): ${tempCount}  |  Pending GT Plots: ${AVAILABLE_UNMAPPED_PLOTS.length}`, margin + 140, y + 15);

  // Table Title
  y += 23;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTHORITATIVE PLOT, BUILDING, HEIGHT & ULPIN ASSIGNMENT REGISTER', margin, y);

  // Table Column Headers
  y += 4;
  const colX = [
    margin,        // Plot No (20)
    margin + 18,   // Khasra (16)
    margin + 34,   // Building ID (26)
    margin + 60,   // Building Name (65)
    margin + 125,  // Height & Flr (22)
    margin + 147,  // Elev (MSL) (20)
    margin + 167,  // Lat / Long (40)
    margin + 207,  // Assigned ULPIN (44)
    margin + 251   // Type / Status (18)
  ];

  doc.setFillColor(30, 41, 59); // Dark slate header
  doc.rect(margin, y, pageWidth - margin * 2, 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);

  doc.text('PLOT NO', colX[0] + 2, y + 5);
  doc.text('KHASRA', colX[1] + 2, y + 5);
  doc.text('BUILDING ID', colX[2] + 2, y + 5);
  doc.text('BUILDING NAME & COMPLEX', colX[3] + 2, y + 5);
  doc.text('HEIGHT (m)', colX[4] + 2, y + 5);
  doc.text('ELEV (MSL)', colX[5] + 2, y + 5);
  doc.text('LAT / LONG (°N, °E)', colX[6] + 2, y + 5);
  doc.text('ASSIGNED ULPIN ID', colX[7] + 2, y + 5);
  doc.text('ULPIN TYPE', colX[8] + 2, y + 5);

  y += 7.5;

  // Table Body Rows
  HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 7.2;

    doc.setFillColor(isEven ? 255 : 241, isEven ? 255 : 245, isEven ? 255 : 249);
    doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(2, 132, 199); // Blue for plot
    doc.text(item.plotNo, colX[0] + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(item.khasraNo, colX[1] + 2, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.buildingId, colX[2] + 2, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const shortName = item.buildingName.length > 36 ? item.buildingName.substring(0, 34) + '..' : item.buildingName;
    doc.text(shortName, colX[3] + 2, y + 4.8);

    // Height and Floors
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.heightM.toFixed(1)}m (${item.totalFloors}F)`, colX[4] + 2, y + 4.8);

    // Elevation MSL
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${item.elevationMsl.toFixed(1)}m`, colX[5] + 2, y + 4.8);

    // Lat / Long
    doc.setFont('courier', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`, colX[6] + 2, y + 4.8);

    // ULPIN ID (Permanent vs Temporary)
    doc.setFont('courier', 'bold');
    doc.setFontSize(7);
    if (item.ulpinType === 'TEMPORARY') {
      doc.setTextColor(180, 83, 9); // Amber
      doc.text(item.ulpin, colX[7] + 2, y + 4.8);

      // Pill for Temporary
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(colX[8] + 1, y + 1.2, 16, 4.8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(180, 83, 9);
      doc.text('TEMP', colX[8] + 4, y + 4.5);
    } else {
      doc.setTextColor(15, 118, 110); // Teal
      doc.text(item.ulpin, colX[7] + 2, y + 4.8);

      // Pill for Permanent
      doc.setFillColor(204, 251, 241);
      doc.roundedRect(colX[8] + 1, y + 1.2, 16, 4.8, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(15, 118, 110);
      doc.text('PERM', colX[8] + 4, y + 4.5);
    }

    y += rowHeight;
  });

  // Footer Note on Page 1
  y += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('* Note: All assigned ULPIN IDs are strictly 14 digits. Temporary ULPINs (e.g. TEMP270410XXXX) are provisional IDs assigned for multi-occupancy or in-progress demarcation.', margin, y);
  doc.text('Page 1 of 2 • Official PMRDA Geospatial Cadastral Record', pageWidth - margin - 68, y);

  // ----------------------------------------------------
  // PAGE 2: Unmapped Plots & Ground Truthing Plan
  // ----------------------------------------------------
  doc.addPage('a4', 'landscape');

  // Header Banner for Page 2
  doc.setFillColor(30, 41, 59); // Slate Dark
  doc.rect(margin, margin, pageWidth - margin * 2, 16, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('UNMAPPED PLOTS SCHEDULE & DGPS RTK GROUND TRUTHING PROGRAM', margin + 6, margin + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Survey Unit 01 (348671) — Available Plots Whose Demarcation / Mapping is Yet to Complete', margin + 6, margin + 12);

  // Table of Unmapped Plots
  y = margin + 22;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('AVAILABLE PLOTS FOR GROUND TRUTHING & HEIGHT RECORDING', margin, y);

  y += 4;
  const p2ColX = [
    margin,        // Plot No (25)
    margin + 25,   // Parcel ID (30)
    margin + 55,   // Khasra (20)
    margin + 75,   // Mapping Status (55)
    margin + 130,  // Target Lat (°N) (35)
    margin + 165,  // Target Long (°E) (35)
    margin + 200,  // Target Elev MSL (30)
    margin + 230   // Action / Field Plan (39)
  ];

  doc.setFillColor(25, 118, 210);
  doc.rect(margin, y, pageWidth - margin * 2, 7.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('PLOT NO', p2ColX[0] + 2, y + 5);
  doc.text('PARCEL ID', p2ColX[1] + 2, y + 5);
  doc.text('KHASRA NO', p2ColX[2] + 2, y + 5);
  doc.text('CURRENT MAPPING STATUS', p2ColX[3] + 2, y + 5);
  doc.text('TARGET LATITUDE (°N)', p2ColX[4] + 2, y + 5);
  doc.text('TARGET LONGITUDE (°E)', p2ColX[5] + 2, y + 5);
  doc.text('TARGET ELEVATION', p2ColX[6] + 2, y + 5);
  doc.text('FIELD ACTION REQUIRED', p2ColX[7] + 2, y + 5);

  y += 7.5;

  AVAILABLE_UNMAPPED_PLOTS.forEach((plot, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 7.2;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(2, 132, 199);
    doc.text(plot.plotNo, p2ColX[0] + 2, y + 5);

    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(plot.parcelId, p2ColX[1] + 2, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.text(plot.khasraNo, p2ColX[2] + 2, y + 5);

    // Status pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    if (plot.mappingStatus.includes('In Progress')) {
      doc.setTextColor(2, 132, 199);
    } else if (plot.mappingStatus.includes('Unmapped')) {
      doc.setTextColor(225, 29, 72);
    } else {
      doc.setTextColor(217, 119, 6);
    }
    doc.text(plot.mappingStatus, p2ColX[3] + 2, y + 5);

    // Coordinates
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(`${plot.defaultLat.toFixed(6)}°N`, p2ColX[4] + 2, y + 5);
    doc.text(`${plot.defaultLng.toFixed(6)}°E`, p2ColX[5] + 2, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${plot.defaultElevationMsl.toFixed(2)} m MSL`, p2ColX[6] + 2, y + 5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Capture DGPS RTK + Height', p2ColX[7] + 2, y + 5);

    y += rowHeight;
  });

  // Regulatory Standards & Explanation Box
  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('REGULATORY FRAMEWORK & ULPIN ASSIGNMENT PROTOCOLS (NAKSHA STANDARD 2026):', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(51, 65, 85);
  doc.text('1. DGPS RTK & Height Precision: All ground control observations must achieve RMS accuracy <= 10mm horizontally and <= 20mm vertically.', margin + 4, y + 11);
  doc.text('2. Dual Height Tagging: Both Absolute Ground Elevation (m MSL) and Structural Superstructure Height (m above ground) are mandatorily recorded.', margin + 4, y + 15);
  doc.text('3. Standard 14-Digit ULPIN & Temporary ULPIN (TEMP270410XXXX): All building ULPIN IDs strictly adhere to the 14-digit standard. Temporary ULPINs are assigned when field boundaries are contested, subdivision is underway, or high-rise vertical rights are being carved.', margin + 4, y + 19);
  doc.text('4. Conversion to Permanent ULPIN: Occurs upon joint verification by PMRDA Town Planning Officer and Surveyor signature endorsement.', margin + 4, y + 23);

  // Signatures / Attestation Block
  y += 32;
  const sigBoxWidth = 80;

  // Surveyor Signature Box
  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 10, y + 12, margin + 10 + sigBoxWidth, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Authorized Cadastral Surveyor', margin + 10, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Survey Unit 01, Hinjawadi Sub-Division, PMRDA Pune', margin + 10, y + 20);

  // Town Planning Officer Signature Box
  const rX = pageWidth - margin - 10 - sigBoxWidth;
  doc.setDrawColor(203, 213, 225);
  doc.line(rX, y + 12, rX + sigBoxWidth, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('District Town Planning & Geospatial Officer', rX, y + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('PMRDA Headquarters, Aundh, Pune - 411007', rX, y + 20);

  return doc;
}

/**
 * Triggers the direct browser file download of the Hinjawadi SU-01 PDF Dossier
 */
export function downloadHinjawadiUlpinPdf(): void {
  const doc = createHinjawadiUlpinPdfDocument();
  doc.save('Hinjawadi_SU01_Cadastral_ULPIN_Register.pdf');
}
