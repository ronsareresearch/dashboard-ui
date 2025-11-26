"use client"

import { CopyIcon } from "lucide-react"
import React, { useEffect, useState } from "react"

export function PersonalInfoStep({ formData, onChange, fetchUserData }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (formData.userType === "existing" && formData.existingUserId) {
      // Call the fetchUserData function if provided
      fetchUserData?.(formData.existingUserId)
    }
  }, [formData.userType, formData.existingUserId, fetchUserData])

  const handleCopyLink = () => {
    const link = `http://localhost:3000/user/tax-fill` // can be dynamic
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
      <p className="text-muted-foreground mb-8">
        {formData.userType === "existing"
          ? "Your information will auto-fill based on your User ID"
          : "Let's start with your basic information"}
      </p>

      {/* User Type Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-foreground mb-3">User Type</label>
        <select
          name="userType"
          value={formData.userType || "new"}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
        >
          <option value="new">New User</option>
          <option value="existing">Existing User</option>
        </select>
      </div>

      {/* Existing User ID input always visible */}
      {formData.userType === "existing" && (
        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-foreground mb-3">Existing User ID</label>
          <input
            type="text"
            name="existingUserId"
            value={formData.existingUserId || ""}
            onChange={onChange}
            placeholder="Enter your User ID"
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-10"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="absolute right-2 top-[46px] text-gray-500 hover:text-gray-700"
          >
            <CopyIcon className="w-5 h-5" />
          </button>
          {copied && (
            <span className="absolute right-10 top-[46px] text-green-600 text-sm">Copied!</span>
          )}
        </div>
      )}

      {/* Personal Info Fields always visible */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Email</label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="sample@example.com"
            maxLength={11}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Social Security Number</label>
          <input
            type="text"
            name="ssn"
            value={formData.ssn || ""}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="XXX-XX-XXXX"
            maxLength={11}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Filing Status</label>
          <select
            name="filingStatus"
            value={formData.filingStatus || "single"}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
      </div>
    </div>
  )
}
