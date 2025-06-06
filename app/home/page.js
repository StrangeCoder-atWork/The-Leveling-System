"use client"
import React from 'react'
import {getServerSession} from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import {redirect} from "next/navigation"

import Cards from '../components/Cards'
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
