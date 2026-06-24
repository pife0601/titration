import React, { useState, useMemo, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import TitrationGraph from './components/TitrationGraph';
import FlaskVisualizer from './components/FlaskVisualizer';
import { CHEMICALS, INDICATORS, calculatePH, generateTitrationCurve } from './utils/titrationMath';

function App() {
  // 기본 상태 설정
  const [analyte, setAnalyte] = useState({ ...CHEMICALS.acids[0], c: 0.1, v: 50 }); // 0.1M HCl 50mL
  const [titrant, setTitrant] = useState({ ...CHEMICALS.bases[0], c: 0.1 }); // 0.1M NaOH
  const [indicator, setIndicator] = useState(INDICATORS[0]); // 페놀프탈레인
  const [vt, setVt] = useState(0); // 현재 투입된 적정액 부피
  const [hoverData, setHoverData] = useState(null); // 그래프 호버 데이터
  
  const maxVt = 100; // 최대 투입량

  // 전체 그래프 데이터 생성
  const graphData = useMemo(() => {
    return generateTitrationCurve(analyte, titrant, maxVt);
  }, [analyte, titrant, maxVt]);

  // 현재 투입량에 따른 pH 계산
  const currentPh = useMemo(() => {
    return calculatePH(analyte, titrant, vt);
  }, [analyte, titrant, vt]);

  // 산/산 또는 염기/염기 혼합 경고
  const [warning, setWarning] = useState('');
  useEffect(() => {
    const isAnalyteAcid = ['SA', 'WA'].includes(analyte.type);
    const isTitrantBase = ['SB', 'WB'].includes(titrant.type);
    if (isAnalyteAcid && !isTitrantBase) {
      setWarning('경고: 산과 산을 혼합하고 있습니다. 올바른 중화적정이 아닙니다.');
    } else if (!isAnalyteAcid && isTitrantBase) {
      setWarning('경고: 염기와 염기를 혼합하고 있습니다. 올바른 중화적정이 아닙니다.');
    } else {
      setWarning('');
    }
  }, [analyte.type, titrant.type]);

  return (
    <div className="app-layout">
      {/* 왼쪽: 조작 패널 */}
      <div className="left-panel">
        <header>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>중화적정 시뮬레이터</h1>
          <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>조건을 설정하고 슬라이더를 조작해 적정 곡선을 확인하세요.</p>
        </header>

        <ControlPanel 
          analyte={analyte} setAnalyte={setAnalyte}
          titrant={titrant} setTitrant={setTitrant}
          indicator={indicator} setIndicator={setIndicator}
          vt={vt} setVt={setVt}
          maxVt={maxVt}
        />
        
        {warning && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5', fontSize: '0.9rem' }}>
            {warning}
          </div>
        )}
      </div>

      {/* 가운데: 그래프 */}
      <div className="middle-panel">
        <TitrationGraph 
          data={graphData} 
          currentVt={vt} 
          currentPh={currentPh}
          hoverData={hoverData}
          setHoverData={setHoverData}
        />
      </div>

      {/* 오른쪽: 플라스크 (색깔) */}
      <div className="right-panel">
        <FlaskVisualizer 
          pH={hoverData ? hoverData.pH : currentPh} 
          indicator={indicator}
          vt={hoverData ? hoverData.volume : vt}
          maxVt={maxVt}
        />
      </div>
    </div>
  );
}

export default App;
