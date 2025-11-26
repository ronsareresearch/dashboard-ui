"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import clsx from "clsx";

export default function RegisterModal({ open, onClose, onRegister }) {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ssn: "",
    dob: "",
    address: "",
    filingStatus: "single",
  });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onRegister?.(newUser);
    onClose();
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center z-50 transition-all",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* OVERLAY (no blur = no lag) */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* CARD */}
      <div
        className={clsx(
          "relative bg-white w-[90%] max-w-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300",
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        )}
      >
        <h2 className="text-2xl font-bold mb-6">Register New User</h2>

        <div className="space-y-4">
          {/* NAME */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              value={newUser.firstName}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-xl bg-gray-50"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={newUser.lastName}
              onChange={handleChange}
              className="w-full border px-4 py-3 rounded-xl bg-gray-50"
              placeholder="Last Name"
            />
          </div>

          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50"
            placeholder="Email"
          />

          <input
            type="text"
            name="phone"
            value={newUser.phone}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50"
            placeholder="Phone"
          />

          <input
            type="text"
            name="ssn"
            value={newUser.ssn}
            onChange={handleChange}
            maxLength={11}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50 tracking-wider"
            placeholder="SSN (XXX-XX-XXXX)"
          />

          <input
            type="date"
            name="dob"
            value={newUser.dob}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50"
          />

          <textarea
            name="address"
            value={newUser.address}
            onChange={handleChange}
            rows={2}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50 resize-none"
            placeholder="Address"
          ></textarea>

          <select
            name="filingStatus"
            value={newUser.filingStatus}
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl bg-gray-50"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>

          <Button
            onClick={handleSubmit}
            className="w-full bg-gray-800 text-white p-6 text-lg rounded-xl"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
