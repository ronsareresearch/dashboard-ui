'use client';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, MoreVertical, Download, Printer, HomeIcon , Mail, MessageSquare, Calendar, Square, Settings } from 'lucide-react';
import Link from 'next/link';
import WhatsAppUi from '@/app/components/WhatsAppUi';


const revenueData = [
  { date: "Jan '25", value: 55 },
  { date: "15 Jan", value: 62 },
  { date: "Feb '25", value: 65 },
  { date: "15 Feb", value: 48 },
  { date: "Mar '25", value: 35 },
  { date: "15 Mar", value: 32 },
  { date: "Apr '25", value: 28 },
  { date: "15 Apr", value: 42 },
  { date: "May '25", value: 38 },
  { date: "15 May", value: 45 }
];

const ordersData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 60 },
  { month: "May", value: 35 },
  { month: "Jun", value: 48 },
  { month: "Jul", value: 52 }
];

const monthlySalesData = [
  { month: "Jan", value: 145 },
  { month: "Feb", value: 110 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 115 },
  { month: "May", value: 155 },
  { month: "Jun", value: 180 },
  { month: "Jul", value: 155 },
  { month: "Aug", value: 135 },
  { month: "Sep", value: 105 },
  { month: "Oct", value: 115 },
  { month: "Nov", value: 125 },
  { month: "Dec", value: 110 }
];

const StatCard = ({ title, value, change, isPositive, chart }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical size={20} />
      </button>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {isPositive ? (
          <>
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">{change}</span>
          </>
        ) : (
          <>
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-red-500 text-sm font-medium">{change}</span>
          </>
        )}
      </div>
      {chart && (
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Line type="monotone" dataKey="value" stroke={isPositive ? "#3b82f6" : "#ef4444"} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const newCustomersChart = [
    { value: 30 }, { value: 45 }, { value: 35 }, { value: 50 }, { value: 40 }
  ];

  const growthChart = [
    { value: 35 }, { value: 42 }, { value: 40 }, { value: 50 }, { value: 55 }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-[300px] bg-gray-900 text-white overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Guru Accounting<span className="text-blue-400 ml-2">AI</span></h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-6 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">MAIN</p>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-blue-500 border-l-2 border-blue-500">
              <div className="w-5 h-5 flex items-center justify-center rounded">
                <HomeIcon size={16} className="text-blue-500" />
              </div>
              <span>Dashboard</span>
            </a>
          </div>
   <div className="px-6 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
          WEB APPS
        </p>

        <Link href="/dashboard/whatsapp" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <Mail size={18} />
          <span>WhatsApp</span>
        </Link>
        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <Mail size={18} />
          <span>Email</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <MessageSquare size={18} />
          <span>Chat</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <Calendar size={18} />
          <span>Calendar</span>
        </a>
      </div>

      {/* COMPONENTS */}
      <div className="px-6 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
          COMPONENTS
        </p>

        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <Square size={18} />
          <span>UI Kit</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400">
          <Settings size={18} />
          <span>Advanced UI</span>
        </a>
      </div>

        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
   
        {/* WhatsApp Ui */}
        <WhatsAppUi />
      </div>
    </div>
  );
}