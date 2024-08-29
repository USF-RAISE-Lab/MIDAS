'use client';

import { SaebrsSummary } from '@/app/ui/dashboard/cards/population/saebrs-summary';
import { CardDisciplinarySummary } from '@/app/ui/dashboard/cards/population/disciplinary-summary';
import { CardTestScoreSummary } from '@/app/ui/dashboard/cards/population/test-scores-summary';
import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useState } from 'react';
import { CardThreeValue } from '@/app/ui/dashboard/cards/general/card-three-value';
import useRiskOptions from '@/hooks/useRiskOptions';
import useClassLevel from '@/hooks/useClassLevel';
import { useSearchContext } from '@/app/context/nav-search-context';
import { Card } from '@nextui-org/react';
import { ethnicity, genders, ell } from '@/constants/constants';
import ClassSearch from '@/app/ui/dashboard/cards/search/class-search-card';
import ClassSearchInputOnly from '@/app/ui/dashboard/cards/search/class-search-input';
import useSchoolLevel from '@/hooks/useSchoolLevel';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { getClassRiskValues, getSchoolRiskValues } from '@/app/lib/get-risk-values';
import { ChartGroup } from '@/app/ui/charts/chart-group';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';

function MidasRiskTooltipContent() {
  return (
    <div>Percentages of students at the three different MIDAS risk levels.</div>
  );
}

export default function Page() {
  const [genderState, setGenderState] = useState({
    math_risk: false,
    read_risk: false,
    susp_risk: false,
  });
  const [ethnicityState, setEthnicityState] = useState({
    math_risk: false,
    read_risk: false,
    susp_risk: false,
  });

  const [ellState, setEllState] = useState({
    math_risk: false,
    read_risk: false,
    susp_risk: false,
  });
  const riskOptions = useRiskOptions();
  const classLevel = useClassLevel();
  console.log(classLevel);
  const classroom = useSearchContext('classroom');
  const selectedClass = classroom.get;

  const [midasRisk, setMidasRisk] = useState({
    low: '45%',
    some: '40%',
    high: '15%',
  });

  const [disciplineRisk, setDisciplineRisk] = useState({
    odrZero: '77%',
    odrSome: '23%',
    suspZero: '80%',
    suspSome: '20%',
  });

  // ASK SONJA WHAT THE VALUES FOR TEST RISK ARE
  const [testRisk, setTestRisk] = useState({});

  const [saebrsRisk, setSaebrsRisk] = useState({
    saebrsTotal: ['60%', '25%', '15%'],
    mySaebrsTotal: ['54%', '33%', '13%'],
    saebrsEmotional: ['59%', '33%', '8%'],
    mySaebrsEmotional: ['50%', '37%', '13%'],
    saebrsSocial: ['40%', '41%', '19%'],
    mySaebrsSocial: ['40%', '39%', '17%'],
    saebrsAcademic: ['72%', '16%', '12%'],
    mySaebrsAcademic: ['70%', '18%', '12%'],
  });

  const getCurrentState = (states: any) => {
    const arr = Object.keys(states).filter((state: any) => {
      if (states[state]) return state;
    });

    if (arr) return arr[0];
    return undefined;
  };

  const genderRisk = getCurrentState(genderState);
  const ellRisk = getCurrentState(ellState);
  const ethRisk = getCurrentState(ethnicityState);

  const schoolLevel = useSchoolLevel();
  if (schoolLevel.listOfAllStudents === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div>Please upload all of the data files first.</div>
      </div>
    );
  }

  // Stops proceeding to dashboard before selecting a classroom level
  if (!selectedClass) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div>Please enter a classroom ID to view the dashboard.</div>
        <div className="w-1/4">
          <ClassSearchInputOnly
            selectedClass={selectedClass}
            setSelectedClass={classroom.set}
          />
        </div>
      </div>
    );
  }

  // BUG - There should be a function that checks all variables because what if mySaebrsAcademic is just NA in the dataset?
  if (classLevel.mySaebrsAcademic[selectedClass] === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>
          The class is not available and please enter a different class to view
          the dashboard.
        </div>
      </div>
    );
  }

  return (
    <main className='lg:max-h-[90vh] grid max-md:grid-cols-1 max-md:grid-rows-none max-lg:grid-cols-2 lg:grid-cols-4 max-lg:grid-rows-1 lg:grid-rows-6 gap-4'>
      {/* Row 1 */}

      <RiskCard
        title={'MIDAS Main Risk'}
        assessments={[
          {
            name: '',
            values: ['33%', '33%', '33%'],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: MidasRiskScoreTooltip()
          },
        ]}
        className=''
      />
      <CardConfidenceVisualizer
        missingVariables={0}
        confidence={3}
        confidenceThresholds={[1, 2, 3, 4, 5]}
        className=''
      />
      <RiskCard
        title={'Teacher Sub-Risk'}
        assessments={[
          {
            name: '',
            values: ['33%', '33%', '33%'],
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
            values: ['33%', '33%', '33%'],
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
            values: ['33%', '33%'],
            labels: ['Zero', 'One +'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Suspensions',
            values: ['33%', '33%'],
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
            values: ['33%', '33%'],
            labels: ['Zero', 'One +'],
            tooltipContent: 'ODR'
          },
          {
            name: 'Reading',
            values: ['33%', '33%'],
            labels: ['Zero', 'One +'],
            tooltipContent: ''
          }
        ]}
        className='lg:row-span-2 lg:order-9'
      />

      <ClassSearch
        selectedClass={selectedClass}
        setSelectedClass={classroom.set}
        studentList={['6A_129', '6A_251', '6B_151', '6H_194']}
        className='lg:order-last order-first max-lg:col-span-full'
      />

      <Card
        className="rounded-xl bg-neutral-50 max-lg:order-last max-md:col-span-1 max-lg:col-span-2 lg:row-span-5 lg:order-6"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">
          Ethnicity and Risk
        </p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of those at risk for each ethnicity
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10 ">
          <MyBarChart data={Object.keys(ethnicity).map((ele: any) => ({
            label: ele,
            highRisk: ethnicity[ele]['High Risk'],
            someRisk: ethnicity[ele]['Some Risk'],
            lowRisk: ethnicity[ele]['Low Risk'],
          }))} />
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
          Distribution of those at risk for English learners and speakers
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={Object.keys(ell).map((ele: any) => ({
            label: ele,
            highRisk: ell[ele]['High Risk'],
            someRisk: ell[ele]['Some Risk'],
            lowRisk: ell[ele]['Low Risk'],
          }))} />
        </div>
      </Card>

      <Card
        className="rounded-xl bg-neutral-50 max-lg:order-last max-md:col-span-1 max-lg:col-span-2 lg:row-span-5 lg:order-8"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">Gender and Risk</p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of those at risk for each gender
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={Object.keys(genders).map((ele: any) => ({
            label: ele,
            highRisk: genders[ele]['High Risk'],
            someRisk: genders[ele]['Some Risk'],
            lowRisk: genders[ele]['Low Risk'],
          }))} />
        </div>
      </Card>
    </main>

  );
}
