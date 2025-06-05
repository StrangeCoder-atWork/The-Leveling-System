export default function HabitCard({ habit, onUpdate }) {
	const [showHistory, setShowHistory] = useState(false);
  
	return (
	  <div className="bg-neutral-800 p-4 rounded-xl">
		<div className="flex justify-between items-center">
		  <h3 className="text-xl font-semibold text-white">{habit.name}</h3>
		  <div className="flex items-center gap-2">
			<span className="text-yellow-400">{habit.streak} 🔥</span>
			<button
			  onClick={() => onUpdate(habit.id)}
			  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
			>
			  Complete
			</button>
		  </div>
		</div>
		
		<div className="mt-4">
		  <div className="flex gap-1">
			{habit.history.slice(-7).map((day, i) => (
			  <div
				key={i}
				className={`w-8 h-8 rounded ${day ? 'bg-green-500' : 'bg-neutral-700'}`}
			  />
			))}
		  </div>
		</div>
	  </div>
	);
  }