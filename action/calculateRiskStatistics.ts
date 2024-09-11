import { SchoolData } from "@/hooks/useSchoolData";

export function calculateRiskPercentages(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher'
) {
  let lowRisk = 0;
  let someRisk = 0;
  let highRisk = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const riskLevel = student.risk?.[riskType]?.risklevel;
    if (riskLevel === 'Very Low to Mild') lowRisk++;
    if (riskLevel === 'Moderate') someRisk++;
    if (riskLevel === 'Marked') highRisk++;
  });

  return {
    low: (lowRisk / totalStudents) * 100,
    some: (someRisk / totalStudents) * 100,
    high: (highRisk / totalStudents) * 100,
    total: totalStudents,
  };
}


export function calculateOccurancePercentages(students: SchoolData[], label: 'odr_f' | 'susp_f') : OccurancePercentage {
  let zero = 0;
  let oneplus = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const occuranceLevel = student[label as keyof typeof student];
    
    if (occuranceLevel === 'Zero') zero++;
    if (occuranceLevel === 'One or More') oneplus++;
   
  });

  console.log("Calculated occurance percentages: " + zero.toString() + " " + oneplus.toString() + " " + totalStudents.toString())

  return {
    zero: (zero / totalStudents) * 100,
    oneplus: (oneplus / totalStudents) * 100
  };

}

export function calculateTestRiskPercentages(students: SchoolData[], label: 'math_f' | 'read_f') : {low: number, some: number, high: number, total: number} {
  
  let lowRisk = 0;
  let someRisk = 0;
  let highRisk = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const riskLevel = student[label as keyof typeof student];
    if (riskLevel === 'Low Risk') lowRisk++;
    if (riskLevel === 'Some Risk') someRisk++;
    if (riskLevel === 'High Risk') highRisk++;
  });

  return {
    low: (lowRisk / totalStudents) * 100,
    some: (someRisk / totalStudents) * 100,
    high: (highRisk / totalStudents) * 100,
    total: totalStudents,
  };
}

// You can extend this function to add filters for gender, ethnicity, etc.
export function calculateRiskByDemographic(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher',
  demographicKey: keyof SchoolData, // e.g., 'gender', 'ethnicity'
  demographicValue: string
) {
  const filteredStudents = students.filter(student => student[demographicKey] === demographicValue);
  return calculateRiskPercentages(filteredStudents, riskType);
}

export function calculateModeConfidence(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher',
)  {

  let frequency = {
    'Low': 0,
    'Moderate': 0,
    'High': 0
  }

  const lowLabel = 'Low';
  const midLabel = 'Moderate';
  const highLabel = 'High';

  students.forEach((student: SchoolData) => {
    if (student.risk![riskType]!.confidence === lowLabel) {
      frequency['Low']++;
    }
    else if (student.risk![riskType]!.confidence === midLabel) {
      frequency['Moderate']++;
    }
    else if (student.risk![riskType]!.confidence === highLabel) {
      frequency['High']++;
    }
  });

  // Cringe typescript moment
  let maxKey: keyof typeof frequency | null = null;
  let maxValue = 0;
  
  for (const key in frequency) {
    if (frequency[key as keyof typeof frequency] > maxValue) {
      maxValue++;
      maxKey = key as keyof typeof frequency;
    }
  }

  return maxKey;
}


