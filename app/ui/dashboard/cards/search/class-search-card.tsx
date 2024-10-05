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
import SimpleLineIconsMagnifier from "@/app/ui/icons/SimpleLineIconsMagnifier";
import { useSearchContext } from "@/app/context/nav-search-context";
import Link from "next/link";
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })

export default function ClassSearch({
  selectedClass,
  setSelectedClass,
  classList,
  studentList,
  className
}: {
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  classList: string[];
  studentList: string[];
  className?: string;
}) {
  const SearchAction = async (formData: FormData) => {
    const id = formData.get('classroomId') || ""
    setSelectedClass(id.toString().toUpperCase())
  }

  const studentContext = useSearchContext('student');

  return (
    <Card className={`bg-neutral-100 ${className}`} shadow='md'>
      <CardHeader className={nunito.className}>
        <h3 className="text-lg font-medium text-slate-800">Currently viewing class </h3>&nbsp;<span className="font-extrabold underline">{selectedClass}</span>
      </CardHeader>
      <CardBody className={clsx('flex flex-row w-full',
        {
          ['basis-full']: selectedClass === '',
          ['basis-1/2']: selectedClass !== ''
        })}>
        <div className={clsx('flex flex-row',
          {
            ['w-full']: selectedClass === '',
            ['w-1/2']: selectedClass !== ''
          })}>
          <form className="flex flex-row w-full" action={SearchAction}>
            <div className='flex w-full'>
              <Dropdown >
                <DropdownTrigger className='flex min-w-full'>
                  <Button variant="bordered" >
                    {selectedClass !== "" ? selectedClass : "Select grade"}
                  </Button>
                </DropdownTrigger>

                <DropdownMenu aria-label="Static Actions">
                  {classList.map((item, index) => (
                    <DropdownItem key={index} onPress={() => setSelectedClass(item)}>{item}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </form>
        </div>

        {selectedClass !== '' &&
          <Divider orientation="vertical" className="mx-2" />}

        {selectedClass !== '' &&
          <div className='flex flex-row basis-1/2 w-full'>
            <Dropdown >
              <DropdownTrigger className='flex min-w-full'>
                <Button
                  variant="bordered"
                >
                  Go to Student
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                {studentList.map((student: string) => {
                  return (

                    <DropdownItem key={student}>
                      <Link
                        key={student}
                        href={{
                          pathname: '/dashboard/student',
                          query: { student },
                        }}
                        onClick={() => { studentContext.set(student) }}
                      >
                        <div className="w-full">
                          {student}
                        </div>

                      </Link>
                    </DropdownItem>

                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>}

      </CardBody>
    </Card>
  );
}
