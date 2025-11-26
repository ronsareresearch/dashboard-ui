"use client"

export function ReviewStep({ formData }) {
  const totalIncome = Number.parseFloat(formData.totalIncome || 0) + Number.parseFloat(formData.investmentIncome || 0)
  const totalDeductions =
    Number.parseFloat(formData.mortgageInterest || 0) +
    Number.parseFloat(formData.studentLoanInterest || 0) +
    Number.parseFloat(formData.charitableDonations || 0) +
    Number.parseFloat(formData.medicalExpenses || 0)
  const taxableIncome = Math.max(0, totalIncome - totalDeductions)

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Review & Submit</h2>
      <p className="text-muted-foreground mb-8">Review your information before submitting</p>

      <div className="space-y-4">
        <div className="bg-secondary/50 border border-border p-6 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-semibold text-foreground">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">SSN</p>
              <p className="font-semibold text-foreground">{formData.ssn}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Filing Status</p>
              <p className="font-semibold text-foreground capitalize">{formData.filingStatus}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 border border-border p-6 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Income Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Wages & Salary:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.totalIncome || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Investment Income:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.investmentIncome || 0).toFixed(2)}
              </p>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <p className="font-semibold text-foreground">Total Income:</p>
              <p className="font-bold text-primary">${totalIncome.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/50 border border-border p-6 rounded-lg">
          <h3 className="font-semibold text-foreground mb-4">Deductions Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Mortgage Interest:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.mortgageInterest || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Student Loan Interest:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.studentLoanInterest || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Charitable Donations:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.charitableDonations || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Medical Expenses:</p>
              <p className="font-semibold text-foreground">
                ${Number.parseFloat(formData.medicalExpenses || 0).toFixed(2)}
              </p>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <p className="font-semibold text-foreground">Total Deductions:</p>
              <p className="font-bold text-primary">${totalDeductions.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {formData.uploadedDocuments.length > 0 && (
          <div className="bg-secondary/50 border border-border p-6 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Uploaded Documents</h3>
            <div className="space-y-1 text-sm">
              {formData.uploadedDocuments.map((file , index) => (
                <div key={index} className="flex items-center gap-2 text-foreground">
                  <span className="text-primary">✓</span>
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-linear-to-r from-primary to-primary/80 p-6 rounded-lg text-primary-foreground mt-6">
          <p className="text-sm opacity-90 mb-1">Estimated Taxable Income</p>
          <p className="text-4xl font-bold">${taxableIncome.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
