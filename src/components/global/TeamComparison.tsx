import React from 'react';

export default function TeamComparison() {
  const metrics = [
    { title: 'Abschlussquote', value: '80%', userValue: '32%', teamValue: '28%' },
    { title: 'Kundenzufriedenheit', value: '90%', userValue: '4.5/5', teamValue: '4.2/5' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Team-Vergleich</h2>
      {metrics.map((metric, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-600">{metric.title}</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-[#3b82f6] h-2.5 rounded-full" style={{ width: metric.value }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>Sie: {metric.userValue}</span>
            <span>Team-Durchschnitt: {metric.teamValue}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
