import { Card } from "@nextui-org/react";
import MyBarChart from "./bar-chart";

export function ChartGroup({
  ethnicityData,
  ellData,
  genderData
}: {
  ethnicityData: any[];
  ellData: any[];
  genderData: any[];
}) {
  return (
    <div className="mt-16 mb-0 flex grow justify-between gap-2">
      {/* ----- Ethnicity Chart Card ----- */}
      <Card
        className="basis-1/3 h-[65vh] -mt-4 flex  rounded-xl bg-neutral-100"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">
          Ethnicity and Risk
        </p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of those at risk for each ethnicity
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10 ">
          <MyBarChart data={Object.keys(ethnicityData).map((ele: any) => ({
            label: ele,
            highRisk: ethnicityData[ele]['High Risk'],
            someRisk: ethnicityData[ele]['Some Risk'],
            lowRisk: ethnicityData[ele]['Low Risk'],
          }))} />
        </div>
      </Card>

      {/* ----- English Learner Chart Card ----- */}
      <Card
        className="basis-1/3 h-[65vh] -mt-4 flex rounded-xl bg-neutral-100"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">
          English Learner and Risk
        </p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of those at risk for English learners and speakers
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={Object.keys(ellData).map((ele: any) => ({
            label: ele,
            highRisk: ellData[ele]['High Risk'],
            someRisk: ellData[ele]['Some Risk'],
            lowRisk: ellData[ele]['Low Risk'],
          }))} />
        </div>
      </Card>

      {/* ----- Gender Chart Card ----- */}
      <Card
        className="basis-1/3 h-[65vh]  -mt-4 flex rounded-xl bg-neutral-100"
        shadow="md"
      >
        <p className="-mb-8 p-2 text-xl font-bold">Gender and Risk</p>
        <p className="-mb-8 mt-6 pl-2 text-sm italic">
          Distribution of those at risk for each gender
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-10">
          <MyBarChart data={Object.keys(genderData).map((ele: any) => ({
            label: ele,
            highRisk: genderData[ele]['High Risk'],
            someRisk: genderData[ele]['Some Risk'],
            lowRisk: genderData[ele]['Low Risk'],
          }))} />
        </div>
      </Card>
    </div>
  )
}