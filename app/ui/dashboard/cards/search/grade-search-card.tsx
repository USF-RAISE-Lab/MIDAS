import clsx from "clsx";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@nextui-org/react";
import { Nunito } from "next/font/google";
import { useState } from "react";
import Link from "next/link";
import { useSearchContext } from "@/app/context/nav-search-context";
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })

export default function GradeSearch({
  selectedGrade,
  setSelectedGrade,
  gradeList,
  classList,
  className
}: {
  selectedGrade: number;
  setSelectedGrade: React.Dispatch<React.SetStateAction<number>>;
  gradeList: number[];
  classList: string[];
  className?: string;
}) {

  const classContext = useSearchContext('classroom');

  return (


    <Card className={`bg-neutral-100 w-full ${className}`} shadow='md'>
      <CardHeader className={nunito.className}>
        <h3 className="text-lg font-medium text-slate-800">Currently viewing grade </h3>&nbsp;<span className="font-extrabold underline">{selectedGrade}</span>
      </CardHeader>
      <CardBody className='flex flex-row'>
        <div className={clsx('flex flex-row w-full',
          {
            ['basis-full']: selectedGrade === 0,
            ['basis-1/2']: selectedGrade !== 0,
          }
        )}>
          <Dropdown >
            <DropdownTrigger className='flex min-w-full'>
              <Button variant="bordered" >
                {selectedGrade !== 0 ? selectedGrade : "Select grade"}
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Static Actions">
              {gradeList.map((item, index) => (
                <DropdownItem key={index} onPress={() => setSelectedGrade(item)}>{item}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Only show the select classroom section if there is a selected grade */}
        {selectedGrade !== 0 &&
          <Divider orientation="vertical" className="mx-2" />}

        {selectedGrade !== 0 &&
          (<div className='flex flex-row basis-1/2 w-full'>
            <Dropdown >
              <DropdownTrigger className='flex min-w-full'>
                <Button
                  variant="bordered"
                >
                  Go to Classroom
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">

                {classList.map((classroom: string) => {
                  return (

                    <DropdownItem key={classroom}>
                      <Link
                        key={classroom}
                        href={{
                          pathname: '/dashboard/classroom',
                          query: { classroom },
                        }}
                        onClick={() => { classContext.set(classroom) }}
                      >
                        <div className="w-full">
                          {classroom}
                        </div>

                      </Link>
                    </DropdownItem>

                  );
                })}

              </DropdownMenu>
            </Dropdown>
          </div>)}
      </CardBody>
    </Card >
  );
}
