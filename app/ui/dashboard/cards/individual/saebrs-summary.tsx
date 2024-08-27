import {
  FaceSmileIcon,
  AcademicCapIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import MaterialSymbolsLightPersonAlertOutline from '../../../icons/MaterialSymbolsLightPersonAlertOutline';

import React from 'react';
import {
  Card,
  Tooltip,
  Divider,
  CardHeader,
  CardBody,
} from '@nextui-org/react';
import { Nunito } from 'next/font/google';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const iconMap = {
  total: MaterialSymbolsLightPersonAlertOutline,
  emotional: FaceSmileIcon,
  social: UsersIcon,
  academic: AcademicCapIcon,
};

function RiskTitle({
  title,
  type,
}: {
  title: string;
  type: 'total' | 'emotional' | 'social' | 'academic';
}) {
  const Icon = iconMap[type];

  return (
    <div
      className={`${nunito.className} -mb-4 -ml-1 mt-1 flex flex-row items-start justify-start`}
    >
      {Icon ? <Icon className="h-6 w-6 text-gray-700" /> : null}
      <p className="pl-2">{title}</p>
    </div>
  );
}

function CapitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Row({ header, content }: { header: string; content: string }) {
  return (
    <div className="">
      <p className="items-start">{header}</p>
      <div className="flex flex-col items-center">
        <p className={`${nunito.className}  md:text-nowrap text-3xl`}>{content}</p>
      </div>
    </div>
  );
}

function CardSaebrs({
  header,
  saebrs,
  mySaebrs,
  tooltip,
  className
}: {
  header: 'total' | 'emotional' | 'social' | 'academic';
  saebrs: string;
  mySaebrs: string;
  tooltip: string;
  className?: string
}) {
  return (
    <Card
      className={`${nunito.className} w-full basis-1/4 bg-neutral-100 px-3 ${className}`}
    >
      <CardHeader className='-mb-16'>
        <RiskTitle title={CapitalizeFirstLetter(header)} type={header} />
      </CardHeader>

      <CardBody className=''>
        <Tooltip content={tooltip} placement="bottom">
          <div className="mb-3 mt-auto w-full">
            <div className={`${nunito.className} flex flex-col gap-2`}>
              <Row header="Saebrs" content={saebrs} />
              <Divider orientation="horizontal" className="" />
              <Row header="MySaebrs" content={mySaebrs} />
            </div>
          </div>
        </Tooltip>
      </CardBody>
    </Card>
  );
}

export function SaebrsSummary({
  saebrsTotal,
  mySaebrsTotal,
  saebrsEmotional,
  mySaebrsEmotional,
  saebrsSocial,
  mySaebrsSocial,
  saebrsAcademic,
  mySaebrsAcademic,
  className,
  className_card,
}: {
  saebrsTotal: string;
  mySaebrsTotal: string;
  saebrsEmotional: string;
  mySaebrsEmotional: string;
  saebrsSocial: string;
  mySaebrsSocial: string;
  saebrsAcademic: string;
  mySaebrsAcademic: string;
  className?: string;
  className_card?: string;
}) {
  // min-w-fit max-w-sm on tooltip className if break
  return (
    // MAIN ROW
    <div
      className={`${nunito.className}  flex w-full flex-col lg:flex-row ${className}`}
    >
      <CardSaebrs
        header="total"
        saebrs={saebrsTotal}
        mySaebrs={mySaebrsTotal}
        tooltip="Total tooltip"
        className={className_card}
      />

      <CardSaebrs
        header="emotional"
        saebrs={saebrsEmotional}
        mySaebrs={mySaebrsEmotional}
        tooltip="emotional tooltip"
        className={className_card}
      />

      <CardSaebrs
        header="social"
        saebrs={saebrsSocial}
        mySaebrs={mySaebrsSocial}
        tooltip="social tooltip"
        className={className_card}
      />

      <CardSaebrs
        header="academic"
        saebrs={saebrsAcademic}
        mySaebrs={mySaebrsAcademic}
        tooltip="academic tooltip"
        className={className_card}
      />
    </div>
  );
}
