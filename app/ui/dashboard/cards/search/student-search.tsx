'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import {useInfiniteScroll} from "@nextui-org/use-infinite-scroll";

import { Nunito } from 'next/font/google';
import SimpleLineIconsMagnifier from '@/app/ui/icons/SimpleLineIconsMagnifier';
import { DonutChart } from '@/app/ui/charts/donut-chart';
import { StudentDemographics } from '@/app/types/student-demographics';
import { FormError } from '@/app/ui/form-error';
import { DemographicsType } from '@/app/ui/charts/demographics-type';
import useSchoolLevel from '@/hooks/useSchoolLevel';
import { useEffect, useState } from 'react';
import Fuse from 'fuse.js'
import Downshift from 'downshift';
import { StudentAutocomplete } from '@/app/ui/autocomplete';

const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const genderDataPlaceholder = [
  {
    label: 'Male',
    value: 500,
  },
  {
    label: 'Female',
    value: 548,
  },
];

const ethnicityDataPlaceholder = [
  {
    label: 'White',
    value: 358,
  },
  {
    label: 'Hispanic',
    value: 300,
  },
  {
    label: 'Other POC',
    value: 390,
  },
];

const englishLearnerDataPlaceholder: DemographicsType[] = [
  {
    label: 'Not ELL',
    value: 800,
  },
  {
    label: 'ELL',
    value: 248,
  },
];

function DemographicsBox({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="flex h-full w-full basis-1/4 flex-col items-center justify-center">
      <p className=" px-2 text-sm">{label}</p>

      <p className="mt-2 text-xl">{content}</p>
    </div>
  );
}

function DemographicsRow({
  content,
  className,
}: {
  content: StudentDemographics;
  className?: string;
}) {
  return (
    <div className={`${nunito.className} flex flex-row ${className}`}>
      <DemographicsBox label="Grade" content={content.grade} />

      <Divider orientation="vertical" />

      {content.gender && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`${nunito.className} text-xl`}>
                School Gender demographics
              </p>
              <DonutChart
                data={genderDataPlaceholder}
                colors={['#f87171', '#a5f3fc']}
              />
            </div>
          }
          placement="bottom"
        >
          <div className="basis-1/4">
            <DemographicsBox label="Gender" content={content.gender} />
          </div>
        </Tooltip>
      )}

      {!content.gender && (
        <div className="basis-1/4">
          <DemographicsBox label="Gender" content={content.gender} />
        </div>
      )}

      <Divider orientation="vertical" />

      {content.ell && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`${nunito.className} text-xl`}>
                School English-learner demographics
              </p>
              <DonutChart
                data={englishLearnerDataPlaceholder}
                colors={['#a3a3a3', '#4ade80']}
              />
            </div>
          }
          placement="bottom"
        >
          <div className="basis-1/4">
            <DemographicsBox label="English Learner" content={content.ell} />
          </div>
        </Tooltip>
      )}

      {!content.ell && (
        <div className="basis-1/4">
          <DemographicsBox label="English Learner" content={content.ell} />
        </div>
      )}

      <Divider orientation="vertical" />

      {content.ethnicity && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`${nunito.className} text-xl`}>
                School Ethnicity demographics
              </p>
              <DonutChart
                data={ethnicityDataPlaceholder}
                colors={['#f87171', '#a5f3fc', '#4ade80']}
              />
            </div>
          }
          placement="bottom"
        >
          <div className="basis-1/4">
            <DemographicsBox label="Ethnicity" content={content.ethnicity} />
          </div>
        </Tooltip>
      )}

      {!content.ethnicity && (
        <div className="basis-1/4">
          <DemographicsBox label="Ethnicity" content={content.ethnicity} />
        </div>
      )}
    </div>
  );
}

export default function StudentSearch({
  selectedStudent,
  setSelectedStudent,
  data,
  className
}: {
  selectedStudent: string;
  setSelectedStudent: React.Dispatch<React.SetStateAction<string>>;
  data: any;
  className?: string;
}) {
  const SearchAction = async (formData: FormData) => {
    const id = formData.get('studentId') || '';
    setSelectedStudent(id.toString().toUpperCase());
    console.log({ selectedStudent });
  };

  const schoolLevel = useSchoolLevel();

  return (
    <Card className={`${className} bg-neutral-100 pb-1 max-h-64 overflow-hidden`} shadow="md">
      <CardHeader className={nunito.className}>
        <h3 className="text-lg font-medium text-slate-800">
          Currently viewing student{' '}
        </h3>
        &nbsp;
        <span className="font-extrabold underline">{selectedStudent}</span>
      </CardHeader>
      <CardBody className={`${nunito.className} -mt-4 flex w-full flex-row overflow-hidden`}>
        <div className="flex w-max basis-full flex-col gap-1">
          <form className="flex w-full flex-row" action={SearchAction}>
            <div className="flex w-full">
              <StudentAutocomplete options={schoolLevel.listOfAllStudents.map((value: any, index: number) => (value.studentid))} name={'studentId'} />

              <Button className="min-w-fit" variant="flat" type="submit">
                <SimpleLineIconsMagnifier />
              </Button>
            </div>
          </form>

          {!data && data !== '' && (
            <FormError message="Student does not exist" />
          )}

          <DemographicsRow
            content={{
              grade: data?.gradelevel,
              gender: data?.gender,
              ell: data?.ell,
              ethnicity: data?.ethnicity,
            }}
            className="mb-0 mt-auto h-full"
          />
        </div>
      </CardBody>
    </Card>
  );
}
