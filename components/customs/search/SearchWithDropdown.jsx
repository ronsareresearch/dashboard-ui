"use client";

import { useState } from "react";

export default function UserSearchDropdown() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("name");
  const [results, setResults] = useState([]);

  const users = [
    { name: "John Doe", email: "john@example.com", id: "U001" },
    { name: "Priya Sharma", email: "priya@example.com", id: "U002" },
    { name: "Aman Verma", email: "aman@example.com", id: "U003" },
    { name: "Riya Singh", email: "riya@example.com", id: "U004" },
    { name: "Arjun Kapoor", email: "arjun@example.com", id: "U005" },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = users.filter((user) =>
        user[filter].toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="flex w-full p-2 bg-gray-200/40 rounded-xl shadow-inner overflow-hidden border border-gray-200">
        {/* SEARCH INPUT */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={`Search by ${filter}...`}
          className="flex-1 px-5 py-3 text-base placeholder-gray-500 bg-transparent rounded-l-full focus:outline-none"
        />

        {/* FILTER DROPDOWN */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 text-base border-l border-gray-200 bg-gray-200/40 rounded-r-xl focus:outline-none"
        >
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="id">ID</option>
        </select>
      </div>

      {/* DROPDOWN RESULTS */}
      {results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((user, index) => (
            <div
              key={index}
              className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex justify-between rounded-lg transition-colors"
              onClick={() => {
                setQuery(user[filter]);
                setResults([]);
              }}
            >
              <span className="text-gray-900">{user.name}</span>
              <span className="text-gray-400 text-sm">{user.email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
