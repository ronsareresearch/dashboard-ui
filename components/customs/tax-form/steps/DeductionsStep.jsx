"use client"


export function DeductionsStep({ formData, onChange }) {
  const totalDeductions =
    Number.parseFloat(formData.mortgageInterest || 0) +
    Number.parseFloat(formData.studentLoanInterest || 0) +
    Number.parseFloat(formData.charitableDonations || 0) +
    Number.parseFloat(formData.medicalExpenses || 0)

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Deductions</h2>
      <p className="text-muted-foreground mb-8">Enter your deductible expenses</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Mortgage Interest ($)</label>
          <input
            type="number"
            name="mortgageInterest"
            value={formData.mortgageInterest}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Student Loan Interest ($)</label>
          <input
            type="number"
            name="studentLoanInterest"
            value={formData.studentLoanInterest}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Charitable Donations ($)</label>
          <input
            type="number"
            name="charitableDonations"
            value={formData.charitableDonations}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">Medical & Dental Expenses ($)</label>
          <input
            type="number"
            name="medicalExpenses"
            value={formData.medicalExpenses}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className="bg-secondary/50 border border-primary/20 p-4 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Total Deductions:</span>{" "}
            <span className="font-bold text-primary">${totalDeductions.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
