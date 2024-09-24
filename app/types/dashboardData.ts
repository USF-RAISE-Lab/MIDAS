
interface RiskPercentage {
  low: number;
  some: number;
  high: number;
}

interface OccurancePercentage {
  zero: number;
  oneplus: number;
}

interface DashboardData {
  midasRiskPercentages: RiskPercentage;
  teacherRiskPercentages: RiskPercentage;
  studentRiskPercentages: RiskPercentage;

  midasConfidence: string | null;

  odrPercentages: OccurancePercentage;
  suspPercentages: OccurancePercentage;

  mathPercentages: RiskPercentage;
  readPercentages: RiskPercentage;

  ethnicityRiskPercentages: {
    white: RiskPercentage;
    hispanic: RiskPercentage;
    other: RiskPercentage;
  };
  ellRiskPercentages: {
    ell: RiskPercentage;
    nonEll: RiskPercentage;
  };
  genderRiskPercentages: {
    male: RiskPercentage;
    female: RiskPercentage;
  };
}

interface StudentDashboardData {
  midasRiskLabel: string;
  teacherRiskLabel: string;
  studentRiskLabel: string;

  midasCondfidence: string;

  odrLabel: string;
  suspLabel: string;

  ethnicity: string;
  ell: string;
  gender: string;
}
