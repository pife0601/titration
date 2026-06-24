import React from 'react';

export default function FlaskVisualizer({ pH, indicator, vt, maxVt }) {
  // 지시약에 따른 색상 결정 로직
  const getLiquidColor = () => {
    if (indicator.id === 'none') return indicator.acidColor;
    
    if (pH < indicator.minPh) {
      return indicator.acidColor;
    } else if (pH > indicator.maxPh) {
      return indicator.baseColor;
    } else {
      // 변색 범위 (그라데이션 또는 중간색)
      if (indicator.midColor) {
        return indicator.midColor;
      }
      return indicator.baseColor; // 단순화
    }
  };

  const liquidColor = getLiquidColor();
  
  // 투입량에 따른 플라스크 안 액체 높이 (초기 부피도 고려해야 하지만 단순화하여 vt 비율로 계산)
  // 예: 초기 30% 높이 + vt에 따라 최대 80%까지 증가
  const fillPercentage = 30 + (vt / maxVt) * 50; 
  
  // 뷰렛 남은 양 (100% -> 0%)
  const buretFill = 100 - (vt / maxVt) * 100;

  return (
    <div className="glass-panel flex-col items-center justify-center">
      <h2 className="mb-4">실험 시뮬레이션</h2>
      
      <div className="flask-container mt-4">
        {/* 뷰렛 (적정액) */}
        <div className="buret">
          <div 
            className="buret-liquid" 
            style={{ height: `${buretFill}%` }}
          ></div>
        </div>
        <div className="buret-tip"></div>
        
        {/* 떨어지는 물방울 (vt가 0이 아니고 최대가 아닐 때 애니메이션) */}
        <div className={`drop ${vt > 0 && vt < maxVt ? 'animating' : ''}`}></div>

        {/* 플라스크 (분석물질) */}
        <div className="flask">
          <div className="flask-neck"></div>
          <div 
            className="liquid" 
            style={{ 
              height: `${fillPercentage}%`,
              backgroundColor: liquidColor,
              boxShadow: `0 0 20px ${liquidColor}`
            }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-2 w-full">
        <div className="ph-badge">현재 pH: {pH.toFixed(2)}</div>
        <div className="text-sm text-gray-400">지시약 색상: {indicator.name}</div>
      </div>
    </div>
  );
}
