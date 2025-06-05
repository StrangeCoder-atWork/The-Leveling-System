
import { useState, useEffect } from "react";
import { askAgentPersonalized } from "@/lib/aiAgent";
export default function AISuggestions({ streakData, habits }) {
  const [suggestions, setSuggestions] = useState(null);

  useEffect(() => {
    const getSuggestions = async () => {
      const aiResponse = await askAgentPersonalized('suggestions', {
        streakData,
        habits,
        type: 'improvement_suggestions'
      });
      setSuggestions(aiResponse);
    };
    getSuggestions();
  }, [streakData, habits]);

  return (
    <div className="mt-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-4">AI Suggestions</h2>
{suggestions && (
  <div className="space-y-4">
    <div className="bg-white/10 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-yellow-400 mb-2">{suggestions.title}</h3>
      <p className="text-neutral-300">{suggestions.message}</p>
    </div>
    {suggestions.actionItems && suggestions.actionItems.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.actionItems.map((item, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">{item.title}</h4>
            <p className="text-neutral-400">{item.description}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
    </div>
  );
}