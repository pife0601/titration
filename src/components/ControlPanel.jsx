import React from 'react';
import { CHEMICALS, INDICATORS } from '../utils/titrationMath';

export default function ControlPanel({
  analyte, setAnalyte,
  titrant, setTitrant,
  indicator, setIndicator,
  vt, setVt,
  maxVt
}) {
  return (
    <div className="glass-panel flex-col gap-1 p-2" style={{ fontSize: '0.85rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '2px', fontWeight: 'bold' }}>실험 설정</h2>
      
      {/* 플라스크 (분석물질) 설정 */}
      <div className="mb-1">
        <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>플라스크 용액 (Analyte)</label>
        <select 
          value={analyte.id} 
          onChange={(e) => {
            const chem = [...CHEMICALS.acids, ...CHEMICALS.bases].find(c => c.id === e.target.value);
            setAnalyte({...analyte, ...chem, id: chem.id});
            setVt(0); // 용액 변경시 초기화
          }}
        >
          <optgroup label="강산 (Strong Acids)">
            {CHEMICALS.acids.filter(c => c.type === 'SA').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="약산 (Weak Acids)">
            {CHEMICALS.acids.filter(c => c.type === 'WA').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="강염기 (Strong Bases)">
            {CHEMICALS.bases.filter(c => c.type === 'SB').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="약염기 (Weak Bases)">
            {CHEMICALS.bases.filter(c => c.type === 'WB').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
        </select>

        <div className="flex gap-2 mt-1">
          <div className="w-full">
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>농도 (M)</label>
            <input 
              type="number" 
              step="0.1" 
              min="0.1" 
              max="2.0"
              value={analyte.c} 
              onChange={(e) => {
                setAnalyte({...analyte, c: Number(e.target.value)});
                setVt(0);
              }} 
            />
          </div>
          <div className="w-full">
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>초기 부피 (mL)</label>
            <input 
              type="number" 
              step="50" 
              min="50" 
              max="200"
              value={analyte.v} 
              onChange={(e) => {
                setAnalyte({...analyte, v: Number(e.target.value)});
                setVt(0);
              }} 
            />
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2px 0' }} />

      {/* 뷰렛 (적정액) 설정 */}
      <div className="mb-1">
        <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>뷰렛 용액 (Titrant)</label>
        <select 
          value={titrant.id} 
          onChange={(e) => {
            const chem = [...CHEMICALS.acids, ...CHEMICALS.bases].find(c => c.id === e.target.value);
            setTitrant({...titrant, ...chem, id: chem.id});
            setVt(0);
          }}
        >
          <optgroup label="강염기 (Strong Bases)">
            {CHEMICALS.bases.filter(c => c.type === 'SB').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="약염기 (Weak Bases)">
            {CHEMICALS.bases.filter(c => c.type === 'WB').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="강산 (Strong Acids)">
            {CHEMICALS.acids.filter(c => c.type === 'SA').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
          <optgroup label="약산 (Weak Acids)">
            {CHEMICALS.acids.filter(c => c.type === 'WA').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
        </select>

        <div className="w-full mt-1">
          <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>농도 (M)</label>
          <input 
            type="number" 
            step="0.1" 
            min="0.1" 
            max="2.0"
            value={titrant.c} 
            onChange={(e) => {
              setTitrant({...titrant, c: Number(e.target.value)});
              setVt(0);
            }} 
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '2px 0' }} />

      {/* 지시약 설정 */}
      <div className="mb-1">
        <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>지시약</label>
        <select 
          value={indicator.id}
          onChange={(e) => {
            const ind = INDICATORS.find(i => i.id === e.target.value);
            setIndicator(ind);
          }}
        >
          {INDICATORS.map(ind => (
            <option key={ind.id} value={ind.id}>{ind.name}</option>
          ))}
        </select>
      </div>

      {/* 적정 슬라이더 */}
      <div className="mt-1 p-2" style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <label style={{ color: '#60a5fa', fontSize: '0.8rem', marginBottom: '2px', display: 'block' }}>
          투입량: <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff' }}>{vt.toFixed(1)}</span> mL
        </label>
        <input 
          type="range" 
          min="0" 
          max={maxVt} 
          step="0.1" 
          value={vt} 
          onChange={(e) => setVt(Number(e.target.value))} 
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0 mL</span>
          <span>{maxVt} mL</span>
        </div>
      </div>
    </div>
  );
}
