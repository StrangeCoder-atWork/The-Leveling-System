"use client"
import React from 'react'
import dynamic from "next/dynamic";

const Home_design = dynamic(() => import("../components/home.js"), { ssr: false });

export default function Page(props) {
  return <Home_design {...props} />;
}
const Home =  () => {
   
  return (
    <>
      <Home_design/>
    </> 
  )
}
