/**
 * @since 2024-08-27
 * @author Gabriel
 */

import clsx from 'clsx';
import React from 'react';
import { Card, CardHeader, Tooltip, Divider } from '@nextui-org/react';
import { Nunito } from 'next/font/google';
const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

/**
 * Only for use in this file
 */
type Assessment = {
  name: string;
  values: string[] | number[];
  labels: string[];
  tooltipText: string;
}

/**
 * Small component to display a single value and label pair in a column structure.
 * @param {string | number} value The numeric or string value to display
 * @param {string} label The label to display below the value
 * @returns {React.ReactElement}
 */
function Metric({
  value,
  label
}: {
  value: string | number;
  label: string;
}) {
  const isNa = value.toString().toLowerCase() === 'na';
  return (
    <div className="flex flex-col items-center">
      <p className={clsx('text-2xl', { 'text-slate-600': isNa })}>
        {value.toString().toUpperCase()}
      </p>
      <p className="text-sm font-extralight italic">{label}</p>
    </div>
  );
}

/**
 * Component to display 'n' Metric atoms in a row, with a title.
 * @param {string} title The title to display above the row
 * @param {string[] | number[]} values The values to display, from left to right
 * @param {string[]} labels The labels to display below the values, from left to right
 * @returns {React.JSX.Element}
 */
function Row({
  title,
  values,
  labels
}: {
  title: string;
  values: string[] | number[];
  labels: string[]
}) {
  return (
    <div className="flex h-20 flex-col w-full">
      <p className="text-md">{title}</p>
      <div className="flex w-full justify-evenly gap-8 px-8">
        {values.map((value, index) => (
          <div key={index}>
            <Metric value={value} label={labels[index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Display one or more rows containing a title and one or more metrics, which contain a value and a label.
 * @param {string} title The title of the card.
 * @param {Assessment[]} assessments The contents of a row. Contains title, values, labels, and tooltipText.
 * @returns {React.JSX.Element}
 */
export function RiskCard({
  title,
  assessments
}: {
  title: string;
  assessments: Assessment[]
}) {
  return (
    <Card className={`${nunito.className} items-center justify-center rounded-xl bg-neutral-100 pb-2`}>
      <CardHeader className="">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </CardHeader>

      <div className="flex flex-col justify-between w-full px-8">
        {assessments.map((assessment: Assessment, index: number) => {
          return (
            <>
              <Tooltip content={assessment.tooltipText} placement="bottom">
                <div className='flex'>
                  <Row
                    title={assessment.name}
                    values={assessment.values}
                    labels={assessment.labels}
                  />
                </div>
              </Tooltip>
              {index < assessments.length - 1 && (
                <Divider className="mb-1 mt-0" />
              )}
            </>
          )
        })}
      </div>
    </Card>
  );
}
