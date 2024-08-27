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

function MidasRiskTooltipContent() {
  return (
    <div>Percentages of students at the three different MIDAS risk levels.</div>
  );
}

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
    <main>
      <div className="flex gap-4">
        {/* LEFT COL */}

        <div className="mb-4 flex basis-1/5 flex-col">
          <div className="flex flex-col gap-3 ">
            {/* <Card className="w-full bg-neutral-100" shadow="md">
              <CardHeader className='z-0'>
                <h3 className="text-lg font-medium text-slate-800">
                  Currently viewing school page{' '}
                </h3>
              </CardHeader>
            </Card> */}


            <div className="">
              <CardThreeValue
                title="MIDAS Risk Scores"
                values={[
                  midasRisk['low'],
                  midasRisk['some'],
                  midasRisk['high'],
                ]}
                subtitles={['Low', 'Some', 'High']}
                tooltip={MidasRiskTooltipContent()}
              />
            </div>

            <div className="">
              <CardConfidenceVisualizer
                missingVariables={0}
                confidence={3}
                confidenceThresholds={[1, 2, 3, 4, 5]}
              />
            </div>


            <RiskCard 
              title={'Discipline'} 
              assessments={[
                {
                  name: 'ODR',
                  values: [1, 2, 5],
                  labels: ['a', 'b', 'c', 'd'],
                  tooltipText: 'ODR Tooltip test'
                },
              ]}                
            />

            <div className="-mb-8">
              <CardTestScoreSummary
                title={'Test Score Risk Summary'}
                valuesTop={['60%', '40%']}
                subtitlesTop={['Low', 'Some']}
                valuesBottom={['55%', '45%']}
                subtitlesBottom={['Low', 'Some']}
              />
            </div>
          </div>
        </div>
        {schoolLevel?.saebrsEmotional && (
          <div className="h-full w-full basis-4/5 flex-col">
            <div className="-mb-8 flex w-full flex-row gap-3">
              <div className="basis-1/4">
                <SaebrsSummary
                  title={'Total'}
                  saebrsValues={['N/A', 'N/A', 'N/A']}
                  mySaebrsValues={['N/A', 'N/A', 'N/A']}
                />
              </div>
              <div className="basis-1/4">
                <SaebrsSummary
                  title={'Social'}
                  saebrsValues={getSchoolRiskValues(schoolLevel, 'Saebrs', 'saebrsSocial')}
                  mySaebrsValues={getSchoolRiskValues(schoolLevel, 'MySaebrs', 'mySaebrsSocial')}
                />
              </div>
              <div className="basis-1/4">
                <SaebrsSummary
                  title={'Academic'}
                  saebrsValues={getSchoolRiskValues(schoolLevel, 'Saebrs', 'saebrsAcademic')}
                  mySaebrsValues={getSchoolRiskValues(schoolLevel, 'MySaebrs', 'mySaebrsAcademic')}
                />
              </div>
              <div className="basis-1/4">
                <SaebrsSummary
                  title={'Emotional'}
                  saebrsValues={getSchoolRiskValues(schoolLevel, 'Saebrs', 'saebrsEmotional')}
                  mySaebrsValues={getSchoolRiskValues(schoolLevel, 'MySaebrs', 'mySaebrsEmotional')}
                />
              </div>
            </div>

            <ChartGroup ethnicityData={ethnicity} ellData={ell} genderData={genders}/>
          </div>
        )}
      </div>
    </main>
  );
}
