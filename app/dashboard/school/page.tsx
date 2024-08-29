'use client';

import { SaebrsSummary } from '@/app/ui/dashboard/cards/population/saebrs-summary';
import { CardDisciplinarySummary } from '@/app/ui/dashboard/cards/population/disciplinary-summary';
import { CardTestScoreSummary } from '@/app/ui/dashboard/cards/population/test-scores-summary';
import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useState } from 'react';
import { CardThreeValue } from '@/app/ui/dashboard/cards/general/card-three-value';
import { Card, CardHeader } from '@nextui-org/react';
import useSchoolLevel from '@/hooks/useSchoolLevel';
import { ethnicity, genders, ell } from '@/constants/constants';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { registerables, Chart } from 'chart.js';
import { getSchoolRiskValues } from '@/app/lib/get-risk-values';
import { ChartGroup } from '@/app/ui/charts/chart-group';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';


export default function Page() {
  const schoolLevel = useSchoolLevel();
  console.log(schoolLevel);

  const [genderState, setGenderState] = useState({
    math_risk: false,
    read_risk: false,
    susp_risk: false,
  });

  const [ellState, setEllState] = useState({
    math_risk: false,
    read_risk: false,
    susp_risk: false,
  });
  const [midasRisk, setMidasRisk] = useState({
    low: '45%',
    some: '40%',
    high: '15%',
  });

  const getCurrentState = (states: any) => {
    const arr = Object.keys(states).filter((state: any) => {
      if (states[state]) return state;
    });

    if (arr) return arr[0];
    return undefined;
  };

  if (schoolLevel.listOfAllStudents === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div>Please upload all of the data files first.</div>
      </div>
    );
  }

  const genderRisk = getCurrentState(genderState);

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
