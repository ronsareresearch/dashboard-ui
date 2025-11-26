"use client"


export function ProgressBar({ currentStep, totalSteps }) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  const stepLabels = ["Personal Info", "Income", "Deductions", "Documents", "Review"]

  return (
    <div className="w-full mb-12">
      <div className="relative mb-10">
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step <= currentStep
            const isCurrent = step === currentStep

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 ${
                    isActive
                      ? isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                        : "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {stepLabels.map((label, idx) => {
          const step = idx + 1
          const isActive = step <= currentStep
          const isCurrent = step === currentStep

          return (
            <div key={idx} className="text-center flex-1 px-1">
              <p
                className={`text-xs font-medium transition-all duration-300 ${
                  isCurrent ? "text-primary font-semibold" : isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
