import React from 'react'
import './store.css'
import Item from './items.jsx'
import game from './tv.png'
import anime from './anime3.png'
import snack from './popcorn.png'
import GainXp from './images (1).jpg'
const store = () => {
  return (
	<div>
	  <div className="store_title text-3xl w-full  text-center mx-auto my-14 underline text-blue-400 font-bold">Purchase Your Comfort!</div>
	  <div className="container p-4  border-l-0 border-r-0 border-1 border-blue-400 flex gap-3 w-200 h-auto">
        <Item img={game} price={1000} name_item={"30 MIN OF GAMING"}/>
        <Item img={snack} price={1500} name_item={"SNACK"}/>
        <Item img={anime} price={1200} name_item={"30 MIN ANIME TIME"}/>
        <Item img={GainXp} price={2000} name_item={"1 Hour of Free Time"}/>
        <Item img={GainXp} price={1700} name_item={"Upgrades in System"}/>
        <Item img={GainXp} price={2100} name_item={"Unlock Special mission with rare loot"}/>
        <Item img={GainXp} price={3000} name_item={"Level Up Booster (XP + 10%)"}/>
	  </div>
	</div>
  )
}

export default store
