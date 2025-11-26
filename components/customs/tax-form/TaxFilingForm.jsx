"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "../progress-bar/ProgressBar"
import { ReviewStep } from "./steps/ReviewStep"
import { IncomeDetailsStep } from "./steps/IncomeDetailsStep"
import { PersonalInfoStep } from "./steps/PersonalInfoStep"
import { DeductionsStep } from "./steps/DeductionsStep"
import { DocumentUploadStep } from "./steps/DocumentUploadStepProps"


export default function TaxFilingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ssn: "",
    filingStatus: "single",
    totalIncome: "",
    investmentIncome: "",
    mortgageInterest: "",
    studentLoanInterest: "",
    charitableDonations: "",
    medicalExpenses: "",
    uploadedDocuments: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDocumentUpload = (files) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: [...prev.uploadedDocuments, ...files],
    }))
  }

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
    alert("Tax filing submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">File Your Taxes</h1>
          <p className="text-muted-foreground">Complete your tax return in 5 simple steps</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={5} />

        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
          {currentStep === 1 && <PersonalInfoStep formData={formData} onChange={handleInputChange} />}
          {currentStep === 2 && <IncomeDetailsStep formData={formData} onChange={handleInputChange} />}
          {currentStep === 3 && <DeductionsStep formData={formData} onChange={handleInputChange} />}
          {currentStep === 4 && (
            <DocumentUploadStep
              uploadedDocuments={formData.uploadedDocuments}
              onUpload={handleDocumentUpload}
              onRemove={handleRemoveDocument}
            />
          )}
          {currentStep === 5 && <ReviewStep formData={formData} />}
        </div>

        <div className="flex gap-3 justify-between">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 1}
            variant="outline"
            className="px-6 sm:px-8 bg-transparent"
          >
            Previous
          </Button>

          <div className="text-xs sm:text-sm text-muted-foreground flex items-center">Step {currentStep} of 5</div>

          {currentStep === 5 ? (
            <Button onClick={handleSubmit} className="px-6 sm:px-8 bg-primary hover:bg-primary/90">
              Submit Filing
            </Button>
          ) : (
            <Button onClick={handleNext} className="px-6 sm:px-8 bg-primary hover:bg-primary/90">
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
