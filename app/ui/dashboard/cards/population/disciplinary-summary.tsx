import clsx from 'clsx';
import React from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

function Interior({
  title,
  values,
  subtitles,
  padding,
}: {
  title: string;
  values: [string | number, string | number];
  subtitles: [string, string];
  padding: string;
}) {
  return (
    <div className={'flex h-20 flex-col rounded-xl ' + padding}>
      {/* CONTENT ROW */}
      <p className={` text-md ml-2`}> {title} </p>
      <div className="-mx-2 flex flex-row px-8">
        {/* LEFT COLUMN */}
        <div className="ml-4 mr-4 flex basis-1/2 flex-col items-center">
          {/* VALUE DIV */}
          <div className="-mb-1">
            <p
              className={clsx('text-3xl', {
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
        <div className="ml-16 mr-4 flex basis-1/2 flex-col items-center">
          {/* VALUE DIV */}
          <div className="">
            <p
              className={clsx('text-3xl', {
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
      </div>
    </div>
  );
}

export function CardDisciplinarySummary({
  title,
  subtitlesTop,
  subtitlesBottom,
  valuesTop,
  valuesBottom,
}: {
  title: string;
  subtitlesTop: [string, string];
  subtitlesBottom: [string, string];
  valuesTop: [string, string] | [number, number];
  valuesBottom: [string, string] | [number, number];
}) {
  return (
    <Card
      className={`${nunito.className} items-center rounded-xl bg-neutral-100 pb-2`}
    >
      {/* MAIN TITLE */}
      <CardHeader>
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </CardHeader>

      {/* MAIN CONTENT */}
      <div className="flex flex-col">
        {/* CARD 1 --- ODR */}
        <Tooltip content={'ODR Tooltip'} placement="bottom">
          <div>
            <Interior
              title="ODR"
              values={valuesTop}
              subtitles={subtitlesTop}
              padding=""
            />
          </div>
        </Tooltip>

        <Divider className="mb-1 mt-0" />

        {/* CARD 2 --- SUSPENSIONS */}
        <Tooltip content={'Suspensions Tooltip'} placement="bottom">
          <div>
            <Interior
              title="Suspensions"
              values={valuesBottom}
              subtitles={subtitlesBottom}
              padding=""
            />
          </div>
        </Tooltip>
      </div>
    </Card>
  );
}
