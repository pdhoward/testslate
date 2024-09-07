'use client';
import { LicenseInfo } from '@mui/x-license';

const key = process.env.MUI_LICENSE_KEY 

  if (key) {
    LicenseInfo.setLicenseKey(key);
  }

export default function MuiXLicense() {
  return null;
}
