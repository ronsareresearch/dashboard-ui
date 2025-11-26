"use client"

import React from "react"


export function IncomeDetailsStep({ formData, onChange }) {
  const totalIncome = Number.parseFloat(formData.totalIncome || 0) + Number.parseFloat(formData.investmentIncome || 0)

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Income Details</h2>
      <p className="text-muted-foreground mb-8">Enter your income information</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Total Wages & Salary ($)</label>
          <input
            type="number"
            name="totalIncome"
            value={formData.totalIncome}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Investment Income ($)</label>
          <input
            type="number"
            name="investmentIncome"
            value={formData.investmentIncome}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className="bg-secondary/50 border border-primary/20 p-4 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Total Income:</span>{" "}
            <span className="font-bold text-primary">${totalIncome.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
