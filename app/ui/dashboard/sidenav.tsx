'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import MidasLogoNoText from '@/app/ui/midas-logo-no-text';
import { PowerIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import ConfirmSignoutModal from '../modals/confirm-signout';
import { useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import clsx from 'clsx';
import SupportModal from '../modals/tech-support';

export default function SideNav() {
  const { isOpen: isOpenSignout, onOpen: onOpenSignout, onOpenChange: onOpenChangeSignout } = useDisclosure();
  const { isOpen: isOpenSupport, onOpen: onOpenSupport, onOpenChange: onOpenChangeSupport } = useDisclosure();

  const [collapsed, setCollapsed] = useState(false);

  const arrows = {
    'left': <>&larr;</>,
    'right': <>&rarr;</>
  }

  const handleHoverStart = () => {
    setCollapsed(false);
  }

  const handleHoverEnd = () => {
    setCollapsed(true);
  }

  return (
    <div className={clsx("flex sm:h-full flex-col px-3 py-4 md:px-2 max-sm:w-fit bg-zinc-50 sm:transition-all sm:duration-100 rounded-md shadow-md",
      {
        'w-16': collapsed,
        'w-40': !collapsed
      },
    )} onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd}>
      <ConfirmSignoutModal isOpen={isOpenSignout} onOpen={onOpenSignout} onOpenChange={onOpenChangeSignout} />
      <SupportModal isOpen={isOpenSupport} onOpen={onOpenSupport} onOpenChange={onOpenChangeSupport} />
      <div
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-gray-50 max-md:hidden md:h-24"
      >
        <div className="w-32 text-white md:w-40 max-md:hidden">
          <MidasLogoNoText />
        </div>
      </div>
      <div className="flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 max-sm:w-fit">
        <NavLinks collapsed={collapsed} />

        {/* <div className="hidden h-full w-full grow rounded-md bg-gray-50 md:block"></div> */}

        <div className='flex flex-col mt-auto mb-0'>
          <button
            onClick={onOpenSupport}
            className='sidenav-navlink-button'
          >
            < QuestionMarkCircleIcon className='sidenav-navlink-icon' />
            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
                Support
              </div>
          </button>

          <button
            onClick={onOpenSignout}
            className='sidenav-navlink-button'
          >
            <PowerIcon className='sidenav-navlink-icon' />
            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
              Signout
            </div>
          </button>
        </div>
        
      </div>
    </div>
  );
}
