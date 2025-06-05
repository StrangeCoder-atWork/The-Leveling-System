"use client"
import React from 'react'
import { useState , useRef } from 'react'

const items = (props) => {
	const [Buy, setBuy] = useState("BUY")
	const  money = 0;
	const handleClick=(price, item)=>{
		if(money>=price){
		 confirm("Are you really wanted to spent $ "+price+ " on purchasing "+item);
		 dispatch(decrementByAmount(price))
		 setBuy("SOLD")
	 }
	 if(money<price){
		alert("You don't have enough Money to purchase "+item)
	 }
	}
  return (
        
        <div className="items  h-14 border-1 border-blue-400">
			<img className='Img w-11 h-11 p-0 my-2 mx-2 absolute' src={props.img} alt="" srcset="" />
			<div className="item absolute my-2 text-black w-100  text-xl mx-20">{props.name_item}
			</div>
			<div className="price w-50 h-fit mx-160 my-3 text-2xl text-center absolute  text-black font-mono">$ {props.price}</div>
             <div  className="button-item my-2 mx-202  w-14 h-9  text-xl  text-black text-center absolute " >
				<button onClick={()=>handleClick(props.price , props.name_item)} disabled={Buy==="SOLD"}>{Buy}</button>
			 </div>
		</div>
  )
}

export default items
