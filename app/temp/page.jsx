"use client";

import { useState } from "react";
import {
  PDFDocument,
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFTextField,
} from "pdf-lib";

export default function Home() {
  const [fields, setFields] = useState([]);
  const [pdfBytes, setPdfBytes] = useState(null);
  const [fieldValues, setFieldValues] = useState({});

  // STEP 1 — Upload & extract form fields
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    setPdfBytes(arrayBuffer);

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();
    const pdfFields = form.getFields();

    const extracted = pdfFields.map((field) => ({
      name: field.getName(),
      type: field.constructor.name,
      options: field.getOptions ? field.getOptions() : [],
    }));

    const initial = {};
    extracted.forEach((f) => {
      if (f.type === "PDFCheckBox") initial[f.name] = false;
      else initial[f.name] = "";
    });

    setFieldValues(initial);
    setFields(extracted);
  };

  // Update field values
  const handleChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  // STEP 3 — Fill PDF & download
  const handleDownload = async () => {
    if (!pdfBytes) return;

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    fields.forEach((f) => {
      const pdfField = form.getField(f.name);
      let value = fieldValues[f.name];

      // TEXT FIELDS — Fix maxLength error
      if (f.type === "PDFTextField") {
        const maxLength = pdfField.getMaxLength();

        if (maxLength && maxLength > 0 && value) {
          value = value.slice(0, maxLength);
        }

        pdfField.setText(value || "");
      }

      // CHECKBOX
      if (f.type === "PDFCheckBox") {
        value ? pdfField.check() : pdfField.uncheck();
      }

      // DROPDOWN
      if (f.type === "PDFDropdown") {
        if (value) pdfField.select(value);
      }

      // RADIO GROUP
      if (f.type === "PDFRadioGroup") {
        if (value) pdfField.select(value);
      }
    });

    form.updateFieldAppearances();

    const filledBytes = await pdfDoc.save();
    const blob = new Blob([filledBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "filled.pdf";
    a.click();
  };

  // Detect date input
  const isDateField = (name) =>
    name.toLowerCase().includes("date") ||
    name.toLowerCase().includes("dob") ||
    name.toLowerCase().includes("birth");

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PDF Auto Form Filler</h1>

      <input type="file" accept="application/pdf" onChange={handlePdfUpload} />

      {fields.length > 0 && (
        <div className="mt-8 space-y-5">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col">
              <label className="font-medium mb-1">{f.name}</label>

              {/* TEXT FIELD */}
              {f.type === "PDFTextField" && (
                <input
                  type={isDateField(f.name) ? "date" : "text"}
                  className="border p-2 rounded"
                  value={fieldValues[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              )}

              {/* CHECKBOX */}
              {f.type === "PDFCheckBox" && (
                <input
                  type="checkbox"
                  checked={fieldValues[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.checked)}
                />
              )}

              {/* DROPDOWN */}
              {f.type === "PDFDropdown" && (
                <select
                  className="border p-2 rounded"
                  value={fieldValues[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  <option value="">Select...</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {/* RADIO GROUP */}
              {f.type === "PDFRadioGroup" &&
                f.options.map((opt) => (
                  <label key={opt} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name={f.name}
                      value={opt}
                      checked={fieldValues[f.name] === opt}
                      onChange={() => handleChange(f.name, opt)}
                    />
                    {opt}
                  </label>
                ))}
            </div>
          ))}

          <button
            onClick={handleDownload}
            className="mt-6 bg-black text-white px-6 py-2 rounded"
          >
            Download Filled PDF
          </button>
        </div>
      )}
    </div>
  );
}
