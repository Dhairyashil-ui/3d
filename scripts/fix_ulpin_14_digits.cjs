const fs = require('fs');
const path = require('path');

console.log('=== FIXING ULPINs TO STRICTLY 14 DIGITS / CHARACTERS ACROSS ENTIRE SYSTEM ===\n');

// 1. plotBuildingUlpinRegister.ts
const registerPath = path.join(__dirname, '../src/data/plotBuildingUlpinRegister.ts');
if (fs.existsSync(registerPath)) {
  let content = fs.readFileSync(registerPath, 'utf8');

  // Permanent ULPINs -> 14 digits
  content = content.replace(/'270410010020101'/g, "'27041001002001'");
  content = content.replace(/'270410010020102'/g, "'27041001002002'");
  content = content.replace(/'270410010020104'/g, "'27041001002004'");
  content = content.replace(/'270410010030001'/g, "'27041001003001'");
  content = content.replace(/'270410010030018'/g, "'27041001003018'");
  content = content.replace(/'270410010030035'/g, "'27041001003035'");

  // Temporary ULPINs -> 14 characters/digits (e.g. TEMP2704100089)
  content = content.replace(/'TEMP-ULPIN-270410-0089'/g, "'TEMP2704100089'");
  content = content.replace(/'TEMP-ULPIN-270410-0114'/g, "'TEMP2704100114'");
  content = content.replace(/'TEMP-ULPIN-270410-0142'/g, "'TEMP2704100142'");
  content = content.replace(/'TEMP-ULPIN-270410-0198'/g, "'TEMP2704100198'");
  content = content.replace(/'TEMP-ULPIN-270410-0205'/g, "'TEMP2704100205'");
  content = content.replace(/'TEMP-ULPIN-270410-0254'/g, "'TEMP2704100254'");

  // Text & descriptions
  content = content.replace(/TEMP-ULPIN-270410-XXXX/g, "TEMP270410XXXX (14 digits)");

  fs.writeFileSync(registerPath, content, 'utf8');
  console.log('✓ Updated src/data/plotBuildingUlpinRegister.ts');
}

// 2. UploadGtPointsPage.tsx
const uploadGtPath = path.join(__dirname, '../src/pages/surveyor/UploadGtPointsPage.tsx');
if (fs.existsSync(uploadGtPath)) {
  let content = fs.readFileSync(uploadGtPath, 'utf8');

  // Permanent ULPINs
  content = content.replace(/'270410010020101'/g, "'27041001002001'");
  content = content.replace(/270410010020101/g, "27041001002001");
  content = content.replace(/27041001002010\$\{idx \+ 1\}/g, "2704100100200${idx + 1}");

  // Temporary ULPINs
  content = content.replace(/TEMP-ULPIN-270410-0089/g, "TEMP2704100089");
  content = content.replace(/TEMP-ULPIN-270410-0099/g, "TEMP2704100099");
  content = content.replace(/TEMP-ULPIN-270410-0\$\{modalRows\.length \+ 200\}/g, "TEMP2704100${modalRows.length + 200}");
  content = content.replace(/TEMP-ULPIN-270410-0\$\{index \+ 240\}/g, "TEMP2704100${index + 240}");
  content = content.replace(/TEMP-ULPIN-270410-0\$\{index \+ 101\}/g, "TEMP2704100${index + 101}");
  content = content.replace(/TEMP-ULPIN-270410-XXXX/g, "TEMP270410XXXX (14 Digits)");

  // Explanatory texts
  content = content.replace(/15-digit permanent ULPIN/g, "14-digit permanent ULPIN");
  content = content.replace(/15-digit alphanumeric ULPIN/g, "14-digit alphanumeric ULPIN");

  fs.writeFileSync(uploadGtPath, content, 'utf8');
  console.log('✓ Updated src/pages/surveyor/UploadGtPointsPage.tsx');
}

// 3. PropertySearchPage.tsx
const propSearchPath = path.join(__dirname, '../src/pages/surveyor/PropertySearchPage.tsx');
if (fs.existsSync(propSearchPath)) {
  let content = fs.readFileSync(propSearchPath, 'utf8');
  content = content.replace(/270410010020101/g, "27041001002001");
  fs.writeFileSync(propSearchPath, content, 'utf8');
  console.log('✓ Updated src/pages/surveyor/PropertySearchPage.tsx');
}

// 4. generateUlpinPdf.ts
const pdfGenPath = path.join(__dirname, '../src/utils/generateUlpinPdf.ts');
if (fs.existsSync(pdfGenPath)) {
  let content = fs.readFileSync(pdfGenPath, 'utf8');
  content = content.replace(/Permanent ULPINs: \$\{permCount\}\s+\|\s+Temporary ULPINs \(TEMP-ULPIN\): \$\{tempCount\}/g, "Permanent ULPINs (14-Digit): ${permCount}  |  Temporary ULPINs (14-Digit): ${tempCount}");
  content = content.replace(/\* Note: Temporary ULPINs \(TEMP-ULPIN-270410-XXXX\) are provisional IDs assigned for multi-occupancy or in-progress demarcation\./g, "* Note: All assigned ULPIN IDs are strictly 14 digits. Temporary ULPINs (e.g. TEMP270410XXXX) are provisional IDs assigned for multi-occupancy or in-progress demarcation.");
  content = content.replace(/3\. Temporary ULPIN \(TEMP-ULPIN-XXXX\): Assigned when field boundaries are contested/g, "3. Standard 14-Digit ULPIN & Temporary ULPIN (TEMP270410XXXX): All building ULPIN IDs strictly adhere to the 14-digit standard. Temporary ULPINs are assigned when field boundaries are contested");
  content = content.replace(/15-digit alphanumeric ULPIN/g, "14-digit alphanumeric ULPIN");
  content = content.replace(/15-digit permanent ULPIN/g, "14-digit permanent ULPIN");
  fs.writeFileSync(pdfGenPath, content, 'utf8');
  console.log('✓ Updated src/utils/generateUlpinPdf.ts');
}

// 5. BuildingSearchWidget.tsx
const bldSearchPath = path.join(__dirname, '../src/components/common/BuildingSearchWidget.tsx');
if (fs.existsSync(bldSearchPath)) {
  let content = fs.readFileSync(bldSearchPath, 'utf8');
  content = content.replace(/270410010020101/g, "27041001002001");
  content = content.replace(/270410010020102/g, "27041001002002");
  content = content.replace(/270410010020103/g, "27041001002003");
  fs.writeFileSync(bldSearchPath, content, 'utf8');
  console.log('✓ Updated src/components/common/BuildingSearchWidget.tsx');
}

// 6. CesiumPhotorealisticViewer.tsx
const cesiumPath = path.join(__dirname, '../src/components/cesium/CesiumPhotorealisticViewer.tsx');
if (fs.existsSync(cesiumPath)) {
  let content = fs.readFileSync(cesiumPath, 'utf8');
  content = content.replace(/270410010030000/g, "27041001003000");
  fs.writeFileSync(cesiumPath, content, 'utf8');
  console.log('✓ Updated src/components/cesium/CesiumPhotorealisticViewer.tsx');
}

// 7. hinjawadiUlbDataset.ts: replace 15-digit ULPINs with 14-digit ULPINs
const ulbDatasetPath = path.join(__dirname, '../src/data/hinjawadiUlbDataset.ts');
if (fs.existsSync(ulbDatasetPath)) {
  let content = fs.readFileSync(ulbDatasetPath, 'utf8');
  // "ulpin": "2704100100300XX" (15 digits) -> "ulpin": "270410010030XX" (14 digits)
  content = content.replace(/"ulpin":\s*"2704100100300(\d{2})"/g, '"ulpin": "270410010030$1"');
  // If any had single digit
  content = content.replace(/"ulpin":\s*"27041001003000(\d{1})"/g, '"ulpin": "2704100100300$1"');
  fs.writeFileSync(ulbDatasetPath, content, 'utf8');
  console.log('✓ Updated src/data/hinjawadiUlbDataset.ts');
}

// 8. coherentPuneDataset.ts: replace 15-digit ULPINs with 14-digit ULPINs
const coherentPath = path.join(__dirname, '../src/data/coherentPuneDataset.ts');
if (fs.existsSync(coherentPath)) {
  let content = fs.readFileSync(coherentPath, 'utf8');
  content = content.replace(/"ulpin":\s*"270410010020101"/g, '"ulpin": "27041001002001"');
  content = content.replace(/"ulpin":\s*"2704100100300(\d{2})"/g, '"ulpin": "270410010030$1"');
  content = content.replace(/"ulpin":\s*"27041001003000(\d{1})"/g, '"ulpin": "2704100100300$1"');
  fs.writeFileSync(coherentPath, content, 'utf8');
  console.log('✓ Updated src/data/coherentPuneDataset.ts');
}

// 9. scripts/generate_pdf.cjs: update hardcoded values to 14 digits and regenerate
const genScriptPath = path.join(__dirname, 'generate_pdf.cjs');
if (fs.existsSync(genScriptPath)) {
  let content = fs.readFileSync(genScriptPath, 'utf8');

  // Permanent ULPINs
  content = content.replace(/'270410010020101'/g, "'27041001002001'");
  content = content.replace(/'270410010020102'/g, "'27041001002002'");
  content = content.replace(/'270410010020104'/g, "'27041001002004'");
  content = content.replace(/'270410010030001'/g, "'27041001003001'");
  content = content.replace(/'270410010030018'/g, "'27041001003018'");
  content = content.replace(/'270410010030035'/g, "'27041001003035'");

  // Temporary ULPINs -> 14 chars
  content = content.replace(/'TEMP-ULPIN-270410-0089'/g, "'TEMP2704100089'");
  content = content.replace(/'TEMP-ULPIN-270410-0114'/g, "'TEMP2704100114'");
  content = content.replace(/'TEMP-ULPIN-270410-0142'/g, "'TEMP2704100142'");
  content = content.replace(/'TEMP-ULPIN-270410-0198'/g, "'TEMP2704100198'");
  content = content.replace(/'TEMP-ULPIN-270410-0205'/g, "'TEMP2704100205'");
  content = content.replace(/'TEMP-ULPIN-270410-0254'/g, "'TEMP2704100254'");

  // Descriptive text
  content = content.replace(/Permanent ULPINs: \$\{permCount\}\s+\|\s+Temporary ULPINs \(TEMP-ULPIN\): \$\{tempCount\}/g, "Permanent ULPINs (14-Digit): ${permCount}  |  Temporary ULPINs (14-Digit): ${tempCount}");
  content = content.replace(/\* Note: Temporary ULPINs \(TEMP-ULPIN-270410-XXXX\) are provisional IDs assigned for multi-occupancy or in-progress demarcation\./g, "* Note: All assigned ULPIN IDs are strictly 14 digits. Temporary ULPINs (e.g. TEMP270410XXXX) are provisional IDs assigned for multi-occupancy or in-progress demarcation.");
  content = content.replace(/3\. Temporary ULPIN \(TEMP-ULPIN-XXXX\): Assigned when field boundaries are contested/g, "3. Standard 14-Digit ULPIN & Temporary ULPIN (TEMP270410XXXX): All building ULPIN IDs strictly adhere to the 14-digit standard. Temporary ULPINs are assigned when field boundaries are contested");

  fs.writeFileSync(genScriptPath, content, 'utf8');
  console.log('✓ Updated scripts/generate_pdf.cjs');
}

console.log('\nAll files updated! Now validating 14-digit ULPIN lengths...\n');

// 10. Verification of lengths
const regContent = fs.readFileSync(registerPath, 'utf8');
const ulpinMatches = regContent.match(/ulpin:\s*'([^']+)'/g);
if (ulpinMatches) {
  ulpinMatches.forEach((m) => {
    const val = m.replace(/ulpin:\s*'/, '').replace(/'/, '');
    console.log(`Checking ULPIN "${val}" -> Length: ${val.length} (${val.length === 14 ? 'OK 14-DIGIT' : 'ERROR: NOT 14!'})`);
  });
}

console.log('\n=== COMPLETED FIXING ALL ULPINs TO 14 DIGITS ===');
