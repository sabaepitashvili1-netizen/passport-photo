export interface SamplePortrait {
  id: string;
  name: string;
  description: string;
  dataUrl: string;
  initialAdjustments?: {
    zoom: number;
    panX: number;
    panY: number;
    rotation: number;
  };
}

// Crisp, high-resolution SVG portrait vector data URIs designed specifically for passport biometric testing
const createSampleSvg = (
  skinColor: string,
  hairColor: string,
  hairStyle: 'short' | 'long' | 'curly',
  shirtColor: string,
  eyebrowColor: string,
  eyeColor: string,
  glasses: boolean = false
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#F6F5FA" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#261569" flood-opacity="0.08" />
      </filter>
    </defs>
    <!-- Background -->
    <rect width="600" height="600" fill="url(#bgGrad)" />
    
    <!-- Torso / Shoulders with formal collared clothes -->
    <path d="M 120 600 C 140 450, 210 400, 300 400 C 390 400, 460 450, 480 600 Z" fill="${shirtColor}" filter="url(#softShadow)" />
    <!-- Collar & Necktie / Lapel details -->
    <path d="M 260 400 L 300 470 L 340 400 Z" fill="#FFFFFF" />
    <path d="M 285 430 L 300 600 L 315 430 Z" fill="#261569" opacity="0.8" />
    
    <!-- Neck -->
    <path d="M 255 330 L 255 420 Q 300 440 345 420 L 345 330 Z" fill="${skinColor}" />
    <path d="M 255 370 Q 300 400 345 370" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4" />

    ${hairStyle === 'long' ? `
      <!-- Back hair behind shoulders -->
      <path d="M 170 240 C 170 380, 200 470, 240 500 C 220 440, 210 320, 220 250 Z" fill="${hairColor}" />
      <path d="M 430 240 C 430 380, 400 470, 360 500 C 380 440, 390 320, 380 250 Z" fill="${hairColor}" />
    ` : ''}

    <!-- Head / Face Oval -->
    <ellipse cx="300" cy="275" rx="108" ry="142" fill="${skinColor}" filter="url(#softShadow)" />
    
    <!-- Ears -->
    <ellipse cx="188" cy="285" rx="15" ry="26" fill="${skinColor}" />
    <ellipse cx="412" cy="285" rx="15" ry="26" fill="${skinColor}" />
    <path d="M 188 275 Q 194 285 188 295" stroke="rgba(0,0,0,0.15)" stroke-width="2.5" fill="none" />
    <path d="M 412 275 Q 406 285 412 295" stroke="rgba(0,0,0,0.15)" stroke-width="2.5" fill="none" />

    <!-- Eyes (Looking straight ahead, biometric level) -->
    <!-- Left Eye -->
    <ellipse cx="255" cy="270" rx="18" ry="10" fill="#FFFFFF" />
    <ellipse cx="255" cy="270" rx="8" ry="8" fill="${eyeColor}" />
    <circle cx="255" cy="270" r="4.5" fill="#111111" />
    <circle cx="257" cy="268" r="2" fill="#FFFFFF" />
    <path d="M 234 269 Q 255 258 276 269" stroke="#222" stroke-width="2" fill="none" />
    
    <!-- Right Eye -->
    <ellipse cx="345" cy="270" rx="18" ry="10" fill="#FFFFFF" />
    <ellipse cx="345" cy="270" rx="8" ry="8" fill="${eyeColor}" />
    <circle cx="345" cy="270" r="4.5" fill="#111111" />
    <circle cx="347" cy="268" r="2" fill="#FFFFFF" />
    <path d="M 324 269 Q 345 258 366 269" stroke="#222" stroke-width="2" fill="none" />

    <!-- Eyebrows (Horizontal, neutral) -->
    <path d="M 232 250 Q 255 242 276 250" stroke="${eyebrowColor}" stroke-width="5" stroke-linecap="round" fill="none" />
    <path d="M 324 250 Q 345 242 368 250" stroke="${eyebrowColor}" stroke-width="5" stroke-linecap="round" fill="none" />

    <!-- Nose (Centered) -->
    <path d="M 300 262 L 297 312 Q 300 318 306 314" stroke="rgba(60,47,128,0.25)" stroke-width="3" fill="none" stroke-linecap="round" />
    <ellipse cx="291" cy="316" rx="4" ry="2" fill="rgba(0,0,0,0.15)" />
    <ellipse cx="309" cy="316" rx="4" ry="2" fill="rgba(0,0,0,0.15)" />

    <!-- Mouth (Neutral, closed expression) -->
    <path d="M 276 354 Q 300 357 324 354" stroke="#8A4A48" stroke-width="3.5" fill="none" stroke-linecap="round" />
    <path d="M 284 353 Q 300 348 316 353" stroke="rgba(180,90,90,0.4)" stroke-width="4" fill="none" />
    <path d="M 282 358 Q 300 366 318 358" stroke="rgba(180,90,90,0.3)" stroke-width="3.5" fill="none" />

    <!-- Hair Styles -->
    ${hairStyle === 'short' ? `
      <!-- Modern neat short hair -->
      <path d="M 190 240 C 190 150, 240 120, 300 120 C 360 120, 410 150, 410 240 C 400 200, 370 170, 300 170 C 230 170, 200 200, 190 240 Z" fill="${hairColor}" />
      <path d="M 194 220 Q 230 180 300 185 Q 370 180 406 220" fill="none" stroke="${hairColor}" stroke-width="8" />
    ` : hairStyle === 'curly' ? `
      <!-- Curly full volume hair -->
      <path d="M 180 250 C 160 180, 200 110, 300 110 C 400 110, 440 180, 420 250 C 410 190, 360 160, 300 160 C 240 160, 190 190, 180 250 Z" fill="${hairColor}" />
      <circle cx="210" cy="180" r="30" fill="${hairColor}" />
      <circle cx="260" cy="140" r="34" fill="${hairColor}" />
      <circle cx="340" cy="140" r="34" fill="${hairColor}" />
      <circle cx="390" cy="180" r="30" fill="${hairColor}" />
    ` : `
      <!-- Sleek shoulder length hair -->
      <path d="M 185 240 C 185 140, 240 118, 300 118 C 360 118, 415 140, 415 240 C 410 190, 360 165, 300 165 C 240 165, 190 190, 185 240 Z" fill="${hairColor}" />
      <path d="M 185 230 C 180 290, 190 350, 205 380 C 215 320, 210 260, 205 230 Z" fill="${hairColor}" />
      <path d="M 415 230 C 420 290, 410 350, 395 380 C 385 320, 390 260, 395 230 Z" fill="${hairColor}" />
    `}

    ${glasses ? `
      <!-- Glasses (Used for demonstrating non-compliant warning) -->
      <rect x="230" y="258" width="50" height="26" rx="4" fill="none" stroke="#333" stroke-width="3.5" />
      <rect x="320" y="258" width="50" height="26" rx="4" fill="none" stroke="#333" stroke-width="3.5" />
      <line x1="280" y1="268" x2="320" y2="268" stroke="#333" stroke-width="3" />
    ` : ''}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_PORTRAITS: SamplePortrait[] = [
  {
    id: 'elena-compliant',
    name: 'Elena Rostova',
    description: '100% Ideal Biometric Pose (Compliant with US & ICAO standards)',
    dataUrl: createSampleSvg(
      '#F9DCB8', // warm fair skin
      '#362215', // dark brunette
      'long',
      '#261569', // Twilight blue collar
      '#2B1B10',
      '#3A4D39' // hazel green eyes
    ),
    initialAdjustments: { zoom: 1.05, panX: 0, panY: 0, rotation: 0 },
  },
  {
    id: 'marcus-short',
    name: 'Marcus Chen',
    description: 'Standard Professional Passport Pose (Even lighting, clean collar)',
    dataUrl: createSampleSvg(
      '#EED0A6', // medium tan
      '#1C1B20', // black hair
      'short',
      '#34495E', // slate suit
      '#1C1B20',
      '#2C2523' // dark eyes
    ),
    initialAdjustments: { zoom: 1.0, panX: 0, panY: 0, rotation: 0 },
  },
  {
    id: 'sarah-curly',
    name: 'Sarah Adebayo',
    description: 'High Contrast Neutral Portrait (Sharp eyes & clean shoulders)',
    dataUrl: createSampleSvg(
      '#7F4C2A', // deep rich skin
      '#151318', // rich dark hair
      'curly',
      '#6C3483', // plum collar
      '#151318',
      '#2B1A0E'
    ),
    initialAdjustments: { zoom: 1.02, panX: 0, panY: 0, rotation: 0 },
  },
  {
    id: 'david-tilted',
    name: 'David Miller (Need Tuning)',
    description: 'Slightly Tilted (Test the angle slider and auto-centering)',
    dataUrl: createSampleSvg(
      '#FCD9BE',
      '#7A4B27', // chestnut
      'short',
      '#1B4F72',
      '#6B3E1C',
      '#2980B9'
    ),
    initialAdjustments: { zoom: 1.0, panX: 18, panY: -12, rotation: 3.5 },
  },
];
