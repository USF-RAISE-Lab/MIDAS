import clsx from 'clsx';
import React from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});


const subtitles = ['Low', 'Some', 'High']

function Interior({
  title,
  values,
}: {
  title: string;
  values: [string | number, string | number, string | number];
}) {
  return (
    <div className={'mx-2 flex h-20 flex-col rounded-xl'}>
      {/* CONTENT ROW */}
      <p className={` text-md ml-2`}> {title} </p>
      <div className="-mx-2 flex flex-row px-8">
        {/* LEFT COLUMN */}
        <div className="flex basis-1/2 flex-col items-center">
          {/* VALUE DIV */}
          <div className="-mb-1">
            <p
              className={clsx('text-2xl', {
                'text-slate-600': values[0].toString().toLowerCase() === 'na',
              })}
            >
              {values[0].toString().toUpperCase()}
            </p>
          </div>

          {/* SUBTITLE DIV */}
          <div>
            <p className="text-sm font-extralight italic">{subtitles[0]}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="ml-10 flex basis-1/2 flex-col items-center">
          {/* VALUE DIV */}
          <div className="">
            <p
              className={clsx('text-2xl', {
                'text-slate-600': values[1].toString().toLowerCase() === 'na',
              })}
            >
              {values[1].toString().toUpperCase()}
            </p>
          </div>

          {/* SUBTITLE DIV */}
          <div className="">
            <p className="text-sm font-extralight italic">{subtitles[1]}</p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="ml-10 flex basis-1/2 flex-col items-center">
          {/* VALUE DIV */}
          <div className="">
            <p
              className={clsx('text-2xl', {
                'text-slate-600': values[1].toString().toLowerCase() === 'na',
              })}
            >
              {values[2].toString().toUpperCase()}
            </p>
          </div>

          {/* SUBTITLE DIV */}
          <div className="">
            <p className="text-sm font-extralight italic">{subtitles[2]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SaebrsSummary({
  title,
  saebrsValues,
  mySaebrsValues,
}: {
  title: string;
  saebrsValues: [string, string, string] | [number, number, number];
  mySaebrsValues: [string, string, string] | [number, number, number];
}) {
  return (
    <Card
      className={`${nunito.className} items-center rounded-xl bg-neutral-100 pb-2`}
    >
      {/* MAIN TITLE */}
      <CardHeader className="">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </CardHeader>

      {/* MAIN CONTENT */}
      <div className="flex flex-col">
        <Tooltip content={'Saebrs Tooltip'} placement="bottom">
          <div>
            <Interior
              title="SAEBRS"
              values={saebrsValues}
            />
          </div>
        </Tooltip>

        <Divider className="mb-1 mt-0" />

        <Tooltip content={'MySaebrs Tooltip'} placement="bottom">
          <div>
            <Interior
              title="mySAEBRS"
              values={mySaebrsValues}
            />
          </div>
        </Tooltip>
      </div>
    </Card>
  );
}
