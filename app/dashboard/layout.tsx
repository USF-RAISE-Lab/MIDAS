'use client';
import SideNav from '@/app/ui/dashboard/sidenav';
import CaptureScreenshotButton from '../ui/CaptureScreenshotButton';
import ToasterProvider from '@/providers/ToastProvider';
import { SearchContextProvider } from '../context/nav-search-context-provider';
import { Nunito } from 'next/font/google';
import { getSession, SessionProvider, useSession } from 'next-auth/react';
import { FetchSchoolData } from '../api/data/downloadSchoolData';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { useEffect, useState } from 'react';
import { loadData } from '@/action/loadData';

const nunito = Nunito({
  weight: ['200', '300'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export default function Layout({ children }: { children: React.ReactNode }) {



  const [schoolId, setSchoolId] = useState<number>(0);
  //useEffect(() => {
  //
  //  const getSchoolId = async () => {
  //
  //    const session = await getSession();
  //    const schoolid = session?.user.school_id;
  //
  //    setSchoolid(schoolid);
  //  }
  //  getSchoolId();
  //
  //  loadData(schoolId);
  //}, [schoolId]);
  //
  useEffect(() => {
    const getSchoolId = async () => {
      const session = await getSession();
      const schoolid = session?.user.school_id;
      setSchoolId(schoolid);  // Set the schoolId here
    };
    getSchoolId();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (schoolId !== null) {
      loadData(schoolId);  // Only call loadData when schoolId has been set
    }
  }, [schoolId]);
  console.log(schoolId)

  return (

    <SearchContextProvider>
      <SessionProvider>
        <div className={`flex bg-neutral-50 h-screen flex-col md:flex-row md:overflow-hidden`}>
          <div className={`${nunito.className} font-medium md:absolute md:h-screen md:z-20`}>
            <SideNav />
          </div>

          <div className={`${nunito.className} md:ml-12 flex-grow md:p-6 md:overflow-y-auto`}>
            <ToasterProvider />
            {children}
          </div>

          <div className='invisible lg:visible z-10 absolute bottom-0 right-0 opacity-75'>
            <CaptureScreenshotButton />
          </div>
        </div>

      </SessionProvider >
    </SearchContextProvider>
  );
}
