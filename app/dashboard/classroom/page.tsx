// classroom/page.tsx

'use client';

import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useEffect, useState } from 'react';
import { Card } from '@nextui-org/react';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import ClassSearch from '@/app/ui/dashboard/cards/search/class-search-card';
import { GetClassroomOptions } from '@/action/getClassroomOptions';
import { RiskCardWithConfidence } from '@/app/ui/dashboard/risk-confidence-card';
import { getSession, useSession } from 'next-auth/react';
import { SearchContext } from '@/app/context/nav-search-context';
import { useRouter, useSearchParams } from 'next/navigation';


export default function Page() {
  const midasStore = useMidasStore();

  const [schoolid, setSchoolid] = useState<number>(0);

  const [classData, setClassData] = useState<SchoolData[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  const searchParams = useSearchParams();
  const classSearchParam = searchParams.get("classroom");

  const [selectedClass, setSelectedClass] = useState<string>(classSearchParam !== undefined ? classSearchParam! : schoolData.map(student => student.classroom)[0]);

  useEffect(() => {
    const classroom = midasStore.getStudentsByClassroom(schoolid, selectedClass);

    const getSchoolId = async () => {
      let session = await getSession();
      setSchoolid(session?.user.school_id);
    }

    getSchoolId()

    const school = midasStore.getStudentsBySchoolId(schoolid);
    console.log("Student data:", school);

    setSchoolData(school);
    //if (classroomSearch === undefined) {
    //  setGradeSearch(GetGradeOptions(schoolData!)[0]);
    //}

    setSchoolData(school)
    setClassData(classroom);
  }, [midasStore, selectedClass, schoolid]);

  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(classData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(classData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(classData!, 'student'),

    midasConfidence: calculateModeConfidence(classData!, 'midas'), // example value

    odrPercentages: calculateOccurancePercentages(classData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(classData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(classData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(classData!, 'read_f'),

    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'white'),
      hispanic: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'hispanic'),
      other: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'other poc'),
    },
    ellRiskPercentages: {
      ell: calculateRiskByDemographic(classData!, 'midas', 'ell', 'yes'),
      nonEll: calculateRiskByDemographic(classData!, 'midas', 'ell', 'no'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(classData!, 'midas', 'gender', 'male'),
      female: calculateRiskByDemographic(classData!, 'midas', 'gender', 'female'),
    },
  };

  console.log("CONFIDENCE")
  console.log(dashboardData.midasConfidence)

  return (
    <main className='lg:max-h-[90vh] grid max-md:grid-cols-1 max-md:grid-rows-none max-lg:grid-cols-2 lg:grid-cols-4 max-lg:grid-rows-1 lg:grid-rows-6 gap-4'>
      <ClassSearch
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classList={GetClassroomOptions(schoolData)}
        studentList={classData.map(student => student.studentid)}
      />

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
