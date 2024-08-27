'use client';
import { SaebrsSummary } from '@/app/ui/dashboard/cards/population/saebrs-summary';
import { CardDisciplinarySummary } from '@/app/ui/dashboard/cards/population/disciplinary-summary';
import { CardTestScoreSummary } from '@/app/ui/dashboard/cards/population/test-scores-summary';
import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useState } from 'react';
import { CardThreeValue } from '@/app/ui/dashboard/cards/general/card-three-value';
import useGradeLevel from '@/hooks/useGradeLevel';
import { useSearchContext } from '@/app/context/nav-search-context';
import useRiskOptions from '@/hooks/useRiskOptions';
import { Card } from '@nextui-org/react';
import { ethnicity, genders, ell } from '@/constants/constants';
import GradeSearchInputOnly from '@/app/ui/dashboard/cards/search/grade-search-input';
import GradeSearch from '@/app/ui/dashboard/cards/search/grade-search-card';
import useSchoolLevel from '@/hooks/useSchoolLevel';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { getGradeRiskValues, getSchoolRiskValues } from '@/app/lib/get-risk-values';
import { ChartGroup } from '@/app/ui/charts/chart-group';
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
  const gradeLevel = useGradeLevel();
  console.log(gradeLevel)
  const grade = useSearchContext('grade');
  const selectedGrade = grade.get;

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

  // Stops proceeding to dashboard before uploading data
  const schoolLevel = useSchoolLevel();
  if (schoolLevel.listOfAllStudents === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div>Please upload all of the data files first.</div>
      </div>
    );
  }

  // Stops proceeding to dashboard before selecting a grade level
  if (!selectedGrade) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div>Please enter a grade to view the dashboard.</div>
        <div className="w-1/4">
          <GradeSearchInputOnly
            selectedGrade={selectedGrade}
            setSelectedGrade={grade.set}
            gradeList={Object.keys(gradeLevel.mySaebrsAcademic).map(
              (grade) => grade,
            )}
          />
        </div>
      </div>
    );
  }

  if (gradeLevel.mySaebrsAcademic[selectedGrade] === undefined) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div>
          The grade is not available and please enter a different grade to view
          the dashboard.
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="flex h-full gap-4">
        {/* LEFT COL */}
        <div className="mb-4 flex basis-1/5 flex-col">
          <div className="flex flex-col gap-3 ">
            <GradeSearch
              selectedGrade={selectedGrade}
              setSelectedGrade={grade.set}
              gradeList={Object.keys(gradeLevel.mySaebrsAcademic).map(
                (grade) => grade,
              )}
              classList={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']}
            />

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
                missingVariables={1}
                confidence={3}
                confidenceThresholds={[1, 2, 3, 4, 5]}
              />
            </div>

            <div className="">
              <CardDisciplinarySummary
                title={'Disciplinary Action Summary'}
                valuesTop={['76%', '24%']}
                subtitlesTop={['Zero', 'One Plus']}
                valuesBottom={['21%', '79%']}
                subtitlesBottom={['Zero', 'One Plus']}
              />
            </div>

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
                saebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'saebrsSocial')}
                mySaebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'mySaebrsSocial')}
              />
            </div>
            <div className="basis-1/4">
              <SaebrsSummary
                title={'Academic'}
                saebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'saebrsAcademic')}
                mySaebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'mySaebrsAcademic')}
              />
            </div>
            <div className="basis-1/4">
              <SaebrsSummary
                title={'Emotional'}
                saebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'saebrsEmotional')}
                mySaebrsValues={getGradeRiskValues(gradeLevel, selectedGrade, 'mySaebrsEmotional')}
              />
            </div>
          </div>

          <ChartGroup ethnicityData={ethnicity} ellData={ell} genderData={genders}/>
        </div>
      </div>
    </main>
  );
}
