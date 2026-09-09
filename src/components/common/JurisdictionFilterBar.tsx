import React, { useState, useEffect } from 'react';
import {
  NAKSHA_JURISDICTION_HIERARCHY,
  CURRENT_SURVEYOR_DEFAULT
} from '../../data/jurisdictionData';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

export interface JurisdictionSelection {
  state: string;
  district: string;
  ulb: string;
  wardVillage: string;
  surveyUnit: string;
  surveyUnitCode?: string;
}

interface JurisdictionFilterBarProps {
  initialValues?: Partial<JurisdictionSelection>;
  onSearch?: (selection: JurisdictionSelection) => void;
  onClear?: () => void;
  onChange?: (selection: JurisdictionSelection) => void;
  showButtons?: boolean;
}

export const JurisdictionFilterBar: React.FC<JurisdictionFilterBarProps> = ({
  initialValues,
  onSearch,
  onClear,
  onChange,
  showButtons = true
}) => {
  const [selectedState, setSelectedState] = useState(initialValues?.state || CURRENT_SURVEYOR_DEFAULT.state);
  const [selectedDistrict, setSelectedDistrict] = useState(initialValues?.district || CURRENT_SURVEYOR_DEFAULT.district);
  const [selectedUlb, setSelectedUlb] = useState(initialValues?.ulb || CURRENT_SURVEYOR_DEFAULT.ulb);
  const [selectedWardVillage, setSelectedWardVillage] = useState(initialValues?.wardVillage || CURRENT_SURVEYOR_DEFAULT.wardVillage);
  const [selectedSurveyUnit, setSelectedSurveyUnit] = useState(initialValues?.surveyUnit || CURRENT_SURVEYOR_DEFAULT.surveyUnit);

  // Derive dynamic options from hierarchical dataset
  const stateObj = NAKSHA_JURISDICTION_HIERARCHY.find(s => s.name === selectedState) || NAKSHA_JURISDICTION_HIERARCHY[0];
  const districts = stateObj ? stateObj.districts : [];
  
  const districtObj = districts.find(d => d.name === selectedDistrict) || districts[0];
  const ulbs = districtObj ? districtObj.ulbs : [];

  const ulbObj = ulbs.find(u => u.name === selectedUlb) || ulbs[0];
  const villages = ulbObj ? ulbObj.villages : [];

  const villageObj = villages.find(v => v.name === selectedWardVillage) || villages[0];
  const surveyUnits = villageObj ? villageObj.surveyUnits : [];

  const currentSelection: JurisdictionSelection = {
    state: selectedState,
    district: selectedDistrict,
    ulb: selectedUlb,
    wardVillage: selectedWardVillage,
    surveyUnit: selectedSurveyUnit,
    surveyUnitCode: surveyUnits.find(su => su.name === selectedSurveyUnit)?.code || CURRENT_SURVEYOR_DEFAULT.surveyUnitCode
  };

  const handleStateChange = (val: string) => {
    setSelectedState(val);
    const s = NAKSHA_JURISDICTION_HIERARCHY.find(item => item.name === val);
    const firstDist = s?.districts[0]?.name || '';
    const firstUlb = s?.districts[0]?.ulbs[0]?.name || '';
    const firstVil = s?.districts[0]?.ulbs[0]?.villages[0]?.name || '';
    const firstSu = s?.districts[0]?.ulbs[0]?.villages[0]?.surveyUnits[0]?.name || '';
    setSelectedDistrict(firstDist);
    setSelectedUlb(firstUlb);
    setSelectedWardVillage(firstVil);
    setSelectedSurveyUnit(firstSu);
    if (onChange) {
      onChange({
        state: val,
        district: firstDist,
        ulb: firstUlb,
        wardVillage: firstVil,
        surveyUnit: firstSu
      });
    }
  };

  const handleDistrictChange = (val: string) => {
    setSelectedDistrict(val);
    const d = districts.find(item => item.name === val);
    const firstUlb = d?.ulbs[0]?.name || '';
    const firstVil = d?.ulbs[0]?.villages[0]?.name || '';
    const firstSu = d?.ulbs[0]?.villages[0]?.surveyUnits[0]?.name || '';
    setSelectedUlb(firstUlb);
    setSelectedWardVillage(firstVil);
    setSelectedSurveyUnit(firstSu);
    if (onChange) {
      onChange({
        state: selectedState,
        district: val,
        ulb: firstUlb,
        wardVillage: firstVil,
        surveyUnit: firstSu
      });
    }
  };

  const handleUlbChange = (val: string) => {
    setSelectedUlb(val);
    const u = ulbs.find(item => item.name === val);
    const firstVil = u?.villages[0]?.name || '';
    const firstSu = u?.villages[0]?.surveyUnits[0]?.name || '';
    setSelectedWardVillage(firstVil);
    setSelectedSurveyUnit(firstSu);
    if (onChange) {
      onChange({
        state: selectedState,
        district: selectedDistrict,
        ulb: val,
        wardVillage: firstVil,
        surveyUnit: firstSu
      });
    }
  };

  const handleVillageChange = (val: string) => {
    setSelectedWardVillage(val);
    const v = villages.find(item => item.name === val);
    const firstSu = v?.surveyUnits[0]?.name || '';
    setSelectedSurveyUnit(firstSu);
    if (onChange) {
      onChange({
        state: selectedState,
        district: selectedDistrict,
        ulb: selectedUlb,
        wardVillage: val,
        surveyUnit: firstSu
      });
    }
  };

  const handleSurveyUnitChange = (val: string) => {
    setSelectedSurveyUnit(val);
    if (onChange) {
      onChange({
        ...currentSelection,
        surveyUnit: val
      });
    }
  };

  const handleClearClick = () => {
    setSelectedState(CURRENT_SURVEYOR_DEFAULT.state);
    setSelectedDistrict(CURRENT_SURVEYOR_DEFAULT.district);
    setSelectedUlb(CURRENT_SURVEYOR_DEFAULT.ulb);
    setSelectedWardVillage(CURRENT_SURVEYOR_DEFAULT.wardVillage);
    setSelectedSurveyUnit(CURRENT_SURVEYOR_DEFAULT.surveyUnit);
    if (onClear) onClear();
    if (onChange) onChange(CURRENT_SURVEYOR_DEFAULT);
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch(currentSelection);
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '18px 22px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Select State * */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Select State *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {NAKSHA_JURISDICTION_HIERARCHY.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* District * */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            District *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {districts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Urban Local Body (ULB) * */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Urban Local Body (ULB) *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedUlb}
              onChange={(e) => handleUlbChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {ulbs.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Ward / Village / Colony * */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Ward / Village / Colony *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedWardVillage}
              onChange={(e) => handleVillageChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {villages.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Survey Unit * */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Survey Unit *
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedSurveyUnit}
              onChange={(e) => handleSurveyUnitChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 32px 8px 12px',
                border: '1.5px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                fontWeight: 600,
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              {surveyUnits.map(su => (
                <option key={su.id} value={su.name}>{su.name}</option>
              ))}
            </select>
            <ChevronDown size={14} color="#3b82f6" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {showButtons && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={handleSearchClick}
            style={{
              backgroundColor: '#1976d2',
              color: '#ffffff',
              border: 'none',
              padding: '8px 24px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.25)'
            }}
          >
            <Search size={15} />
            <span>Search</span>
          </button>
          <button
            type="button"
            onClick={handleClearClick}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#475569',
              border: '1px solid #cbd5e1',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} />
            <span>Clear</span>
          </button>
        </div>
      )}
    </div>
  );
};
