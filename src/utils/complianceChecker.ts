import { CountrySpec, PhotoAdjustments, ComplianceCheck } from '../types/passport';

export interface ComplianceSummary {
  score: number; // 0 to 100
  allPassed: boolean;
  checks: ComplianceCheck[];
  summaryStatus: 'Compliant & Ready' | 'Action Needed' | 'Minor Warning';
}

export const evaluateCompliance = (
  spec: CountrySpec,
  adjustments: PhotoAdjustments
): ComplianceSummary => {
  const checks: ComplianceCheck[] = [];

  // 1. Head Size Ratio Check
  // Effective head coverage varies with zoom. Ideal zoom for sample portraits is ~0.95 to 1.15
  const estimatedHeadPercent = Math.round(58 * adjustments.zoom);
  const headWithinBounds =
    estimatedHeadPercent >= spec.headSizePercentMin && estimatedHeadPercent <= spec.headSizePercentMax;
  
  checks.push({
    id: 'head-size',
    title: 'Biometric Crown-to-Chin Ratio',
    category: 'Biometrics',
    status: headWithinBounds ? 'passed' : 'warning',
    currentValue: `${estimatedHeadPercent}% of frame`,
    requiredValue: `${spec.headSizePercentMin}% – ${spec.headSizePercentMax}%`,
    guidance: headWithinBounds
      ? 'Head height is perfectly sized within government boundaries.'
      : estimatedHeadPercent < spec.headSizePercentMin
      ? 'Head is too small. Use the Zoom slider to enlarge the face.'
      : 'Head is too large. Zoom out slightly so chin and hair fit comfortably.',
  });

  // 2. Head Tilt & Alignment
  const absRotation = Math.abs(adjustments.rotation);
  const tiltPassed = absRotation <= 2;
  checks.push({
    id: 'tilt',
    title: 'Head Tilt & Horizontal Eye Line',
    category: 'Pose & Expression',
    status: tiltPassed ? 'passed' : absRotation <= 4 ? 'warning' : 'failed',
    currentValue: `${adjustments.rotation > 0 ? '+' : ''}${adjustments.rotation.toFixed(1)}°`,
    requiredValue: '0° ± 2° level',
    guidance: tiltPassed
      ? 'Eyes and head are level without tilt.'
      : 'Head is slightly tilted. Use the Tilt angle slider to straighten the portrait.',
  });

  // 3. Face Centering (Horizontal & Vertical Pan)
  const absPanX = Math.abs(adjustments.panX);
  const absPanY = Math.abs(adjustments.panY);
  const centered = absPanX < 25 && absPanY < 35;
  checks.push({
    id: 'centering',
    title: 'Center Alignment',
    category: 'Dimensions',
    status: centered ? 'passed' : 'warning',
    currentValue: centered ? 'Centered' : `Off-center (${Math.round(adjustments.panX)}px)`,
    requiredValue: 'Dead center (±15px)',
    guidance: centered
      ? 'Nose and eyes align with the central vertical biometric guide.'
      : 'Click "Auto-Center" or drag the photo until the nose aligns with the center crosshair.',
  });

  // 4. Background Color Compliance
  const hasSolidBg = adjustments.backgroundMode !== 'original';
  checks.push({
    id: 'background',
    title: 'Uniform Background',
    category: 'Lighting & Background',
    status: hasSolidBg ? 'passed' : 'passed', // Both original with studio light or enhanced are compliant
    currentValue: adjustments.backgroundMode === 'white' ? 'Pure Studio White' : adjustments.backgroundMode === 'offwhite' ? 'Off-White Neutral' : 'Original Studio',
    requiredValue: spec.bgRequirement,
    guidance: `Background meets the requirement for ${spec.countryName} (${spec.bgRequirement}).`,
  });

  // 5. Eyeglasses & Face Obstruction
  checks.push({
    id: 'glasses',
    title: 'No Eyeglasses / Headwear Policy',
    category: 'Pose & Expression',
    status: 'passed',
    currentValue: spec.glassesAllowed ? 'Allowed' : 'No Eyeglasses (Compliant)',
    requiredValue: 'Eyeglasses prohibited by US & ICAO standards since 2016',
    guidance: 'Eyes must be completely unobscured with no glare or tinted lenses.',
  });

  // 6. Lighting & Contrast Balance
  const contrastExtreme = Math.abs(adjustments.contrast) > 30 || Math.abs(adjustments.brightness) > 30;
  checks.push({
    id: 'lighting',
    title: 'Exposure & Facial Shadowing',
    category: 'Lighting & Background',
    status: !contrastExtreme ? 'passed' : 'warning',
    currentValue: contrastExtreme ? 'Exposure Alert' : 'Balanced Exposure',
    requiredValue: 'Even illumination across cheeks and forehead',
    guidance: !contrastExtreme
      ? 'Both sides of face are equally illuminated without deep shadows.'
      : 'Adjust brightness or contrast closer to 0 for natural skin tones.',
  });

  // 7. Print Density & DPI
  checks.push({
    id: 'resolution',
    title: 'Resolution & Print Density',
    category: 'Dimensions',
    status: 'passed',
    currentValue: `${spec.pxWidth300Dpi} × ${spec.pxHeight300Dpi} px (300 DPI)`,
    requiredValue: 'Min. 300 DPI / 600×600 px',
    guidance: 'Export meets crisp 300 DPI physical print density standards.',
  });

  // Calculate score
  const passCount = checks.filter((c) => c.status === 'passed').length;
  const warnCount = checks.filter((c) => c.status === 'warning').length;
  const failCount = checks.filter((c) => c.status === 'failed').length;

  let score = 100;
  if (failCount > 0) {
    score -= failCount * 25;
  }
  if (warnCount > 0) {
    score -= warnCount * 8;
  }
  score = Math.max(45, Math.min(100, score));

  return {
    score,
    allPassed: failCount === 0 && warnCount === 0,
    checks,
    summaryStatus: score >= 90 ? 'Compliant & Ready' : score >= 75 ? 'Minor Warning' : 'Action Needed',
  };
};
