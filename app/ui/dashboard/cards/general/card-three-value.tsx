import clsx from "clsx";
import { Card, CardBody, CardHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { Nunito } from "next/font/google";
import { MidasRiskScoreTooltip } from "@/app/ui/textblocks/tooltips";
import TooltipModal from "@/app/ui/modals/tooltip-modal";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

export function ThreeValueInterior({
  values,
  subtitles,
}: {
  values: [string | number, string | number, string | number];
  subtitles: [string, string, string];
}) {
  return (
    <div className='flex flex-col'>
          {/* CONTENT ROW */}
          <div className="flex flex-row -mx-2">
            {/* LEFT COLUMN */} 
              <div className='flex flex-col basis-1/3 items-center'>
                {/* VALUE DIV */}
                <div className="-mb-1">
                  <p className={clsx(
                    `${nunito.className} font-semibold text-3xl`,
                    {
                      'text-red-500': values[0].toString().toLowerCase() === 'high',
                      'text-amber-300': values[0].toString().toLowerCase() === 'some' ||
                        values[0].toString().toLowerCase() === 'one+',
                      'text-green-400': values[0].toString().toLowerCase() === 'low'  ||
                        values[0].toString().toLowerCase() === 'zero',
                      'text-slate-600': values[0].toString().toLowerCase() === 'na'
                    }
                    )}>
                      {values[0].toString().toUpperCase()}
                    </p>
                </div>
                {/* SUBTITLE DIV */}
                <div>
                  <p className={`${nunito.className} font-extralight italic text-sm`}>{subtitles[0]}</p>
                </div>
              </div>
            
             

            {/* MIDDLE COLUMN */}
            
              <div className='flex flex-col  basis-1/3 items-center'>
                {/* VALUE DIV */}
                <div className="">
                  <p className={clsx(
                    `${nunito.className} font-semibold text-3xl`,
                    {
                      'text-red-500': values[1].toString().toLowerCase() === 'high',
                      'text-amber-300': values[1].toString().toLowerCase() === 'some' ||
                        values[1].toString().toLowerCase() === 'one+',
                      'text-green-400': values[1].toString().toLowerCase() === 'low'  ||
                        values[1].toString().toLowerCase() === 'zero',
                      'text-slate-600': values[1].toString().toLowerCase() === 'na'
                    }
                    )}>
                      {values[1].toString().toUpperCase()}
                    </p>
                </div>
                {/* SUBTITLE DIV */}
                <div className="">
                  <p className={`${nunito.className} font-extralight italic text-sm`}>{subtitles[1]}</p>
                </div>
              </div>
            

            {/* RIGHT COLUMN */}
            
              <div className='flex flex-col  basis-1/3 items-center'>
                {/* VALUE DIV */}
                <div className="">
                  <p className={clsx(
                    `${nunito.className} font-semibold text-3xl`,
                    {
                      'text-red-500': values[2].toString().toLowerCase() === 'high',
                      'text-amber-300': values[2].toString().toLowerCase() === 'some' ||
                        values[1].toString().toLowerCase() === 'one+',
                      'text-green-400': values[2].toString().toLowerCase() === 'low'  ||
                        values[1].toString().toLowerCase() === 'zero',
                      'text-slate-600': values[2].toString().toLowerCase() === 'na'
                    }
                    )}>
                      {values[2].toString().toUpperCase()}
                    </p>
                </div>
                {/* SUBTITLE DIV */}
                <div className="">
                  <p className={`${nunito.className} font-extralight italic text-sm`}>{subtitles[2]}</p>
                </div>
              </div>
            
          </div>
          
        </div>
  );
}

export function CardThreeValue({
  title,
  values,
  subtitles,
  tooltip,
}: {
  title: string;
  values: [string | number, string | number, string | number];
  subtitles: [string, string, string];
  tooltip: React.ReactNode;
}) {
  const {isOpen: TooltipIsOpen, onOpen: TooltipOnOpen, onOpenChange: TooltipOnOpenChange} = useDisclosure();

  return (
    <>
      <TooltipModal 
      isOpen={TooltipIsOpen} 
      onOpen={TooltipOnOpen} 
      onOpenChange={TooltipOnOpenChange} 
      title={"MIDAS Risk Score"} 
      content={MidasRiskScoreTooltip()}/>

      <div onClick={TooltipOnOpen}>
      <Tooltip content="Click to see more information about the MIDAS risk score" placement='bottom' className="">
        <Card className=" bg-neutral-100" shadow='md' >
          <CardHeader className={`${nunito.className}`}>
            <h3 className="text-lg font-medium text-slate-800">{title}</h3>
          </CardHeader>
          <CardBody className=''>
            <ThreeValueInterior values={values} subtitles={subtitles}/>
          </CardBody>
        </Card>
      </Tooltip>
      </div>
    </>
  );
}


// export function ThreeValueInterior({
//   values,
//   subtitles,
// }: {
//   values: [string | number, string | number, string | number];
//   subtitles: [string, string, string];
// }) {
//   return (
//     <div className='flex flex-col bg-zinc-50 pt-4 h-20 rounded-xl'>
//           {/* CONTENT ROW */}
//           <div className="flex flex-row px-8 -mx-2">

//             {/* LEFT COLUMN */}
            
//               <div className='flex flex-col basis-1/3 items-center'>
//                 {/* VALUE DIV */}
//                 <div className="-mb-1">
//                   <p className={clsx(
//                     'font-semibold text-3xl',
//                     {
//                       'text-red-500': values[0].toString().toLowerCase() === 'high',
//                       'text-amber-300': values[0].toString().toLowerCase() === 'some' ||
//                         values[0].toString().toLowerCase() === 'one+',
//                       'text-green-400': values[0].toString().toLowerCase() === 'low'  ||
//                         values[0].toString().toLowerCase() === 'zero',
//                       'text-slate-600': values[0].toString().toLowerCase() === 'na'
//                     }
//                     )}>
//                       {values[0].toString().toUpperCase()}
//                     </p>
//                 </div>
//                 {/* SUBTITLE DIV */}
//                 <div>
//                   <p className='font-extralight italic text-sm'>{subtitles[0]}</p>
//                 </div>
//               </div>
            

//             {/* MIDDLE COLUMN */}
            
//               <div className='flex flex-col  basis-1/3 items-center'>
//                 {/* VALUE DIV */}
//                 <div className="">
//                   <p className={clsx(
//                     'font-semibold text-3xl',
//                     {
//                       'text-red-500': values[1].toString().toLowerCase() === 'high',
//                       'text-amber-300': values[1].toString().toLowerCase() === 'some' ||
//                         values[1].toString().toLowerCase() === 'one+',
//                       'text-green-400': values[1].toString().toLowerCase() === 'low'  ||
//                         values[1].toString().toLowerCase() === 'zero',
//                       'text-slate-600': values[1].toString().toLowerCase() === 'na'
//                     }
//                     )}>
//                       {values[1].toString().toUpperCase()}
//                     </p>
//                 </div>
//                 {/* SUBTITLE DIV */}
//                 <div className="">
//                   <p className='font-extralight italic text-sm'>{subtitles[1]}</p>
//                 </div>
//               </div>
            

//             {/* RIGHT COLUMN */}
            
//               <div className='flex flex-col  basis-1/3 items-center'>
//                 {/* VALUE DIV */}
//                 <div className="">
//                   <p className={clsx(
//                     'font-semibold text-3xl',
//                     {
//                       'text-red-500': values[2].toString().toLowerCase() === 'high',
//                       'text-amber-300': values[2].toString().toLowerCase() === 'some' ||
//                         values[1].toString().toLowerCase() === 'one+',
//                       'text-green-400': values[2].toString().toLowerCase() === 'low'  ||
//                         values[1].toString().toLowerCase() === 'zero',
//                       'text-slate-600': values[2].toString().toLowerCase() === 'na'
//                     }
//                     )}>
//                       {values[2].toString().toUpperCase()}
//                     </p>
//                 </div>
//                 {/* SUBTITLE DIV */}
//                 <div className="">
//                   <p className='font-extralight italic text-sm'>{subtitles[2]}</p>
//                 </div>
//               </div>
            
//           </div>
          
//         </div>
//   );
// }

// export function CardThreeValue({
//   title,
//   values,
//   subtitles,
// }: {
//   title: string;
//   values: [string | number, string | number, string | number];
//   subtitles: [string, string, string];
// }) {
//   return (
    
//     <Card className="border-none p-4 bg-zinc-100" >
//       <CardBody>
//         <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
//         <ThreeValueInterior values={values} subtitles={subtitles}/>
//       </CardBody>
      
//     </Card>
//     // <div className="rounded-xl p-4 bg-zinc-100 shadow-md">
      
//     // </div>
//   );
// }