// student/page.ts

'use client';

import { useEffect, useState } from 'react';
import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';

interface SearchProps {
  searchParams: {
    studentId: string;
  };
}

export default function Page({ searchParams }: SearchProps) {

  const schoolid = 1;
  const midasStore = useMidasStore();

  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  useEffect(() => {
    const school = midasStore.getStudentsByGradeLevel(schoolid, 7);
    console.log("Student data:", school);

    setSchoolData(school);
  }, [midasStore, schoolid]);

  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(schoolData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(schoolData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(schoolData!, 'student'),

    midasConfidence: calculateModeConfidence(schoolData!, 'midas'), // example value

    odrPercentages: calculateOccurancePercentages(schoolData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(schoolData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(schoolData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(schoolData!, 'read_f'),

    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'White'),
      hispanic: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'Hispanic'),
      other: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'Other POC'),
    },

    ellRiskPercentages: {
      ell: calculateRiskByDemographic(schoolData!, 'midas', 'ell', 'Yes'),
      nonEll: calculateRiskByDemographic(schoolData!, 'midas', 'ell', 'No'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(schoolData!, 'midas', 'gender', 'Male'),
      female: calculateRiskByDemographic(schoolData!, 'midas', 'gender', 'Female'),
    },
  };

  //handle export feature
  //const handleExport = async (listStudents: any) => {
  //  const result = await postData({
  //    url: 'https://midas-topaz.vercel.app/api/export',
  //    data: { listStudents },
  //  });
  //  const res = writeFile(result, 'students.xlsx', {
  //    compression: true,
  //    type: 'file',
  //  });
  //};
  return (
    <main className="grid grid-cols-2 grid-rows-5 max-w-[50%] mx-auto">

      <RiskCard
        title={'MIDAS Main Risk'}
        assessments={[
          {
            name: '',
            values: [dashboardData.midasRiskPercentages.low, dashboardData.midasRiskPercentages.some, dashboardData.midasRiskPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: MidasRiskScoreTooltip()
          },
        ]}
        className=""
      />
      <CardConfidenceVisualizer
        missingVariables={0}
        confidence={dashboardData.midasConfidence}
        confidenceThresholds={[1, 2, 3, 4, 5]}
        className=""
      />
      <RiskCard
        title={'Teacher Sub-Risk'}
        assessments={[
          {
            name: '',
            values: [dashboardData.studentRiskPercentages.low, dashboardData.studentRiskPercentages.some, dashboardData.studentRiskPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'Sub risk'
          },
        ]}
        className=''
      />
      <RiskCard
        title={'Student Sub-Risk'}
        assessments={[
          {
            name: '',
            values: [dashboardData.teacherRiskPercentages.low, dashboardData.teacherRiskPercentages.some, dashboardData.teacherRiskPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'Sub risk'
          },
        ]}
        className=''
      />

      {/* Row 2 */}
      <RiskCard
        title={'Discipline Summary'}
        assessments={[
          {
            name: 'ODR',
            values: [dashboardData.odrPercentages.zero, dashboardData.odrPercentages.oneplus],
            labels: ['Zero', 'One +'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Suspensions',
            values: [dashboardData.suspPercentages.zero, dashboardData.suspPercentages.oneplus],
            labels: ['Zero', 'One +'],
            tooltipContent: 'Suspensions'
          }
        ]}
        className=""
      />

      <RiskCard
        title={'Test Risk Scores'}
        assessments={[
          {
            name: 'Math',
            values: [dashboardData.mathPercentages.low, dashboardData.mathPercentages.some, dashboardData.mathPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Reading',
            values: [dashboardData.mathPercentages.low, dashboardData.mathPercentages.some, dashboardData.mathPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: ''
          }
        ]}
        className=""
      />

    </main>

  );
}
