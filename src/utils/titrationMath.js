// src/utils/titrationMath.js

// 화학종 데이터
export const CHEMICALS = {
  acids: [
    { id: 'HCl', name: '염산 (HCl)', type: 'SA', pKa: null },
    { id: 'CH3COOH', name: '아세트산 (CH₃COOH)', type: 'WA', pKa: 4.76 }
  ],
  bases: [
    { id: 'NaOH', name: '수산화나트륨 (NaOH)', type: 'SB', pKb: null },
    { id: 'NH3', name: '암모니아 (NH₃)', type: 'WB', pKb: 4.75 }
  ]
};

export const INDICATORS = [
  { id: 'phenolphthalein', name: '페놀프탈레인', minPh: 8.2, maxPh: 10.0, acidColor: 'rgba(255, 255, 255, 0.2)', baseColor: 'rgba(255, 0, 128, 0.7)', midColor: 'rgba(255, 128, 192, 0.5)' },
  { id: 'methylOrange', name: '메틸오렌지', minPh: 3.1, maxPh: 4.4, acidColor: 'rgba(255, 0, 0, 0.7)', baseColor: 'rgba(255, 200, 0, 0.7)', midColor: 'rgba(255, 100, 0, 0.7)' },
  { id: 'bromothymolBlue', name: 'BTB 용액', minPh: 6.0, maxPh: 7.6, acidColor: 'rgba(255, 255, 0, 0.7)', baseColor: 'rgba(0, 0, 255, 0.7)', midColor: 'rgba(0, 255, 0, 0.7)' },
  { id: 'none', name: '지시약 없음', minPh: 0, maxPh: 14, acidColor: 'rgba(255, 255, 255, 0.1)', baseColor: 'rgba(255, 255, 255, 0.1)' }
];

// Helper for -log10
const pX = (val) => (val > 0 ? -Math.log10(val) : 14);

/**
 * pH 계산 함수
 * @param {Object} analyte 플라스크 내 용액
 * @param {Object} titrant 뷰렛 용액
 * @param {number} vt 투입된 적정액 부피(mL)
 * @returns {number} pH
 */
export function calculatePH(analyte, titrant, vt) {
  const ca = analyte.c;
  const va = analyte.v;
  const ct = titrant.c;
  
  const na = ca * va; // analyte mmol
  const nt = ct * vt; // titrant mmol
  const vTotal = va + vt;
  
  if (vTotal === 0) return 7;

  const isAnalyteAcid = ['SA', 'WA'].includes(analyte.type);
  const isTitrantBase = ['SB', 'WB'].includes(titrant.type);
  
  // 산-산, 염기-염기 혼합 예외 처리 (단순 혼합)
  if (isAnalyteAcid && !isTitrantBase) return pX((na + nt) / vTotal);
  if (!isAnalyteAcid && isTitrantBase) return 14 - pX((na + nt) / vTotal);

  // 1. 강산 - 강염기
  if (analyte.type === 'SA' && titrant.type === 'SB') {
    if (na > nt) return pX((na - nt) / vTotal);
    if (na === nt) return 7;
    return 14 - pX((nt - na) / vTotal);
  }

  // 2. 강염기 - 강산
  if (analyte.type === 'SB' && titrant.type === 'SA') {
    if (na > nt) return 14 - pX((na - nt) / vTotal);
    if (na === nt) return 7;
    return pX((nt - na) / vTotal);
  }

  // 3. 약산 - 강염기
  if (analyte.type === 'WA' && titrant.type === 'SB') {
    const pKa = analyte.pK || 4.76;
    if (nt === 0) return 0.5 * (pKa - Math.log10(ca));
    if (nt < na) {
      if (na - nt < 1e-7) return pKa + 3;
      return pKa + Math.log10(nt / (na - nt));
    }
    if (nt === na) {
      const cSalt = na / vTotal;
      const pKb = 14 - pKa;
      return 14 - 0.5 * (pKb - Math.log10(cSalt));
    }
    if (nt > na) return 14 - pX((nt - na) / vTotal);
  }

  // 4. 약염기 - 강산
  if (analyte.type === 'WB' && titrant.type === 'SA') {
    const pKb = analyte.pK || 4.75;
    if (nt === 0) return 14 - 0.5 * (pKb - Math.log10(ca));
    if (nt < na) {
      if (na - nt < 1e-7) return 14 - (pKb + 3);
      return 14 - (pKb + Math.log10(nt / (na - nt)));
    }
    if (nt === na) {
      const cSalt = na / vTotal;
      const pKa = 14 - pKb;
      return 0.5 * (pKa - Math.log10(cSalt));
    }
    if (nt > na) return pX((nt - na) / vTotal);
  }

  // 5. 강산 - 약염기
  if (analyte.type === 'SA' && titrant.type === 'WB') {
    const pKb = titrant.pK || 4.75;
    if (nt === 0) return pX(ca);
    if (nt < na) {
      if (na - nt < 1e-7) return 7;
      return pX((na - nt) / vTotal);
    }
    if (nt === na) {
      const cSalt = na / vTotal;
      const pKa = 14 - pKb;
      return 0.5 * (pKa - Math.log10(cSalt));
    }
    if (nt > na) {
      if (nt - na < 1e-7) return 14 - (pKb + 3);
      return 14 - (pKb + Math.log10(na / (nt - na)));
    }
  }

  // 6. 강염기 - 약산
  if (analyte.type === 'SB' && titrant.type === 'WA') {
    const pKa = titrant.pK || 4.76;
    if (nt === 0) return 14 - pX(ca);
    if (nt < na) {
      if (na - nt < 1e-7) return 7;
      return 14 - pX((na - nt) / vTotal);
    }
    if (nt === na) {
      const cSalt = na / vTotal;
      const pKb = 14 - pKa;
      return 14 - 0.5 * (pKb - Math.log10(cSalt));
    }
    if (nt > na) {
      if (nt - na < 1e-7) return pKa + 3;
      return pKa + Math.log10(na / (nt - na));
    }
  }

  // 7. 약산 - 약염기
  if (analyte.type === 'WA' && titrant.type === 'WB') {
    const pKa = analyte.pK || 4.76;
    const pKb = titrant.pK || 4.75;
    if (nt === 0) return 0.5 * (pKa - Math.log10(ca));
    if (nt < na) {
      if (na - nt < 1e-7) return pKa + 3;
      return pKa + Math.log10(nt / (na - nt));
    }
    if (nt === na) return 0.5 * (14 + pKa - pKb);
    if (nt > na) {
      if (nt - na < 1e-7) return 14 - (pKb + 3);
      return 14 - (pKb + Math.log10(na / (nt - na)));
    }
  }

  // 8. 약염기 - 약산
  if (analyte.type === 'WB' && titrant.type === 'WA') {
    const pKb = analyte.pK || 4.75;
    const pKa = titrant.pK || 4.76;
    if (nt === 0) return 14 - 0.5 * (pKb - Math.log10(ca));
    if (nt < na) {
      if (na - nt < 1e-7) return 14 - (pKb + 3);
      return 14 - (pKb + Math.log10(nt / (na - nt)));
    }
    if (nt === na) return 0.5 * (14 + pKa - pKb);
    if (nt > na) {
      if (nt - na < 1e-7) return pKa + 3;
      return pKa + Math.log10(na / (nt - na));
    }
  }

  return 7;
}

export function generateTitrationCurve(analyte, titrant, maxVt) {
  const data = [];
  const points = 300;
  
  const eqVt = (analyte.c * analyte.v) / titrant.c;
  
  for (let i = 0; i <= points; i++) {
    let vt = (i / points) * maxVt;
    const pH = calculatePH(analyte, titrant, vt);
    data.push({ volume: Number(vt.toFixed(2)), pH: Number(pH.toFixed(3)) });
  }

  for (let i = -10; i <= 10; i++) {
    if (i === 0) continue;
    let vt = eqVt + (i * 0.1);
    if (vt >= 0 && vt <= maxVt) {
      const pH = calculatePH(analyte, titrant, vt);
      data.push({ volume: Number(vt.toFixed(2)), pH: Number(pH.toFixed(3)) });
    }
  }

  return data.sort((a, b) => a.volume - b.volume);
}
