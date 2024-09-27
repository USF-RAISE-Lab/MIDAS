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
    const school = midasStore.getStudentById(schoolid, "6A_132");
    console.log("Student data:", school);

    setSchoolData(school);
  }, [midasStore, schoolid]);

  const student = schoolData.pop();

  const dashboardData: StudentDashboardData = {
    midasRiskLabel: student?.risk.midas?.risklevel || "NA",
    teacherRiskLabel: student?.risk.teacher?.risklevel || "NA",
    studentRiskLabel: student?.risk.student?.risklevel || "NA",
    midasConfidence: student?.risk.midas?.confidence || "NA",
    odrLabel: student?.odr_f || "NA",
    suspLabel: student?.susp_f || "NA",
    ethnicity: student?.ethnicity || "NA",
    ell: student?.ell || "NA",
    gender: student?.gender || "NA"
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
    <main className="flex flex-col w-[50%] gap-4 mx-auto">

      <RiskCard
        title={'MIDAS Main Risk'}
        assessments={[
          {
            name: '',
            values: [],
            labels: [],
            tooltipContent: MidasRiskScoreTooltip()
          },
        ]}
        className="max-h-64"
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
            values: [dashboardData.teacherRiskLabel],
            labels: [],
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
            values: [],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'Sub risk'
          },
        ]}
        className=""
      />

      {/* Row 2 */}
      <RiskCard
        title={'Discipline Summary'}
        assessments={[
          {
            name: 'ODR',
            values: [],
            labels: ['Zero', 'One +'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Suspensions',
            values: [],
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
            values: [],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Reading',
            values: [],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: ''
          }
        ]}
        className=""
      />

    </main>

  );
}
