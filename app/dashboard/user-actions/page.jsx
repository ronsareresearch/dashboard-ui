"use client";

import SearchWithDropdown from "@/components/customs/search/SearchWithDropdown";
import RegisterModal from "@/components/customs/user-register/RegisterModal";
import { useState } from "react";
import {
  FileText, Briefcase, Compass, Shield, DollarSign, Users
} from "lucide-react";

const services = [
  { name: "Tax Filing", icon: FileText },
  { name: "Accounting", icon: Briefcase },
  { name: "Immigration Service", icon: Compass },
  { name: "Business Insurance", icon: Shield },
  { name: "Payroll Management", icon: DollarSign },
  { name: "Financial Advisory", icon: Users },
];

// Dummy history data for each user
const userHistory = {
  "Aman Gupta": {
    pending: "2024 Tax Filing Form Not Submitted",
    history: [
      { action: "Uploaded PAN card", date: "2025-11-20" },
      { action: "Submitted Basic Details", date: "2025-11-18" },
      { action: "Created Account", date: "2025-11-10" },
    ],
  },
  "Rohit Singh": {
    pending: "Awaiting Accounting Report Upload",
    history: [
      { action: "Uploaded Bank Statements", date: "2025-11-21" },
      { action: "Submitted Verification Docs", date: "2025-11-15" }
    ],
  },
  "Priya Mehta": {
    pending: "Payroll Verification Failed",
    history: [
      { action: "Updated Employee Salary Data", date: "2025-11-12" }
    ],
  },
  "Karan Verma": {
    pending: "Passport Re-verification Required",
    history: [
      { action: "Uploaded Passport Copy", date: "2025-11-16" },
      { action: "Submitted Migration Form", date: "2025-11-14" }
    ],
  }
};

export default function UserProfileActionsPage() {
  const [showRegister, setShowRegister] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [users] = useState([
    { name: "Aman Gupta", service: "Tax Filing", status: "Active", date: "2025-11-26" },
    { name: "Rohit Singh", service: "Accounting", status: "Pending", date: "2025-11-25" },
    { name: "Priya Mehta", service: "Payroll Management", status: "Blocked", date: "2025-11-20" },
    { name: "Karan Verma", service: "Immigration Service", status: "Active", date: "2025-11-22" },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);

  const applyFilters = () => {
    let result = [...users];

    if (selectedService !== null)
      result = result.filter((u) => u.service === services[selectedService].name);

    if (status) result = result.filter((u) => u.status === status);

    if (fromDate) result = result.filter((u) => u.date >= fromDate);
    if (toDate) result = result.filter((u) => u.date <= toDate);

    setFilteredUsers(result);
  };

  return (
   <div className="p-2 bg-gray-800 h-screen">
    
     <div className="flex h-full bg-gray-100 rounded-3xl">

      {/* LEFT SIDE AREA (70%) */}
      <div className="w-[70%] p-6 flex flex-col overflow-hidden">

        {/* If NO user selected → show list */}
        {!selectedUser && (
          <>
            {/* TOP SEARCH + REGISTER */}
            <div className="flex items-center gap-4 mb-6">
              <SearchWithDropdown />

              <button
                onClick={() => setShowRegister(true)}
                className="px-6 py-4 bg-gray-900 text-white rounded-xl text-lg font-medium hover:bg-gray-800"
              >
                Register
              </button>

              <RegisterModal
                open={showRegister}
                onClose={() => setShowRegister(false)}
                onRegister={(data) => console.log("User Registered:", data)}
              />
            </div>

            {/* USER LIST */}
            <div className="flex-1 bg-white border rounded-3xl p-6 shadow overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Filtered Users
              </h2>

              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No users found</p>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((u, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedUser(u)}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                          {u.name[0]}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.service}</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 text-right">
                        <p>{u.date}</p>
                        <p>{u.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* If user selected → FULL PAGE USER DETAILS */}
        {selectedUser && (
          <div className="flex-1 bg-white border rounded-3xl p-6 shadow overflow-y-auto">
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← Back
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center font-bold text-2xl text-gray-700">
                {selectedUser.name[0]}
              </div>

              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {selectedUser.name}
                </p>
                <p className="text-gray-500">{selectedUser.service}</p>
                <p className="text-sm text-gray-500">{selectedUser.status}</p>
              </div>
            </div>

            {/* Pending Section */}
            <div className="mb-6">
              <p className="text-lg font-semibold mb-1">Pending Task</p>
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-xl text-gray-800">
                {userHistory[selectedUser.name]?.pending || "No pending tasks"}
              </div>
            </div>

            {/* History Section */}
            <div>
              <p className="text-lg font-semibold mb-2">History</p>

              <div className="space-y-3">
                {userHistory[selectedUser.name]?.history?.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 border flex justify-between"
                  >
                    <span>{h.action}</span>
                    <span className="text-gray-500 text-xs">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE FILTERS (30%) */}
      <div className="w-[30%] bg-white border-l p-6 flex flex-col rounded-r-3xl overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Filters</h2>

        {/* SERVICES */}
        <h3 className="text-sm font-medium text-gray-700 mb-3">Service</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {services.map((s, index) => {
            const Icon = s.icon;
            const active = selectedService === index;

            return (
              <button
                key={index}
                onClick={() => setSelectedService(index)}
                className={`flex gap-2 items-center p-3 rounded-xl border transition 
                  ${active ? "bg-blue-600 text-white border-blue-700 shadow" : "bg-gray-50 border-gray-300 hover:bg-gray-100"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium">{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* DATE RANGE */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-1">From Date</p>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 mb-3"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <p className="text-sm text-gray-700 mb-1">To Date</p>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg border border-gray-300"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-1">Status</p>
          <select
            className="w-full px-3 py-3 rounded-xl border bg-gray-50"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>

   </div>
  );
}
