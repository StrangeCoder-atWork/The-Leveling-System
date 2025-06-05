import React from 'react'

const DragTask = ( { task} ) => {
  return (
	<div className='DragTask relative z-50 bg-auto text-white h-10  ' draggable={true}>
	  <strong>{task.title}</strong>
      <div>XP: {task.xp}</div>
	  {task.isCompleted && (<div>Completed</div>)}
	</div>
  )
}

export default DragTask
