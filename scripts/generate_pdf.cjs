const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const AVAILABLE_UNMAPPED_PLOTS = [
  { plotNo: 'P-14', parcelId: 'PAR-000123', khasraNo: '112/3', defaultLat: 18.584728, defaultLng: 73.737562, defaultElevationMsl: 568.20, mappingStatus: 'Mapping In Progress' },
  { plotNo: 'P-15', parcelId: 'PAR-000124', khasraNo: '114/1', defaultLat: 18.585180, defaultLng: 73.738430, defaultElevationMsl: 569.00, mappingStatus: 'Pending GT Survey' },
  { plotNo: 'P-16', parcelId: 'PAR-000125', khasraNo: '115/2', defaultLat: 18.585954, defaultLng: 73.738229, defaultElevationMsl: 569.40, mappingStatus: 'Pending GT Survey' },
  { plotNo: 'Plot-21', parcelId: 'PAR-PUNE-011', khasraNo: '121/2', defaultLat: 18.584089, defaultLng: 73.737943, defaultElevationMsl: 568.20, mappingStatus: 'Unmapped - DGPS Required' },
  { plotNo: 'Plot-28', parcelId: 'PAR-PUNE-018', khasraNo: '128/4', defaultLat: 18.586200, defaultLng: 73.736800, defaultElevationMsl: 570.10, mappingStatus: 'Pending Field Demarcation' },
  { plotNo: 'Plot-32', parcelId: 'PAR-PUNE-022', khasraNo: '132/1', defaultLat: 18.583414, defaultLng: 73.735300, defaultElevationMsl: 568.80, mappingStatus: 'Pending GT Survey' },
  { plotNo: 'Plot-45', parcelId: 'PAR-PUNE-035', khasraNo: '145/3', defaultLat: 18.587100, defaultLng: 73.740100, defaultElevationMsl: 571.30, mappingStatus: 'Unmapped - DGPS Required' },
  { plotNo: 'Plot-58', parcelId: 'PAR-PUNE-048', khasraNo: '158/2', defaultLat: 18.582900, defaultLng: 73.734500, defaultElevationMsl: 567.90, mappingStatus: 'Pending Field Demarcation' }
];

const HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER = [
  { id: 'REG-001', plotNo: 'P-14', khasraNo: '112/3', buildingId: 'BLD-HINJ-001', buildingName: 'I²IT Academic Central Complex (A-Block)', totalFloors: 5, heightM: 16.4, elevationMsl: 568.20, latitude: 18.584728, longitude: 73.737562, ulpin: '27041001002001', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-002', plotNo: 'P-14', khasraNo: '112/3', buildingId: 'BLD-HINJ-002', buildingName: 'I²IT Advanced Computing & Research Wing', totalFloors: 4, heightM: 13.2, elevationMsl: 568.60, latitude: 18.585180, longitude: 73.738430, ulpin: '27041001002002', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-003', plotNo: 'P-14', khasraNo: '112/3', buildingId: 'BLD-HINJ-003', buildingName: 'I²IT Innovation Incubation & Seminar Center', totalFloors: 3, heightM: 9.8, elevationMsl: 569.00, latitude: 18.584402, longitude: 73.737702, ulpin: 'TEMP2704100089', ulpinType: 'TEMPORARY', status: 'Mapping In Progress' },
  { id: 'REG-004', plotNo: 'P-15', khasraNo: '114/1', buildingId: 'BLD-HINJ-004', buildingName: 'Tech Vista IT Campus — Tower Alpha', totalFloors: 8, heightM: 26.5, elevationMsl: 569.40, latitude: 18.585954, longitude: 73.738229, ulpin: '27041001002004', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-005', plotNo: 'P-15', khasraNo: '114/1', buildingId: 'BLD-HINJ-005', buildingName: 'Tech Vista Campus — Tower Beta (Under Extension)', totalFloors: 6, heightM: 19.8, elevationMsl: 569.80, latitude: 18.586391, longitude: 73.737306, ulpin: 'TEMP2704100114', ulpinType: 'TEMPORARY', status: 'Mapping In Progress' },
  { id: 'REG-006', plotNo: 'Plot-21', khasraNo: '121/2', buildingId: 'BLD-HINJ-006', buildingName: 'Cognizant Technology Park — Annex 1', totalFloors: 3, heightM: 9.6, elevationMsl: 568.20, latitude: 18.584089, longitude: 73.737943, ulpin: '27041001003001', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-007', plotNo: 'Plot-21', khasraNo: '121/2', buildingId: 'BLD-HINJ-007', buildingName: 'Cognizant Tech Facility — Utility & Data Hub', totalFloors: 2, heightM: 6.4, elevationMsl: 568.30, latitude: 18.583945, longitude: 73.737819, ulpin: 'TEMP2704100142', ulpinType: 'TEMPORARY', status: 'Pending Field Survey' },
  { id: 'REG-008', plotNo: 'Plot-28', khasraNo: '128/4', buildingId: 'BLD-HINJ-008', buildingName: 'Hinjawadi Gaothan Residential Society — Block A', totalFloors: 4, heightM: 12.8, elevationMsl: 570.10, latitude: 18.586200, longitude: 73.736800, ulpin: '27041001003018', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-009', plotNo: 'Plot-28', khasraNo: '128/4', buildingId: 'BLD-HINJ-009', buildingName: 'Hinjawadi Gaothan Mixed Commercial Storefront', totalFloors: 2, heightM: 6.5, elevationMsl: 570.20, latitude: 18.586344, longitude: 73.736874, ulpin: 'TEMP2704100198', ulpinType: 'TEMPORARY', status: 'Pending Field Survey' },
  { id: 'REG-010', plotNo: 'Plot-32', khasraNo: '132/1', buildingId: 'BLD-HINJ-010', buildingName: 'Wipro Circle Ancillary Office Complex', totalFloors: 5, heightM: 16.0, elevationMsl: 568.80, latitude: 18.583414, longitude: 73.735300, ulpin: 'TEMP2704100205', ulpinType: 'TEMPORARY', status: 'Ground Truthing Required' },
  { id: 'REG-011', plotNo: 'Plot-45', khasraNo: '145/3', buildingId: 'BLD-HINJ-011', buildingName: 'Blue Ridge Spine Residential Tower 9', totalFloors: 14, heightM: 44.8, elevationMsl: 571.30, latitude: 18.587100, longitude: 73.740100, ulpin: '27041001003035', ulpinType: 'PERMANENT', status: 'Completed' },
  { id: 'REG-012', plotNo: 'Plot-58', khasraNo: '158/2', buildingId: 'BLD-HINJ-012', buildingName: 'MIDC Emergency Power & Substation Facility', totalFloors: 1, heightM: 4.8, elevationMsl: 567.90, latitude: 18.582900, longitude: 73.734500, ulpin: 'TEMP2704100254', ulpinType: 'TEMPORARY', status: 'Pending Field Survey' }
];

const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
const pageWidth = 297;
const pageHeight = 210;
const margin = 14;

// PAGE 1
doc.setFillColor(25, 118, 210);
doc.rect(margin, margin, pageWidth - margin * 2, 22, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
doc.setTextColor(255, 255, 255);
doc.text('NAKSHA PORTAL • GOVERNMENT OF INDIA / PMRDA PUNE', margin + 6, margin + 8);
doc.setFont('helvetica', 'normal');
doc.setFontSize(9);
doc.setTextColor(224, 242, 254);
doc.text('National Geospatial Knowledge-based Land Survey of Urban Habitations — Survey Unit 01 Cadastral Register', margin + 6, margin + 14);
doc.text('Datum: WGS84 UTM 43N • Vertical Datum: MSL (EGM2008) • Date: 09-Sep-2026', margin + 6, margin + 19);

doc.setFillColor(34, 197, 94);
doc.roundedRect(pageWidth - margin - 52, margin + 4, 46, 14, 2, 2, 'F');
doc.setFont('helvetica', 'bold');
doc.setFontSize(8.5);
doc.setTextColor(255, 255, 255);
doc.text('OFFICIAL DOSSIER', pageWidth - margin - 49, margin + 10);
doc.setFontSize(7);
doc.text('VERIFIED & CERTIFIED', pageWidth - margin - 49, margin + 15);

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

const permCount = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'PERMANENT').length;
const tempCount = HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.filter(r => r.ulpinType === 'TEMPORARY').length;
doc.text(`Total Buildings Registered: ${HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.length} structures across 6 Plots`, margin + 140, y + 11);
doc.text(`Permanent ULPINs (14-Digit): ${permCount}  |  Temporary ULPINs (14-Digit): ${tempCount}  |  Pending GT Plots: ${AVAILABLE_UNMAPPED_PLOTS.length}`, margin + 140, y + 15);

y += 23;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10.5);
doc.setTextColor(15, 23, 42);
doc.text('AUTHORITATIVE PLOT, BUILDING, HEIGHT & ULPIN ASSIGNMENT REGISTER', margin, y);

y += 4;
const colX = [
  margin,
  margin + 18,
  margin + 34,
  margin + 60,
  margin + 125,
  margin + 147,
  margin + 167,
  margin + 207,
  margin + 251
];

doc.setFillColor(30, 41, 59);
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

HINJAWADI_PLOT_BUILDING_ULPIN_REGISTER.forEach((item, index) => {
  const isEven = index % 2 === 0;
  const rowHeight = 7.2;

  doc.setFillColor(isEven ? 255 : 241, isEven ? 255 : 245, isEven ? 255 : 249);
  doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(2, 132, 199);
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

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${item.heightM.toFixed(1)}m (${item.totalFloors}F)`, colX[4] + 2, y + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${item.elevationMsl.toFixed(1)}m`, colX[5] + 2, y + 4.8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}`, colX[6] + 2, y + 4.8);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7);
  if (item.ulpinType === 'TEMPORARY') {
    doc.setTextColor(180, 83, 9);
    doc.text(item.ulpin, colX[7] + 2, y + 4.8);

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(colX[8] + 1, y + 1.2, 16, 4.8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(180, 83, 9);
    doc.text('TEMP', colX[8] + 4, y + 4.5);
  } else {
    doc.setTextColor(15, 118, 110);
    doc.text(item.ulpin, colX[7] + 2, y + 4.8);

    doc.setFillColor(204, 251, 241);
    doc.roundedRect(colX[8] + 1, y + 1.2, 16, 4.8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(15, 118, 110);
    doc.text('PERM', colX[8] + 4, y + 4.5);
  }

  y += rowHeight;
});

y += 4;
doc.setFont('helvetica', 'italic');
doc.setFontSize(7);
doc.setTextColor(100, 116, 139);
doc.text('* Note: All assigned ULPIN IDs are strictly 14 digits. Temporary ULPINs (e.g. TEMP270410XXXX) are provisional IDs assigned for multi-occupancy or in-progress demarcation.', margin, y);
doc.text('Page 1 of 2 • Official PMRDA Geospatial Cadastral Record', pageWidth - margin - 68, y);

// PAGE 2
doc.addPage('a4', 'landscape');
doc.setFillColor(30, 41, 59);
doc.rect(margin, margin, pageWidth - margin * 2, 16, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(11);
doc.setTextColor(255, 255, 255);
doc.text('UNMAPPED PLOTS SCHEDULE & DGPS RTK GROUND TRUTHING PROGRAM', margin + 6, margin + 7);

doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
doc.setTextColor(203, 213, 225);
doc.text('Survey Unit 01 (348671) — Available Plots Whose Demarcation / Mapping is Yet to Complete', margin + 6, margin + 12);

y = margin + 22;
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(15, 23, 42);
doc.text('AVAILABLE PLOTS FOR GROUND TRUTHING & HEIGHT RECORDING', margin, y);

y += 4;
const p2ColX = [
  margin,
  margin + 25,
  margin + 55,
  margin + 75,
  margin + 130,
  margin + 165,
  margin + 200,
  margin + 230
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

y += 32;
const sigBoxWidth = 80;

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

// Write to public and artifact folders
const publicDest = path.join(__dirname, '../public/Hinjawadi_SU01_Cadastral_ULPIN_Register.pdf');
const artifactDest = 'C:\\Users\\Dhairyashil\\.gemini\\antigravity-ide\\brain\\1f12b138-bc3c-4b3d-976e-a608cfb3b805\\Hinjawadi_SU01_Cadastral_ULPIN_Register.pdf';

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(publicDest, pdfBuffer);
console.log('Successfully saved to public:', publicDest, fs.statSync(publicDest).size, 'bytes');

try {
  fs.writeFileSync(artifactDest, pdfBuffer);
  console.log('Successfully saved to artifacts:', artifactDest, fs.statSync(artifactDest).size, 'bytes');
} catch (e) {
  console.warn('Artifact write note:', e.message);
}
