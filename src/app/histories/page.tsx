"use client";
import React from 'react'
import Datatable from './components/datatable';
import Header from '@/app/components/header';

const Histories = () => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Header title='รายการประวัติการขาย'></Header>
      <Datatable/>
    </div>
  )
}

export default Histories