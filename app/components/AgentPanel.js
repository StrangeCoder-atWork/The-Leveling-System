"use client";

import { useEffect, useState } from "react";
import { getUserProfile, askAgentPersonalized } from "../../lib/aiAgent";

export default function AgentPanel({ section }) {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    async function fetchAdvice() {
      const userProfile = getUserProfile();
      const res = await askAgentPersonalized(section, userProfile);
      setResponse(res);
    }
    fetchAdvice();
  }, [section]);

  if (!response) return <div className="p-4">Loading agent advice...</div>;

  return (
    <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6 w-full max-w-xl mx-auto mt-6 absolute left-[25%]">
      <h2 className="text-xl font-bold mb-2">{response.title}</h2>
      <p className="mb-4">{response.message}</p>
      <div className="text-sm text-yellow-400">💡 Suggestion: {response.suggestion}</div>
    </div>
  );
}
