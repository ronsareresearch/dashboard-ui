"use client"

import React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export function DocumentUploadStep({ uploadedDocuments, onUpload, onRemove }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const acceptedFileTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".xlsx", ".xls"]

  const handleFileSelect = (files) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) => {
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      return acceptedFileTypes.includes(fileExtension)
    })

    if (validFiles.length > 0) {
      onUpload(validFiles)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Upload Documents</h2>
      <p className="text-muted-foreground mb-8">Upload supporting documents for your tax filing</p>

      <div className="space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-border bg-secondary/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <svg
            className="w-12 h-12 mx-auto mb-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>

          <p className="text-foreground font-semibold mb-1">Drag files here to upload</p>
          <p className="text-sm text-muted-foreground mb-4">or</p>
          <Button onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-primary/90">
            Select Files
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Accepted: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 50MB per file)
          </p>
        </div>

        {uploadedDocuments.length > 0 && (
          <div className="bg-secondary/50 border border-border p-6 rounded-lg">
            <h3 className="font-semibold text-foreground mb-4">Uploaded Documents ({uploadedDocuments.length})</h3>
            <div className="space-y-2">
              {uploadedDocuments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-card p-3 rounded border border-border">
                  <div className="flex items-center gap-3 flex-1">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7H4m0 0a1 1 0 018 0m0 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0M4 7a1 1 0 018 0" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onRemove(index)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-secondary/50 border border-border p-6 rounded-lg">
          <h3 className="font-semibold text-foreground mb-3">Required Documents for US Tax Filing</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>W-2 forms (from all employers)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>1099 forms (investment income, freelance work, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Receipts for deductible expenses (medical, charitable, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Mortgage interest statements</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Student loan interest documentation</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Property tax statements</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
