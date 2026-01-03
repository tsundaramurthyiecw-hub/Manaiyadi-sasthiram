
import { LandInfo, AyadiParameters } from '../types';
import { 
  AYADI_KARPAM_MAP, 
  AYADI_NATCHATHIRAM_MAP, 
  AYADI_THITHI_MAP, 
  AYADI_YONI_MAP,
  AYADI_AMSAM_MAP,
  AYADI_VAMSAM_MAP,
  AYADI_NETHIRAM_MAP,
  AYADI_SOOTHIRAM_MAP,
  AYADI_YOGAM_MAP,
  AYADI_PANJAGAM_MAP,
  AYADI_VAARAM_MAP
} from '../constants';

/**
 * Traditional Ayadi Calculations
 * Formulas are based on standard Manai Adi Sasthiram rules using the Kuzhi (area/9).
 */
export const calculateAyadi = (land: LandInfo): AyadiParameters => {
  const kuzhi = Math.floor(land.totalKuzhi);
  
  // 1. Varavu (Income): (Kuzhi * 8) % 12
  const varavu = ((kuzhi * 8) % 12) || 12;
  
  // 2. Selavu (Expense): (Kuzhi * 9) % 10
  const selavu = ((kuzhi * 9) % 10) || 10;
  
  // 3. Aayul (Longevity): (Kuzhi * 27) % 100
  const aayul = (kuzhi * 27) % 100;
  
  // 4. Natchathiram: (Kuzhi * 8) % 27
  const natchIndex = ((kuzhi * 8) % 27) || 27;
  const natchathiram = AYADI_NATCHATHIRAM_MAP[natchIndex - 1];
  
  // 5. Thithi: (Kuzhi * 9) % 30
  const thithiIndex = ((kuzhi * 9) % 30) || 30;
  const thithi = AYADI_THITHI_MAP[(thithiIndex - 1) % 15]; // Mapping to 15 standard lunar days
  
  // 6. Yoni: (Kuzhi * 3) % 8
  const yoniIndex = ((kuzhi * 3) % 8) || 8;
  const yoni = AYADI_YONI_MAP[yoniIndex - 1];
  
  // 7. Karpam: (Kuzhi * 8) % 12 -> then mapped to 4 types
  const karpamIndex = (varavu % 4);
  const karpam = AYADI_KARPAM_MAP[karpamIndex];

  // 8. Amsam: (Kuzhi * 4) % 9
  const amsamIndex = ((kuzhi * 4) % 9) || 9;
  const amsam = AYADI_AMSAM_MAP[amsamIndex - 1];

  // 9. Vamsam: (Kuzhi * 5) % 4
  const vamsamIndex = ((kuzhi * 5) % 4) || 4;
  const vamsam = AYADI_VAMSAM_MAP[vamsamIndex - 1];

  // 10. Nethiram: (Kuzhi * 6) % 3
  const nethiramIndex = ((kuzhi * 6) % 3) || 3;
  const nethiram = AYADI_NETHIRAM_MAP[nethiramIndex - 1];

  // 11. Soothiram: (Kuzhi * 7) % 4
  const soothiramIndex = ((kuzhi * 7) % 4) || 4;
  const soothiram = AYADI_SOOTHIRAM_MAP[soothiramIndex - 1];

  // 12. Yogam: (Kuzhi * 8) % 5
  const yogamIndex = ((kuzhi * 8) % 5) || 5;
  const yogam = AYADI_YOGAM_MAP[yogamIndex - 1];

  // 13. Vaaram: (Kuzhi * 9) % 7
  const vaaramIndex = ((kuzhi * 9) % 7) || 7;
  const vaaram = AYADI_VAARAM_MAP[vaaramIndex - 1];

  // 14. Panjagam: (Kuzhi * 10) % 5
  const panjagamIndex = ((kuzhi * 10) % 5) || 5;
  const panjagam = AYADI_PANJAGAM_MAP[panjagamIndex - 1];
  
  return {
    karpam,
    varavu,
    selavu,
    aayul,
    natchathiram,
    thithi,
    yoni,
    amsam,
    vamsam,
    nethiram,
    soothiram,
    yogam,
    vaaram,
    panjagam
  };
};
