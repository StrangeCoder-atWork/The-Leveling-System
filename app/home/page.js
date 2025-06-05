
import React from 'react'
import {getServerSession} from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import {redirect} from "next/navigation"
import "./home.css"
import Cards from '../components/Cards'
import Home_design from "./home"

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

export default Home
