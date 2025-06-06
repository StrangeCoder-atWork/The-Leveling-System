
import React from 'react'
import {getServerSession} from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import {redirect} from "next/navigation"
import "./home.css"
import Cards from '../components/Cards'
import dynamic from "next/dynamic";

const Home_design = dynamic(() => import("../components/home.js"), { ssr: false });

export default function Page(props) {
  return <Home_design {...props} />;
}
const Home = async () => {
    
  // const session = await getServerSession(authOptions);
  // if(!session){
  //   redirect("/login");
  // }
   
  return (
    <>
      <Home_design/>
    </> 
  )
}
