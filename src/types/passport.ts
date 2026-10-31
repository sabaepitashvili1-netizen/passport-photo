export interface CountrySpec {
  id: string;
  countryName: string;
  countryCode: string; // ISO 2-letter
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East & Africa';
  documentType: string;
  widthMm: number;
  heightMm: number;
  widthInches: number;
  heightInches: number;
  pxWidth300Dpi: number;
  pxHeight300Dpi: number;
  headSizeMinMm: number;
  headSizeMaxMm: number;
  headSizePercentMin: number; // e.g. 50
  headSizePercentMax: number; // e.g. 69
  eyeHeightMinMm: number;
  bgRequirement: string;
  bgHex: string;
  glassesAllowed: boolean;
  officialStandard: string;
  sheetCount: number; // How many fit on 4x6 sheet
  popular?: boolean;
}

export interface PhotoAdjustments {
  zoom: number; // 0.8 to 2.5
  panX: number; // pixels
  panY: number; // pixels
  rotation: number; // -15 to +15 deg
  brightness: number; // -40 to +40
  contrast: number; // -40 to +40
  backgroundMode: 'original' | 'white' | 'offwhite' | 'lightgray';
  showBiometricGuide: boolean;
}

export interface ComplianceCheck {
  id: string;
  title: string;
  category: 'Dimensions' | 'Pose & Expression' | 'Lighting & Background' | 'Biometrics';
  status: 'passed' | 'warning' | 'failed';
  currentValue: string;
  requiredValue: string;
  guidance: string;
}

export interface PostalOrderInfo {
  paperFinish: 'matte' | 'lustre';
  quantity: number;
  price: number;
  recipientName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  shippingMethod: 'standard' | 'priority' | 'express';
  trackingNumber?: string;
  orderId?: string;
}
