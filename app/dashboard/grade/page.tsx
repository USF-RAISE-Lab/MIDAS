// grade/page.tsx

'use client';

import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useEffect, useState } from 'react';
import { Card } from '@nextui-org/react';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import { RiskCardWithConfidence } from '@/app/ui/dashboard/risk-confidence-card';
import GradeSearch from '@/app/ui/dashboard/cards/search/grade-search-card';
import { GetGradeOptions } from '@/action/getGradeOptions';
import { GetClassroomOptions } from '@/action/getClassroomOptions';
import { getSession, useSession } from 'next-auth/react';


export default function Page() {
  const { data: session } = useSession();

  const midasStore = useMidasStore();

  const [schoolid, setSchoolid] = useState<number>(0);

  const [gradeData, setGradeData] = useState<SchoolData[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  // todo)) Add check for if there are no grades available
  const [gradeSearch, setGradeSearch] = useState<number>(GetGradeOptions(schoolData!)[0]);


  useEffect(() => {
    const getSchoolId = async () => {
      let session = await getSession();
      setSchoolid(session?.user.school_id);
    }

    getSchoolId()

    const school = midasStore.getStudentsBySchoolId(schoolid);
    console.log("Student data:", school);

    setSchoolData(school);
  }, [midasStore, schoolid]);

  useEffect(() => {
    if (schoolData.length === 0) return; // Wait until schoolData is loaded

    // If gradeSearch is undefined, set it to the first available grade
    if (gradeSearch === undefined) {
      const availableGrades = GetGradeOptions(schoolData);
      if (availableGrades.length > 0) {
        setGradeSearch(availableGrades[0]);
      }
    }

    // Fetch grade-specific data when gradeSearch is available
    const grade = midasStore.getStudentsByGradeLevel(schoolid, gradeSearch);
    console.log("Grade search:", gradeSearch);
    console.log("Loaded grade level student data:", grade);

    setGradeData(grade);
  }, [midasStore, schoolData, schoolid, gradeSearch]);



  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(gradeData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(gradeData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(gradeData!, 'student'),

    midasConfidence: calculateModeConfidence(gradeData!, 'midas'), // example value

    odrPercentages: calculateOccurancePercentages(gradeData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(gradeData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(gradeData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(gradeData!, 'read_f'),

    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'white'),
      hispanic: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'hispanic'),
      other: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'other poc'),
    },
    ellRiskPercentages: {
      ell: calculateRiskByDemographic(gradeData!, 'midas', 'ell', 'yes'),
      nonEll: calculateRiskByDemographic(gradeData!, 'midas', 'ell', 'no'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(gradeData!, 'midas', 'gender', 'male'),
      female: calculateRiskByDemographic(gradeData!, 'midas', 'gender', 'female'),
    },
  };

  console.log("CONFIDENCE")
  console.log(dashboardData.midasConfidence)

  return (
    <main className='lg:max-h-[90vh] grid max-md:grid-cols-1 max-md:grid-rows-none max-lg:grid-cols-2 lg:grid-cols-4 max-lg:grid-rows-1 lg:grid-rows-6 gap-4'>
      <GradeSearch selectedGrade={gradeSearch} setSelectedGrade={setGradeSearch} gradeList={GetGradeOptions(schoolData!)} classList={GetClassroomOptions(gradeData!)} />

      {/* Row 1 */}
      <RiskCardWithConfidence
        title={'MIDAS Main Risk'}
        assessments={[
          {
            name: '',
            values: [dashboardData.midasRiskPercentages.low, dashboardData.midasRiskPercentages.some, dashboardData.midasRiskPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: MidasRiskScoreTooltip()
          },
        ]}
        confidence={dashboardData.midasConfidence!}
        className=''
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
        className='lg:row-span-2 max-lg:order-5 lg:order-5'
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
        className='lg:row-span-2 lg:order-last'
      />

      <Card
        className="rounded-xl bg-neutral-50 max-lg:order-last max-md:col-span-1 max-lg:col-span-2 lg:row-span-5 lg:order-6"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">
          Ethnicity and Risk
        </p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of risk for each ethnicity
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10 ">
          <MyBarChart data={dashboardData.ethnicityRiskPercentages} />
        </div>
      </Card>

      <Card
        className="rounded-xl bg-neutral-50 max-lg:order-last max-md:col-span-1 max-lg:col-span-2 lg:row-span-5 lg:order-7"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">
          English Learner and Risk
        </p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of risk for English fluency status
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={dashboardData.ellRiskPercentages} />
        </div>
      </Card>

      <Card
        className="rounded-xl bg-neutral-50 max-lg:order-last max-md:col-span-1 max-lg:col-span-2 lg:row-span-5 lg:order-8"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">Gender and Risk</p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of risk for each gender
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={dashboardData.genderRiskPercentages} />
        </div>
      </Card>
    </main>
  );
}
