import React, { ReactNode } from 'react';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-full'>
      <Sidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
