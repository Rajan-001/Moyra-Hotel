"use client"
import { Suspense } from "react";
import ConfiramtionPage from '@/components/ConfiramtionPage'
import React from 'react'



export default function page ()  {
  return (
    <div>
      <Suspense>
        <ConfiramtionPage/>
        </Suspense>
    </div>
  )
}