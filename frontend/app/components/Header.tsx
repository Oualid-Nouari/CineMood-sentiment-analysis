'use client'

import Image from 'next/image'
import ProjectInfoModal from './ProjectInfoModal'
import { useState } from 'react'

export default function Header() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleOpenInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  return (
    <>
      <header className="relative z-0 w-full text-white shadow-md ">
        <div className="w-[90%] mx-auto flex items-center justify-between border-b border-white/30 px-4 py-6">          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/imgs/logo.png" 
              alt="App Logo"
              width={90}
              height={90}
              className="rounded-md w-auto h-10 md:h-12"
            />
          </div>

          <button
            onClick={handleOpenInfoModal}
            className="text-sm md:text-base font-medium cursor-pointer hover:text-sky-300 transition underline focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-sm p-1"
          >
            What this app's doing?
          </button>

        </div>
      </header>

      {/* Render the ProjectInfoModal */}
      <ProjectInfoModal 
        isOpen={isInfoModalOpen} 
        onClose={handleCloseInfoModal} 
      />
    </>
  )
}