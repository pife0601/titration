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
    <div className="app-container">
      {/* 왼쪽 제어 패널 */}
      <div>
        <ControlPanel 
          analyte={analyte} setAnalyte={setAnalyte}
          titrant={titrant} setTitrant={setTitrant}
          indicator={indicator} setIndicator={setIndicator}
          vt={vt} setVt={setVt}
          maxVt={maxVt}
        />
        
        {warning && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5' }}>
            {warning}
          </div>
        )}
      </div>

      {/* 오른쪽 메인 콘텐츠 영역 (시각화 및 그래프) */}
      <div className="main-content">
        <header>
          <h1>중화적정 시뮬레이터</h1>
          <p>분석물질과 적정액의 종류 및 농도를 설정하고, 뷰렛의 슬라이더를 조작하여 적정 곡선과 지시약의 변색을 관찰해보세요.</p>
        </header>

        <div className="visualization-area">
          {/* 그래프 영역 */}
          <TitrationGraph 
            data={graphData} 
            currentVt={vt} 
            currentPh={currentPh}
            hoverData={hoverData}
            setHoverData={setHoverData}
          />

          {/* 비커(플라스크) 뷰 영역 */}
          <FlaskVisualizer 
            pH={hoverData ? hoverData.pH : currentPh} 
            indicator={indicator}
            vt={hoverData ? hoverData.volume : vt}
            maxVt={maxVt}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
