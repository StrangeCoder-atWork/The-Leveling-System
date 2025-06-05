"use client"
import React from 'react'
import './Cards.css'
import Link from 'next/link'
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes'
import { useRouter } from 'next/navigation';
const Cards = (props) => {
	const theme= useTheme();
			const current=themes[theme['theme']];
			const router= useRouter();
  return (
	<button className={`${current.card} relative z-10`} type='button' onClick={()=>router.push(props.link)}>
	  {props.title}
	</button>
  )
}

export default Cards
