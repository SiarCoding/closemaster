import React from 'react'
import { Info, RefreshCcw, MoreVertical, Rocket } from 'lucide-react'

export default function DashboardContent() {
  return (
    <div className="p-8 bg-gray-100">
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-sm text-black mb-4">
            <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
            <span>Deine Abschlussquote</span>
          </div>
          <div className="text-4xl font-bold">% 92</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span>Anstehende Termine heute</span>
          </div>
          <div className="text-4xl font-bold">2,420</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <span>Conversionrate</span>
          </div>
          <div className="text-4xl font-bold">1,523</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Last 7 days vs prior week</span>
              <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                Nov 26
              </div>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Formation status</h2>
            <Info size={20} className="text-gray-400" />
          </div>
          <div className="text-sm text-gray-500 mb-2">In progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-indigo-600 h-2.5 rounded-full w-2/3"></div>
          </div>
          <div className="text-sm text-gray-500 mb-4">Estimated processing</div>
          <div className="text-2xl font-bold mb-4">4-5 business days</div>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">View status</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Daily Sales Summary</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">From Oct 1 - Nov 26</span>
              <RefreshCcw size={20} className="text-gray-400" />
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded mb-4"></div>
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-500">Minimum</div>
              <div className="font-semibold">14,770</div>
            </div>
            <div>
              <div className="text-gray-500">Maximum</div>
              <div className="font-semibold">14,770</div>
            </div>
            <div>
              <div className="text-gray-500">Average</div>
              <div className="font-semibold">14,770</div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Expenses</h2>
              <MoreVertical size={20} className="text-gray-400" />
            </div>
            <div className="h-32 bg-gray-100 rounded-full"></div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold">$23,316</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New clients</h2>
              <div className="text-green-500 font-semibold">+18.7%</div>
            </div>
            <div className="text-4xl font-bold mb-2">54</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Invoices</h2>
            <button className="text-indigo-600 font-semibold">Create invoice</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-4">Invoice ID</th>
                <th className="pb-4">Client</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="py-4 flex items-center space-x-2">
                    <img src="/placeholder.svg?height=32&width=32" alt="Client" className="w-8 h-8 rounded-full" />
                    <span>#D152LA</span>
                  </td>
                  <td className="py-4">Supergank EC</td>
                  <td className="py-4">11/12/2023</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${index === 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                      {index === 0 ? 'Upcoming' : 'Completed'}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-indigo-600">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-indigo-600 p-6 rounded-xl shadow text-white">
          <h2 className="text-xl font-semibold mb-4">Upgrade to Pro</h2>
          <p className="mb-4">Let's maintain the all of the medical details on this dashboard.</p>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold">Get Started</button>
          <div className="mt-8 flex justify-end">
            <Rocket size={48} />
          </div>
        </div>
      </div>
    </div>
  )
}