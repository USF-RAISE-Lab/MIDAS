import { create } from 'zustand';

interface GradeLevelStore {
  listOfAllStudents: any;
  confidenceLevel: number;

  saebrsEmotional: any;
  mySaebrsEmotional: any;
  saebrsAcademic: any;
  mySaebrsAcademic: any;
  saebrsSocial: any;
  mySaebrsSocial: any;

  riskMath: string;
  riskReading: string;

  riskODR: string;
  riskSuspension: string;

  genderRisk: string;
  ethnicityRisk: string;
  ellRisk: string;
  
  setConfidenceLevel: (confidence: number) => void;
  setlistOfAllStudents: (students: any) => void;

  setSaebrsEmotional: (emo: JSON) => void;
  setMySaebrsEmotional: (emo: JSON) => void;
  setSaebrsAcademic: (academic: JSON) => void;
  setMySaebrsAcademic: (academic: JSON) => void;
  setSaebrsSocial: (social: JSON) => void;
  setMySaebrsSocial: (social: JSON) => void;

  setRiskMath: (math: string) => void;
  setRiskReading: (reading: string) => void;

  setRiskSuspension: (susp: string) => void;
  setRiskODR: (odr: string) => void;

  setGenderRisk: (gender: string) => void;
  setEthnicityRisk: (ethnicity: string) => void;
  setEllRisk: (ell: string) => void;
}

const useGradeLevel = create<GradeLevelStore>((set: any) => ({
  listOfAllStudents: undefined,
  confidenceLevel: 0,

  saebrsEmotional: '',
  mySaebrsEmotional: '',
  saebrsAcademic: '',
  mySaebrsAcademic: '',
  saebrsSocial: '',
  mySaebrsSocial: '',

  riskMath: '',
  riskReading: '',

  riskODR: '',
  riskSuspension: '',

  genderRisk: '',
  ethnicityRisk: '',
  ellRisk: '',

  setConfidenceLevel: (confidence: number) => set({ confidenceLevel: confidence }),
  setlistOfAllStudents: (students: any) => set({ listOfAllStudents: students }),

  setSaebrsEmotional: (emo: JSON) => set({ saebrsEmotional: emo }),
  setMySaebrsEmotional: (emo: JSON) => set({ mySaebrsEmotional: emo }),
  setSaebrsAcademic: (academic: JSON) => set({ saebrsAcademic: academic }),
  setMySaebrsAcademic: (academic: JSON) => set({ mySaebrsAcademic: academic }),
  setSaebrsSocial: (social: JSON) => set({ saebrsSocial: social }),
  setMySaebrsSocial: (social: JSON) => set({ mySaebrsSocial: social }),

  setRiskMath: (math: string) => set({ riskMath: math }),
  setRiskReading: (reading: string) => set({ riskReading: reading }),

  setRiskODR: (odr: string) => set({ riskODR: odr }),
  setRiskSuspension: (susp: string) => set({ riskSuspension: susp }),

  setGenderRisk: (gender: string) => set({ genderRisk: gender }),
  setEthnicityRisk: (ethnicity: string) => set({ ethnicityRisk: ethnicity }),
  setEllRisk: (ell: string) => set({ ellRisk: ell }),
}));

export default useGradeLevel;
