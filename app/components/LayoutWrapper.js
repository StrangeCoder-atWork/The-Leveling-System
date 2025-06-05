'use client'
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";
import React from 'react'

const LayoutWrapper = ({children}) => {
	// const session = await getServerSession(authOptions);
	const pathname= usePathname();
	  const hideNavbar = pathname === "/login" || pathname === "/signup" || pathname === "/setup";
  return (
	<>
	  {!hideNavbar && <Navbar isLoggedIn={true}/>}
	  {children}
	</>
  )
}

export default LayoutWrapper
