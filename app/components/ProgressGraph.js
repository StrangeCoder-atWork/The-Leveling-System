import { Line } from 'react-chartjs-2';
import { askAgentPersonalized } from '@/lib/aiAgent';
import { useState, useEffect } from 'react';
export default function ProgressGraph({ data }) {
  const [graphData, setGraphData] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (data) {
      // Get AI insights for the graph
      const getInsights = async () => {
        const aiResponse = await askAgentPersonalized('progress', {
          data,
          type: 'graph_analysis'
        });
        setInsights(aiResponse);
      };
      getInsights();

      // Format data for the graph
      setGraphData({
        labels: data.dates,
        datasets: [
          {
            label: 'Workout',
            data: data.workout,
            borderColor: '#9333ea'
          },
          {
            label: 'Study',
            data: data.study,
            borderColor: '#3b82f6'
          },
          {
            label: 'Work',
            data: data.work,
            borderColor: '#22c55e'
          }
        ]
      });
    }
  }, [data]);

  return (
    <div>
      {graphData && (
        <Line
          data={graphData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: { color: 'white' }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: { color: 'white' }
              }
            },
            plugins: {
              legend: {
                labels: { color: 'white' }
              }
            }
          }}
        />
      )}
      
      {insights && (
        <div className="mt-4 p-4 bg-neutral-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">AI Insights</h3>
          <p className="text-neutral-300">{insights.message}</p>
        </div>
      )}
    </div>
  );
}